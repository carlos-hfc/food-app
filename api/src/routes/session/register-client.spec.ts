import { faker } from "@faker-js/faker"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { makeUser } from "@/test/factories/make-user"

describe("Register client [POST] /session/register", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to register a client", async () => {
    const response = await request(app.server)
      .post("/session/register")
      .send(makeUser())

    expect(response.status).toEqual(201)
  })

  it("should not be able to register a client with existent e-mail", async () => {
    const email = faker.internet.email()

    await request(app.server)
      .post("/session/register")
      .send(makeUser({ email }))

    const response = await request(app.server)
      .post("/session/register")
      .send(makeUser({ email }))

    expect(response.status).toEqual(400)
  })

  it("should not be able to register a client with existent phone", async () => {
    const phone = faker.phone.number()

    await request(app.server)
      .post("/session/register")
      .send(makeUser({ phone }))

    const response = await request(app.server)
      .post("/session/register")
      .send(makeUser({ phone }))

    expect(response.status).toEqual(400)
  })
})
