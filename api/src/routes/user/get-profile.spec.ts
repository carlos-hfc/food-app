import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { createAndAuthUser } from "@/test/utils/create-and-auth-user"

describe("Get profile [GET] /profile", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to get logged user profile", async () => {
    const { token } = await createAndAuthUser(app, {
      name: "John Doe",
    })

    const response = await request(app.server)
      .get("/profile")
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      id: expect.any(String),
      name: "John Doe",
      email: expect.any(String),
      phone: expect.any(String),
    })
  })
})
