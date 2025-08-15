import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { prisma } from "@/lib/prisma"
import { app } from "@/server"

describe("List categories [GET] /categories", () => {
  beforeAll(async () => {
    await app.ready()
    await prisma.category.createManyAndReturn({
      data: [{ name: "Brasileira" }, { name: "Pizza" }, { name: "Lanches" }],
    })
  })

  afterAll(async () => {
    await prisma.category.deleteMany()
    await app.close()
  })

  it("should be able to list categories", async () => {
    const response = await request(app.server).get("/categories").send()

    expect(response.status).toEqual(200)
    expect(response.body).toHaveLength(3)
  })

  it("should be able to list categories filtering by name", async () => {
    const response = await request(app.server)
      .get("/categories")
      .query({ name: "Brasileira" })

    expect(response.status).toEqual(200)
    expect(response.body).toHaveLength(1)
  })
})
