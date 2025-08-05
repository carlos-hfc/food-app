import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { OrderStatus } from "generated/prisma"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"

export const cancelOrder: FastifyPluginAsyncZod = async app => {
  app.register(auth).patch(
    "/order/:orderId/cancel",
    {
      schema: {
        params: z.object({
          orderId: z.string().uuid(),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const restaurantId = await request.getManagedRestaurantId()

      const { orderId } = request.params

      const order = await prisma.order.findUnique({
        where: {
          id: orderId,
          restaurantId,
        },
      })

      if (!order) {
        throw new ClientError("Order not found")
      }

      if (
        order.status === OrderStatus.CANCELED ||
        order.status === OrderStatus.DELIVERED ||
        order.status === OrderStatus.ROUTING
      ) {
        throw new ClientError("Not allowed")
      }

      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: OrderStatus.CANCELED,
          canceledAt: new Date(),
        },
      })

      return reply.status(204).send()
    },
  )
}
