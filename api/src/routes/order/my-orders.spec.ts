import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { makeAddress } from "@/test/factories/make-address"
import { makeProduct } from "@/test/factories/make-product"
import { createAndAuthRestaurant } from "@/test/utils/create-and-auth-restaurant"
import { createAndAuthUser } from "@/test/utils/create-and-auth-user"

let userToken: string[]
const productIds: string[] = []

describe("List my orders [GET] /orders/me", () => {
  beforeAll(async () => {
    await app.ready()

    const { restaurantId, token: restaurantToken } =
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

    userToken = (await createAndAuthUser(app)).token

    const addressResponse = await request(app.server)
      .post("/addresses")
      .set("Cookie", userToken)
      .send(makeAddress())

    await Promise.all([
      request(app.server)
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
        }),
      request(app.server)
        .post("/orders")
        .set("Cookie", userToken)
        .send({
          restaurantId,
          addressId: addressResponse.body.addressId,
          payment: "cash",
          products: productIds.map(item => ({
            id: item,
            quantity: 1,
          })),
        }),
      request(app.server)
        .post("/orders")
        .set("Cookie", userToken)
        .send({
          restaurantId,
          addressId: addressResponse.body.addressId,
          payment: "pix",
          products: productIds.map(item => ({
            id: item,
            quantity: 1,
          })),
        }),
    ])
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to list my orders", async () => {
    const response = await request(app.server)
      .get(`/orders/me`)
      .set("Cookie", userToken)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          date: expect.any(String),
          status: expect.any(String),
          payment: expect.any(String),
          restaurant: expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            image: expect.toBeOneOf([expect.any(String), null]),
          }),
          products: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              name: expect.any(String),
              quantity: expect.any(Number),
              price: expect.any(Number),
              image: expect.toBeOneOf([expect.any(String), null]),
            }),
          ]),
        }),
      ]),
    )
  })
})
