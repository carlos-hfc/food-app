import { compare } from "bcryptjs"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { Role } from "generated/prisma"
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
          role: z.string().toUpperCase().pipe(z.nativeEnum(Role)),
        }),
        response: {
          200: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { email, password, role } = request.body

      const user = await prisma.user.findUnique({
        where: {
          email,
          role,
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

      return reply
        .setCookie("token", token, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: true,
        })
        .status(200)
        .send()
    },
  )
}
