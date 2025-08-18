import { faker } from "@faker-js/faker"
import { Prisma } from "generated/prisma"

export function makeProduct(
  override: Partial<Prisma.ProductUncheckedCreateInput> = {},
) {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: Number(
      faker.commerce.price({
        min: 20,
        max: 40,
        dec: 1,
      }),
    ),
    ...override,
  }
}
