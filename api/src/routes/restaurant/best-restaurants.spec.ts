import { faker } from "@faker-js/faker"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { makeAddress } from "@/test/factories/make-address"
import { makeProduct } from "@/test/factories/make-product"
import { createAndAuthRestaurant } from "@/test/utils/create-and-auth-restaurant"
import { createAndAuthUser } from "@/test/utils/create-and-auth-user"

let restaurantToken: string[]
let userToken: string[]
let restaurantId: string
let addressId: string
const productIds: string[] = []

describe("List best restaurants [GET] /best-restaurants", () => {
  beforeAll(async () => {
    await app.ready()

    for (let index = 0; index < 10; index++) {
      const restaurant = await createAndAuthRestaurant(app, {
        openedAt: "08:00",
        closedAt: "23:00",
      })

      restaurantId = restaurant.restaurantId
      restaurantToken = restaurant.token

      for (let index = 0; index < 2; index++) {
        const response = await request(app.server)
          .post("/products")
          .set("Cookie", restaurantToken)
          .send(makeProduct())

        productIds.push(response.body.productId)
      }

      userToken = (await createAndAuthUser(app)).token

      const addressResponse = await request(app.server)
        .post("/addresses")
        .set("Cookie", userToken)
        .send(makeAddress())

      addressId = addressResponse.body.addressId

      for (let index = 0; index < 3; index++) {
        const order = await request(app.server)
          .post("/orders")
          .set("Cookie", userToken)
          .send({
            restaurantId,
            addressId,
            payment: "card",
            products: productIds.map(item => ({
              id: item,
              quantity: 1,
            })),
          })

        const orderId = order.body.orderId

        await request(app.server)
          .patch(`/orders/${orderId}/approve`)
          .set("Cookie", restaurantToken)
          .send()
        await request(app.server)
          .patch(`/orders/${orderId}/dispatch`)
          .set("Cookie", restaurantToken)
          .send()
        await request(app.server)
          .patch(`/orders/${orderId}/deliver`)
          .set("Cookie", restaurantToken)
          .send()

        await request(app.server)
          .post(`/evaluations`)
          .set("Cookie", userToken)
          .send({
            orderId,
            rate: faker.number.int({ min: 3, max: 5 }),
          })
      }
    }
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to list best restaurants", async () => {
    const response = await request(app.server).get(`/best-restaurants`).send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
        }),
      ]),
    )
  })
})
