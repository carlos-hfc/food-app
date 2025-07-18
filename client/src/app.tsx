import { QueryClientProvider } from "@tanstack/react-query"
import { Helmet, HelmetProvider } from "react-helmet-async"
import { RouterProvider } from "react-router"

import { queryClient } from "./lib/react-query"
import { router } from "./pages/routes"

export function App() {
  return (
    <HelmetProvider>
      <Helmet titleTemplate="%s | food.app" />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </HelmetProvider>
  )
}
