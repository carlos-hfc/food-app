import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

export const editAddress: FastifyPluginAsyncZod = async app => {
  app.register(auth).patch(
    "/address/:addressId",
    {
      preHandler: [verifyUserRole("CLIENT")],
      schema: {
        params: z.object({
          addressId: z.string().uuid(),
        }),
        body: z.object({
          zipCode: z.string().optional(),
          address: z.string().optional(),
          number: z.number().nullable().optional(),
          district: z.string().optional(),
          city: z.string().optional(),
          uf: z.string().optional(),
          alias: z.string().nullable().optional(),
          main: z.boolean().optional(),
        }),
        response: {
          200: z.null(),
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

      const {
        zipCode,
        address: addressName,
        number,
        district,
        city,
        uf,
        alias,
        main,
      } = request.body

      await prisma.address.update({
        where: {
          id: addressId,
        },
        data: {
          zipCode,
          address: addressName,
          number,
          district,
          city,
          uf,
          alias,
          main,
        },
      })

      return reply.send()
    },
  )
}
