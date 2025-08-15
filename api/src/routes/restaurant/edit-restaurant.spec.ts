import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { makeRestaurant } from "@/test/factories/make-restaurant"
import { createAndAuthRestaurant } from "@/test/utils/create-and-auth-restaurant"

describe("Edit restaurant [PUT] /restaurants", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to update restaurant", async () => {
    const { token } = await createAndAuthRestaurant(app)

    const response = await request(app.server)
      .put("/restaurants")
      .set("Cookie", token)
      .send({
        name: "Bonanova",
      })

    expect(response.status).toEqual(200)
  })

  it("should not be able to update restaurant with existent phone", async () => {
    const phone = "11321654987"

    await request(app.server)
      .post("/restaurants")
      .send(await makeRestaurant({ phone }))

    const { token } = await createAndAuthRestaurant(app)

    const response = await request(app.server)
      .put("/restaurants")
      .set("Cookie", token)
      .send({
        phone,
      })

    expect(response.status).toEqual(400)
  })
})
