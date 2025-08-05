import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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

const addressSchema = z.object({
  alias: z.string().optional(),
  zipCode: z.string(),
  address: z.string(),
  number: z.string().optional(),
  district: z.string(),
  city: z.string(),
  uf: z.string(),
  main: z.boolean().optional(),
  apiLoaded: z.boolean().default(false).optional(),
})

type AddressSchema = z.infer<typeof addressSchema>

type CepResponse =
  | {
      cep: string
      logradouro: string
      bairro: string
      localidade: string
      uf: string
    }
  | { erro: boolean }

interface AddressDialogProps {
  addressId?: string
}

export function AddressDialog() {
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
  })

  const isFilled = watch("apiLoaded")

  async function searchCep() {
    const cep = getValues("zipCode")

    try {
      const response = await axios.get<CepResponse>(
        `https://viacep.com.br/ws/${cep}/json`,
      )

      if (!("erro" in response.data)) {
        setValue("address", response.data.logradouro)
        setValue("district", response.data.bairro)
        setValue("city", response.data.localidade)
        setValue("uf", response.data.uf)

        setValue("apiLoaded", true)
      } else {
        toast.error("CEP inválido")
      }
    } catch (error) {
      toast.error("CEP não encontrado")
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-xl leading-none">
          Adicionar endereço
        </DialogTitle>
        <DialogDescription>Lorem ipsum dolor sit</DialogDescription>
      </DialogHeader>

      <form>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="alias">Apelido do local</Label>
            <Input
              id="alias"
              type="text"
              {...register("alias")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">CEP</Label>
            <div className="flex gap-1">
              <Input
                id="zipCode"
                type="text"
                inputMode="numeric"
                {...register("zipCode")}
              />
              <Button
                type="button"
                className="h-auto"
                onClick={searchCep}
              >
                Buscar
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              type="text"
              {...register("address")}
              disabled={!isFilled || !!watch("address")}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="w-4/5 space-y-2">
              <Label htmlFor="district">Bairro</Label>
              <Input
                id="district"
                type="text"
                {...register("district")}
                disabled={!isFilled || !!watch("district")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input
                id="number"
                type="number"
                min={1}
                {...register("number")}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="w-4/5 space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                type="text"
                {...register("city")}
                disabled={!isFilled || !!watch("city")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="uf">Estado</Label>
              <Input
                id="uf"
                type="text"
                {...register("uf")}
                disabled={!isFilled || !!watch("uf")}
              />
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <Checkbox
              id="main"
              {...register("main")}
            />
            <Label htmlFor="main">Endereço principal</Label>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
            >
              Cancelar
            </Button>
          </DialogClose>

          <Button
            type="submit"
            disabled={isSubmitting}
          >
            Cadastrar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
