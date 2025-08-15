import { faker } from "@faker-js/faker"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { prisma } from "@/lib/prisma"
import { app } from "@/server"

const categoryName = faker.word.noun()

describe("List categories [GET] /categories", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to list categories", async () => {
    const category = await prisma.category.create({
      data: { name: categoryName },
    })

    const response = await request(app.server).get("/categories").send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: category.id,
          name: categoryName,
        }),
      ]),
    )
  })

  it("should be able to list categories filtering by name", async () => {
    const response = await request(app.server)
      .get("/categories")
      .query({ name: categoryName })

    expect(response.status).toEqual(200)
    expect(response.body).toHaveLength(1)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: categoryName,
        }),
      ]),
    )
  })
})
