import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { makeProduct } from "@/test/factories/make-product"
import { createAndAuthRestaurant } from "@/test/utils/create-and-auth-restaurant"

let restaurantId: string

describe("List restaurant menu [GET] /restaurants/:restaurantId/menu", () => {
  beforeAll(async () => {
    await app.ready()

    const restaurant = await createAndAuthRestaurant(app)
    restaurantId = restaurant.restaurantId

    for (let index = 0; index < 20; index++) {
      await request(app.server)
        .post("/products")
        .set("Cookie", restaurant.token)
        .send(makeProduct())
    }
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to list products", async () => {
    const response = await request(app.server)
      .get(`/restaurants/${restaurantId}/menu`)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          restaurantId,
          name: expect.any(String),
          price: expect.any(Number),
        }),
      ]),
    )
  })
})
