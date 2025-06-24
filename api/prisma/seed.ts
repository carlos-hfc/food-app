import { randomUUID } from "node:crypto"

import { faker } from "@faker-js/faker"
import { hash } from "bcryptjs"
import { addDays } from "date-fns"
import { OrderStatus, PaymentMethod, Prisma } from "generated/prisma"

import { prisma } from "@/lib/prisma"

async function main() {
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`

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

  const [admin1, admin2, admin3] = await prisma.user.createManyAndReturn({
    data: [
      {
        email: "carlos@email.com",
        name: "Carlos",
        password,
        phone: faker.phone.number(),
        role: "ADMIN",
      },
      {
        email: faker.internet.email().toLowerCase(),
        name: faker.person.firstName(),
        password,
        phone: faker.phone.number(),
        role: "ADMIN",
      },
      {
        email: faker.internet.email().toLowerCase(),
        name: faker.person.firstName(),
        password,
        phone: faker.phone.number(),
        role: "ADMIN",
      },
    ],
  })

  const [client1, client2, client3] = await prisma.user.createManyAndReturn({
    data: [
      {
        email: "filled@email.com",
        name: faker.person.firstName(),
        password,
        phone: faker.phone.number(),
        role: "CLIENT",
      },
      {
        email: faker.internet.email().toLowerCase(),
        name: faker.person.firstName(),
        password,
        phone: faker.phone.number(),
        role: "CLIENT",
      },
      {
        email: faker.internet.email().toLowerCase(),
        name: faker.person.firstName(),
        password,
        phone: faker.phone.number(),
        role: "CLIENT",
      },
      {
        email: "vazio@email.com",
        name: faker.person.firstName(),
        password,
        phone: faker.phone.number(),
        role: "CLIENT",
      },
    ],
  })

  const [br, pizza, lanches] = await prisma.category.createManyAndReturn({
    data: [{ name: "Brasileira" }, { name: "Pizza" }, { name: "Lanches" }],
  })

  const address = await prisma.address.createManyAndReturn({
    data: [
      {
        address: faker.location.street(),
        city: faker.location.city(),
        uf: faker.location.state({ abbreviated: true }),
        clientId: client1.id,
        district: faker.location.country(),
        zipCode: faker.location.zipCode(),
        main: true,
      },
      {
        address: faker.location.street(),
        city: faker.location.city(),
        uf: faker.location.state({ abbreviated: true }),
        clientId: client1.id,
        district: faker.location.country(),
        zipCode: faker.location.zipCode(),
      },
      {
        address: faker.location.street(),
        city: faker.location.city(),
        uf: faker.location.state({ abbreviated: true }),
        clientId: client2.id,
        district: faker.location.country(),
        zipCode: faker.location.zipCode(),
        main: true,
      },
      {
        address: faker.location.street(),
        city: faker.location.city(),
        uf: faker.location.state({ abbreviated: true }),
        clientId: client2.id,
        district: faker.location.country(),
        zipCode: faker.location.zipCode(),
      },
      {
        address: faker.location.street(),
        city: faker.location.city(),
        uf: faker.location.state({ abbreviated: true }),
        clientId: client3.id,
        district: faker.location.country(),
        zipCode: faker.location.zipCode(),
        main: true,
      },
      {
        address: faker.location.street(),
        city: faker.location.city(),
        uf: faker.location.state({ abbreviated: true }),
        clientId: client3.id,
        district: faker.location.country(),
        zipCode: faker.location.zipCode(),
      },
    ],
  })

  const [restaurant1, restaurant2, restaurant3] =
    await prisma.restaurant.createManyAndReturn({
      data: [
        {
          adminId: admin1.id,
          categoryId: faker.helpers.arrayElement([pizza.id, br.id, lanches.id]),
          deliveryTime: faker.number.int({ min: 30, max: 90 }),
          tax: faker.number.int({ min: 0, max: 20 }),
          name: faker.company.name(),
          phone: faker.phone.number(),
        },
        {
          adminId: admin2.id,
          categoryId: faker.helpers.arrayElement([pizza.id, br.id, lanches.id]),
          deliveryTime: faker.number.int({ min: 30, max: 90 }),
          tax: faker.number.int({ min: 0, max: 20 }),
          name: faker.company.name(),
          phone: faker.phone.number(),
        },
        {
          adminId: admin3.id,
          categoryId: faker.helpers.arrayElement([pizza.id, br.id, lanches.id]),
          deliveryTime: faker.number.int({ min: 30, max: 90 }),
          tax: faker.number.int({ min: 0, max: 20 }),
          name: faker.company.name(),
          phone: faker.phone.number(),
        },
      ],
    })

  for (let index = 0; index < 7; index++) {
    await prisma.hour.createMany({
      data: [
        {
          weekday: index,
          openedAt: faker.number.int({ min: 540, max: 840 }),
          closedAt: faker.number.int({ min: 840, max: 1439 }),
          restaurantId: restaurant1.id,
          open: true,
        },
        {
          weekday: index,
          openedAt: faker.number.int({ min: 540, max: 840 }),
          closedAt: faker.number.int({ min: 840, max: 1439 }),
          restaurantId: restaurant2.id,
          open: true,
        },
        {
          weekday: index,
          openedAt: faker.number.int({ min: 540, max: 840 }),
          closedAt: faker.number.int({ min: 840, max: 1439 }),
          restaurantId: restaurant3.id,
          open: true,
        },
      ],
    })
  }

  const products1 = await prisma.product.createManyAndReturn({
    data: [
      {
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
      {
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
      {
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
      {
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
      {
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
      {
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
      {
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
    ],
  })

  const products2 = await prisma.product.createManyAndReturn({
    data: [
      {
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
      {
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
      {
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
      {
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
      {
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
      {
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
      {
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
    ],
  })

  const products3 = await prisma.product.createManyAndReturn({
    data: [
      {
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
      {
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
      {
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
      {
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
      {
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
      {
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
      {
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
    ],
  })

  const orders: Prisma.OrderUncheckedCreateInput[] = []
  const orderItems: Prisma.OrderItemUncheckedCreateInput[] = []
  for (let index = 0; index < 50; index++) {
    const orderId = randomUUID()

    const orderProducts1 = faker.helpers.arrayElements(products1, {
      min: 1,
      max: 3,
    })

    let total = 0

    orderProducts1.forEach(product => {
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
    ])

    orders.push({
      id: orderId,
      clientId: client,
      restaurantId: restaurant1.id,
      payment: faker.helpers.arrayElement([
        PaymentMethod.CARD,
        PaymentMethod.CASH,
        PaymentMethod.PIX,
      ]),
      status: faker.helpers.arrayElement([
        OrderStatus.CANCELED,
        OrderStatus.DELIVERED,
        OrderStatus.PENDING,
        OrderStatus.PREPARING,
        OrderStatus.ROUTING,
      ]),
      total: total + restaurant1.tax.toNumber(),
      addressId: faker.helpers.arrayElement(
        address.filter(item => item.clientId === client),
      ).id,
      date: faker.date.recent({ days: 60 }),
    })
  }

  for (let index = 0; index < 50; index++) {
    const orderId = randomUUID()

    const orderProducts2 = faker.helpers.arrayElements(products2, {
      min: 1,
      max: 3,
    })

    let total = 0

    orderProducts2.forEach(product => {
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
    ])

    orders.push({
      id: orderId,
      clientId: client,
      restaurantId: restaurant2.id,
      payment: faker.helpers.arrayElement([
        PaymentMethod.CARD,
        PaymentMethod.CASH,
        PaymentMethod.PIX,
      ]),
      status: faker.helpers.arrayElement([
        OrderStatus.CANCELED,
        OrderStatus.DELIVERED,
        OrderStatus.PENDING,
        OrderStatus.PREPARING,
        OrderStatus.ROUTING,
      ]),
      total: total + restaurant2.tax.toNumber(),
      addressId: faker.helpers.arrayElement(
        address.filter(item => item.clientId === client),
      ).id,
      date: faker.date.recent({ days: 60 }),
    })
  }

  for (let index = 0; index < 50; index++) {
    const orderId = randomUUID()

    const orderProducts3 = faker.helpers.arrayElements(products3, {
      min: 1,
      max: 3,
    })

    let total = 0

    orderProducts3.forEach(product => {
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
    ])

    orders.push({
      id: orderId,
      clientId: client,
      restaurantId: restaurant3.id,
      payment: faker.helpers.arrayElement([
        PaymentMethod.CARD,
        PaymentMethod.CASH,
        PaymentMethod.PIX,
      ]),
      status: faker.helpers.arrayElement([
        OrderStatus.CANCELED,
        OrderStatus.DELIVERED,
        OrderStatus.PENDING,
        OrderStatus.PREPARING,
        OrderStatus.ROUTING,
      ]),
      total: total + restaurant3.tax.toNumber(),
      addressId: faker.helpers.arrayElement(
        address.filter(item => item.clientId === client),
      ).id,
      date: faker.date.recent({ days: 60 }),
    })
  }

  for (let index = 0; index < orders.length; index++) {
    const currentOrder = orders[index]

    if (currentOrder.status === OrderStatus.DELIVERED) {
      currentOrder.grade = faker.number.int({ min: 1, max: 5 })
      currentOrder.ratingDate = addDays(currentOrder.date as string, 1)
      currentOrder.comment = faker.helpers.arrayElement([
        null,
        faker.lorem.words({ min: 2, max: 10 }),
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
        ]),
      },
    ],
    skipDuplicates: true,
  })
}

main().then(() => console.log("Database seeded!"))
