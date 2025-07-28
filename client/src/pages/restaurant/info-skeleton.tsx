import { Skeleton } from "@/components/ui/skeleton"

export function InfoSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row justify-between gap-4 divide-y-1 lg:divide-y-0">
      <div className="flex items-center gap-3 pb-4">
        <Skeleton className="rounded-full size-16 md:size-24" />
        <div className="relative flex items-center gap-2">
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <Skeleton className="size-3 md:size-4" />
          <Skeleton className="h-3 md:h-4 w-12" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-24" />

        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}
