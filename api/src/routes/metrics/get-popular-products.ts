import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { Prisma } from "generated/prisma"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

interface Query {
  amount: number
  product: string
}

export const getPopularProducts: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/metrics/popular-products",
    {
      preHandler: [verifyUserRole("ADMIN")],
      schema: {
        response: {
          200: z.array(
            z.object({
              product: z.string(),
              amount: z.number(),
            }),
          ),
        },
      },
    },
    async request => {
      const restaurantId = await request.getManagedRestaurantId()

      const popularProducts = await prisma.$queryRaw<Query[]>(Prisma.sql`
        select 
          p.name product,
          count(oi."id")::int amount
        from "orderItems" oi
        left join orders o on o.id = oi."orderId"
        left join products p on p.id = oi."productId"
        where o."restaurantId" = ${restaurantId}
        group by p.name
        order by amount desc
        limit 5
      `)

      return popularProducts
    },
  )
}
