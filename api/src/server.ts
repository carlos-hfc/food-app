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
import { deleteAddress } from "./routes/address/delete-address"
import { editAddress } from "./routes/address/edit-address"
import { listAddress } from "./routes/address/list-address"
import { registerAddress } from "./routes/address/register-address"
import { listCategories } from "./routes/category/list-categories"
import { deleteFavorite } from "./routes/favorite/delete-favorite"
import { listFavorites } from "./routes/favorite/list-favorites"
import { saveFavorite } from "./routes/favorite/save-favorite"
import { addImageOnProduct } from "./routes/product/add-image-on-product"
import { editProduct } from "./routes/product/edit-product"
import { listProductsByRestaurant } from "./routes/product/list-products-by-restaurant"
import { registerProduct } from "./routes/product/register-product"
import { addImageOnRestaurant } from "./routes/restaurant/add-image-on-restaurant"
import { editRestaurant } from "./routes/restaurant/edit-restaurant"
import { listRestaurants } from "./routes/restaurant/list-restaurants"
import { registerRestaurant } from "./routes/restaurant/register-restaurant"
import { authenticate } from "./routes/session/authenticate"
import { registerAdmin } from "./routes/session/register-admin"
import { registerClient } from "./routes/session/register-client"
import { editProfile } from "./routes/user/edit-profile"
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
app.register(editProfile)

app.register(registerAddress)
app.register(listAddress)
app.register(editAddress)
app.register(deleteAddress)

app.register(saveFavorite)
app.register(listFavorites)
app.register(deleteFavorite)

app.register(registerProduct)
app.register(listProductsByRestaurant)
app.register(addImageOnProduct)
app.register(editProduct)

app.listen({ port: env.PORT }).then(() => console.log("HTTP Server running"))
