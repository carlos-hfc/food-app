import { createBrowserRouter } from "react-router"

import { withPermission } from "@/components/with-permission"

import { AppLayout } from "./_layouts/app"
import { AuthLayout } from "./_layouts/auth"
import { Address } from "./address/address"
import { SignIn } from "./auth/sign-in"
import { SignUp } from "./auth/sign-up"
import { Category } from "./categories/category"
import { Favorites } from "./favorites/favorites"
import { HomePage } from "./home/home"
import { Restaurant } from "./restaurant/restaurant"
import { Restaurants } from "./restaurants/restaurants"

const AddressPage = withPermission(Address)
const FavoritePage = withPermission(Favorites)

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
])
