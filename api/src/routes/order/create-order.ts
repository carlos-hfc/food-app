import { TZDate } from "@date-fns/tz"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { PaymentMethod } from "generated/prisma"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"
import { restaurantIsOpen } from "@/utils/check-restaurant-is-open"

export const createOrder: FastifyPluginAsyncZod = async app => {
  app.register(auth).post(
    "/orders",
    {
      preHandler: [verifyUserRole("CLIENT")],
      schema: {
        body: z.object({
          restaurantId: z.string().uuid(),
          addressId: z.string().uuid(),
          payment: z.string().toUpperCase().pipe(z.nativeEnum(PaymentMethod)),
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
            total: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id: clientId } = await request.getCurrentUser()

      const { restaurantId, addressId, products, payment } = request.body

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
            },
          },
        },
      })

      if (!restaurant) {
        throw new ClientError("Restaurant not found")
      }

      if (!restaurantIsOpen(restaurant.hours[0]) || !restaurant.hours[0].open) {
        throw new ClientError("Restaurant is closed")
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

      const uniqueProducts = products.filter(
        (product, i, self) =>
          i === self.findIndex(item => item.id === product.id),
      )

      const restaurantProducts = await prisma.product.findMany({
        where: {
          id: {
            in: uniqueProducts.map(({ id }) => id),
          },
          restaurantId,
          available: true,
          active: true,
        },
      })

      for (let index = 0; index < uniqueProducts.length; index++) {
        if (restaurantProducts.length !== uniqueProducts.length) {
          throw new ClientError(`Product ${uniqueProducts[index].id} not found`)
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
                data: uniqueProducts.map(product => ({
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

        const total =
          orderItems.reduce((acc, cur) => {
            acc += cur.quantity * cur.price.toNumber()

            return acc
          }, 0) + restaurant.tax.toNumber()

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
