import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

export const getEvaluation: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/evaluations/:orderId",
    {
      preHandler: [verifyUserRole("ADMIN")],
      schema: {
        params: z.object({
          orderId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            id: z.string().uuid(),
            date: z.date(),
            total: z.number(),
            grade: z.number(),
            ratingDate: z.date(),
            comment: z.string().nullable(),
            tax: z.number(),
            client: z.object({
              name: z.string(),
              email: z.string().email(),
              phone: z.string(),
            }),
            products: z.array(
              z.object({
                id: z.string().uuid(),
                name: z.string(),
                price: z.number(),
                quantity: z.number(),
              }),
            ),
          }),
        },
      },
    },
    async request => {
      const { orderId } = request.params

      const evaluation = await prisma.order.findUnique({
        where: {
          id: orderId,
          grade: {
            not: null,
          },
        },
        select: {
          id: true,
          clientId: true,
          date: true,
          total: true,
          grade: true,
          comment: true,
          ratingDate: true,
          client: {
            select: {
              name: true,
              phone: true,
              email: true,
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
                },
              },
            },
          },
          restaurant: {
            select: {
              tax: true,
            },
          },
        },
      })

      if (!evaluation) {
        throw new ClientError("Evaluation not found")
      }

      return {
        ...evaluation,
        total: evaluation.total.toNumber(),
        grade: evaluation.grade!,
        ratingDate: evaluation.ratingDate!,
        tax: evaluation.restaurant.tax.toNumber(),
        products: evaluation.orderItems.map(item => ({
          id: item.id,
          name: item.product.name,
          price: item.price.toNumber(),
          quantity: item.quantity,
        })),
      }
    },
  )
}
