import { randomUUID } from "node:crypto"

import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { createOrder } from "@/test/utils/create-order"

describe("Evaluate order [POST] /evaluations", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to evaluate an order", async () => {
    const { userToken, orderId } = await createOrder(app, {
      status: "DELIVERED",
    })

    const response = await request(app.server)
      .post(`/evaluations`)
      .set("Cookie", userToken)
      .send({
        orderId,
        rate: 5,
      })

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({
      evaluationId: expect.any(String),
    })
  })

  it("should not be able to evaluate an inexistent order", async () => {
    const { userToken } = await createOrder(app, {
      status: "DELIVERED",
    })

    const response = await request(app.server)
      .post(`/evaluations`)
      .set("Cookie", userToken)
      .send({
        orderId: randomUUID(),
        rate: 5,
      })

    expect(response.status).toEqual(400)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Order not found",
      }),
    )
  })

  it("should not be able to evaluate an order that was not delivered", async () => {
    const { userToken, orderId } = await createOrder(app, {
      status: "CANCELED",
    })

    const response = await request(app.server)
      .post(`/evaluations`)
      .set("Cookie", userToken)
      .send({
        orderId,
        rate: 5,
      })

    expect(response.status).toEqual(400)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Orders not delivered cannot be evaluated",
      }),
    )
  })
})
