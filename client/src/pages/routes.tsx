import { createBrowserRouter } from "react-router"

import { HomePage } from "./home/home"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  // {
  //   path: "/",
  //   element: <AuthLayout />,
  // },
])
