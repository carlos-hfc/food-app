import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { env } from "@/env"
import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { uploadFile } from "@/middlewares/upload-file"
import { verifyUserRole } from "@/middlewares/verify-user-role"

export const addImageOnRestaurant: FastifyPluginAsyncZod = async app => {
  app.register(auth).patch(
    "/restaurant/:restaurantId/image",
    {
      preHandler: [verifyUserRole("ADMIN")],
      schema: {
        params: z.object({
          restaurantId: z.string().uuid(),
        }),
        response: {
          200: z.null(),
        },
      },
    },
    async (request, reply) => {
      const userId = await request.getCurrentUserId()

      const { restaurantId } = request.params

      const restaurant = await prisma.restaurant.findUnique({
        where: {
          id: restaurantId,
          adminId: userId,
        },
      })

      if (!restaurant) {
        throw new ClientError("Restaurant not found")
      }

      const file = await request.file()

      if (!file) {
        throw new ClientError("File is required")
      }

      const { url } = await uploadFile({
        file,
      })

      const image = new URL(url, `http://localhost:${env.PORT}`).toString()

      await prisma.restaurant.update({
        where: {
          id: restaurantId,
        },
        data: {
          image,
        },
      })

      return reply.status(200).send()
    },
  )
}
