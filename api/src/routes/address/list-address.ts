import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

export const listAddress: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/address",
    {
      preHandler: [verifyUserRole("CLIENT")],
      schema: {
        response: {
          200: z.object({
            addresses: z.array(
              z.object({
                id: z.string().uuid(),
                zipCode: z.string(),
                address: z.string(),
                number: z.number().nullable(),
                district: z.string(),
                city: z.string(),
                uf: z.string(),
                alias: z.string().nullable(),
                main: z.boolean(),
                clientId: z.string().uuid(),
              }),
            ),
          }),
        },
      },
    },
    async request => {
      const { id: clientId } = await request.getCurrentUser()

      const addresses = await prisma.address.findMany({
        where: {
          clientId,
        },
      })

      return { addresses }
    },
  )
}
