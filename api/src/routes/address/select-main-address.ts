import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

export const selectMainAddress: FastifyPluginAsyncZod = async app => {
  app.register(auth).patch(
    "/address/:addressId/main",
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
        throw new ClientError("Address not found or not belongs to user")
      }

      await prisma.address.updateMany({
        where: {
          main: true,
        },
        data: {
          main: false,
        },
      })

      await prisma.address.update({
        where: {
          id: addressId,
        },
        data: {
          main: true,
        },
      })

      return reply.status(204).send()
    },
  )
}
