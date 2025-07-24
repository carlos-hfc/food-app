import { Skeleton } from "@/components/ui/skeleton"

export function BestRestaurantsCardSkeleton() {
  return (
    <div className="space-y-3 py-6">
      <Skeleton className="w-56 h-6" />

      <div className="flex gap-4 overflow-x-auto py-2 scrollbar-hidden">
        {Array.from({ length: 4 })?.map((_, i) => (
          <Skeleton
            key={i}
            className="w-24 lg:w-56 h-36"
          />
        ))}
      </div>
    </div>
  )
}
