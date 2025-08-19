import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { makeAddress } from "@/test/factories/make-address"
import { makeProduct } from "@/test/factories/make-product"
import { createAndAuthRestaurant } from "@/test/utils/create-and-auth-restaurant"
import { createAndAuthUser } from "@/test/utils/create-and-auth-user"

let restaurantToken: string[]
let restaurantId: string
const productIds: string[] = []

describe("List order [GET] /orders", () => {
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

    const { token } = await createAndAuthUser(app)

    const addressResponse = await request(app.server)
      .post("/addresses")
      .set("Cookie", token)
      .send(makeAddress())

    await Promise.all([
      request(app.server)
        .post("/orders")
        .set("Cookie", token)
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
        .set("Cookie", token)
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
        .set("Cookie", token)
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

  it("should be able to list orders", async () => {
    const response = await request(app.server)
      .get(`/orders`)
      .set("Cookie", restaurantToken)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        orders: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            date: expect.any(String),
            status: expect.any(String),
            payment: expect.any(String),
            customerName: expect.any(String),
            total: expect.any(Number),
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

  it("should be able to list orders filtering by status", async () => {
    const response = await request(app.server)
      .get(`/orders`)
      .set("Cookie", restaurantToken)
      .query({ status: "DELIVERED" })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        orders: expect.arrayContaining([]),
        meta: expect.objectContaining({
          totalCount: 0,
          pageIndex: 0,
          perPage: 10,
        }),
      }),
    )
  })

  it("should be able to list orders filtering by payment", async () => {
    const response = await request(app.server)
      .get(`/orders`)
      .set("Cookie", restaurantToken)
      .query({ payment: "cash" })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        orders: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            date: expect.any(String),
            status: expect.any(String),
            payment: expect.any(String),
            customerName: expect.any(String),
            total: expect.any(Number),
          }),
        ]),
        meta: expect.objectContaining({
          totalCount: 1,
          pageIndex: 0,
          perPage: 10,
        }),
      }),
    )
  })

  it("should be able to paginated the orders listing", async () => {
    const { token } = await createAndAuthUser(app)

    const addressResponse = await request(app.server)
      .post("/addresses")
      .set("Cookie", token)
      .send(makeAddress())

    for (let index = 0; index < 15; index++) {
      await request(app.server)
        .post("/orders")
        .set("Cookie", token)
        .send({
          restaurantId,
          addressId: addressResponse.body.addressId,
          payment: "card",
          products: productIds.map(item => ({
            id: item,
            quantity: 1,
          })),
        })
    }

    const response = await request(app.server)
      .get(`/orders`)
      .set("Cookie", restaurantToken)
      .query({ pageIndex: 1 })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        orders: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            date: expect.any(String),
            status: expect.any(String),
            payment: expect.any(String),
            customerName: expect.any(String),
            total: expect.any(Number),
          }),
        ]),
        meta: expect.objectContaining({
          totalCount: 18,
          pageIndex: 1,
          perPage: 10,
        }),
      }),
    )
  })
})
