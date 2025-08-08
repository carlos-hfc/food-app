import { createBrowserRouter } from "react-router"

import { withPermission } from "@/components/with-permission"

import { AppLayout } from "./_layouts/app"
import { AuthLayout } from "./_layouts/auth"
import { CheckoutLayout } from "./_layouts/checkout"
import { Address } from "./address/address"
import { SignIn } from "./auth/sign-in"
import { SignUp } from "./auth/sign-up"
import { Category } from "./categories/category"
import { Checkout } from "./checkout/checkout"
import { Favorites } from "./favorites/favorites"
import { HomePage } from "./home/home"
import { Orders } from "./orders/orders"
import { Restaurant } from "./restaurant/restaurant"
import { Restaurants } from "./restaurants/restaurants"

const AddressPage = withPermission(Address)
const CheckoutPage = withPermission(Checkout)
const FavoritePage = withPermission(Favorites)
const OrderPage = withPermission(Orders)

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/restaurantes",
        children: [
          {
            index: true,
            element: <Restaurants />,
          },
          {
            path: ":restaurantId",
            element: <Restaurant />,
          },
        ],
      },
      {
        path: "/categoria/:categoryId",
        element: <Category />,
      },
      {
        path: "/favoritos",
        element: <FavoritePage />,
      },
      {
        path: "/enderecos",
        element: <AddressPage />,
      },
      {
        path: "/pedidos",
        element: <OrderPage />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
  {
    path: "/",
    element: <CheckoutLayout />,
    children: [
      {
        path: "/checkout",
        element: <CheckoutPage />,
      },
    ],
  },
])
