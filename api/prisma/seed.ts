import { hash } from "bcryptjs"

import { prisma } from "@/lib/prisma"

async function main() {
  await prisma.favorite.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.hour.deleteMany()
  await prisma.address.deleteMany()
  await prisma.restaurant.deleteMany()
  await prisma.user.deleteMany()

  await prisma.user.create({
    data: {
      email: "carlos@email.com",
      name: "Carlos",
      password: await hash("12345678", 10),
      phone: "11987654321",
      role: "ADMIN",
    },
  })

  await prisma.user.create({
    data: {
      email: "cliente@email.com",
      name: "Cliente",
      password: await hash("12345678", 10),
      phone: "11912345678",
      role: "CLIENT",
    },
  })

  await prisma.category.createMany({
    data: [
      { name: "Brasileira" },
      { name: "Pizza" },
      { name: "Chinesa" },
      { name: "Japonesa" },
      { name: "Mexicana" },
      { name: "Lanches" },
    ],
  })
}

main().then(() => console.log("Database seeded!"))
