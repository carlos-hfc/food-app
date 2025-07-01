import { resolve } from "node:path"

import fastifyCookie from "@fastify/cookie"
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
import { getDailyReceiptInPeriod } from "./routes/metrics/get-daily-receipt-in-period"
import { getMonthCanceledOrdersAmount } from "./routes/metrics/get-month-canceled-orders-amount"
import { getMonthOrdersAmount } from "./routes/metrics/get-month-orders-amount"
import { getMonthReceipt } from "./routes/metrics/get-month-receipt"
import { getPopularProducts } from "./routes/metrics/get-popular-products"
import { changeOrderStatus } from "./routes/order/change-order-status"
import { createOrder } from "./routes/order/create-order"
import { getOrder } from "./routes/order/get-order"
import { listOrders } from "./routes/order/list-orders"
import { myOrders } from "./routes/order/my-orders"
import { rateOrder } from "./routes/order/rate-order"
import { addImageOnProduct } from "./routes/product/add-image-on-product"
import { editProduct } from "./routes/product/edit-product"
import { listProducts } from "./routes/product/list-products"
import { listProductsByRestaurant } from "./routes/product/list-products-by-restaurant"
import { registerProduct } from "./routes/product/register-product"
import { addImageOnRestaurant } from "./routes/restaurant/add-image-on-restaurant"
import { editRestaurant } from "./routes/restaurant/edit-restaurant"
import { getInfoRestaurant } from "./routes/restaurant/get-info-restaurant"
import { getManagedRestaurant } from "./routes/restaurant/get-managed-restaurant"
import { getRestaurant } from "./routes/restaurant/get-restaurant"
import { listRestaurants } from "./routes/restaurant/list-restaurants"
import { registerRestaurant } from "./routes/restaurant/register-restaurant"
import { authenticate } from "./routes/session/authenticate"
import { registerClient } from "./routes/session/register-client"
import { signOut } from "./routes/session/sign-out"
import { editProfile } from "./routes/user/edit-profile"
import { getProfile } from "./routes/user/get-profile"

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "token",
    signed: false,
  },
  sign: {
    expiresIn: "7d",
  },
})
app.register(fastifyCors, {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "PATCH", "POST", "PUT", "DELETE"],
})
app.register(fastifyCookie)
app.register(fastifyMultipart)
app.register(fastifyStatic, {
  root: resolve(__dirname, "..", "uploads"),
  prefix: "/uploads",
})

app.register(registerClient)
app.register(authenticate)
app.register(signOut)

app.register(registerRestaurant)
app.register(addImageOnRestaurant)
app.register(listRestaurants)
app.register(editRestaurant)
app.register(getRestaurant)
app.register(getInfoRestaurant)
app.register(getManagedRestaurant)

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
app.register(listProducts)

app.register(createOrder)
app.register(getOrder)
app.register(changeOrderStatus)
app.register(rateOrder)
app.register(myOrders)
app.register(listOrders)

app.register(getPopularProducts)
app.register(getMonthOrdersAmount)
app.register(getMonthCanceledOrdersAmount)
app.register(getDailyReceiptInPeriod)
app.register(getMonthReceipt)

app
  .listen({ port: env.PORT, host: "0.0.0.0" })
  .then(() => console.log("HTTP Server running"))
