import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { OrderStatus } from "generated/prisma"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"

export const deliverOrder: FastifyPluginAsyncZod = async app => {
  app.register(auth).patch(
    "/order/:orderId/deliver",
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
      const adminId = await request.getCurrentUserId()

      const { orderId } = request.params

      const order = await prisma.order.findUnique({
        where: {
          id: orderId,
          restaurant: {
            adminId,
          },
        },
      })

      if (!order) {
        throw new ClientError("Order not found")
      }

      if (order.status !== OrderStatus.ROUTING) {
        throw new ClientError("Not allowed")
      }

      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: OrderStatus.DELIVERED,
        },
      })

      return reply.status(204).send()
    },
  )
}
