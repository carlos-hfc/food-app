import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { Prisma } from "generated/prisma"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"
import { PER_PAGE } from "@/utils/constants"

interface Query {
  id: string
  name: string
  price: string
  available: boolean
  active: boolean
}

export const listProducts: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/product",
    {
      preHandler: [verifyUserRole("ADMIN")],
      schema: {
        querystring: z.object({
          pageIndex: z.coerce.number().default(0),
          available: z
            .string()
            .transform(value => value === "true")
            .pipe(z.boolean())
            .optional(),
          active: z
            .string()
            .transform(value => value === "true")
            .pipe(z.boolean())
            .optional(),
        }),
        response: {
          200: z.object({
            products: z.array(
              z.object({
                id: z.string().uuid(),
                name: z.string(),
                price: z.number(),
                available: z.boolean(),
                active: z.boolean(),
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
      const { pageIndex, available, active } = request.query

      const search: Prisma.Sql[] = []

      search.push(Prisma.sql`p."restaurantId" = ${restaurantId}`)
      if (active === true) search.push(Prisma.sql`p.active = true`)
      if (active === false) search.push(Prisma.sql`p.active = false`)
      if (available === true) search.push(Prisma.sql`p.available = true`)
      if (available === false) search.push(Prisma.sql`p.available = false`)

      const baseQuery = Prisma.sql`
        select 
          p.id,
          p.name,
          p.price,
          p.available,
          p.active,
          p."createdAt"
        from products p
        where ${Prisma.join(search, " and ")}
        order by p."createdAt" desc
      `

      const products = await prisma.$queryRaw<Query[]>(Prisma.sql`
        ${baseQuery} limit ${PER_PAGE} offset ${pageIndex * PER_PAGE}
      `)
      const [{ count }] = await prisma.$queryRaw<
        Array<{ count: number }>
      >(Prisma.sql`
        with base as (${baseQuery})  
        select count(*)::int from base
      `)

      return {
        products: products.map(item => ({
          ...item,
          price: Number(item.price),
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
