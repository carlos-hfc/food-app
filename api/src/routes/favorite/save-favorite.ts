import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

export const saveFavorite: FastifyPluginAsyncZod = async app => {
  app.register(auth).post(
    "/favorites",
    {
      preHandler: [verifyUserRole("CLIENT")],
      schema: {
        tags: ["favorites"],
        summary: "Save a restaurant as favorite",
        body: z.object({
          restaurantId: z.string().uuid(),
        }),
        response: {
          201: z
            .object({
              favoriteId: z.string().uuid(),
            })
            .describe("Created"),
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

      const { id } = await prisma.favorite.create({
        data: {
          restaurantId,
          clientId,
        },
      })

      return reply.status(201).send({ favoriteId: id })
    },
  )
}
