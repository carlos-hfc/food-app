import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { OrderStatus, PaymentMethod, Prisma } from "generated/prisma"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"

interface Query {
  id: string
  date: Date
  preparedAt: Date | null
  routedAt: Date | null
  deliveredAt: Date | null
  canceledAt: Date | null
  payment: string
  status: string
  total: string
  customerName: string
  phone: string
  email: string
  street: string
  number: number
  district: string
  city: string
  state: string
  restaurantId: string
  restaurantName: string
  restaurantImage: string | null
  tax: string
  deliveryTime: number
  productId: string
  productName: string
  productImage: string | null
  price: string
  quantity: number
  rate: number | null
}

export const getOrder: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/orders/:orderId",
    {
      schema: {
        params: z.object({
          orderId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            id: z.string().uuid(),
            date: z.date(),
            preparedAt: z.date().nullable(),
            routedAt: z.date().nullable(),
            deliveredAt: z.date().nullable(),
            canceledAt: z.date().nullable(),
            payment: z.string().toUpperCase().pipe(z.nativeEnum(PaymentMethod)),
            status: z.string().toUpperCase().pipe(z.nativeEnum(OrderStatus)),
            total: z.number(),
            rate: z.number().nullable(),
            client: z.object({
              name: z.string(),
              email: z.string().email(),
              phone: z.string(),
            }),
            address: z.object({
              street: z.string(),
              number: z.number(),
              district: z.string(),
              city: z.string(),
              state: z.string(),
            }),
            restaurant: z.object({
              id: z.string().uuid(),
              name: z.string(),
              image: z.string().nullable(),
              deliveryTime: z.number(),
              tax: z.number(),
            }),
            products: z.array(
              z.object({
                id: z.string().uuid(),
                name: z.string(),
                price: z.number(),
                quantity: z.number(),
                image: z.string().nullable(),
              }),
            ),
          }),
        },
      },
    },
    async request => {
      const { orderId } = request.params

      const query = await prisma.$queryRaw<Query[]>(Prisma.sql`
        select
          o.id,
          o.date,
          o."preparedAt",
          o."routedAt",
          o."deliveredAt",
          o."canceledAt",
          o.payment,
          o.status,
          o.total,
          u.name "customerName",
          u.phone,
          u.email,
          ad.street,
          ad.number,
          ad.district,
          ad.city,
          ad.state,
          r.id "restaurantId",
          r.name "restaurantName",
          r.image "restaurantImage",
          r.tax::money,
          r."deliveryTime",
          pr.id "productId",
          pr.name "productName",
          pr.image "productImage",
          pr.price,
          oi.quantity,
          e.rate
        from orders o
        join users u on u.id = o."clientId"
        join addresses ad on ad.id = o."addressId"
        join restaurants r on r.id = o."restaurantId"
        join "orderItems" oi on oi."orderId" = o.id
        join products pr on pr.id = oi."productId"
        left join evaluations e on e."orderId" = o.id
        where o.id = ${orderId}
      `)

      const {
        id,
        date,
        preparedAt,
        routedAt,
        deliveredAt,
        canceledAt,
        payment,
        status,
        total,
        customerName,
        phone,
        email,
        street,
        number,
        district,
        city,
        state,
        restaurantId,
        restaurantName,
        restaurantImage,
        tax,
        deliveryTime,
        rate,
      } = query[0]

      const order = {
        id,
        date,
        preparedAt,
        routedAt,
        deliveredAt,
        canceledAt,
        payment,
        status,
        total: Number(total),
        rate,
        restaurant: {
          id: restaurantId,
          name: restaurantName,
          image: restaurantImage,
          tax: Number(tax),
          deliveryTime,
        },
        client: {
          name: customerName,
          phone,
          email,
        },
        address: {
          street,
          number,
          district,
          city,
          state,
        },
        products: query.map(item => ({
          id: item.productId,
          name: item.productName,
          image: item.productImage,
          price: Number(item.price),
          quantity: item.quantity,
        })),
      }

      return order
    },
  )
}
