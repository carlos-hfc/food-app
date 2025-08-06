import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

export const getAddress: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/address/:addressId",
    {
      preHandler: [verifyUserRole("CLIENT")],
      schema: {
        params: z.object({
          addressId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            id: z.string().uuid(),
            zipCode: z.string(),
            address: z.string(),
            number: z.number().nullable(),
            district: z.string(),
            city: z.string(),
            uf: z.string(),
            alias: z.string().nullable(),
            main: z.boolean(),
          }),
        },
      },
    },
    async request => {
      const { id: clientId } = await request.getCurrentUser()

      const { addressId } = request.params

      const address = await prisma.address.findUnique({
        where: {
          id: addressId,
          clientId,
        },
      })

      if (!address) {
        throw new ClientError("Address not found")
      }

      return address
    },
  )
}
