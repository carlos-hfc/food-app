import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

export const listCategories: FastifyPluginAsyncZod = async app => {
  app.get(
    "/categories",
    {
      schema: {
        querystring: z.object({
          name: z.string().optional(),
        }),
        response: {
          200: z.array(
            z.object({
              id: z.string().uuid(),
              name: z.string(),
            }),
          ),
        },
      },
    },
    async request => {
      const { name } = request.query

      const categories = await prisma.category.findMany({
        where: {
          name: {
            mode: "insensitive",
            equals: name,
          },
        },
      })

      return categories
    },
  )
}
