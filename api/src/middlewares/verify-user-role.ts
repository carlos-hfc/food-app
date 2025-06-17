import { FastifyRequest } from "fastify"
import { Role } from "generated/prisma"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"

export function verifyUserRole(roleToVerify: Role) {
  return async (request: FastifyRequest) => {
    const userId = await request.getCurrentUserId()

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user || user.role !== roleToVerify) {
      throw new ClientError("Unauthorized")
    }
  }
}
