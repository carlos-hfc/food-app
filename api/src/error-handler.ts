import { FastifyInstance } from "fastify"
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod"
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

  console.log(error)

  return reply.status(500).send({
    message: "Internal server error",
    error: JSON.stringify(error),
  })
}
