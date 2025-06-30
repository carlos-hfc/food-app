import { RouterProvider } from "react-router"

import { ThemeProvider } from "./components/theme/theme-provider"
import { router } from "./pages/routes"

export function App() {
  return (
    <ThemeProvider storageKey="@food-app-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
