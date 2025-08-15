import { compare, hash } from "bcryptjs"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { PASSWORD_REGEX } from "@/utils/constants"

export const editProfile: FastifyPluginAsyncZod = async app => {
  app.register(auth).put(
    "/profile",
    {
      schema: {
        body: z
          .object({
            name: z.string().optional(),
            email: z.string().email().optional(),
            phone: z.string().optional(),
            password: z
              .string()
              .min(8)
              .refine(value => PASSWORD_REGEX.test(value), {
                message:
                  "Password must contain at least eight characters, an uppercase letter, a lowercase letter, a number and a special character",
              })
              .optional(),
            confirmPassword: z.string().optional(),
          })
          .refine(data => data.password === data.confirmPassword, {
            message: "Password and confirm password don't match",
            path: ["confirmPassword"],
          }),
        response: {
          200: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { id } = await request.getCurrentUser()

      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      })

      if (!user) {
        throw new ClientError("User not found")
      }

      const { name, password, phone, email } = request.body

      if (password && (await compare(password, user.password))) {
        throw new ClientError(
          "New password cannot be equal to the current password",
        )
      }

      let hashedPassword

      if (password) {
        hashedPassword = await hash(password, 10)
      }

      const userExists = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { phone }],
        },
      })

      if (userExists) {
        throw new ClientError("User already exists")
      }

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name,
          password: hashedPassword,
          phone,
          email,
        },
      })

      return reply.send()
    },
  )
}
