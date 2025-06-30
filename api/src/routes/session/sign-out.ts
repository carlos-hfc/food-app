import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { auth } from "@/middlewares/auth"

export const signOut: FastifyPluginAsyncZod = async app => {
  app.register(auth).post(
    "/session/sign-out",
    {
      schema: {
        response: {
          200: z.null(),
        },
      },
    },
    async (_, reply) => {
      return reply.clearCookie("token").status(200).send()
    },
  )
}
