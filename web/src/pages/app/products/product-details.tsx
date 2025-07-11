import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getProductDetails } from "@/http/get-product-details"
import { GetProductsResponse } from "@/http/get-products"
import { updateProduct } from "@/http/update-product"
import { queryClient } from "@/lib/react-query"

import { ProductDetailsSkeleton } from "./product-details-skeleton"

interface ProductDetailsProps {
  productId: string
  open: boolean
}

const updateProductForm = z.object({
  name: z.string(),
  description: z.string(),
  price: z.coerce.number(),
})

type UpdateProductForm = z.infer<typeof updateProductForm>

export function ProductDetails({ open, productId }: ProductDetailsProps) {
  const { data: product } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductDetails({ productId }),
    enabled: open,
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<UpdateProductForm>({
    resolver: zodResolver(updateProductForm),
    values: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
    },
  })

  const { mutateAsync: updateProductFn } = useMutation({
    mutationFn: updateProduct,
    onSuccess(_, variables) {
      const cached = queryClient.getQueryData(["product", productId])

      if (cached) {
        queryClient.setQueryData(["product", productId], {
          ...cached,
          ...variables,
        })
      }

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
              return { ...product, ...variables }
            }

            return product
          }),
        })
      })
    },
  })

  async function handleUpdateProduct(data: UpdateProductForm) {
    try {
      await updateProductFn({
        productId,
        name: data.name,
        price: data.price,
        description: data.description,
      })

      toast.success("Produto atualizado com sucesso!")
    } catch (error) {
      toast.error("Falha ao atualizar o product, tente novamente")
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Produto: {productId}</DialogTitle>
        <DialogDescription>
          Atualize as informações do produto visíveis ao seu cliente
        </DialogDescription>
      </DialogHeader>

      {product ? (
        <form onSubmit={handleSubmit(handleUpdateProduct)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                type="text"
                {...register("name")}
              />
              {errors.name?.message && (
                <p className="text-xs text-destructive font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                {...register("description")}
              />
              {errors.description?.message && (
                <p className="text-xs text-destructive font-medium">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço</Label>
              <Input
                id="price"
                type="number"
                {...register("price")}
              />
              {errors.price?.message && (
                <p className="text-xs text-destructive font-medium">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant={"ghost"}
              >
                Cancelar
              </Button>
            </DialogClose>

            <Button
              type="submit"
              variant={"success"}
              disabled={isSubmitting}
            >
              Salvar
            </Button>
          </DialogFooter>
        </form>
      ) : (
        <ProductDetailsSkeleton />
      )}
    </DialogContent>
  )
}
