import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { makeAddress } from "@/test/factories/make-address"
import { createAndAuthUser } from "@/test/utils/create-and-auth-user"

describe("List address [GET] /addresses", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to get an address", async () => {
    const { token } = await createAndAuthUser(app)

    await Promise.all([
      request(app.server)
        .post("/addresses")
        .set("Cookie", token)
        .send(makeAddress()),
      request(app.server)
        .post("/addresses")
        .set("Cookie", token)
        .send(makeAddress()),
    ])

    const response = await request(app.server)
      .get(`/addresses`)
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toHaveLength(2)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          alias: expect.any(String),
          main: expect.any(Boolean),
          zipCode: expect.any(String),
        }),
        expect.objectContaining({
          alias: expect.any(String),
          main: expect.any(Boolean),
          zipCode: expect.any(String),
        }),
      ]),
    )
  })
})
