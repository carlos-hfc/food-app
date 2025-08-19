import { randomUUID } from "node:crypto"

import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { createOrder } from "@/test/utils/create-order"

describe("Get evaluation [GET] /evaluations/:evaluationId", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to get an evaluation", async () => {
    const { restaurantToken, userToken, orderId } = await createOrder(app, {
      status: "DELIVERED",
    })

    const evaluationResponse = await request(app.server)
      .post(`/evaluations`)
      .set("Cookie", userToken)
      .send({
        orderId,
        rate: 5,
      })

    const response = await request(app.server)
      .get(`/evaluations/${evaluationResponse.body.evaluationId}`)
      .set("Cookie", restaurantToken)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        id: evaluationResponse.body.evaluationId,
        rate: expect.any(Number),
        comment: expect.toBeOneOf([expect.any(String), null]),
        customer: expect.objectContaining({
          name: expect.any(String),
          email: expect.any(String),
        }),
        products: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            price: expect.any(Number),
            quantity: expect.any(Number),
          }),
        ]),
      }),
    )
  })

  it("should not be able to get an inexistent evaluation", async () => {
    const { restaurantToken, userToken, orderId } = await createOrder(app, {
      status: "DELIVERED",
    })

    const evaluationResponse = await request(app.server)
      .post(`/evaluations`)
      .set("Cookie", userToken)
      .send({
        orderId,
        rate: 5,
      })

    const response = await request(app.server)
      .get(`/evaluations/${randomUUID()}`)
      .set("Cookie", restaurantToken)
      .send()

    expect(response.status).toEqual(400)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Evaluation not found",
      }),
    )
  })
})
