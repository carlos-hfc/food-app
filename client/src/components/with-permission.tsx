import { ComponentType } from "react"
import { Navigate, useLocation } from "react-router"

export function withPermission<T extends object>(Component: ComponentType<T>) {
  const ComponentWithNavigation = (props: T) => {
    const { pathname } = useLocation()
    const logged = sessionStorage.getItem("isLogged")

    return logged ? (
      <Component {...props} />
    ) : (
      <Navigate to={`/sign-in?redirectTo=${pathname}`} />
    )
  }

  return ComponentWithNavigation
}
