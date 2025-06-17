export function convertHoursToMinutes(hours: string) {
  const [hour, minute] = hours.split(":")
  return Number(hour) * 60 + Number(minute)
}
