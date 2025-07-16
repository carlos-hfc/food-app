import { useMutation } from "@tanstack/react-query"
import { SearchIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { TableCell, TableRow } from "@/components/ui/table"
import { GetProductsResponse } from "@/http/get-products"
import { toggleActiveProduct } from "@/http/toggle-active-product"
import { toggleAvailableProduct } from "@/http/toggle-available-product"
import { queryClient } from "@/lib/react-query"

import { ProductDialog } from "./product-dialog"

interface ProductTableRowProps {
  product: {
    id: string
    name: string
    price: number
    available: boolean
    active: boolean
  }
}

export function ProductTableRow({ product }: ProductTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const {
    mutateAsync: toggleActiveProductFn,
    isPending: isToggleActivingProduct,
  } = useMutation({
    mutationFn: toggleActiveProduct,
    async onSuccess(_, { productId }) {
      const productsListCache = queryClient.getQueriesData<GetProductsResponse>(
        {
          queryKey: ["products"],
        },
      )

      productsListCache.forEach(([cacheKey, cacheData]) => {
        if (!cacheData) return

        queryClient.setQueryData<GetProductsResponse>(cacheKey, {
          ...cacheData,
          products: cacheData.products.map(product => {
            if (product.id === productId) {
              return { ...product, active: !product.active }
            }

            return product
          }),
        })
      })
    },
  })

  const {
    mutateAsync: toggleAvailableProductFn,
    isPending: isToggleAvailablingProduct,
  } = useMutation({
    mutationFn: toggleAvailableProduct,
    async onSuccess(_, { productId }) {
      const productsListCache = queryClient.getQueriesData<GetProductsResponse>(
        {
          queryKey: ["products"],
        },
      )

      productsListCache.forEach(([cacheKey, cacheData]) => {
        if (!cacheData) return

        queryClient.setQueryData<GetProductsResponse>(cacheKey, {
          ...cacheData,
          products: cacheData.products.map(product => {
            if (product.id === productId) {
              return { ...product, available: !product.available }
            }

            return product
          }),
        })
      })
    },
  })

  return (
    <TableRow>
      <TableCell>
        <Dialog
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        >
          <DialogTrigger asChild>
            <Button
              variant={"outline"}
              size={"xs"}
              aria-label="Detalhes do produto"
            >
              <SearchIcon className="size-3" />
            </Button>
          </DialogTrigger>

          <ProductDialog
            open={isDetailsOpen}
            productId={product.id}
            isEdit
          />
        </Dialog>
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
        <Switch
          checked={product.available}
          onCheckedChange={() =>
            toggleAvailableProductFn({ productId: product.id })
          }
          disabled={isToggleAvailablingProduct}
        />
      </TableCell>
      <TableCell>
        <Switch
          checked={product.active}
          onCheckedChange={() =>
            toggleActiveProductFn({ productId: product.id })
          }
          disabled={isToggleActivingProduct}
        />
      </TableCell>
    </TableRow>
  )
}
