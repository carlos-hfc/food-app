import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { TableCell, TableRow } from "@/components/ui/table"

export function ProductTableSkeleton() {
  return Array.from({ length: 10 }).map((_, i) => (
    <TableRow key={i}>
      <TableCell>
        <Button
          variant={"outline"}
          size={"xs"}
          aria-label="Detalhes do produto"
          disabled
        >
          <SearchIcon className="size-3" />
        </Button>
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-72" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-36" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
    </TableRow>
  ))
}
