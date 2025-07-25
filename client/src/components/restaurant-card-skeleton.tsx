import { Skeleton } from "@/components/ui/skeleton"

export function RestaurantCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {Array.from({ length: 3 })?.map((_, i) => (
        <Skeleton
          key={i}
          className="h-32"
        />
      ))}
    </div>
  )
}
