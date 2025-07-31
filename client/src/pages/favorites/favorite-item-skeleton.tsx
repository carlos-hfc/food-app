import { Skeleton } from "@/components/ui/skeleton"

export function FavoriteItemSkeleton() {
  return Array.from({ length: 6 }).map((_, i) => (
    <Skeleton
      key={i}
      className="h-28"
    />
  ))
}
