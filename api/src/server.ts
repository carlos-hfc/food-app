import { resolve } from "node:path"

import fastifyCors from "@fastify/cors"
import fastifyJwt from "@fastify/jwt"
import fastifyMultipart from "@fastify/multipart"
import fastifyStatic from "@fastify/static"
import fastify from "fastify"
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod"

import { env } from "./env"
import { errorHandler } from "./error-handler"
import { listCategories } from "./routes/category/list-categories"
import { addImageOnRestaurant } from "./routes/restaurant/add-image-on-restaurant"
import { editRestaurant } from "./routes/restaurant/edit-restaurant"
import { listRestaurants } from "./routes/restaurant/list-restaurants"
import { registerRestaurant } from "./routes/restaurant/register-restaurant"
import { authenticate } from "./routes/session/authenticate"
import { registerAdmin } from "./routes/session/register-admin"
import { registerClient } from "./routes/session/register-client"
import { getProfile } from "./routes/user/get-profile"

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})
app.register(fastifyCors)
app.register(fastifyMultipart)
app.register(fastifyStatic, {
  root: resolve(__dirname, "..", "uploads"),
  prefix: "/uploads",
})

app.register(registerClient)
app.register(authenticate)
app.register(registerAdmin)

app.register(registerRestaurant)
app.register(addImageOnRestaurant)
app.register(listRestaurants)
app.register(editRestaurant)

app.register(listCategories)

app.register(getProfile)

app.listen({ port: env.PORT }).then(() => console.log("HTTP Server running"))
