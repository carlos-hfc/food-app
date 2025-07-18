import { Skeleton } from "@/components/ui/skeleton"

export function CardSkeleton() {
  return Array.from({ length: 4 }).map((_, i) => (
    <div
      key={i}
      className="border rounded-md flex items-center gap-2 py-8 px-4 relative flex-1"
    >
      <Skeleton className="w-24 h-20" />

      <div className="space-y-2">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-12 h-3" />
      </div>
    </div>
  ))
}
