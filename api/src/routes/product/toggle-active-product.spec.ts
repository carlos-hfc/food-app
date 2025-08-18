import { randomUUID } from "crypto"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { makeProduct } from "@/test/factories/make-product"
import { createAndAuthRestaurant } from "@/test/utils/create-and-auth-restaurant"

describe("Toggle active product [PATCH] /products/:productId/active", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to toggle active product", async () => {
    const { token } = await createAndAuthRestaurant(app)

    const productResponse = await request(app.server)
      .post("/products")
      .set("Cookie", token)
      .send(makeProduct())

    const response = await request(app.server)
      .patch(`/products/${productResponse.body.productId}/active`)
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(200)
  })

  it("should not be able to toggle active inexistent product", async () => {
    const { token } = await createAndAuthRestaurant(app)

    await request(app.server)
      .post("/products")
      .set("Cookie", token)
      .send(makeProduct())

    const response = await request(app.server)
      .patch(`/products/${randomUUID()}/active`)
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(400)
  })
})
