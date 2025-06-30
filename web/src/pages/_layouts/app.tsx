import { isAxiosError } from "axios"
import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router"

import { Header } from "@/components/header"
import { api } from "@/lib/axios"

export function AppLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    const intercetorId = api.interceptors.response.use(
      response => response,
      error => {
        if (isAxiosError(error)) {
          const status = error.response?.status
          const message = error.response?.data.message

          if (status === 400 && message === "Invalid auth token") {
            navigate("/sign-in", { replace: true })
          }
        } else {
          console.log(error.response)
          throw error
        }
      },
    )

    return () => {
      api.interceptors.response.eject(intercetorId)
    }
  }, [navigate])

  return (
    <div className="flex min-h-dvh flex-col antialiased">
      <Header />

      <div className="flex flex-1 flex-col gap-4 p-8 pt-6">
        <Outlet />
      </div>
    </div>
  )
}
