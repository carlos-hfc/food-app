import { Skeleton } from "@/components/ui/skeleton"

export function CategoryCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-6 w-60" />

      <div className="flex gap-4 overflow-x-auto scrollbar-hidden">
        {Array.from({ length: 5 })?.map((_, i) => (
          <Skeleton
            key={i}
            className="min-w-24 size-24"
          />
        ))}
      </div>
    </div>
  )
}
