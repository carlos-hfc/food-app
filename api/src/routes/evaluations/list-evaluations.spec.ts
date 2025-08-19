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

describe("List evaluations [GET] /evaluations", () => {
  beforeAll(async () => {
    await app.ready()

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
          rate: 5,
        })
    }
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to list evaluations", async () => {
    const response = await request(app.server)
      .get(`/evaluations`)
      .set("Cookie", restaurantToken)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        evaluations: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            customerName: expect.any(String),
            rate: expect.any(Number),
            comment: expect.toBeOneOf([expect.any(String), null]),
            createdAt: expect.any(String),
          }),
        ]),
        meta: expect.objectContaining({
          totalCount: 3,
          pageIndex: 0,
          perPage: 10,
        }),
      }),
    )
  })

  it("should be able to list evaluations filtering by rate", async () => {
    const response = await request(app.server)
      .get(`/evaluations`)
      .set("Cookie", restaurantToken)
      .query({ rate: "5" })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        evaluations: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            customerName: expect.any(String),
            rate: 5,
            comment: expect.toBeOneOf([expect.any(String), null]),
            createdAt: expect.any(String),
          }),
        ]),
        meta: expect.objectContaining({
          totalCount: expect.toSatisfy(value => value >= 0),
          pageIndex: 0,
          perPage: 10,
        }),
      }),
    )
  })

  it("should be able to list evaluations filtering by comment", async () => {
    const response = await request(app.server)
      .get(`/evaluations`)
      .set("Cookie", restaurantToken)
      .query({ comment: "false" })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        evaluations: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            customerName: expect.any(String),
            rate: 5,
            comment: null,
            createdAt: expect.any(String),
          }),
        ]),
        meta: expect.objectContaining({
          totalCount: expect.toSatisfy(value => value >= 0),
          pageIndex: 0,
          perPage: 10,
        }),
      }),
    )
  })

  it("should be able to paginated evaluations listing", async () => {
    for (let index = 0; index < 20; index++) {
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
          rate: 5,
        })
    }

    const response = await request(app.server)
      .get(`/evaluations`)
      .set("Cookie", restaurantToken)
      .query({ pageIndex: 1 })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        evaluations: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            customerName: expect.any(String),
            rate: 5,
            comment: expect.toBeOneOf([expect.any(String), null]),
            createdAt: expect.any(String),
          }),
        ]),
        meta: expect.objectContaining({
          totalCount: 23,
          pageIndex: 1,
          perPage: 10,
        }),
      }),
    )
  })
})
