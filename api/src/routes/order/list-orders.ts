import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { OrderStatus, PaymentMethod, Prisma } from "generated/prisma"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"
import { PER_PAGE } from "@/utils/constants"

interface Query {
  id: string
  date: Date
  status: OrderStatus
  payment: PaymentMethod
  total: string
  customerName: string
}

export const listOrders: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/orders",
    {
      preHandler: [verifyUserRole("ADMIN")],
      schema: {
        querystring: z.object({
          pageIndex: z.coerce.number().default(0),
          status: z
            .string()
            .toUpperCase()
            .pipe(z.nativeEnum(OrderStatus))
            .optional(),
          payment: z
            .string()
            .toUpperCase()
            .pipe(z.nativeEnum(PaymentMethod))
            .optional(),
        }),
        response: {
          200: z.object({
            orders: z.array(
              z.object({
                id: z.string().uuid(),
                date: z.date(),
                payment: z.nativeEnum(PaymentMethod),
                status: z.nativeEnum(OrderStatus),
                total: z.number(),
                customerName: z.string(),
              }),
            ),
            meta: z.object({
              totalCount: z.number(),
              pageIndex: z.number(),
              perPage: z.number(),
            }),
          }),
        },
      },
    },
    async request => {
      const restaurantId = await request.getManagedRestaurantId()
      const { pageIndex, status, payment } = request.query

      const search: Prisma.Sql[] = []

      search.push(Prisma.sql`o."restaurantId" = ${restaurantId}`)
      if (status) search.push(Prisma.sql`o.status::varchar = ${status}`)
      if (payment) search.push(Prisma.sql`o.payment::varchar = ${payment}`)

      const baseQuery = Prisma.sql`
        select
          o.id,
          o.date,
          o.status,
          o.payment,
          o.total,
          u.name "customerName"
        from orders o
        join users u on u.id = o."clientId"
        where ${Prisma.join(search, " and ")}
        order by
          case o.status
            when 'PENDING' then 4
            when 'PREPARING' then 3
            when 'ROUTING' then 2
            when 'DELIVERED' then 1
            when 'CANCELED' then 0
          end desc, date desc
      `

      const orders = await prisma.$queryRaw<Query[]>(Prisma.sql`
        ${baseQuery} limit ${PER_PAGE} offset ${pageIndex * PER_PAGE}
      `)
      const [{ count }] = await prisma.$queryRaw<
        Array<{ count: number }>
      >(Prisma.sql`
        with base as (${baseQuery})
        select count(*)::int from base
      `)

      return {
        orders: orders.map(item => ({
          ...item,
          total: Number(item.total),
        })),
        meta: {
          pageIndex,
          totalCount: count,
          perPage: PER_PAGE,
        },
      }
    },
  )
}
