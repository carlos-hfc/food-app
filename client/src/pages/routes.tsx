import { createBrowserRouter } from "react-router"

import { AuthLayout } from "./_layouts/auth"
import { SignIn } from "./auth/sign-in"
import { SignUp } from "./auth/sign-up"
import { HomePage } from "./home/home"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
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
