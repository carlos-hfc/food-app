import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { env } from "@/env"
import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { uploadFile } from "@/middlewares/upload-file"
import { verifyUserRole } from "@/middlewares/verify-user-role"

export const addImageOnProduct: FastifyPluginAsyncZod = async app => {
  app.register(auth).patch(
    "/product/:productId/image",
    {
      preHandler: [verifyUserRole("ADMIN")],
      schema: {
        params: z.object({
          productId: z.string().uuid(),
        }),
        response: {
          200: z.null(),
        },
      },
    },
    async (request, reply) => {
      const restaurantId = await request.getManagedRestaurantId()
      const { productId } = request.params

      const product = await prisma.product.findUnique({
        where: {
          id: productId,
          restaurantId,
        },
      })

      if (!product) {
        throw new ClientError("Product not found")
      }

      const file = await request.file()

      if (!file) {
        throw new ClientError("File is required")
      }

      const { url } = await uploadFile({
        file,
      })

      const image = new URL(url, `http://localhost:${env.PORT}`).toString()

      await prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          image,
        },
      })

      return reply.status(200).send()
    },
  )
}
