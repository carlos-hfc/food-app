import { randomUUID } from "node:crypto"

import { fakerPT_BR as faker } from "@faker-js/faker"
import { hash } from "bcryptjs"
import { addHours } from "date-fns"
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

  const [admin1, admin2, admin3, admin4, admin5] =
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
      ],
    })

  const [client1, client2, client3] = await prisma.user.createManyAndReturn({
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
        email: "vazio@email.com",
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
        address: faker.location.street(),
        city: faker.location.city(),
        uf: faker.location.state({ abbreviated: true }),
        clientId: client1.id,
        district: faker.location.county(),
        zipCode: faker.location.zipCode(),
        main: true,
      },
      {
        address: faker.location.street(),
        city: faker.location.city(),
        uf: faker.location.state({ abbreviated: true }),
        clientId: client1.id,
        district: faker.location.county(),
        zipCode: faker.location.zipCode(),
      },
      {
        address: faker.location.street(),
        city: faker.location.city(),
        uf: faker.location.state({ abbreviated: true }),
        clientId: client2.id,
        district: faker.location.county(),
        zipCode: faker.location.zipCode(),
        main: true,
      },
      {
        address: faker.location.street(),
        city: faker.location.city(),
        uf: faker.location.state({ abbreviated: true }),
        clientId: client2.id,
        district: faker.location.county(),
        zipCode: faker.location.zipCode(),
      },
      {
        address: faker.location.street(),
        city: faker.location.city(),
        uf: faker.location.state({ abbreviated: true }),
        clientId: client3.id,
        district: faker.location.county(),
        zipCode: faker.location.zipCode(),
        main: true,
      },
      {
        address: faker.location.street(),
        city: faker.location.city(),
        uf: faker.location.state({ abbreviated: true }),
        clientId: client3.id,
        district: faker.location.county(),
        zipCode: faker.location.zipCode(),
      },
    ],
  })

  const [restaurant1, restaurant2, restaurant3, restaurant4, restaurant5] =
    await prisma.restaurant.createManyAndReturn({
      data: [
        {
          adminId: admin1.id,
          categoryId: faker.helpers.arrayElement(
            categories.map(({ id }) => id),
          ),
          deliveryTime: faker.number.int({ min: 30, max: 120 }),
          tax: faker.number.int({ min: 0, max: 20 }),
          name: faker.company.name(),
          phone: faker.phone.number({ style: "international" }),
        },
        {
          adminId: admin2.id,
          categoryId: faker.helpers.arrayElement(
            categories.map(({ id }) => id),
          ),
          deliveryTime: faker.number.int({ min: 30, max: 120 }),
          tax: faker.number.int({ min: 0, max: 20 }),
          name: faker.company.name(),
          phone: faker.phone.number({ style: "international" }),
        },
        {
          adminId: admin3.id,
          categoryId: faker.helpers.arrayElement(
            categories.map(({ id }) => id),
          ),
          deliveryTime: faker.number.int({ min: 30, max: 120 }),
          tax: faker.number.int({ min: 0, max: 20 }),
          name: faker.company.name(),
          phone: faker.phone.number({ style: "international" }),
        },
        {
          adminId: admin4.id,
          categoryId: faker.helpers.arrayElement(
            categories.map(({ id }) => id),
          ),
          deliveryTime: faker.number.int({ min: 30, max: 120 }),
          tax: faker.number.int({ min: 0, max: 20 }),
          name: faker.company.name(),
          phone: faker.phone.number({ style: "international" }),
        },
        {
          adminId: admin5.id,
          categoryId: faker.helpers.arrayElement(
            categories.map(({ id }) => id),
          ),
          deliveryTime: faker.number.int({ min: 30, max: 120 }),
          tax: faker.number.int({ min: 0, max: 20 }),
          name: faker.company.name(),
          phone: faker.phone.number({ style: "international" }),
        },
      ],
    })

  for (let weekday = 0; weekday < 7; weekday++) {
    const openedAt = faker.number.int({ min: 540, max: 840 })
    const closedAt = faker.number.int({ min: 1080, max: 1440 })

    await prisma.hour.createMany({
      data: [
        {
          weekday,
          openedAt,
          closedAt,
          restaurantId: restaurant1.id,
          open: true,
        },
        {
          weekday,
          openedAt,
          closedAt,
          restaurantId: restaurant2.id,
          open: true,
        },
        {
          weekday,
          openedAt,
          closedAt,
          restaurantId: restaurant3.id,
          open: true,
        },
        {
          weekday,
          openedAt,
          closedAt,
          restaurantId: restaurant4.id,
          open: true,
        },
        {
          weekday,
          openedAt,
          closedAt,
          restaurantId: restaurant5.id,
          open: true,
        },
      ],
    })
  }

  const products1: Product[] = []
  const products2: Product[] = []
  const products3: Product[] = []
  const products4: Product[] = []
  const products5: Product[] = []

  for (let index = 0; index < 30; index++) {
    products1.push(
      await prisma.product.create({
        data: {
          description: faker.commerce.productDescription(),
          name: faker.commerce.productName(),
          price: faker.commerce.price({
            min: 20,
            max: 40,
            dec: 1,
          }),
          restaurantId: restaurant1.id,
          available: true,
        },
      }),
    )
    products2.push(
      await prisma.product.create({
        data: {
          description: faker.commerce.productDescription(),
          name: faker.commerce.productName(),
          price: faker.commerce.price({
            min: 20,
            max: 40,
            dec: 1,
          }),
          restaurantId: restaurant2.id,
          available: true,
        },
      }),
    )
    products3.push(
      await prisma.product.create({
        data: {
          description: faker.commerce.productDescription(),
          name: faker.commerce.productName(),
          price: faker.commerce.price({
            min: 20,
            max: 40,
            dec: 1,
          }),
          restaurantId: restaurant3.id,
          available: true,
        },
      }),
    )
    products4.push(
      await prisma.product.create({
        data: {
          description: faker.commerce.productDescription(),
          name: faker.commerce.productName(),
          price: faker.commerce.price({
            min: 20,
            max: 40,
            dec: 1,
          }),
          restaurantId: restaurant4.id,
          available: true,
        },
      }),
    )
    products5.push(
      await prisma.product.create({
        data: {
          description: faker.commerce.productDescription(),
          name: faker.commerce.productName(),
          price: faker.commerce.price({
            min: 20,
            max: 40,
            dec: 1,
          }),
          restaurantId: restaurant5.id,
          available: true,
        },
      }),
    )
  }

  const orders: Prisma.OrderUncheckedCreateInput[] = []
  const orderItems: Prisma.OrderItemUncheckedCreateInput[] = []
  for (let index = 0; index < 300; index++) {
    const orderId = randomUUID()

    const orderProducts1 = faker.helpers.arrayElements(products1, {
      min: 1,
      max: 5,
    })

    let total = 0

    orderProducts1.forEach(product => {
      const quantity = faker.number.int({
        min: 1,
        max: 5,
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
    ])

    orders.push({
      id: orderId,
      clientId: client,
      restaurantId: restaurant1.id,
      payment: faker.helpers.enumValue(PaymentMethod),
      status: faker.helpers.enumValue(OrderStatus),
      total: total + restaurant1.tax.toNumber(),
      addressId: faker.helpers.arrayElement(
        address.filter(item => item.clientId === client),
      ).id,
      date: faker.date.recent({ days: 90 }),
    })
  }

  for (let index = 0; index < 300; index++) {
    const orderId = randomUUID()

    const orderProducts2 = faker.helpers.arrayElements(products2, {
      min: 1,
      max: 5,
    })

    let total = 0

    orderProducts2.forEach(product => {
      const quantity = faker.number.int({
        min: 1,
        max: 5,
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
    ])

    orders.push({
      id: orderId,
      clientId: client,
      restaurantId: restaurant2.id,
      payment: faker.helpers.enumValue(PaymentMethod),
      status: faker.helpers.enumValue(OrderStatus),
      total: total + restaurant2.tax.toNumber(),
      addressId: faker.helpers.arrayElement(
        address.filter(item => item.clientId === client),
      ).id,
      date: faker.date.recent({ days: 90 }),
    })
  }

  for (let index = 0; index < 300; index++) {
    const orderId = randomUUID()

    const orderProducts3 = faker.helpers.arrayElements(products3, {
      min: 1,
      max: 5,
    })

    let total = 0

    orderProducts3.forEach(product => {
      const quantity = faker.number.int({
        min: 1,
        max: 5,
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
    ])

    orders.push({
      id: orderId,
      clientId: client,
      restaurantId: restaurant3.id,
      payment: faker.helpers.enumValue(PaymentMethod),
      status: faker.helpers.enumValue(OrderStatus),
      total: total + restaurant3.tax.toNumber(),
      addressId: faker.helpers.arrayElement(
        address.filter(item => item.clientId === client),
      ).id,
      date: faker.date.recent({ days: 90 }),
    })
  }

  for (let index = 0; index < 300; index++) {
    const orderId = randomUUID()

    const orderProducts4 = faker.helpers.arrayElements(products4, {
      min: 1,
      max: 5,
    })

    let total = 0

    orderProducts4.forEach(product => {
      const quantity = faker.number.int({
        min: 1,
        max: 5,
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
    ])

    orders.push({
      id: orderId,
      clientId: client,
      restaurantId: restaurant4.id,
      payment: faker.helpers.enumValue(PaymentMethod),
      status: faker.helpers.enumValue(OrderStatus),
      total: total + restaurant4.tax.toNumber(),
      addressId: faker.helpers.arrayElement(
        address.filter(item => item.clientId === client),
      ).id,
      date: faker.date.recent({ days: 90 }),
    })
  }

  for (let index = 0; index < 300; index++) {
    const orderId = randomUUID()

    const orderProducts5 = faker.helpers.arrayElements(products5, {
      min: 1,
      max: 5,
    })

    let total = 0

    orderProducts5.forEach(product => {
      const quantity = faker.number.int({
        min: 1,
        max: 5,
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
    ])

    orders.push({
      id: orderId,
      clientId: client,
      restaurantId: restaurant5.id,
      payment: faker.helpers.enumValue(PaymentMethod),
      status: faker.helpers.enumValue(OrderStatus),
      total: total + restaurant5.tax.toNumber(),
      addressId: faker.helpers.arrayElement(
        address.filter(item => item.clientId === client),
      ).id,
      date: faker.date.recent({ days: 90 }),
    })
  }

  for (let index = 0; index < orders.length; index++) {
    const currentOrder = orders[index]

    if (currentOrder.status === OrderStatus.DELIVERED) {
      currentOrder.grade = faker.number.int({ min: 1, max: 5 })
      currentOrder.ratingDate = faker.date.between({
        from: addHours(currentOrder.date as string, 1),
        to: faker.date.soon({
          days: 2,
          refDate: addHours(currentOrder.date as string, 1),
        }),
      })

      currentOrder.comment = faker.helpers.arrayElement([
        null,
        faker.lorem.paragraph({ min: 1, max: 4 }),
      ])
    }
  }

  await prisma.order.createMany({
    data: orders,
  })

  await prisma.orderItem.createMany({
    data: orderItems,
  })

  await prisma.favorite.createMany({
    data: [
      {
        clientId: faker.helpers.arrayElement([
          client1.id,
          client2.id,
          client3.id,
        ]),
        restaurantId: faker.helpers.arrayElement([
          restaurant1.id,
          restaurant2.id,
          restaurant3.id,
          restaurant4.id,
          restaurant5.id,
        ]),
      },
      {
        clientId: faker.helpers.arrayElement([
          client1.id,
          client2.id,
          client3.id,
        ]),
        restaurantId: faker.helpers.arrayElement([
          restaurant1.id,
          restaurant2.id,
          restaurant3.id,
          restaurant4.id,
          restaurant5.id,
        ]),
      },
      {
        clientId: faker.helpers.arrayElement([
          client1.id,
          client2.id,
          client3.id,
        ]),
        restaurantId: faker.helpers.arrayElement([
          restaurant1.id,
          restaurant2.id,
          restaurant3.id,
          restaurant4.id,
          restaurant5.id,
        ]),
      },
      {
        clientId: faker.helpers.arrayElement([
          client1.id,
          client2.id,
          client3.id,
        ]),
        restaurantId: faker.helpers.arrayElement([
          restaurant1.id,
          restaurant2.id,
          restaurant3.id,
          restaurant4.id,
          restaurant5.id,
        ]),
      },
      {
        clientId: faker.helpers.arrayElement([
          client1.id,
          client2.id,
          client3.id,
        ]),
        restaurantId: faker.helpers.arrayElement([
          restaurant1.id,
          restaurant2.id,
          restaurant3.id,
          restaurant4.id,
          restaurant5.id,
        ]),
      },
    ],
    skipDuplicates: true,
  })
}

main().then(() => console.log("Database seeded!"))
