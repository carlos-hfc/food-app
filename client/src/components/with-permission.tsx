import { isAxiosError } from "axios"
import { ComponentType, useEffect } from "react"
import { Navigate, useLocation, useNavigate } from "react-router"

import { api } from "@/lib/axios"

export function withPermission<T extends object>(Component: ComponentType<T>) {
  const ComponentWithNavigation = (props: T) => {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const logged = sessionStorage.getItem("isLogged")
    const redirectOnError = `/sign-in?redirectTo=${pathname}`

    useEffect(() => {
      const interceptorId = api.interceptors.response.use(
        response => response,
        error => {
          if (isAxiosError(error)) {
            const status = error.response?.status
            const message = error.response?.data.message

            if (status === 401 && message === "Invalid auth token") {
              sessionStorage.removeItem("isLogged")
              navigate(redirectOnError, { replace: true })
            }

            throw error
          } else {
            throw error
          }
        },
      )

      return () => {
        api.interceptors.response.eject(interceptorId)
      }
    }, [navigate, redirectOnError])

    return logged ? (
      <Component {...props} />
    ) : (
      <Navigate
        to={redirectOnError}
        replace
      />
    )
  }

  return ComponentWithNavigation
}
