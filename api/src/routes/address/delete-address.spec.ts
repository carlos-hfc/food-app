import { randomUUID } from "node:crypto"

import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { makeAddress } from "@/test/factories/make-address"
import { createAndAuthUser } from "@/test/utils/create-and-auth-user"

let token: string[]

describe("Delete address [DELETE] /addresses/:addressId", () => {
  beforeAll(async () => {
    token = (await createAndAuthUser(app)).token

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to delete an address", async () => {
    const addressResponse = await request(app.server)
      .post("/addresses")
      .set("Cookie", token)
      .send(makeAddress())

    const response = await request(app.server)
      .delete(`/addresses/${addressResponse.body.addressId}`)
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(204)
  })

  it("should not be able to delete an inexistent address", async () => {
    const response = await request(app.server)
      .delete(`/addresses/${randomUUID()}`)
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(400)
  })
})
