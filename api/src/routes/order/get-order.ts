import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { OrderStatus, PaymentMethod } from "generated/prisma"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"

export const getOrder: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/order/:orderId",
    {
      schema: {
        params: z.object({
          orderId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            id: z.string().uuid(),
            date: z.date(),
            payment: z.nativeEnum(PaymentMethod),
            status: z.nativeEnum(OrderStatus),
            total: z.number(),
            grade: z.number().nullable(),
            client: z.object({
              name: z.string(),
              email: z.string().email(),
              phone: z.string(),
            }),
            address: z.object({
              address: z.string(),
              number: z.number().nullable(),
              district: z.string(),
              city: z.string(),
              uf: z.string(),
            }),
            restaurant: z.object({
              name: z.string(),
              image: z.string().nullable(),
              deliveryTime: z.number(),
              tax: z.number(),
            }),
            products: z.array(
              z.object({
                id: z.string().uuid(),
                name: z.string(),
                price: z.number(),
                quantity: z.number(),
                image: z.string().nullable(),
              }),
            ),
          }),
        },
      },
    },
    async request => {
      const { orderId } = request.params

      const order = await prisma.order.findUnique({
        where: {
          id: orderId,
        },
        select: {
          id: true,
          clientId: true,
          date: true,
          payment: true,
          status: true,
          total: true,
          grade: true,
          client: {
            select: {
              name: true,
              phone: true,
              email: true,
            },
          },
          address: {
            select: {
              address: true,
              number: true,
              district: true,
              city: true,
              uf: true,
            },
          },
          orderItems: {
            select: {
              id: true,
              price: true,
              quantity: true,
              product: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
          restaurant: {
            select: {
              name: true,
              image: true,
              tax: true,
              deliveryTime: true,
            },
          },
        },
      })

      if (!order) {
        throw new ClientError("Order not found")
      }

      return {
        ...order,
        total: order.total.toNumber(),
        restaurant: {
          ...order.restaurant,
          tax: order.restaurant.tax.toNumber(),
        },
        products: order.orderItems.map(item => ({
          id: item.id,
          name: item.product.name,
          price: item.price.toNumber(),
          quantity: item.quantity,
          image: item.product.image,
        })),
      }
    },
  )
}
