import { randomUUID } from "node:crypto"

import request from "supertest"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"

import { app } from "@/server"
import { makeAddress } from "@/test/factories/make-address"
import { makeProduct } from "@/test/factories/make-product"
import { createAndAuthRestaurant } from "@/test/utils/create-and-auth-restaurant"
import { createAndAuthUser } from "@/test/utils/create-and-auth-user"

const productIds: string[] = []
let restaurantId: string

describe("Create order [POST] /orders", () => {
  beforeAll(async () => {
    await app.ready()

    const { token, restaurantId: id } = await createAndAuthRestaurant(app, {
      openedAt: "08:00",
      closedAt: "23:00",
    })

    restaurantId = id

    for (let index = 0; index < 2; index++) {
      const response = await request(app.server)
        .post("/products")
        .set("Cookie", token)
        .send(makeProduct())

      productIds.push(response.body.productId)
    }
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to create an order", async () => {
    const { token } = await createAndAuthUser(app)

    const addressResponse = await request(app.server)
      .post("/addresses")
      .set("Cookie", token)
      .send(makeAddress())

    const response = await request(app.server)
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

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({
      orderId: expect.any(String),
      total: expect.any(Number),
    })
  })

  it("should not be able to create an order with closed restaurant", async () => {
    vi.setSystemTime(new Date(2025, 7, 21, 6, 0, 0))

    const { token } = await createAndAuthUser(app)

    const addressResponse = await request(app.server)
      .post("/addresses")
      .set("Cookie", token)
      .send(makeAddress())

    const response = await request(app.server)
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

    expect(response.status).toEqual(400)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Restaurant is closed",
      }),
    )
  })

  it("should not be able to create an order with inexistent restaurant", async () => {
    const { token } = await createAndAuthUser(app)

    const addressResponse = await request(app.server)
      .post("/addresses")
      .set("Cookie", token)
      .send(makeAddress())

    const response = await request(app.server)
      .post("/orders")
      .set("Cookie", token)
      .send({
        restaurantId: randomUUID(),
        addressId: addressResponse.body.addressId,
        payment: "card",
        products: [
          {
            id: randomUUID(),
            quantity: 1,
          },
        ],
      })

    expect(response.status).toEqual(400)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Restaurant not found",
      }),
    )
  })

  it("should not be able to create an order with inexsitent address", async () => {
    vi.setSystemTime(new Date(2025, 7, 21, 13, 0, 0))

    const { token } = await createAndAuthUser(app)

    const response = await request(app.server)
      .post("/orders")
      .set("Cookie", token)
      .send({
        restaurantId,
        addressId: randomUUID(),
        payment: "card",
        products: productIds.map(item => ({
          id: item,
          quantity: 1,
        })),
      })

    expect(response.status).toEqual(400)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Address not found or address not belongs to user",
      }),
    )
  })

  it("should not be able to create an order with inexistent product", async () => {
    const { token } = await createAndAuthUser(app)

    const addressResponse = await request(app.server)
      .post("/addresses")
      .set("Cookie", token)
      .send(makeAddress())

    const productId = randomUUID()

    const response = await request(app.server)
      .post("/orders")
      .set("Cookie", token)
      .send({
        restaurantId,
        addressId: addressResponse.body.addressId,
        payment: "card",
        products: [
          {
            id: productId,
            quantity: 1,
          },
        ],
      })

    expect(response.status).toEqual(400)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: `Product ${productId} not found`,
      }),
    )
  })
})
