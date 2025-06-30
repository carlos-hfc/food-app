import { QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider } from "react-router"
import { Toaster } from "sonner"

import { ThemeProvider } from "./components/theme/theme-provider"
import { queryClient } from "./lib/react-query"
import { router } from "./pages/routes"

export function App() {
  return (
    <ThemeProvider storageKey="@food-app-theme">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
      <Toaster richColors />
    </ThemeProvider>
  )
}
