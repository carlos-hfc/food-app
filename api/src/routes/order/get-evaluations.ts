import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { Prisma } from "generated/prisma"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"
import { PER_PAGE } from "@/utils/constants"

export const getEvaluations: FastifyPluginAsyncZod = async app => {
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
                client: z.string(),
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

      const where: Prisma.OrderWhereInput = {
        restaurantId,
        grade: {
          equals: grade,
          not: null,
        },
        comment: comment ? { not: null } : comment === false ? null : {},
      }

      const totalCount = await prisma.order.count({
        where,
      })

      const evaluations = await prisma.order.findMany({
        where,
        select: {
          grade: true,
          comment: true,
          ratingDate: true,
          id: true,
          client: {
            select: {
              name: true,
            },
          },
        },
        take: PER_PAGE,
        skip: pageIndex * PER_PAGE,
        orderBy: {
          ratingDate: "desc",
        },
      })

      return {
        evaluations: evaluations.map(item => ({
          ...item,
          client: item.client.name,
          grade: item.grade!,
          ratingDate: item.ratingDate!,
        })),
        meta: {
          pageIndex,
          totalCount,
          perPage: PER_PAGE,
        },
      }
    },
  )
}
