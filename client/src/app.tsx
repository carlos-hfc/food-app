import { QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider } from "react-router"
import { Toaster } from "sonner"

import { CartProvider } from "./contexts/cart"
import { queryClient } from "./lib/react-query"
import { router } from "./pages/routes"

export function App() {
  return (
    <CartProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster richColors />
      </QueryClientProvider>
    </CartProvider>
  )
}
