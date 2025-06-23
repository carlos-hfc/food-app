import { TZDate } from "@date-fns/tz"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { OrderStatus } from "generated/prisma"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

export const rateOrder: FastifyPluginAsyncZod = async app => {
  app.register(auth).patch(
    "/order/:orderId",
    {
      preHandler: [verifyUserRole("CLIENT")],
      schema: {
        params: z.object({
          orderId: z.string().uuid(),
        }),
        body: z.object({
          grade: z.number().int().min(1),
          comment: z.string().optional(),
        }),
        response: {
          200: z.null(),
        },
      },
    },
    async (request, reply) => {
      const clientId = await request.getCurrentUserId()

      const { orderId } = request.params
      const { grade, comment } = request.body

      const order = await prisma.order.findUnique({
        where: {
          id: orderId,
          clientId,
        },
      })

      if (!order) {
        throw new ClientError("Order not found")
      }

      if (order.ratingDate) {
        throw new ClientError("Order already rated")
      }

      if (order.status === OrderStatus.CANCELED) {
        throw new ClientError("Canceled order cannot be rated")
      }

      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          grade,
          comment,
          ratingDate: new TZDate(),
        },
      })

      return reply.send()
    },
  )
}
