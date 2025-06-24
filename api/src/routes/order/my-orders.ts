import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { OrderStatus } from "generated/prisma"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

export const myOrders: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/order/me",
    {
      preHandler: [verifyUserRole("CLIENT")],
      schema: {
        response: {
          200: z.array(
            z.object({
              id: z.string().uuid(),
              status: z.nativeEnum(OrderStatus),
              date: z.date(),
              grade: z.number().nullable(),
              restaurant: z.object({
                name: z.string(),
                image: z.string().nullable(),
              }),
              orderItems: z.array(
                z.object({
                  quantity: z.number(),
                  product: z.string(),
                }),
              ),
            }),
          ),
        },
      },
    },
    async request => {
      const clientId = await request.getCurrentUserId()

      const orders = await prisma.order.findMany({
        where: {
          clientId,
        },
        select: {
          id: true,
          date: true,
          grade: true,
          status: true,
          restaurant: {
            select: {
              name: true,
              image: true,
            },
          },
          orderItems: {
            select: {
              quantity: true,
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      })

      return orders.map(item => ({
        ...item,
        orderItems: item.orderItems.map(order => ({
          product: order.product.name,
          quantity: order.quantity,
        })),
      }))
    },
  )
}
