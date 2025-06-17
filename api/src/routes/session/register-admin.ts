import { hash } from "bcryptjs"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { Role } from "generated/prisma"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

export const registerAdmin: FastifyPluginAsyncZod = async app => {
  app.register(auth).post(
    "/session/admin",
    {
      preHandler: [verifyUserRole("ADMIN")],
      schema: {
        body: z.object({
          email: z.string().email(),
          password: z
            .string()
            .refine(value => /[A-Za-z0-9!@#$%^&*]{8,}/.test(value), {
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
      const { email, password, name, phone } = request.body

      const user = await prisma.user.findUnique({
        where: {
          email,
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
          role: Role.ADMIN,
        },
      })

      return reply.status(201).send()
    },
  )
}
