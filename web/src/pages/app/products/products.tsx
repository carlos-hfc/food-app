import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useSearchParams } from "react-router"
import { z } from "zod"

import { Pagination } from "@/components/pagination"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getProducts } from "@/http/get-products"

import { ProductDialog } from "./product-dialog"
import { ProductTableFilters } from "./product-table-filters"
import { ProductTableRow } from "./product-table-row"
import { ProductTableSkeleton } from "./product-table-skeleton"

export function Products() {
  const [open, setOpen] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams()

  const active = searchParams.get("active")
  const available = searchParams.get("available")

  const pageIndex = z.coerce
    .number()
    .transform(page => page - 1)
    .parse(searchParams.get("page") ?? 1)

  const { data: result, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", pageIndex, active, available],
    queryFn: () => getProducts({ pageIndex, active, available }),
  })

  function handlePaginate(pageIndex: number) {
    setSearchParams(prev => {
      prev.set("page", String(pageIndex + 1))

      return prev
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>

      <div className="space-y-2.5">
        <div className="flex justify-between">
          <ProductTableFilters />

          <Dialog
            open={open}
            onOpenChange={setOpen}
          >
            <DialogTrigger asChild>
              <Button size="xs">Cadastrar produto</Button>
            </DialogTrigger>

            <ProductDialog onOpenChange={setOpen} />
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16" />
                <TableHead className="w-72">Identificador</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="w-36">Preço</TableHead>
                <TableHead className="w-40">Disponível</TableHead>
                <TableHead className="w-40">Ativo</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoadingProducts && <ProductTableSkeleton />}

              {result?.products.map(product => (
                <ProductTableRow
                  key={product.id}
                  product={product}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        {result && (
          <Pagination
            pageIndex={result.meta.pageIndex}
            totalCount={result.meta.totalCount}
            perPage={result.meta.perPage}
            onPageChange={handlePaginate}
          />
        )}
      </div>
    </div>
  )
}
