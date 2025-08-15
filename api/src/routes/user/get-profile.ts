import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

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
      const user = await request.getCurrentUser()

      return user
    },
  )
}
