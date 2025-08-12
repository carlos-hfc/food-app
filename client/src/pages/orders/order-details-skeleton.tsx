import { Skeleton } from "@/components/ui/skeleton"

export function OrderDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="w-full h-8" />

      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-sm"
          >
            <Skeleton className="size-16" />
            <Skeleton className="w-48 h-6" />
            <Skeleton className="w-16 h-6 ml-auto" />
          </div>
        ))}
      </div>

      <div className="text-sm space-y-2">
        <Skeleton className="w-40 h-6" />

        <div className="flex items-center justify-between text-muted-foreground">
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-16 h-4" />
        </div>
      </div>

      <div className="text-sm space-y-2">
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-16 h-4" />
      </div>

      <div className="text-sm space-y-2">
        <Skeleton className="w-40 h-6" />

        <div className="flex items-center gap-3">
          <Skeleton className="size-6" />

          <div className="leading-snug space-y-1">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-40 h-4" />
          </div>
        </div>
      </div>
    </div>
  )
}
