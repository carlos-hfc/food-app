import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
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
import { registerProduct } from "@/http/register-product"
import { queryClient } from "@/lib/react-query"

const registerProductForm = z.object({
  description: z.string(),
  name: z.string(),
  price: z.coerce.number().min(1),
})

type RegisterProductForm = z.infer<typeof registerProductForm>

interface StoreProductDialogProps {
  onOpenChange(open: boolean): void
}

export function StoreProductDialog({ onOpenChange }: StoreProductDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<RegisterProductForm>({
    resolver: zodResolver(registerProductForm),
  })

  const { mutateAsync: registerProductFn } = useMutation({
    mutationFn: registerProduct,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      })
      reset()
      onOpenChange(false)
    },
  })

  async function handleRegisterProduct(data: RegisterProductForm) {
    try {
      await registerProductFn({
        description: data.description,
        name: data.name,
        price: data.price,
      })

      toast.success("Produto cadastrado com sucesso!")
    } catch (error) {
      toast.error("Falha ao cadastrar o produto, tente novamente")
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Cadastrar produto</DialogTitle>
        <DialogDescription>
          Adicione as informações do seu produto
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleRegisterProduct)}>
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
              variant="ghost"
              onClick={() => reset()}
            >
              Cancelar
            </Button>
          </DialogClose>

          <Button
            type="submit"
            variant="success"
            disabled={isSubmitting}
          >
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
