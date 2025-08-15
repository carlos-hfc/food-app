import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/server"
import { createAndAuthUser } from "@/test/utils/create-and-auth-user"

describe("Edit profile [PUT] /profile", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to update logged user profile", async () => {
    const { token } = await createAndAuthUser(app, {
      name: "John Doe",
      password: "Test@123",
    })

    const response = await request(app.server)
      .put("/profile")
      .set("Cookie", token)
      .send({
        name: "Carlos",
        password: "Test@456",
        confirmPassword: "Test@456",
      })

    expect(response.status).toEqual(200)
  })

  it("should not be able to update logged user profile with the new password being equal to the current password", async () => {
    const { token } = await createAndAuthUser(app, {
      name: "John Doe",
      password: "Test@123",
    })

    const response = await request(app.server)
      .put("/profile")
      .set("Cookie", token)
      .send({
        password: "Test@123",
        confirmPassword: "Test@123",
      })

    expect(response.status).toEqual(400)
  })

  it("should not be able to update logged user profile with an existent e-mail", async () => {
    await createAndAuthUser(app, {
      email: "john.doe@email.com",
    })

    const { token } = await createAndAuthUser(app, {
      name: "John Doe",
      password: "Test@123",
    })

    const response = await request(app.server)
      .put("/profile")
      .set("Cookie", token)
      .send({
        email: "john.doe@email.com",
      })

    expect(response.status).toEqual(400)
  })

  it("should not be able to update logged user profile with an existent phone", async () => {
    await createAndAuthUser(app, {
      phone: "11987654321",
    })

    const { token } = await createAndAuthUser(app, {
      name: "John Doe",
      password: "Test@123",
    })

    const response = await request(app.server)
      .put("/profile")
      .set("Cookie", token)
      .send({
        phone: "11987654321",
      })

    expect(response.status).toEqual(400)
  })
})
