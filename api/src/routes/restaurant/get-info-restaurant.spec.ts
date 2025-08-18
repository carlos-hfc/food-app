import { randomUUID } from "node:crypto"

import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { makeRestaurant } from "@/test/factories/make-restaurant"

describe("Get restaurant informations [GET] /restaurants/:restaurantId/info", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to get information from a restaurant", async () => {
    const restaurantReponse = await request(app.server)
      .post("/restaurants")
      .send(await makeRestaurant())

    const response = await request(app.server)
      .get(`/restaurants/${restaurantReponse.body.restaurantId}/info`)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        restaurant: expect.objectContaining({
          id: restaurantReponse.body.restaurantId,
          hours: expect.arrayContaining([
            expect.objectContaining({
              hourId: expect.any(String),
              weekday: expect.any(Number),
              openedAt: expect.any(String),
            }),
          ]),
        }),
        rateResume: expect.objectContaining({
          average: expect.any(Number),
          totalCount: expect.any(Number),
        }),
        rates: expect.arrayContaining([]),
        evaluationByRate: expect.arrayContaining([]),
      }),
    )
  })

  it("should not be able to get information from an inexistent restaurant", async () => {
    const response = await request(app.server)
      .get(`/restaurants/${randomUUID()}/info`)
      .send()

    expect(response.status).toEqual(400)
  })
})
