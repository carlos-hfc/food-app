import { useQuery } from "@tanstack/react-query"
import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getProducts } from "@/http/get-products"

import { ProductTableSkeleton } from "./product-table-skeleton"

export function Products() {
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  })

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>

      <div className="space-y-2.5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16" />
              <TableHead className="w-72">Identificador</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead className="w-36">Preço</TableHead>
              <TableHead className="w-40" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoadingProducts && <ProductTableSkeleton />}

            {products?.map(product => (
              <TableRow key={product.id}>
                <TableCell>
                  <Button
                    variant={"outline"}
                    size={"xs"}
                    aria-label="Detalhes do produto"
                  >
                    <SearchIcon className="size-3" />
                  </Button>
                </TableCell>
                <TableCell className="font-mono text-xs font-medium">
                  {product.id}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="font-medium">
                  {product.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
                <TableCell>
                  <Switch defaultChecked={product.available} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
