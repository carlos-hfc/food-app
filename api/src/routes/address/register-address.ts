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
        respnose: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const clientId = await request.getCurrentUserId()

      const { zipCode, address, number, district, city, uf, alias } =
        request.body

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
        },
      })

      return reply.status(201).send()
    },
  )
}
