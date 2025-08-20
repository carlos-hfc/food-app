import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

export const listAddress: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/addresses",
    {
      preHandler: [verifyUserRole("CLIENT")],
      schema: {
        tags: ["addresses"],
        summary: "List all addresses of the user",
        response: {
          200: z
            .array(
              z.object({
                id: z.string().uuid(),
                zipCode: z.string(),
                street: z.string(),
                number: z.number(),
                district: z.string(),
                city: z.string(),
                state: z.string(),
                alias: z.string().nullable(),
                main: z.boolean(),
              }),
            )
            .describe("OK"),
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
    async request => {
      const { id: clientId } = await request.getCurrentUser()

      const addresses = await prisma.address.findMany({
        where: {
          clientId,
          active: true,
        },
        orderBy: [{ main: "desc" }, { createdAt: "asc" }],
      })

      return addresses
    },
  )
}
