import { faker } from "@faker-js/faker"
import request from "supertest"
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest"

import { app } from "@/server"
import { makeClient } from "@/test/factories/make-client"

const email = faker.internet.email()

describe("Authenticate user [POST] /session/authenticate", () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    await request(app.server)
      .post("/session/register")
      .send(makeClient({ email }))
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to authenticate a client", async () => {
    const response = await request(app.server)
      .post("/session/authenticate")
      .send({
        email,
        password: "Test@123",
        role: "CLIENT",
      })

    expect(response.status).toEqual(200)
    expect(response.get("Set-Cookie")).toEqual([expect.any(String)])
  })

  it("should not be able to authenticate with wrong e-mail", async () => {
    const response = await request(app.server)
      .post("/session/authenticate")
      .send({
        email: "test@email.com",
        password: "Test@123",
        role: "CLIENT",
      })

    expect(response.status).toEqual(400)
  })

  it("should not be able to authenticate with wrong password", async () => {
    const response = await request(app.server)
      .post("/session/authenticate")
      .send({
        email,
        password: "123",
        role: "CLIENT",
      })

    expect(response.status).toEqual(400)
  })
})
