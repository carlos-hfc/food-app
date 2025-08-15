import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { createAndAuthRestaurant } from "@/test/utils/create-and-auth-restaurant"

describe("Add image on restaurant [PATCH] /restaurants/image", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to add image on restaurant", async () => {
    const { token } = await createAndAuthRestaurant(app)

    const response = await request(app.server)
      .patch("/restaurants/image")
      .set("Cookie", token)
      .attach("file", "./src/test/file/coffee.jpg")

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      image: expect.any(String),
    })
  })
})
