import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

export const deleteFavorite: FastifyPluginAsyncZod = async app => {
  app.register(auth).delete(
    "/favorite/:favoriteId",
    {
      preHandler: [verifyUserRole("CLIENT")],
      schema: {
        params: z.object({
          favoriteId: z.string().uuid(),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const clientId = await request.getCurrentUserId()

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
