import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { OrderStatus, PaymentMethod } from "generated/prisma"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"
import { PER_PAGE } from "@/utils/constants"

export const listOrders: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/order",
    {
      preHandler: [verifyUserRole("ADMIN")],
      schema: {
        querystring: z.object({
          pageIndex: z.coerce.number().default(0),
          status: z
            .string()
            .toUpperCase()
            .pipe(z.nativeEnum(OrderStatus))
            .optional(),
          payment: z
            .string()
            .toUpperCase()
            .pipe(z.nativeEnum(PaymentMethod))
            .optional(),
        }),
        response: {
          200: z.object({
            orders: z.array(
              z.object({
                id: z.string().uuid(),
                date: z.date(),
                payment: z.nativeEnum(PaymentMethod),
                status: z.nativeEnum(OrderStatus),
                total: z.number(),
                grade: z.number().nullable(),
                client: z.object({
                  name: z.string(),
                }),
              }),
            ),
            meta: z.object({
              totalCount: z.number(),
              pageIndex: z.number(),
              perPage: z.number(),
            }),
          }),
        },
      },
    },
    async request => {
      const adminId = await request.getCurrentUserId()
      const { pageIndex, status, payment } = request.query

      const totalCount = await prisma.order.count({
        where: {
          restaurant: {
            adminId,
          },
          status,
          payment,
        },
      })

      const orders = await prisma.order.findMany({
        where: {
          restaurant: {
            adminId,
          },
          status,
          payment,
        },
        select: {
          id: true,
          date: true,
          status: true,
          payment: true,
          total: true,
          grade: true,
          client: {
            select: {
              name: true,
            },
          },
        },
        take: PER_PAGE,
        skip: pageIndex * PER_PAGE,
      })

      return {
        orders: orders.map(item => ({
          ...item,
          total: item.total.toNumber(),
        })),
        meta: {
          pageIndex,
          totalCount,
          perPage: PER_PAGE,
        },
      }
    },
  )
}
