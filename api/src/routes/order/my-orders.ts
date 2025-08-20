import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { OrderStatus, PaymentMethod, Prisma } from "generated/prisma"
import z from "zod"

import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

interface Query {
  id: string
  status: string
  payment: string
  date: Date
  preparedAt: Date | null
  routedAt: Date | null
  deliveredAt: Date | null
  canceledAt: Date | null
  restaurantId: string
  name: string
  image: string | null
  tax: string
  quantity: number
  productId: string
  productName: string
  productImage: string | null
  price: string
  rate: number | null
}

export const myOrders: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/orders/me",
    {
      preHandler: [verifyUserRole("CLIENT")],
      schema: {
        tags: ["orders"],
        summary: "List all orders of the user",
        response: {
          200: z
            .array(
              z.object({
                id: z.string().uuid(),
                status: z.string().pipe(z.nativeEnum(OrderStatus)),
                payment: z.string().pipe(z.nativeEnum(PaymentMethod)),
                date: z.date(),
                preparedAt: z.date().nullable(),
                routedAt: z.date().nullable(),
                deliveredAt: z.date().nullable(),
                canceledAt: z.date().nullable(),
                rate: z.number().nullable(),
                restaurant: z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  image: z.string().nullable(),
                  tax: z.number(),
                }),
                products: z.array(
                  z.object({
                    id: z.string().uuid(),
                    quantity: z.number(),
                    name: z.string(),
                    image: z.string().nullable(),
                    price: z.number(),
                  }),
                ),
              }),
            )
            .describe("OK"),
          400: z
            .object({
              statusCode: z.number(),
              message: z.string(),
            })
            .describe("Bad Request"),
          401: z
            .object({
              statusCode: z.number(),
              message: z.string(),
            })
            .describe("Unauthorized"),
        },
      },
    },
    async request => {
      const { id: clientId } = await request.getCurrentUser()

      const query = await prisma.$queryRaw<Query[]>(Prisma.sql`
        select
          o.id,
          o.status,
          o.payment,
          o.date,
          o."preparedAt",
          o."routedAt",
          o."deliveredAt",
          o."canceledAt",
          r.id "restaurantId",
          r.name,
          r.image,
          r.tax,
          oi.quantity,
          pr.id "productId",
          pr.name "productName",
          pr.image "productImage",
          pr.price,
          e.rate
        from orders o
        join users u on u.id = o."clientId"
        join restaurants r on r.id = o."restaurantId"
        join "orderItems" oi on oi."orderId" = o.id
        join products pr on pr.id = oi."productId"
        left join evaluations e on e."orderId" = o.id
        where u.id = ${clientId}
        order by
          case o.status
            when 'PENDING' then 3
            when 'PREPARING' then 2
            when 'ROUTING' then 1
            when 'DELIVERED' then 0
            when 'CANCELED' then 0
          end desc, o.date desc
      `)

      const orders = new Map()

      for (const item of query) {
        if (!orders.has(item.id)) {
          orders.set(item.id, {
            id: item.id,
            payment: item.payment,
            status: item.status,
            date: item.date,
            preparedAt: item.preparedAt,
            routedAt: item.routedAt,
            deliveredAt: item.deliveredAt,
            canceledAt: item.canceledAt,
            rate: item.rate,
            restaurant: {
              id: item.restaurantId,
              name: item.name,
              image: item.image,
              tax: Number(item.tax),
            },
            products: [],
          })
        }

        orders.get(item.id).products.push({
          id: item.productId,
          name: item.productName,
          quantity: item.quantity,
          image: item.productImage,
          price: Number(item.price),
        })
      }

      return Array.from(orders.values())
    },
  )
}
