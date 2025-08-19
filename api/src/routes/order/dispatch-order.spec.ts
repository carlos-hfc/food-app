import { randomUUID } from "node:crypto"

import request from "supertest"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"

import { app } from "@/server"
import { createOrder } from "@/test/utils/create-order"

describe("Dispatch order [PATCH] /orders/:orderId/dispatch", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to dispatch an order", async () => {
    const { orderId, restaurantToken } = await createOrder(app, {
      status: "PREPARING",
    })

    const response = await request(app.server)
      .patch(`/orders/${orderId}/dispatch`)
      .set("Cookie", restaurantToken)
      .send()

    expect(response.status).toEqual(204)
  })

  it("should not be able to dispatch an order with closed restaurant", async () => {
    const { orderId, restaurantToken } = await createOrder(app)

    vi.setSystemTime(new Date(2025, 7, 21, 6, 0, 0))

    const response = await request(app.server)
      .patch(`/orders/${orderId}/dispatch`)
      .set("Cookie", restaurantToken)
      .send()

    expect(response.status).toEqual(400)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Restaurant is not open to update order status",
      }),
    )
  })

  it("should not be able to dispatch an inexistent order", async () => {
    const { restaurantToken } = await createOrder(app)

    vi.setSystemTime(new Date(2025, 7, 21, 13, 0, 0))

    const response = await request(app.server)
      .patch(`/orders/${randomUUID()}/dispatch`)
      .set("Cookie", restaurantToken)
      .send()

    expect(response.status).toEqual(400)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Order not found",
      }),
    )
  })

  it("should not be able to dispatch an order without the preparing status", async () => {
    const { orderId, restaurantToken } = await createOrder(app, {
      status: "ROUTING",
    })

    vi.setSystemTime(new Date(2025, 7, 21, 13, 0, 0))

    const response = await request(app.server)
      .patch(`/orders/${orderId}/dispatch`)
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
