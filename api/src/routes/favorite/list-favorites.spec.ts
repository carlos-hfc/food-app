import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { makeRestaurant } from "@/test/factories/make-restaurant"
import { createAndAuthUser } from "@/test/utils/create-and-auth-user"

let token: string[]

describe("List favorites [GET] /favorites", () => {
  beforeAll(async () => {
    await app.ready()

    token = (await createAndAuthUser(app)).token
    const restaurantsResponse = await Promise.all([
      request(app.server)
        .post("/restaurants")
        .send(await makeRestaurant()),
      request(app.server)
        .post("/restaurants")
        .send(await makeRestaurant()),
    ])

    await Promise.all(
      restaurantsResponse.map(item =>
        request(app.server).post("/favorites").set("Cookie", token).send({
          restaurantId: item.body.restaurantId,
        }),
      ),
    )
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to save a restaurant as favorite", async () => {
    const response = await request(app.server)
      .get("/favorites")
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toHaveLength(2)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          restaurantId: expect.any(String),
          restaurantName: expect.any(String),
        }),
      ]),
    )
  })
})
