import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

export const signOut: FastifyPluginAsyncZod = async app => {
  app.post(
    "/session/sign-out",
    {
      schema: {
        tags: ["sessions"],
        summary: "Sign out user",
        response: {
          200: z.null().describe("OK"),
        },
      },
    },
    async (_, reply) => {
      return reply.clearCookie("token").status(200).send()
    },
  )
}
