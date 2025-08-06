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
          street: z.string(),
          number: z.number(),
          district: z.string(),
          city: z.string(),
          state: z.string(),
          alias: z.string().nullable(),
          main: z.boolean().optional(),
        }),
        response: {
          201: z.object({
            addressId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id: clientId } = await request.getCurrentUser()

      const { zipCode, street, number, district, city, state, alias, main } =
        request.body

      const addresses = await prisma.address.findMany({
        where: {
          clientId,
          main: true,
        },
      })

      if (main) {
        await prisma.address.updateMany({
          where: {
            main: true,
          },
          data: {
            main: false,
          },
        })
      }

      const address = await prisma.address.create({
        data: {
          zipCode,
          street,
          number,
          district,
          city,
          state,
          alias,
          clientId,
          main: main ?? addresses.length <= 0,
        },
      })

      return reply.status(201).send({ addressId: address.id })
    },
  )
}
