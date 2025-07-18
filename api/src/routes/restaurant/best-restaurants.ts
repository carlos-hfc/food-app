import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { Prisma } from "generated/prisma"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

interface Query {
  id: string
  name: string
  image: string | null
  category: string
}

export const bestRestaurants: FastifyPluginAsyncZod = async app => {
  app.get(
    "/best-restaurants",
    {
      schema: {
        response: {
          200: z.array(
            z.object({
              id: z.string().uuid(),
              name: z.string(),
              image: z.string().nullable(),
              category: z.string(),
            }),
          ),
        },
      },
    },
    async () => {
      const query = await prisma.$queryRaw<Query[]>(Prisma.sql`
        select 
          r.id id,
          r.name name,
          r.image image,
          cat.name category,
          round(avg(o.grade), 2) average
        from restaurants r
        join orders o on o."restaurantId" = r.id
        join categories cat on cat.id = r."categoryId"
        where o.grade is not null
        group by r.id, cat.id
        order by average desc
        limit 4
      `)

      return query
    },
  )
}
