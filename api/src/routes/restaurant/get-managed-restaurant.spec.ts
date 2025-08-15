import { faker } from "@faker-js/faker"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { createAndAuthRestaurant } from "@/test/utils/create-and-auth-restaurant"

const restaurantName = faker.company.name()
const restaurantDeliveryTime = faker.number.int({ min: 30, max: 90 })
const restaurantTax = faker.number.int({ min: 0, max: 20 })

describe("Get managed restaurant [GET] /managed-restaurant", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to get managed restaurant", async () => {
    const { token } = await createAndAuthRestaurant(app, {
      restaurantName: "Bonanova",
    })

    const response = await request(app.server)
      .get("/managed-restaurant")
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        name: "Bonanova",
      }),
    )
  })
})
