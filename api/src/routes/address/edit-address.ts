import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

export const editAddress: FastifyPluginAsyncZod = async app => {
  app.register(auth).put(
    "/addresses/:addressId",
    {
      preHandler: [verifyUserRole("CLIENT")],
      schema: {
        tags: ["addresses"],
        summary: "Update an address",
        params: z.object({
          addressId: z.string().uuid(),
        }),
        body: z.object({
          zipCode: z.string().optional(),
          street: z.string().optional(),
          number: z.number().optional(),
          district: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          alias: z.string().nullable().optional(),
          main: z.boolean().optional(),
        }),
        response: {
          204: z.null().describe("OK"),
          400: z
            .object({
              statusCode: z.number(),
              message: z.string(),
            })
            .describe("Bad Request"),
          401: z
            .object({
              statusCode: z.number(),
              message: z.string(),
            })
            .describe("Unauthorized"),
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

      const { zipCode, street, number, district, city, state, alias, main } =
        request.body

      await prisma.address.update({
        where: {
          id: addressId,
        },
        data: {
          zipCode,
          street,
          number,
          district,
          city,
          state,
          alias,
          main,
        },
      })

      return reply.status(204).send()
    },
  )
}
