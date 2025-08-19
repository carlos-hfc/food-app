import { randomUUID } from "node:crypto"

import request from "supertest"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"

import { app } from "@/server"
import { createOrder } from "@/test/utils/create-order"

describe("Cancel order [PATCH] /orders/:orderId/cancel", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to cancel an order", async () => {
    const { orderId, restaurantToken } = await createOrder(app)

    const response = await request(app.server)
      .patch(`/orders/${orderId}/cancel`)
      .set("Cookie", restaurantToken)
      .send()

    expect(response.status).toEqual(204)
  })

  it("should not be able to cancel an order with closed restaurant", async () => {
    const { orderId, restaurantToken } = await createOrder(app)

    vi.setSystemTime(new Date(2025, 7, 21, 6, 0, 0))

    const response = await request(app.server)
      .patch(`/orders/${orderId}/cancel`)
      .set("Cookie", restaurantToken)
      .send()

    expect(response.status).toEqual(400)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Restaurant is not open to update order status",
      }),
    )
  })

  it("should not be able to cancel an inexistent order", async () => {
    const { restaurantToken } = await createOrder(app)

    vi.setSystemTime(new Date(2025, 7, 21, 13, 0, 0))

    const response = await request(app.server)
      .patch(`/orders/${randomUUID()}/cancel`)
      .set("Cookie", restaurantToken)
      .send()

    expect(response.status).toEqual(400)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Order not found",
      }),
    )
  })

  it("should not be able to cancel an order without the preparing status or pending status", async () => {
    const { orderId, restaurantToken } = await createOrder(app, {
      status: "DELIVERED",
    })

    vi.setSystemTime(new Date(2025, 7, 21, 13, 0, 0))

    const response = await request(app.server)
      .patch(`/orders/${orderId}/cancel`)
      .set("Cookie", restaurantToken)
      .send()

    expect(response.status).toEqual(400)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Not allowed",
      }),
    )
  })
})
