import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { makeProduct } from "@/test/factories/make-product"
import { createAndAuthRestaurant } from "@/test/utils/create-and-auth-restaurant"

let token: string[]

describe("List product [GET] /products", () => {
  beforeAll(async () => {
    await app.ready()

    token = (await createAndAuthRestaurant(app)).token

    await Promise.all([
      request(app.server)
        .post("/products")
        .set("Cookie", token)
        .send(makeProduct()),
      request(app.server)
        .post("/products")
        .set("Cookie", token)
        .send(makeProduct({ active: false })),
      request(app.server)
        .post("/products")
        .set("Cookie", token)
        .send(makeProduct({ available: false })),
    ])
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to list products", async () => {
    const response = await request(app.server)
      .get("/products")
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        products: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            price: expect.any(Number),
            available: expect.any(Boolean),
            active: expect.any(Boolean),
          }),
        ]),
        meta: expect.objectContaining({
          totalCount: expect.any(Number),
          pageIndex: 0,
          perPage: 10,
        }),
      }),
    )
  })

  it("should be able to list products filtering by available", async () => {
    const response = await request(app.server)
      .get("/products")
      .set("Cookie", token)
      .query({
        available: "false",
      })

    expect(response.status).toEqual(200)
    expect(response.body.products).toHaveLength(1)
    expect(response.body).toEqual(
      expect.objectContaining({
        products: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            price: expect.any(Number),
            available: expect.any(Boolean),
            active: expect.any(Boolean),
          }),
        ]),
        meta: expect.objectContaining({
          totalCount: expect.any(Number),
          pageIndex: 0,
          perPage: 10,
        }),
      }),
    )
  })

  it("should be able to list products filtering by active", async () => {
    const response = await request(app.server)
      .get("/products")
      .set("Cookie", token)
      .query({
        active: "false",
      })

    expect(response.status).toEqual(200)
    expect(response.body.products).toHaveLength(1)
    expect(response.body).toEqual(
      expect.objectContaining({
        products: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            price: expect.any(Number),
            available: expect.any(Boolean),
            active: expect.any(Boolean),
          }),
        ]),
        meta: expect.objectContaining({
          totalCount: expect.any(Number),
          pageIndex: 0,
          perPage: 10,
        }),
      }),
    )
  })

  it("should be able to paginated the products listing", async () => {
    for (let index = 0; index < 20; index++) {
      await request(app.server)
        .post("/products")
        .set("Cookie", token)
        .send(makeProduct())
    }

    const response = await request(app.server)
      .get("/products")
      .set("Cookie", token)
      .query({
        pageIndex: 1,
      })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        products: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            price: expect.any(Number),
            available: expect.any(Boolean),
            active: expect.any(Boolean),
          }),
        ]),
        meta: expect.objectContaining({
          totalCount: 23,
          pageIndex: 1,
          perPage: 10,
        }),
      }),
    )
  })
})
