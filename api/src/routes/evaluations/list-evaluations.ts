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
  grade: number
  comment: string | null
  ratingDate: Date
}

export const listEvaluations: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/evaluations",
    {
      preHandler: [verifyUserRole("ADMIN")],
      schema: {
        querystring: z.object({
          pageIndex: z.coerce.number().default(0),
          grade: z.coerce.number().optional(),
          comment: z
            .string()
            .transform(value => value === "true")
            .pipe(z.boolean())
            .optional(),
        }),
        response: {
          200: z.object({
            evaluations: z.array(
              z.object({
                id: z.string().uuid(),
                customerName: z.string(),
                grade: z.number(),
                comment: z.string().nullable(),
                ratingDate: z.date(),
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
      const { pageIndex, comment, grade } = request.query

      const search: Prisma.Sql[] = []

      search.push(
        Prisma.sql`o."restaurantId" = ${restaurantId} and o.grade is not null`,
      )
      if (grade) search.push(Prisma.sql`o.grade = ${grade}`)
      if (comment === true) search.push(Prisma.sql`o.comment is not null`)
      if (comment === false) search.push(Prisma.sql`o.comment is null`)

      const baseQuery = Prisma.sql`
        select
          o.id,
          u.name "customerName",
          o.grade,
          o."ratingDate",
          o.comment
        from orders o
        join users u on u.id = o."clientId"
        where ${Prisma.join(search, " and ")}
        order by o."ratingDate" desc
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
