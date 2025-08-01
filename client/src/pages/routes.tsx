import { createBrowserRouter } from "react-router"

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
        element: <Favorites />,
      },
      {
        path: "/enderecos",
        element: <Address />,
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
