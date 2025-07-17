import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Dropzone } from "@/components/dropzone"
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
import { addImageProduct } from "@/http/add-image-product"
import {
  getProductDetails,
  GetProductDetailsResponse,
} from "@/http/get-product-details"
import { GetProductsResponse } from "@/http/get-products"
import { registerProduct } from "@/http/register-product"
import { updateProduct } from "@/http/update-product"
import { queryClient } from "@/lib/react-query"

import { ProductDetailsSkeleton } from "./product-details-skeleton"

interface ProductDialogProps {
  isEdit?: boolean
  open?: boolean
  onOpenChange?(open: boolean): void
  productId?: string
}

const productDialogSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
  price: z.coerce.number().min(1),
  file: z.custom<FileList>().optional(),
})

type ProductDialogSchema = z.infer<typeof productDialogSchema>

export function ProductDialog({
  open,
  onOpenChange,
  productId,
  isEdit,
}: ProductDialogProps) {
  const { data: product } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductDetails({ productId: String(productId) }),
    enabled: Boolean(open && productId),
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ProductDialogSchema>({
    resolver: zodResolver(productDialogSchema),
    values: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 1,
    },
  })

  function updateProductOnCache(
    productId: string,
    data: Partial<GetProductDetailsResponse>,
  ) {
    const cached = queryClient.getQueryData(["product", productId])

    if (cached) {
      queryClient.setQueryData(["product", productId], {
        ...cached,
        ...data,
      })
    }

    const productsListCache = queryClient.getQueriesData<GetProductsResponse>({
      queryKey: ["products"],
    })

    productsListCache.forEach(([cacheKey, cacheData]) => {
      if (!cacheData) return

      queryClient.setQueryData<GetProductsResponse>(cacheKey, {
        ...cacheData,
        products: cacheData.products.map(product => {
          if (product.id === productId) {
            return { ...product, ...data }
          }

          return product
        }),
      })
    })
  }

  const { mutateAsync: registerProductFn } = useMutation({
    mutationFn: registerProduct,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      })
      reset()
      if (onOpenChange) onOpenChange(false)
    },
  })

  const { mutateAsync: updateProductFn } = useMutation({
    mutationFn: updateProduct,
    onSuccess(_, { productId, ...variables }) {
      updateProductOnCache(productId, variables)
    },
  })

  const { mutateAsync: addImageProductFn } = useMutation({
    mutationFn: addImageProduct,
    onSuccess({ image }, { productId }) {
      updateProductOnCache(productId, { image })
    },
  })

  async function handleStoreProduct(data: ProductDialogSchema) {
    try {
      if (productId) {
        if (data.file?.length) {
          await addImageProductFn({
            file: data.file[0],
            productId,
          })
        }

        const productClone = structuredClone({
          name: product?.name,
          description: product?.description,
          price: product?.price,
        })
        const dataClone = structuredClone({
          name: data?.name,
          description: data?.description,
          price: data?.price,
        })

        if (JSON.stringify(productClone) !== JSON.stringify(dataClone)) {
          await updateProductFn({
            productId,
            name: data.name,
            description: data.description,
            price: data.price,
          })
        }
      } else {
        await registerProductFn({
          name: data.name,
          description: data.description,
          price: data.price,
        })
      }

      toast.success(
        productId
          ? "Produto atualizado com sucesso!"
          : "Produto cadastrado com sucesso!",
      )
    } catch (error) {
      toast.error(
        productId
          ? "Falha ao atualizar o produto, tente novamente"
          : "Falha ao cadastrar o produto, tente novamente",
      )
    }
  }

  return (
    <DialogContent
      onEscapeKeyDown={() => reset()}
      onInteractOutside={() => reset()}
      onPointerDownOutside={() => reset()}
    >
      {!product && isEdit ? (
        <ProductDetailsSkeleton />
      ) : (
        <>
          <DialogHeader>
            <DialogTitle>
              {productId ? `Produto: ${productId}` : "Cadastrar produto"}
            </DialogTitle>
            <DialogDescription>
              {productId
                ? "Atualize as informações do seu produto visíveis ao seu cliente"
                : "Adicione as informações do seu produto visíveis ao seu cliente"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(handleStoreProduct)}>
            <div className="space-y-4 py-4">
              {productId && (
                <div className="space-y-2">
                  <Dropzone
                    name="file"
                    register={register}
                    watch={watch}
                    image={product?.image}
                  />
                </div>
              )}

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
                  step={0.1}
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
                  size="xs"
                  variant="ghost"
                  onClick={() => reset()}
                >
                  Cancelar
                </Button>
              </DialogClose>

              <Button
                type="submit"
                size="xs"
                variant="success"
                disabled={isSubmitting}
              >
                {productId ? "Salvar" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </form>
        </>
      )}
    </DialogContent>
  )
}
