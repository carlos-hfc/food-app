import { hash } from "bcryptjs"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { Role } from "generated/prisma"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { PASSWORD_REGEX } from "@/utils/constants"

export const registerClient: FastifyPluginAsyncZod = async app => {
  app.post(
    "/session/register",
    {
      schema: {
        body: z.object({
          email: z.string().email(),
          password: z.string().refine(value => PASSWORD_REGEX.test(value), {
            message:
              "Password must contain at least eight characters, an uppercase letter, a lowercase letter, a number and a special character",
          }),
          name: z.string(),
          phone: z.string(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { email, name, password, phone } = request.body

      const user = await prisma.user.findUnique({
        where: {
          email_phone: {
            email,
            phone,
          },
        },
      })

      if (user) {
        throw new ClientError("User already exists")
      }

      const hashedPassword = await hash(password, 10)

      await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          phone,
          role: Role.CLIENT,
        },
      })

      return reply.status(201).send()
    },
  )
}
