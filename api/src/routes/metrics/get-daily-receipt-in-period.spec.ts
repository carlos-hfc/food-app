import { faker } from "@faker-js/faker"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"

import { prisma } from "@/lib/prisma"
import { app } from "@/server"
import { makeAddress } from "@/test/factories/make-address"
import { makeProduct } from "@/test/factories/make-product"
import { createAndAuthRestaurant } from "@/test/utils/create-and-auth-restaurant"
import { createAndAuthUser } from "@/test/utils/create-and-auth-user"

let restaurantToken: string[]
let restaurantId: string
const productIds: string[] = []

describe("List daily receipt in period [GET] /metrics/daily-receipt-in-period", () => {
  beforeAll(async () => {
    vi.setSystemTime(new Date(2025, 7, 19, 10, 0, 0))

    await app.ready()

    const restaurant = await createAndAuthRestaurant(app, {
      openedAt: "08:00",
      closedAt: "23:00",
    })

    restaurantId = restaurant.restaurantId
    restaurantToken = restaurant.token

    for (let index = 0; index < 5; index++) {
      const response = await request(app.server)
        .post("/products")
        .set("Cookie", restaurantToken)
        .send(makeProduct())

      productIds.push(response.body.productId)
    }

    const { token } = await createAndAuthUser(app)

    const addressResponse = await request(app.server)
      .post("/addresses")
      .set("Cookie", token)
      .send(makeAddress())

    for (let index = 0; index < 30; index++) {
      const order = await request(app.server)
        .post("/orders")
        .set("Cookie", token)
        .send({
          restaurantId,
          addressId: addressResponse.body.addressId,
          payment: "card",
          products: faker.helpers
            .arrayElements(productIds, {
              min: 1,
              max: 3,
            })
            .map(item => ({
              id: item,
              quantity: faker.number.int({ min: 1, max: 3 }),
            })),
        })

      const id = order.body.orderId

      await prisma.order.update({
        where: {
          id,
        },
        data: {
          status: "DELIVERED",
          date: faker.date.recent({ days: 120 }),
        },
      })
    }
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to list daily receipt in period", async () => {
    const response = await request(app.server)
      .get(`/metrics/daily-receipt-in-period`)
      .set("Cookie", restaurantToken)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          date: expect.any(String),
          receipt: expect.any(Number),
        }),
      ]),
    )
  })

  it("should be able to list daily receipt in period filtering date interval", async () => {
    const response = await request(app.server)
      .get(`/metrics/daily-receipt-in-period`)
      .set("Cookie", restaurantToken)
      .query({
        from: "2025-08-01",
        to: "2025-08-07",
      })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          date: expect.any(String),
          receipt: expect.any(Number),
        }),
      ]),
    )
  })
})
