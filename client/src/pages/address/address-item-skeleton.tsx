import { Skeleton } from "@/components/ui/skeleton"

export function AddressItemSkeleton() {
  return Array.from({ length: 4 }).map((_, i) => (
    <Skeleton
      key={i}
      className="h-28"
    />
  ))
}
