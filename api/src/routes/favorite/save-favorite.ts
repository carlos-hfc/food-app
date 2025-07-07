import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
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
      const { id: clientId } = await request.getCurrentUser()
      const { restaurantId } = request.body

      const favoriteExists = await prisma.favorite.findUnique({
        where: {
          clientId_restaurantId: {
            clientId,
            restaurantId,
          },
        },
      })

      if (favoriteExists) {
        throw new ClientError("Restaurant already is favorited")
      }

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
