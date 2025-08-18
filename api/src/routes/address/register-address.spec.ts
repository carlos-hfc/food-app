import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { prisma } from "@/lib/prisma"
import { app } from "@/server"
import { makeAddress } from "@/test/factories/make-address"
import { createAndAuthUser } from "@/test/utils/create-and-auth-user"

describe("Register address [POST] /addresses", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to register an address", async () => {
    const { token } = await createAndAuthUser(app)

    const response = await request(app.server)
      .post("/addresses")
      .set("Cookie", token)
      .send(makeAddress())

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({
      addressId: expect.any(String),
    })
  })

  it("should be able to register an address as main address", async () => {
    const { token } = await createAndAuthUser(app)

    const response = await request(app.server)
      .post("/addresses")
      .set("Cookie", token)
      .send(
        makeAddress({
          main: true,
          alias: "Endereço principal",
        }),
      )

    const address = await prisma.address.findFirst({
      where: {
        main: true,
        alias: "Endereço principal",
      },
    })

    expect(response.status).toEqual(201)
    expect(address).toEqual(
      expect.objectContaining({
        main: true,
        alias: "Endereço principal",
      }),
    )
  })
})
