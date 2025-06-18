import { FastifyInstance } from "fastify"
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod"
import { PrismaClientKnownRequestError } from "generated/prisma/runtime/library"
import { ZodError } from "zod"

import { ClientError } from "./errors/client-error"

type FastifyErrorHandler = FastifyInstance["errorHandler"]

export const errorHandler: FastifyErrorHandler = (error, _, reply) => {
  if (error instanceof ClientError) {
    return reply.status(400).send({
      message: error.message,
      statusCode: 400,
    })
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Invalid input",
      statusCode: 400,
      errors:
        error.flatten().formErrors.length > 0
          ? error.flatten().formErrors
          : error.flatten().fieldErrors,
    })
  }

  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: "Invalid input",
      statusCode: 400,
      errors: error.validation,
    })
  }

  if (error instanceof PrismaClientKnownRequestError) {
    return reply.status(400).send({
      message: "Prisma error",
      statusCode: 400,
      error,
    })
  }

  return reply.status(500).send({
    message: "Internal server error",
    error: JSON.stringify(error),
  })
}
