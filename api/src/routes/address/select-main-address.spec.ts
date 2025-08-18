import { randomUUID } from "node:crypto"

import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { prisma } from "@/lib/prisma"
import { app } from "@/server"
import { makeAddress } from "@/test/factories/make-address"
import { createAndAuthUser } from "@/test/utils/create-and-auth-user"

let token: string[]

describe("Select main address [PATCH] /addresses/:addressId/main", () => {
  beforeAll(async () => {
    token = (await createAndAuthUser(app)).token

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to select address as main address", async () => {
    await request(app.server)
      .post("/addresses")
      .set("Cookie", token)
      .send(makeAddress({ main: true }))

    const addressResponse = await request(app.server)
      .post("/addresses")
      .set("Cookie", token)
      .send(makeAddress())

    const response = await request(app.server)
      .patch(`/addresses/${addressResponse.body.addressId}/main`)
      .set("Cookie", token)
      .send()

    const address = await prisma.address.findUnique({
      where: {
        id: addressResponse.body.addressId,
      },
    })

    expect(response.status).toEqual(204)
    expect(address).toEqual(
      expect.objectContaining({
        main: true,
      }),
    )
  })

  it("should not be able to select inexistent address as main address", async () => {
    const response = await request(app.server)
      .patch(`/addresses/${randomUUID()}/main`)
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(400)
  })
})
