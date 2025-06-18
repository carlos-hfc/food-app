import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

export const saveFavorite: FastifyPluginAsyncZod = async app => {
  app.register(auth).post(
    "/favorite",
    {
      preHandler: [verifyUserRole("CLIENT")],
      schema: {
        body: z.object({
          restaurantId: z.string().uuid(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const clientId = await request.getCurrentUserId()

      const { restaurantId } = request.body

      await prisma.favorite.create({
        data: {
          restaurantId,
          clientId,
        },
      })

      return reply.status(201).send()
    },
  )
}
