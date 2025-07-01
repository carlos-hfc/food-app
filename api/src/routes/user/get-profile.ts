import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"

export const getProfile: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/profile",
    {
      schema: {
        response: {
          200: z.object({
            id: z.string().uuid(),
            name: z.string(),
            email: z.string().email(),
            phone: z.string(),
          }),
        },
      },
    },
    async request => {
      const userId = await request.getCurrentUserId()

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      })

      if (!user) {
        throw new ClientError("User not found")
      }

      return user
    },
  )
}
