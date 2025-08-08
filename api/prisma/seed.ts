import { randomUUID } from "node:crypto"

import { fakerPT_BR as faker } from "@faker-js/faker"
import { hash } from "bcryptjs"
import { addHours, addMinutes } from "date-fns"
import { OrderStatus, PaymentMethod, Prisma, Product } from "generated/prisma"

import { prisma } from "@/lib/prisma"

async function main() {
  const tablenames = await prisma.$queryRaw<Array<{ tablename: string }>>(
    Prisma.sql`SELECT tablename FROM pg_tables WHERE schemaname='public'`,
  )

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter(name => name !== "_prisma_migrations")
    .map(name => `"public"."${name}"`)
    .join(", ")

  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`)
  } catch (error) {
    console.log({ error })
  }

  const password = await hash("12345678", 10)

  const [admin1, admin2, admin3, admin4, admin5, admin6] =
    await prisma.user.createManyAndReturn({
      data: [
        {
          email: "carlos@email.com",
          name: "Carlos",
          password,
          phone: faker.phone.number({ style: "international" }),
          role: "ADMIN",
        },
        {
          email: faker.internet.email({ provider: "email.com" }).toLowerCase(),
          name: faker.person.fullName(),
          password,
          phone: faker.phone.number({ style: "international" }),
          role: "ADMIN",
        },
        {
          email: faker.internet.email({ provider: "email.com" }).toLowerCase(),
          name: faker.person.fullName(),
          password,
          phone: faker.phone.number({ style: "international" }),
          role: "ADMIN",
        },
        {
          email: faker.internet.email({ provider: "email.com" }).toLowerCase(),
          name: faker.person.fullName(),
          password,
          phone: faker.phone.number({ style: "international" }),
          role: "ADMIN",
        },
        {
          email: faker.internet.email({ provider: "email.com" }).toLowerCase(),
          name: faker.person.fullName(),
          password,
          phone: faker.phone.number({ style: "international" }),
          role: "ADMIN",
        },
        {
          email: faker.internet.email({ provider: "email.com" }).toLowerCase(),
          name: faker.person.fullName(),
          password,
          phone: faker.phone.number({ style: "international" }),
          role: "ADMIN",
        },
      ],
    })

  const [client1, client2, client3, client4, client5, client6, client7] =
    await prisma.user.createManyAndReturn({
      data: [
        {
          email: "filled@email.com",
          name: faker.person.fullName(),
          password,
          phone: faker.phone.number({ style: "international" }),
          role: "CLIENT",
        },
        {
          email: faker.internet.email({ provider: "email.com" }).toLowerCase(),
          name: faker.person.fullName(),
          password,
          phone: faker.phone.number({ style: "international" }),
          role: "CLIENT",
        },
        {
          email: faker.internet.email({ provider: "email.com" }).toLowerCase(),
          name: faker.person.fullName(),
          password,
          phone: faker.phone.number({ style: "international" }),
          role: "CLIENT",
        },
        {
          email: faker.internet.email().toLowerCase(),
          name: faker.person.fullName(),
          password,
          phone: faker.phone.number({ style: "international" }),
          role: "CLIENT",
        },
        {
          email: faker.internet.email().toLowerCase(),
          name: faker.person.fullName(),
          password,
          phone: faker.phone.number({ style: "international" }),
          role: "CLIENT",
        },
        {
          email: faker.internet.email().toLowerCase(),
          name: faker.person.fullName(),
          password,
          phone: faker.phone.number({ style: "international" }),
          role: "CLIENT",
        },
        {
          email: faker.internet.email().toLowerCase(),
          name: faker.person.fullName(),
          password,
          phone: faker.phone.number({ style: "international" }),
          role: "CLIENT",
        },
      ],
    })

  const categories = await prisma.category.createManyAndReturn({
    data: [{ name: "Brasileira" }, { name: "Pizza" }, { name: "Lanches" }],
  })

  const address = await prisma.address.createManyAndReturn({
    data: [
      {
        clientId: client1.id,
        zipCode: faker.location.zipCode(),
        street: faker.location.street(),
        number: Number(faker.location.buildingNumber()),
        district: faker.location.county(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        main: true,
      },
      {
        clientId: client1.id,
        zipCode: faker.location.zipCode(),
        street: faker.location.street(),
        number: Number(faker.location.buildingNumber()),
        district: faker.location.county(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
      },
      {
        clientId: client2.id,
        zipCode: faker.location.zipCode(),
        street: faker.location.street(),
        number: Number(faker.location.buildingNumber()),
        district: faker.location.county(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        main: true,
      },
      {
        clientId: client2.id,
        zipCode: faker.location.zipCode(),
        street: faker.location.street(),
        number: Number(faker.location.buildingNumber()),
        district: faker.location.county(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
      },
      {
        clientId: client3.id,
        zipCode: faker.location.zipCode(),
        street: faker.location.street(),
        number: Number(faker.location.buildingNumber()),
        district: faker.location.county(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        main: true,
      },
      {
        clientId: client3.id,
        zipCode: faker.location.zipCode(),
        street: faker.location.street(),
        number: Number(faker.location.buildingNumber()),
        district: faker.location.county(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
      },
      {
        clientId: client4.id,
        zipCode: faker.location.zipCode(),
        street: faker.location.street(),
        number: Number(faker.location.buildingNumber()),
        district: faker.location.county(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        main: true,
      },
      {
        clientId: client4.id,
        zipCode: faker.location.zipCode(),
        street: faker.location.street(),
        number: Number(faker.location.buildingNumber()),
        district: faker.location.county(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
      },
      {
        clientId: client5.id,
        zipCode: faker.location.zipCode(),
        street: faker.location.street(),
        number: Number(faker.location.buildingNumber()),
        district: faker.location.county(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        main: true,
      },
      {
        clientId: client5.id,
        zipCode: faker.location.zipCode(),
        street: faker.location.street(),
        number: Number(faker.location.buildingNumber()),
        district: faker.location.county(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
      },
      {
        clientId: client6.id,
        zipCode: faker.location.zipCode(),
        street: faker.location.street(),
        number: Number(faker.location.buildingNumber()),
        district: faker.location.county(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        main: true,
      },
      {
        clientId: client6.id,
        zipCode: faker.location.zipCode(),
        street: faker.location.street(),
        number: Number(faker.location.buildingNumber()),
        district: faker.location.county(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
      },
      {
        clientId: client7.id,
        zipCode: faker.location.zipCode(),
        street: faker.location.street(),
        number: Number(faker.location.buildingNumber()),
        district: faker.location.county(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        main: true,
      },
      {
        clientId: client7.id,
        zipCode: faker.location.zipCode(),
        street: faker.location.street(),
        number: Number(faker.location.buildingNumber()),
        district: faker.location.county(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
      },
    ],
  })

  const restaurants = await prisma.restaurant.createManyAndReturn({
    data: [
      {
        adminId: admin1.id,
        categoryId: faker.helpers.arrayElement(categories.map(({ id }) => id)),
        deliveryTime: faker.number.int({ min: 30, max: 120 }),
        tax: faker.number.int({ min: 0, max: 20 }),
        name: faker.company.name(),
        phone: faker.phone.number({ style: "international" }),
      },
      {
        adminId: admin2.id,
        categoryId: faker.helpers.arrayElement(categories.map(({ id }) => id)),
        deliveryTime: faker.number.int({ min: 30, max: 120 }),
        tax: faker.number.int({ min: 0, max: 20 }),
        name: faker.company.name(),
        phone: faker.phone.number({ style: "international" }),
      },
      {
        adminId: admin3.id,
        categoryId: faker.helpers.arrayElement(categories.map(({ id }) => id)),
        deliveryTime: faker.number.int({ min: 30, max: 120 }),
        tax: faker.number.int({ min: 0, max: 20 }),
        name: faker.company.name(),
        phone: faker.phone.number({ style: "international" }),
      },
      {
        adminId: admin4.id,
        categoryId: faker.helpers.arrayElement(categories.map(({ id }) => id)),
        deliveryTime: faker.number.int({ min: 30, max: 120 }),
        tax: faker.number.int({ min: 0, max: 20 }),
        name: faker.company.name(),
        phone: faker.phone.number({ style: "international" }),
      },
      {
        adminId: admin5.id,
        categoryId: faker.helpers.arrayElement(categories.map(({ id }) => id)),
        deliveryTime: faker.number.int({ min: 30, max: 120 }),
        tax: faker.number.int({ min: 0, max: 20 }),
        name: faker.company.name(),
        phone: faker.phone.number({ style: "international" }),
      },
      {
        adminId: admin6.id,
        categoryId: faker.helpers.arrayElement(categories.map(({ id }) => id)),
        deliveryTime: faker.number.int({ min: 30, max: 120 }),
        tax: faker.number.int({ min: 0, max: 20 }),
        name: faker.company.name(),
        phone: faker.phone.number({ style: "international" }),
      },
    ],
  })

  const products: Product[] = []
  const orders: Prisma.OrderUncheckedCreateInput[] = []
  const orderItems: Prisma.OrderItemUncheckedCreateInput[] = []
  const evaluations: Prisma.EvaluationUncheckedCreateInput[] = []

  for (let index = 0; index < restaurants.length; index++) {
    const restaurant = restaurants[index]
    const openedAt = faker.number.int({ min: 540, max: 840 })
    const closedAt = faker.number.int({ min: 1080, max: 1440 })

    for (let weekday = 0; weekday < 7; weekday++) {
      await prisma.hour.create({
        data: {
          weekday,
          openedAt,
          closedAt,
          restaurantId: restaurant.id,
          open: true,
        },
      })
    }

    let productIndex = 0
    let orderIndex = 0

    while (productIndex < 10) {
      products.push(
        await prisma.product.create({
          data: {
            description: faker.commerce.productDescription(),
            name: faker.commerce.productName(),
            price: faker.commerce.price({
              min: 20,
              max: 40,
              dec: 1,
            }),
            restaurantId: restaurant.id,
            available: true,
          },
        }),
      )

      productIndex++
    }

    while (orderIndex < 10) {
      const orderId = randomUUID()

      const restaurantProducts = products.filter(
        product => product.restaurantId === restaurant.id,
      )

      const orderProducts = faker.helpers.arrayElements(restaurantProducts, {
        min: 1,
        max: 4,
      })

      let total = 0

      orderProducts.forEach(product => {
        const quantity = faker.number.int({
          min: 1,
          max: 3,
        })

        total += product.price.toNumber() * quantity

        orderItems.push({
          orderId,
          productId: product.id,
          price: product.price,
          quantity,
        })
      })

      const client = faker.helpers.arrayElement([
        client1.id,
        client2.id,
        client3.id,
        client4.id,
        client5.id,
        client6.id,
        client7.id,
      ])

      const status = faker.helpers.arrayElement([
        OrderStatus.DELIVERED,
        OrderStatus.CANCELED,
      ])
      const date = faker.date.recent({ days: 90 })

      orders.push({
        id: orderId,
        clientId: client,
        restaurantId: restaurant.id,
        payment: faker.helpers.enumValue(PaymentMethod),
        total: total + restaurant.tax.toNumber(),
        addressId: faker.helpers.arrayElement(
          address.filter(item => item.clientId === client),
        ).id,
        date,
        status,
        preparedAt: addMinutes(date, 1),
        routedAt:
          status === "CANCELED"
            ? null
            : addMinutes(date, restaurant.deliveryTime),
        deliveredAt:
          status === "DELIVERED"
            ? addMinutes(date, restaurant.deliveryTime + 10)
            : null,
        canceledAt:
          status === "CANCELED"
            ? addMinutes(date, restaurant.deliveryTime + 10)
            : null,
      })

      if (status === OrderStatus.DELIVERED) {
        evaluations.push({
          rate: faker.number.int({ min: 3, max: 5 }),
          comment: faker.helpers.arrayElement([
            null,
            faker.lorem.paragraph({ min: 1, max: 4 }),
          ]),
          createdAt: faker.date.between({
            from: addHours(addMinutes(date, restaurant.deliveryTime + 10), 1),
            to: faker.date.soon({
              days: 2,
              refDate: addHours(
                addMinutes(date, restaurant.deliveryTime + 10),
                1,
              ),
            }),
          }),
          clientId: client,
          orderId,
        })
      }

      orderIndex++
    }
  }

  await prisma.order.createMany({
    data: orders,
  })

  await prisma.orderItem.createMany({
    data: orderItems,
  })

  await prisma.evaluation.createMany({
    data: evaluations,
  })

  await prisma.favorite.createMany({
    data: [
      {
        clientId: faker.helpers.arrayElement([
          client1.id,
          client2.id,
          client3.id,
          client4.id,
          client5.id,
          client6.id,
          client7.id,
        ]),
        restaurantId: faker.helpers.arrayElement(
          restaurants.map(({ id }) => id),
        ),
      },
      {
        clientId: faker.helpers.arrayElement([
          client1.id,
          client2.id,
          client3.id,
          client4.id,
          client5.id,
          client6.id,
          client7.id,
        ]),
        restaurantId: faker.helpers.arrayElement(
          restaurants.map(({ id }) => id),
        ),
      },
      {
        clientId: faker.helpers.arrayElement([
          client1.id,
          client2.id,
          client3.id,
          client4.id,
          client5.id,
          client6.id,
          client7.id,
        ]),
        restaurantId: faker.helpers.arrayElement(
          restaurants.map(({ id }) => id),
        ),
      },
      {
        clientId: faker.helpers.arrayElement([
          client1.id,
          client2.id,
          client3.id,
          client4.id,
          client5.id,
          client6.id,
          client7.id,
        ]),
        restaurantId: faker.helpers.arrayElement(
          restaurants.map(({ id }) => id),
        ),
      },
      {
        clientId: faker.helpers.arrayElement([
          client1.id,
          client2.id,
          client3.id,
          client4.id,
          client5.id,
          client6.id,
          client7.id,
        ]),
        restaurantId: faker.helpers.arrayElement(
          restaurants.map(({ id }) => id),
        ),
      },
    ],
    skipDuplicates: true,
  })
}

main().then(() => console.log("Database seeded!"))
