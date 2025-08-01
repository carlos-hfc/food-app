import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

export const registerAddress: FastifyPluginAsyncZod = async app => {
  app.register(auth).post(
    "/address",
    {
      preHandler: [verifyUserRole("CLIENT")],
      schema: {
        body: z.object({
          zipCode: z.string(),
          address: z.string(),
          number: z.number().optional(),
          district: z.string(),
          city: z.string(),
          uf: z.string(),
          alias: z.string().optional(),
          main: z.boolean().optional(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { id: clientId } = await request.getCurrentUser()

      const { zipCode, address, number, district, city, uf, alias, main } =
        request.body

      const addresses = await prisma.address.findMany({
        where: {
          clientId,
          main: true,
        },
      })

      await prisma.address.create({
        data: {
          zipCode,
          address,
          number,
          district,
          city,
          uf,
          alias,
          clientId,
          main: main ?? addresses.length <= 0,
        },
      })

      return reply.status(201).send()
    },
  )
}
