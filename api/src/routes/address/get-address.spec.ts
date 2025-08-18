import { randomUUID } from "node:crypto"

import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { makeAddress } from "@/test/factories/make-address"
import { createAndAuthUser } from "@/test/utils/create-and-auth-user"

let token: string[]

describe("Get address [GET] /addresses/:addressId", () => {
  beforeAll(async () => {
    token = (await createAndAuthUser(app)).token

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to get an address", async () => {
    const addressResponse = await request(app.server)
      .post("/addresses")
      .set("Cookie", token)
      .send(
        makeAddress({
          alias: "Novo endereco",
          main: true,
          zipCode: "12345-678",
        }),
      )

    const response = await request(app.server)
      .get(`/addresses/${addressResponse.body.addressId}`)
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        alias: "Novo endereco",
        main: true,
        zipCode: "12345-678",
      }),
    )
  })

  it("should not be able to get an inexistent address", async () => {
    const response = await request(app.server)
      .get(`/addresses/${randomUUID()}`)
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(400)
  })
})
