import { randomUUID } from "node:crypto"

import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { prisma } from "@/lib/prisma"
import { app } from "@/server"
import { makeAddress } from "@/test/factories/make-address"
import { createAndAuthUser } from "@/test/utils/create-and-auth-user"

let token: string[]

describe("Edit address [PUT] /addresses/:addressId", () => {
  beforeAll(async () => {
    token = (await createAndAuthUser(app)).token

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to update an address", async () => {
    const addressResponse = await request(app.server)
      .post("/addresses")
      .set("Cookie", token)
      .send(makeAddress())

    const response = await request(app.server)
      .put(`/addresses/${addressResponse.body.addressId}`)
      .set("Cookie", token)
      .send({
        alias: "Novo endereco",
      })

    const address = await prisma.address.findUnique({
      where: {
        id: addressResponse.body.addressId,
      },
    })

    expect(response.status).toEqual(200)
    expect(address).toEqual(
      expect.objectContaining({
        alias: "Novo endereco",
      }),
    )
  })

  it("should not be able to update an inexistent address", async () => {
    const response = await request(app.server)
      .put(`/addresses/${randomUUID()}`)
      .set("Cookie", token)
      .send({
        alias: "Novo endereco",
      })

    expect(response.status).toEqual(400)
  })
})
