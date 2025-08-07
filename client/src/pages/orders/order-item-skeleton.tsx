import { Skeleton } from "@/components/ui/skeleton"

export function OrderItemSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <div
      key={i}
      className="space-y-2"
    >
      <Skeleton className="h-4 w-36" />

      <div className="rounded-md shadow-md p-3 md:px-4 divide-y divide-accent space-y-3 *:pb-3">
        <div className="flex items-center gap-2 md:gap-4">
          <Skeleton className="rounded-full size-16 md:size-24" />

          <Skeleton className="h-6 w-32" />

          <Skeleton className="size-4 md:size-6 ml-auto" />
        </div>

        <div className="text-xs md:text-sm space-y-1">
          <div className="flex items-center gap-1">
            <Skeleton className="size-4 md:size-5" />

            <Skeleton className="h-4 w-20" />
          </div>

          <div className="flex items-center gap-1">
            <Skeleton className="size-4 md:size-5" />

            <Skeleton className="h-4 w-42" />
          </div>
        </div>

        <div className="flex text-sm justify-between">
          <Skeleton className="h-4 w-20" />

          <Skeleton className="h-4 w-20" />
        </div>

        <div className="flex gap-4 pb-0!">
          <Skeleton className="h-8 w-full" />

          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    </div>
  ))
}
