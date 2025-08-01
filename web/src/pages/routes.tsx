import { createBrowserRouter } from "react-router"

import { AppLayout } from "./_layouts/app"
import { AuthLayout } from "./_layouts/auth"
import { Dashboard } from "./app/dashboard/dashboard"
import { Evaluations } from "./app/evaluations/evaluations"
import { Orders } from "./app/orders/orders"
import { Products } from "./app/products/products"
import { SignIn } from "./auth/sign-in"
import { SignUp } from "./auth/sign-up"
import { Error } from "./error"
import { NotFound } from "./not-found"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/orders",
        element: <Orders />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/evaluations",
        element: <Evaluations />,
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
    path: "*",
    element: <NotFound />,
  },
])
