import { faker } from "@faker-js/faker"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { makeClient } from "@/test/factories/make-client"

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
      .send(makeClient())

    expect(response.status).toEqual(201)
  })

  it("should not be able to register a client with existent e-mail", async () => {
    const email = faker.internet.email()

    await request(app.server)
      .post("/session/register")
      .send(makeClient({ email }))

    const response = await request(app.server)
      .post("/session/register")
      .send(makeClient({ email }))

    expect(response.status).toEqual(400)
  })

  it("should not be able to register a client with existent phone", async () => {
    const phone = faker.phone.number()

    await request(app.server)
      .post("/session/register")
      .send(makeClient({ phone }))

    const response = await request(app.server)
      .post("/session/register")
      .send(makeClient({ phone }))

    expect(response.status).toEqual(400)
  })
})
