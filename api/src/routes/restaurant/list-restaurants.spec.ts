import { faker } from "@faker-js/faker"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { makeRestaurant } from "@/test/factories/make-restaurant"

const restaurantName = faker.company.name()
const restaurantDeliveryTime = faker.number.int({ min: 30, max: 90 })
const restaurantTax = faker.number.int({ min: 0, max: 20 })

describe("List restaurant [GET] /restaurants", () => {
  beforeAll(async () => {
    await app.ready()

    await request(app.server)
      .post("/restaurants")
      .send(
        await makeRestaurant({
          restaurantName,
          deliveryTime: restaurantDeliveryTime,
          tax: restaurantTax,
        }),
      )
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to list restaurants", async () => {
    const response = await request(app.server).get("/restaurants").send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          tax: expect.any(Number),
          rate: expect.any(Number),
        }),
      ]),
    )
  })

  it("should be able to list restaurants filtering by name", async () => {
    const response = await request(app.server).get("/restaurants").query({
      name: restaurantName,
    })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: restaurantName,
          tax: restaurantTax,
          deliveryTime: restaurantDeliveryTime,
        }),
      ]),
    )
  })

  it("should be able to list restaurants filtering by tax", async () => {
    const response = await request(app.server).get("/restaurants").query({
      tax: restaurantTax,
    })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: restaurantName,
          tax: restaurantTax,
          deliveryTime: restaurantDeliveryTime,
        }),
      ]),
    )
  })

  it("should be able to list restaurants filtering by delivery time", async () => {
    const response = await request(app.server).get("/restaurants").query({
      deliverytime: restaurantDeliveryTime,
    })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: restaurantName,
          tax: restaurantTax,
          deliveryTime: restaurantDeliveryTime,
        }),
      ]),
    )
  })
})
