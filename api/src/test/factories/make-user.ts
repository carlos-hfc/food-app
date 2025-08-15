import { fakerPT_BR as faker } from "@faker-js/faker"
import { Prisma, Role } from "generated/prisma"

export function makeUser(override: Partial<Prisma.UserCreateInput> = {}) {
  return {
    email: faker.internet.email({ provider: "email.com" }).toLowerCase(),
    name: faker.person.fullName(),
    password: "Test@123",
    phone: faker.phone.number({ style: "international" }),
    role: Role.CLIENT,
    ...override,
  }
}
