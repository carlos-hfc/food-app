import { tz, TZDate } from "@date-fns/tz"
import { differenceInMinutes, startOfToday } from "date-fns"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { PaymentMethod } from "generated/prisma"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

export const createOrder: FastifyPluginAsyncZod = async app => {
  app.register(auth).post(
    "/restaurant/:restaurantId/order",
    {
      preHandler: [verifyUserRole("CLIENT")],
      schema: {
        params: z.object({
          restaurantId: z.string().uuid(),
        }),
        body: z.object({
          addressId: z.string().uuid(),
          payment: z.nativeEnum(PaymentMethod),
          products: z
            .array(
              z.object({
                id: z.string().uuid(),
                quantity: z.number().min(1),
              }),
            )
            .nonempty(),
        }),
        response: {
          201: z.object({
            orderId: z.string().uuid(),
            total: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const clientId = await request.getCurrentUserId()

      const { restaurantId } = request.params
      const { addressId, products, payment } = request.body

      const restaurant = await prisma.restaurant.findUnique({
        where: {
          id: restaurantId,
        },
        include: {
          hours: {
            where: {
              weekday: {
                equals: new TZDate().getDay(),
              },
              open: true,
              openedAt: {
                gt: differenceInMinutes(
                  new TZDate(),
                  startOfToday({ in: tz("-03:00") }),
                ),
              },
              closedAt: {
                lt: differenceInMinutes(
                  new TZDate(),
                  startOfToday({ in: tz("-03:00") }),
                ),
              },
            },
          },
        },
      })

      if (!restaurant) {
        throw new ClientError("Restaurant not found")
      }

      if (restaurant.hours.length <= 0) {
        throw new ClientError("Closed restaurant")
      }

      const address = await prisma.address.findUnique({
        where: {
          id: addressId,
        },
      })

      if (!address || address.clientId !== clientId) {
        throw new ClientError(
          "Address not found or address not belongs to user",
        )
      }

      const uniqueProducts = new Set()
      for (const product of products) {
        if (uniqueProducts.has(product.id)) {
          throw new ClientError(`Product ${product.id} is duplicated`)
        }

        uniqueProducts.add(product.id)
      }

      const restaurantProducts = await prisma.product.findMany({
        where: {
          id: {
            in: products.map(({ id }) => id),
          },
          restaurantId,
          available: true,
        },
      })

      for (let index = 0; index < products.length; index++) {
        if (restaurantProducts.length !== products.length) {
          throw new ClientError(`Product ${products[index].id} not found`)
        }
      }

      const { order, total } = await prisma.$transaction(async tx => {
        const order = await tx.order.create({
          data: {
            payment,
            addressId,
            clientId,
            restaurantId,
            total: 0,
            orderItems: {
              createMany: {
                data: products.map(product => ({
                  price:
                    restaurantProducts.find(item => item.id === product.id)
                      ?.price ?? 0,
                  productId: product.id,
                  quantity: product.quantity,
                })),
              },
            },
          },
        })

        const orderItems = await tx.orderItem.findMany({
          where: {
            orderId: order.id,
          },
        })

        if (!orderItems) {
          throw new ClientError("Order not found")
        }

        const total = (
          orderItems.reduce((acc, cur) => {
            acc += cur.quantity * cur.price.toNumber()

            return acc
          }, 0) + restaurant.tax.toNumber()
        ).toFixed(2)

        await tx.order.update({
          where: {
            id: order.id,
          },
          data: {
            total,
          },
        })

        return {
          order,
          orderItems,
          total,
        }
      })

      return reply.status(201).send({
        orderId: order.id,
        total,
      })
    },
  )
}
