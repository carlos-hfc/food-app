import { useQuery } from "@tanstack/react-query"

import { Pagination } from "@/components/pagination"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getOrders } from "@/http/get-orders"

import { OrderTableFilters } from "./order-table-filters"
import { OrderTableRow } from "./order-table-row"

export function Orders() {
  const { data: result } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  })

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>

      <div className="space-y-2.5">
        <OrderTableFilters />

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16" />
                <TableHead className="w-72">Identificador</TableHead>
                <TableHead className="w-36">Realizado há</TableHead>
                <TableHead className="w-16">Pagamento</TableHead>
                <TableHead className="w-44">Status</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="w-36">Total do pedido</TableHead>
                <TableHead className="w-40" />
                <TableHead className="w-32" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {result?.orders.map(order => (
                <OrderTableRow
                  key={order.id}
                  order={order}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        <Pagination
          pageIndex={0}
          totalCount={100}
          perPage={10}
          onPageChange={() => {}}
        />
      </div>
    </div>
  )
}
