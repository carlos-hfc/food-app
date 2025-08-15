import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { makeRestaurant } from "@/test/factories/make-restaurant"
import { makeUser } from "@/test/factories/make-user"

describe("Register restaurant [POST] /restaurants", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to register a restaurant", async () => {
    const restaurant = await makeRestaurant()

    const response = await request(app.server)
      .post("/restaurants")
      .send(restaurant)

    expect(response.status).toEqual(201)
  })

  it("should not be able to register a restaurant with existent e-mail", async () => {
    const email = "email@email.com"

    await request(app.server)
      .post("/session/register")
      .send(makeUser({ email }))

    const restaurant = await makeRestaurant({
      email,
    })

    const response = await request(app.server)
      .post("/restaurants")
      .send(restaurant)

    expect(response.status).toEqual(400)
  })

  it("should not be able to register a restaurant with existent phone", async () => {
    const phone = "11321654987"

    await request(app.server)
      .post("/session/register")
      .send(makeUser({ phone }))

    const restaurant = await makeRestaurant({
      phone,
    })

    const response = await request(app.server)
      .post("/restaurants")
      .send(restaurant)

    expect(response.status).toEqual(400)
  })
})
