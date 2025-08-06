import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

export const deleteAddress: FastifyPluginAsyncZod = async app => {
  app.register(auth).delete(
    "/address/:addressId",
    {
      preHandler: [verifyUserRole("CLIENT")],
      schema: {
        params: z.object({
          addressId: z.string().uuid(),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
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

      await prisma.address.update({
        where: {
          id: addressId,
        },
        data: {
          active: false,
        },
      })

      return reply.status(204).send()
    },
  )
}
