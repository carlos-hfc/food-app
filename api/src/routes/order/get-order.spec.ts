import { randomUUID } from "node:crypto"

import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { createOrder } from "@/test/utils/create-order"

describe("Get order [GET] /orders/:orderId", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to get an order", async () => {
    const { orderId, restaurantToken } = await createOrder(app)

    const response = await request(app.server)
      .get(`/orders/${orderId}`)
      .set("Cookie", restaurantToken)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        id: orderId,
        total: expect.any(Number),
        rate: expect.toBeOneOf([expect.any(Number), null]),
        client: expect.objectContaining({
          name: expect.any(String),
          email: expect.any(String),
          phone: expect.any(String),
        }),
        address: expect.objectContaining({
          street: expect.any(String),
          number: expect.any(Number),
        }),
        restaurant: expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          image: expect.toBeOneOf([expect.any(String), null]),
        }),
        products: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            price: expect.any(Number),
            quantity: expect.any(Number),
            image: expect.toBeOneOf([expect.any(String), null]),
          }),
        ]),
      }),
    )
  })

  it("should not be able to get an inexistent order", async () => {
    const { restaurantToken } = await createOrder(app)

    const response = await request(app.server)
      .get(`/orders/${randomUUID()}`)
      .set("Cookie", restaurantToken)
      .send()

    expect(response.status).toEqual(400)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Order not found",
      }),
    )
  })
})
