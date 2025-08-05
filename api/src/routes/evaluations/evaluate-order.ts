import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { OrderStatus } from "generated/prisma"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

export const evaluateOrder: FastifyPluginAsyncZod = async app => {
  app.register(auth).post(
    "/evaluations/:orderId",
    {
      preHandler: [verifyUserRole("CLIENT")],
      schema: {
        params: z.object({
          orderId: z.string().uuid(),
        }),
        body: z.object({
          rate: z.number().int().min(1),
          comment: z.string().optional(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { id: clientId } = await request.getCurrentUser()

      const { orderId } = request.params
      const { rate, comment } = request.body

      const order = await prisma.order.findUnique({
        where: {
          id: orderId,
          clientId,
        },
      })

      if (!order) {
        throw new ClientError("Order not found")
      }

      if (order.status !== OrderStatus.DELIVERED) {
        throw new ClientError("Orders not delivered cannot be evaluated")
      }

      await prisma.evaluation.create({
        data: {
          orderId,
          rate,
          comment,
          clientId,
        },
      })

      return reply.status(201).send()
    },
  )
}
