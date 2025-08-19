import { FastifyInstance } from "fastify"
import { Prisma } from "generated/prisma"
import request from "supertest"

import { prisma } from "@/lib/prisma"

import { makeAddress } from "../factories/make-address"
import { makeProduct } from "../factories/make-product"
import { createAndAuthRestaurant } from "../utils/create-and-auth-restaurant"
import { createAndAuthUser } from "../utils/create-and-auth-user"

export interface CreateOrderParams extends Prisma.OrderUncheckedCreateInput {}

export interface CreateOrderResponse {
  orderId: string
  total: number
  restaurantToken: string[]
  userToken: string[]
}

export async function createOrder(
  app: FastifyInstance,
  override: Partial<CreateOrderParams> = {},
): Promise<CreateOrderResponse> {
  const productIds: string[] = []

  const { token: restaurantToken, restaurantId } =
    await createAndAuthRestaurant(app, {
      openedAt: "08:00",
      closedAt: "23:00",
    })

  for (let index = 0; index < 2; index++) {
    const response = await request(app.server)
      .post("/products")
      .set("Cookie", restaurantToken)
      .send(makeProduct())

    productIds.push(response.body.productId)
  }

  const { token: userToken } = await createAndAuthUser(app)

  const addressResponse = await request(app.server)
    .post("/addresses")
    .set("Cookie", userToken)
    .send(makeAddress())

  const response = await request(app.server)
    .post("/orders")
    .set("Cookie", userToken)
    .send({
      restaurantId,
      addressId: addressResponse.body.addressId,
      payment: "card",
      products: productIds.map(item => ({
        id: item,
        quantity: 1,
      })),
    })

  if (override.status) {
    await prisma.order.update({
      where: {
        id: response.body.orderId,
      },
      data: {
        status: override.status,
      },
    })
  }

  return {
    orderId: response.body.orderId,
    total: response.body.total,
    userToken,
    restaurantToken,
  }
}
