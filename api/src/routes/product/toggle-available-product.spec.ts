import { randomUUID } from "crypto"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { makeProduct } from "@/test/factories/make-product"
import { createAndAuthRestaurant } from "@/test/utils/create-and-auth-restaurant"

describe("Toggle available product [PATCH] /products/:productId/available", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to toggle available product", async () => {
    const { token } = await createAndAuthRestaurant(app)

    const productResponse = await request(app.server)
      .post("/products")
      .set("Cookie", token)
      .send(makeProduct())

    const response = await request(app.server)
      .patch(`/products/${productResponse.body.productId}/available`)
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(200)
  })

  it("should not be able to toggle available inexistent product", async () => {
    const { token } = await createAndAuthRestaurant(app)

    await request(app.server)
      .post("/products")
      .set("Cookie", token)
      .send(makeProduct())

    const response = await request(app.server)
      .patch(`/products/${randomUUID()}/available`)
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(400)
  })
})
