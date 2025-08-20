import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { Prisma } from "generated/prisma"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"
import { PER_PAGE } from "@/utils/constants"

interface Query {
  id: string
  customerName: string
  rate: number
  comment: string | null
  createdAt: Date
}

export const listEvaluations: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/evaluations",
    {
      preHandler: [verifyUserRole("ADMIN")],
      schema: {
        tags: ["evaluations"],
        summary: "List all evaluations of the restaurant",
        querystring: z.object({
          pageIndex: z.coerce.number().default(0),
          rate: z.coerce.number().optional(),
          comment: z
            .string()
            .transform(value => value === "true")
            .pipe(z.boolean())
            .optional(),
        }),
        response: {
          200: z
            .object({
              evaluations: z.array(
                z.object({
                  id: z.string().uuid(),
                  customerName: z.string(),
                  rate: z.number(),
                  comment: z.string().nullable(),
                  createdAt: z.date(),
                }),
              ),
              meta: z.object({
                totalCount: z.number(),
                pageIndex: z.number(),
                perPage: z.number(),
              }),
            })
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
      const restaurantId = await request.getManagedRestaurantId()
      const { pageIndex, comment, rate } = request.query

      const search: Prisma.Sql[] = []

      search.push(Prisma.sql`r.id = ${restaurantId}`)
      if (rate) search.push(Prisma.sql`e.rate = ${rate}`)
      if (comment === true) search.push(Prisma.sql`e.comment is not null`)
      if (comment === false) search.push(Prisma.sql`e.comment is null`)

      const baseQuery = Prisma.sql`
        select
          e.id,
          u.name "customerName",
          e.rate,
          e."createdAt",
          e.comment
        from evaluations e
        join users u on u.id = e."clientId"
        join orders o on o.id = e."orderId"
        join restaurants r on r.id = o."restaurantId"
        where ${Prisma.join(search, " and ")}
        order by e."createdAt" desc
      `

      const [{ count }] = await prisma.$queryRaw<
        Array<{ count: number }>
      >(Prisma.sql`
        with base as (${baseQuery})
        select count(*)::int from base
      `)

      const evaluations = await prisma.$queryRaw<Query[]>(Prisma.sql`
        ${baseQuery} limit ${PER_PAGE} offset ${pageIndex * PER_PAGE}
      `)

      return {
        evaluations,
        meta: {
          pageIndex,
          totalCount: count,
          perPage: PER_PAGE,
        },
      }
    },
  )
}
