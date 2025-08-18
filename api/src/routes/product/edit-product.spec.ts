import { randomUUID } from "node:crypto"

import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { makeProduct } from "@/test/factories/make-product"
import { createAndAuthRestaurant } from "@/test/utils/create-and-auth-restaurant"

describe("Edit product [PUT] /products/:productId", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to update a product", async () => {
    const { token } = await createAndAuthRestaurant(app)

    const productResponse = await request(app.server)
      .post("/products")
      .set("Cookie", token)
      .send(makeProduct())

    const response = await request(app.server)
      .put(`/products/${productResponse.body.productId}`)
      .set("Cookie", token)
      .send({
        price: 25,
      })

    expect(response.status).toEqual(200)
  })

  it("should not be able to update an inexistent product", async () => {
    const { token } = await createAndAuthRestaurant(app)

    const response = await request(app.server)
      .put(`/products/${randomUUID()}`)
      .set("Cookie", token)
      .send({
        price: 25,
      })

    expect(response.status).toEqual(400)
  })
})
