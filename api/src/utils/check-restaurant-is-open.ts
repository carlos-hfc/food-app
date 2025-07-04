import { tz, TZDate } from "@date-fns/tz"
import { differenceInMinutes, startOfToday } from "date-fns"

interface RestaurantIsOpenParams {
  openedAt: number
  closedAt: number
}

export function restaurantIsOpen({
  closedAt,
  openedAt,
}: RestaurantIsOpenParams) {
  return (
    differenceInMinutes(new TZDate(), startOfToday({ in: tz("-03:00") })) >
      openedAt &&
    differenceInMinutes(new TZDate(), startOfToday({ in: tz("-03:00") })) <
      closedAt
  )
}
