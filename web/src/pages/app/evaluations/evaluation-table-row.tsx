import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { SearchIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { TableCell, TableRow } from "@/components/ui/table"

import { EvaluationDetails } from "./evaluation-details"

interface EvaluationTableRowProps {
  evaluation: {
    orderId: string
    customerName: string
    grade: number
    comment: string | null
    ratingDate: string
  }
}

export function EvaluationTableRow({ evaluation }: EvaluationTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  return (
    <TableRow>
      <TableCell>
        <Dialog
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        >
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="xs"
              aria-label="Detalhes da avaliação"
            >
              <SearchIcon className="size-3" />
            </Button>
          </DialogTrigger>

          <EvaluationDetails
            open={isDetailsOpen}
            orderId={evaluation.orderId}
          />
        </Dialog>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {evaluation.orderId}
      </TableCell>
      <TableCell className="font-medium">{evaluation.customerName}</TableCell>
      <TableCell className="font-medium text-center">
        {evaluation.grade}
      </TableCell>
      <TableCell className="text-muted-foreground">
        <div className="line-clamp-2">{evaluation.comment ?? "-"}</div>
      </TableCell>
      <TableCell className="text-muted-foreground text-center">
        {formatDistanceToNow(new Date(evaluation.ratingDate), {
          locale: ptBR,
          addSuffix: true,
        })}
      </TableCell>
    </TableRow>
  )
}
