import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { createAndAuthUser } from "@/test/utils/create-and-auth-user"

describe("Sign out [POST] /session/sign-out", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to logout", async () => {
    const { token } = await createAndAuthUser(app)

    const response = await request(app.server)
      .post("/session/sign-out")
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(200)
  })
})
