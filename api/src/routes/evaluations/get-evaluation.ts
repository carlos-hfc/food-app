import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { Prisma } from "generated/prisma"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

interface Query {
  id: string
  rate: number
  comment: string | null
  createdAt: Date
  customerName: string
  phone: string
  email: string
  total: string
  date: Date
  tax: string
  productId: string
  productName: string
  price: string
  quantity: number
}

export const getEvaluation: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/evaluations/:evaluationId",
    {
      preHandler: [verifyUserRole("ADMIN")],
      schema: {
        params: z.object({
          evaluationId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            id: z.string().uuid(),
            rate: z.number(),
            comment: z.string().nullable(),
            createdAt: z.date(),
            date: z.date(),
            total: z.number(),
            tax: z.number(),
            customer: z.object({
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
      const { evaluationId } = request.params

      const query = await prisma.$queryRaw<Query[]>(Prisma.sql`
          select 
            e.id,
            e.rate,
            e.comment,
            e."createdAt"::date,
            u.name "customerName",
            u.phone,
            u.email,
            o.total::money,
            o.date::date,
            r.tax::money,
            pr.id "productId",
            pr.name "productName",
            oi.price,
            oi.quantity
          from evaluations e
          join users u on u.id = e."clientId"
          join orders o on o.id = e."orderId"
          join restaurants r on r.id = o."restaurantId"
          join "orderItems" oi on oi."orderId" = o.id
          join products pr on pr.id = oi."productId"
          where e.id = ${evaluationId} 
        `)

      const {
        id,
        rate,
        comment,
        createdAt,
        customerName,
        phone,
        email,
        total,
        date,
        tax,
      } = query[0]

      const evaluation = {
        id,
        rate,
        comment,
        createdAt,
        date,
        total: Number(total),
        tax: Number(tax),
        customer: {
          name: customerName,
          phone,
          email,
        },
        products: query.map(item => ({
          id: item.productId,
          name: item.productName,
          price: Number(item.price),
          quantity: item.quantity,
        })),
      }

      return evaluation
    },
  )
}
