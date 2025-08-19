import { randomUUID } from "node:crypto"

import { fakerPT_BR as faker } from "@faker-js/faker"

import { prisma } from "@/lib/prisma"
import { convertMinutesToHours } from "@/utils/convert-minutes-to-hours"

export interface MakeRestaurantParams {
  id: string
  managerName: string
  restaurantName: string
  email: string
  password: string
  phone: string
  tax: number
  deliveryTime: number
  categoryId: string
  openedAt: string
  closedAt: string
  weekday: number
}

export async function makeRestaurant(
  override: Partial<MakeRestaurantParams> = {},
) {
  const restaurantId = override.id ?? randomUUID()

  const category = await prisma.category.create({
    data: { name: faker.word.noun() },
  })

  const openedAt = override.openedAt
    ? override.openedAt
    : convertMinutesToHours(faker.number.int({ min: 540, max: 840 }))
  const closedAt = override.closedAt
    ? override.closedAt
    : convertMinutesToHours(faker.number.int({ min: 1080, max: 1440 }))
  const hours = []

  for (let weekday = 0; weekday < 7; weekday++) {
    hours.push({
      weekday: String(weekday),
      openedAt,
      closedAt,
      restaurantId,
      open: override.weekday ? override?.weekday <= weekday : true,
    })
  }

  return {
    managerName: faker.person.fullName(),
    restaurantName: faker.company.name(),
    email: faker.internet.email(),
    password: "Test@123",
    phone: faker.phone.number({ style: "international" }),
    deliveryTime: faker.number.int({ min: 30, max: 90 }),
    tax: faker.number.int({ min: 0, max: 20 }),
    categoryId: category.id,
    ...override,
    id: restaurantId,
    hours,
  }
}
