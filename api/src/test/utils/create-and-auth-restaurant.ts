import { FastifyInstance } from "fastify"
import request from "supertest"

import {
  makeRestaurant,
  MakeRestaurantParams,
} from "../factories/make-restaurant"

export async function createAndAuthRestaurant(
  app: FastifyInstance,
  override: Partial<MakeRestaurantParams> = {},
) {
  const restaurant = await makeRestaurant(override)

  const restaurantResponse = await request(app.server)
    .post("/restaurants")
    .send(restaurant)

  const authResponse = await request(app.server)
    .post("/session/authenticate")
    .send({
      email: restaurant.email,
      password: restaurant.password,
      role: "ADMIN",
    })

  const token = authResponse.get("Set-Cookie") as string[]

  return { token, restaurantId: restaurantResponse.body.restaurantId as string }
}
