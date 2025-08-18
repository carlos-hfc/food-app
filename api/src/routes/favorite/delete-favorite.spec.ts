import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { makeRestaurant } from "@/test/factories/make-restaurant"
import { createAndAuthUser } from "@/test/utils/create-and-auth-user"

let token: string[]
let restaurantId: string

describe("Delete favorites [DELETE] /favorites/:favoriteId", () => {
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

  it("should be able to delete a restaurant as favorite", async () => {
    const favoriteResponse = await request(app.server)
      .post("/favorites")
      .set("Cookie", token)
      .send({
        restaurantId,
      })

    const response = await request(app.server)
      .delete(`/favorites/${favoriteResponse.body.favoriteId}`)
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(204)
  })
})
