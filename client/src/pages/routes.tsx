import { createBrowserRouter } from "react-router"

import { AppLayout } from "./_layouts/app"
import { AuthLayout } from "./_layouts/auth"
import { SignIn } from "./auth/sign-in"
import { SignUp } from "./auth/sign-up"
import { HomePage } from "./home/home"
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
        element: <Restaurants />,
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
