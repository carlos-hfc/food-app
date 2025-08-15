import { FastifyInstance } from "fastify"
import { Prisma } from "generated/prisma"
import request from "supertest"

import { makeUser } from "../factories/make-user"

export async function createAndAuthUser(
  app: FastifyInstance,
  override: Partial<Prisma.UserCreateInput> = {},
) {
  const user = makeUser(override)

  await request(app.server).post("/session/register").send(user)

  const authResponse = await request(app.server)
    .post("/session/authenticate")
    .send({
      email: user.email,
      password: user.password,
      role: user.role,
    })

  const token = authResponse.get("Set-Cookie") as string[]

  return { token }
}
