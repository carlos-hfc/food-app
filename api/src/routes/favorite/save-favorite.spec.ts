import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { makeRestaurant } from "@/test/factories/make-restaurant"
import { createAndAuthUser } from "@/test/utils/create-and-auth-user"

let token: string[]
let restaurantId: string

describe("Save favorite [POST] /favorites", () => {
  beforeAll(async () => {
    await app.ready()

    token = (await createAndAuthUser(app)).token
    const { body: restaurantBody } = await request(app.server)
      .post("/restaurants")
      .send(await makeRestaurant())

    restaurantId = restaurantBody.restaurantId
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to save a restaurant as favorite", async () => {
    const response = await request(app.server)
      .post("/favorites")
      .set("Cookie", token)
      .send({
        restaurantId,
      })

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({
      favoriteId: expect.any(String),
    })
  })

  it("should not be able to save a restaurant that has already been favorited", async () => {
    const response = await request(app.server)
      .post("/favorites")
      .set("Cookie", token)
      .send({
        restaurantId,
      })

    expect(response.status).toEqual(400)
  })
})
