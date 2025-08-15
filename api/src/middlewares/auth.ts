import fastifyPlugin from "fastify-plugin"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"

export const auth = fastifyPlugin(async app => {
  app.addHook("preHandler", async (request, reply) => {
    request.getCurrentUser = async () => {
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>()

        const user = await prisma.user.findUnique({
          where: {
            id: sub,
          },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            restaurant: {
              select: {
                id: true,
              },
            },
          },
        })

        if (!user) {
          return reply.clearCookie("token").send()
        }

        return {
          ...user,
          restaurantId: user.restaurant?.id,
        }
      } catch (error) {
        throw new ClientError("Invalid auth token", 401)
      }
    }

    request.getManagedRestaurantId = async () => {
      const { restaurantId } = await request.getCurrentUser()

      if (!restaurantId) {
        throw new ClientError("User is not a restaurant manager", 401)
      }

      return restaurantId
    }
  })
})
