import { faker } from "@faker-js/faker"
import { Prisma } from "generated/prisma"

export function makeAddress(
  override: Partial<Prisma.AddressUncheckedCreateInput> = {},
) {
  return {
    zipCode: faker.location.zipCode(),
    street: faker.location.street(),
    number: Number(faker.location.buildingNumber()),
    district: faker.location.county(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    main: faker.helpers.arrayElement([true, false]),
    alias: faker.helpers.arrayElement([null, faker.word.noun()]),
    ...override,
  }
}
