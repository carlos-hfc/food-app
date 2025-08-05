import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { OrderStatus, Prisma } from "generated/prisma"
import z from "zod"

import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

interface Query {
  id: string
  status: string
  date: Date
  name: string
  image: string | null
  quantity: number
  productId: string
  productName: string
  rate: number | null
}

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
              status: z.string().pipe(z.nativeEnum(OrderStatus)),
              date: z.date(),
              rate: z.number().nullable(),
              restaurant: z.object({
                name: z.string(),
                image: z.string().nullable(),
              }),
              products: z.array(
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
      const { id: clientId } = await request.getCurrentUser()

      const query = await prisma.$queryRaw<Query[]>(Prisma.sql`
          select
            o.id,
            o.status,
            o.date,
            r.name,
            r.image,
            oi.quantity,
            pr.id "productId",
            pr.name "productName",
            e.rate
          from orders o
          join users u on u.id = o."clientId"
          join restaurants r on r.id = o."restaurantId"
          join "orderItems" oi on oi."orderId" = o.id
          join products pr on pr.id = oi."productId"
          left join evaluations e on e."orderId" = o.id
          where u.id = ${clientId}
        `)

      const orders = new Map()

      for (const item of query) {
        if (!orders.has(item.id)) {
          orders.set(item.id, {
            id: item.id,
            status: item.status,
            date: item.date,
            rate: item.rate,
            restaurant: {
              name: item.name,
              image: item.image,
            },
            products: [],
          })
        }

        orders.get(item.id).products.push({
          id: item.productId,
          product: item.productName,
          quantity: item.quantity,
        })
      }

      return Array.from(orders.values())
    },
  )
}
