import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { OrderStatus, PaymentMethod, Prisma } from "generated/prisma"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"

interface Query {
  id: string
  date: Date
  payment: string
  status: string
  total: string
  customerName: string
  phone: string
  email: string
  address: string
  number: number | null
  district: string
  city: string
  uf: string
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
    "/order/:orderId",
    {
      schema: {
        params: z.object({
          orderId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            id: z.string().uuid(),
            date: z.date(),
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
              address: z.string(),
              number: z.number().nullable(),
              district: z.string(),
              city: z.string(),
              uf: z.string(),
            }),
            restaurant: z.object({
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
          o.payment,
          o.status,
          o.total,
          u.name "customerName",
          u.phone,
          u.email,
          ad.address,
          ad.number,
          ad.district,
          ad.city,
          ad.uf,
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
        payment,
        status,
        total,
        customerName,
        phone,
        email,
        address,
        number,
        district,
        city,
        uf,
        restaurantName,
        restaurantImage,
        tax,
        deliveryTime,
        rate,
      } = query[0]

      const order = {
        id,
        date,
        payment,
        status,
        total: Number(total),
        rate,
        restaurant: {
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
          address,
          number,
          district,
          city,
          uf,
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
