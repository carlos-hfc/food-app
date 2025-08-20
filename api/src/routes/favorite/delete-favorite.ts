import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

export const deleteFavorite: FastifyPluginAsyncZod = async app => {
  app.register(auth).delete(
    "/favorites/:favoriteId",
    {
      preHandler: [verifyUserRole("CLIENT")],
      schema: {
        tags: ["favorites"],
        summary: "Remove a favorite",
        params: z.object({
          favoriteId: z.string().uuid(),
        }),
        response: {
          204: z.null().describe("No content"),
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

      const { favoriteId } = request.params

      await prisma.favorite.delete({
        where: {
          id: favoriteId,
          clientId,
        },
      })

      return reply.status(204).send()
    },
  )
}
