import { TZDate } from "@date-fns/tz"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { OrderStatus } from "generated/prisma"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { restaurantIsOpen } from "@/utils/check-restaurant-is-open"

export const cancelOrder: FastifyPluginAsyncZod = async app => {
  app.register(auth).patch(
    "/orders/:orderId/cancel",
    {
      schema: {
        params: z.object({
          orderId: z.string().uuid(),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { orderId } = request.params

      const order = await prisma.order.findUnique({
        where: {
          id: orderId,
        },
      })

      if (!order) {
        throw new ClientError("Order not found")
      }

      const restaurant = await prisma.restaurant.findUnique({
        where: {
          id: order.restaurantId,
        },
        include: {
          hours: {
            where: {
              weekday: new TZDate().getDay(),
            },
          },
        },
      })

      if (
        !restaurantIsOpen(restaurant!.hours[0]) ||
        !restaurant!.hours[0].open
      ) {
        throw new ClientError("Restaurant is not open to update order status")
      }

      if (
        order.status === OrderStatus.CANCELED ||
        order.status === OrderStatus.DELIVERED ||
        order.status === OrderStatus.ROUTING
      ) {
        throw new ClientError("Not allowed")
      }

      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: OrderStatus.CANCELED,
          canceledAt: new Date(),
        },
      })

      return reply.status(204).send()
    },
  )
}
