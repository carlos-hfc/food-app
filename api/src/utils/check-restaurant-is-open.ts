import { tz, TZDate } from "@date-fns/tz"
import { differenceInMinutes, startOfToday } from "date-fns"
import { Hour } from "generated/prisma"

export function restaurantIsOpen(hour: Hour) {
  return (
    differenceInMinutes(new TZDate(), startOfToday({ in: tz("-03:00") })) >
      hour.openedAt &&
    differenceInMinutes(new TZDate(), startOfToday({ in: tz("-03:00") })) <
      hour.closedAt
  )
}
