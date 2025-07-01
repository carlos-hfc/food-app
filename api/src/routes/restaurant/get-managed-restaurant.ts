import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"

export const getManagedRestaurant: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/managed-restaurant",
    {
      schema: {
        response: {
          200: z.object({
            id: z.string().uuid(),
            name: z.string(),
          }),
        },
      },
    },
    async request => {
      const adminId = await request.getCurrentUserId()

      if (!adminId) {
        throw new ClientError("User not found")
      }

      const restaurant = await prisma.restaurant.findUnique({
        where: {
          adminId,
        },
        select: {
          id: true,
          name: true,
        },
      })

      if (!restaurant) {
        throw new ClientError("Restaurant not found")
      }

      return restaurant
    },
  )
}
