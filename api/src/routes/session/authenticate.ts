import { compare } from "bcryptjs"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"

export const authenticate: FastifyPluginAsyncZod = async app => {
  app.post(
    "/session/authenticate",
    {
      schema: {
        body: z.object({
          email: z.string().email(),
          password: z.string().min(8),
        }),
        response: {
          200: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) {
        throw new ClientError("Invalid credentials")
      }

      const isPasswordValid = await compare(password, user.password)

      if (!isPasswordValid) {
        throw new ClientError("Invalid credentials")
      }

      const token = await reply.jwtSign(
        {
          role: user.role,
        },
        {
          sign: {
            sub: user.id,
            expiresIn: "7d",
          },
        },
      )

      return reply.status(200).send({ token })
    },
  )
}
