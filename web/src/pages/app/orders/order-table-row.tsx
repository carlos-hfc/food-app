import { ArrowRightIcon, SearchIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"

export function OrderTableRow() {
  return (
    <TableRow>
      <TableCell>
        <Button
          variant={"outline"}
          size={"xs"}
          aria-label="Detalhes do pedido"
        >
          <SearchIcon className="size-3" />
        </Button>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        089fda089fda
      </TableCell>
      <TableCell className="text-muted-foreground">há 15 minutos</TableCell>
      <TableCell className="font-medium">PIX</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-slate-400" />
          <span className="font-medium text-muted-foreground">Pendente</span>
        </div>
      </TableCell>
      <TableCell className="font-medium">Carlos Faustino</TableCell>
      <TableCell className="font-medium">R$ 150,00</TableCell>
      <TableCell>
        <Button
          variant={"outline"}
          size={"xs"}
        >
          <ArrowRightIcon className="mr-2 size-3" />
          Aprovar
        </Button>
      </TableCell>
      <TableCell>
        <Button
          variant={"ghost"}
          size={"xs"}
        >
          <XIcon className="mr-2 size-3" />
          Cancelar
        </Button>
      </TableCell>
    </TableRow>
  )
}
