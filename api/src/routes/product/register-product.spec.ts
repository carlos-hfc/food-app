import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { makeProduct } from "@/test/factories/make-product"
import { createAndAuthRestaurant } from "@/test/utils/create-and-auth-restaurant"

describe("Register product [POST] /products", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to register a product", async () => {
    const { token } = await createAndAuthRestaurant(app)

    const response = await request(app.server)
      .post("/products")
      .set("Cookie", token)
      .send(makeProduct())

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({
      productId: expect.any(String),
    })
  })
})
