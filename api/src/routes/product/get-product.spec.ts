import { randomUUID } from "node:crypto"

import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { makeProduct } from "@/test/factories/make-product"
import { createAndAuthRestaurant } from "@/test/utils/create-and-auth-restaurant"

describe("Get product [GET] /products/:productId", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to get product", async () => {
    const { token } = await createAndAuthRestaurant(app)

    const productResponse = await request(app.server)
      .post("/products")
      .set("Cookie", token)
      .send(makeProduct())

    const response = await request(app.server)
      .get(`/products/${productResponse.body.productId}`)
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      id: productResponse.body.productId,
      name: expect.any(String),
      description: expect.any(String),
      price: expect.any(Number),
      image: expect.toBeOneOf([expect.any(String), null]),
    })
  })

  it("should not be able to get inexistent product", async () => {
    const { token } = await createAndAuthRestaurant(app)

    await request(app.server)
      .post("/products")
      .set("Cookie", token)
      .send(makeProduct())

    const response = await request(app.server)
      .get(`/products/${randomUUID()}`)
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(400)
  })
})
