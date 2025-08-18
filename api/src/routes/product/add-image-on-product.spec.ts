import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { makeProduct } from "@/test/factories/make-product"
import { createAndAuthRestaurant } from "@/test/utils/create-and-auth-restaurant"

describe("Add image on product [PATCH] /products/:productId/image", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to add image on product", async () => {
    const { token } = await createAndAuthRestaurant(app)

    const productResponse = await request(app.server)
      .post("/products")
      .set("Cookie", token)
      .send(makeProduct())

    const response = await request(app.server)
      .patch(`/products/${productResponse.body.productId}/image`)
      .set("Cookie", token)
      .attach("file", "./src/test/file/coffee.jpg")

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      image: expect.any(String),
    })
  })
})
