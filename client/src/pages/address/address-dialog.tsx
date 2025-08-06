import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Controller, useForm } from "react-hook-form"
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
import { getAddress, GetAddressResponse } from "@/http/get-address"
import { ListAddressResponse } from "@/http/list-address"
import { registerAddress } from "@/http/register-address"
import { updateAddress } from "@/http/update-address"
import { queryClient } from "@/lib/react-query"

import { AddressDialogSkeleton } from "./address-dialog-skeleton"

const addressSchema = z.object({
  alias: z.string().optional(),
  zipCode: z.string(),
  street: z.string(),
  number: z.coerce.number<number>(),
  district: z.string(),
  city: z.string(),
  state: z.string(),
  main: z.boolean().optional(),
  apiLoaded: z.boolean().default(false).optional(),
})

type AddressDialogSchema = z.infer<typeof addressSchema>

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
  isEdit?: boolean
  open?: boolean
  onOpenChange?(open: boolean): void
  addressId?: string
}

export function AddressDialog({
  addressId,
  isEdit,
  onOpenChange,
  open,
}: AddressDialogProps) {
  const { data: address } = useQuery({
    queryKey: ["address", addressId],
    queryFn: () => getAddress({ addressId: String(addressId) }),
    enabled: Boolean(open && addressId),
  })

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressDialogSchema>({
    resolver: zodResolver(addressSchema),
    values: {
      street: address?.street ?? "",
      zipCode: address?.zipCode ?? "",
      alias: address?.alias ?? "",
      number: address?.number ?? 0,
      district: address?.district ?? "",
      city: address?.city ?? "",
      state: address?.state ?? "",
      main: address?.main ?? false,
    },
  })

  const isFilled = watch("apiLoaded")

  async function searchCep() {
    const cep = getValues("zipCode")

    try {
      const response = await axios.get<CepResponse>(
        `https://viacep.com.br/ws/${cep}/json`,
      )

      if (!("erro" in response.data)) {
        setValue("street", response.data.logradouro)
        setValue("district", response.data.bairro)
        setValue("city", response.data.localidade)
        setValue("state", response.data.uf)

        setValue("apiLoaded", true)
      } else {
        toast.error("CEP inválido")
      }
    } catch (error) {
      toast.error("CEP não encontrado")
    }
  }

  function updateAddressOnCache(
    addressId: string,
    data: Omit<GetAddressResponse, "id">,
  ) {
    const currentAddress = queryClient.getQueryData<GetAddressResponse>([
      "address",
      addressId,
    ])

    if (currentAddress) {
      queryClient.setQueryData<GetAddressResponse>(["address", addressId], {
        ...currentAddress,
        ...data,
      })
    }

    const cached = queryClient.getQueryData<ListAddressResponse>(["addresses"])

    if (cached) {
      if (!isEdit) {
        cached.push({
          ...data,
          id: addressId,
        })
      }

      queryClient.setQueryData<ListAddressResponse>(
        ["addresses"],
        cached
          .map(address => {
            if (address.id === addressId) {
              return {
                ...address,
                ...data,
                main: Boolean(data.main ?? address.main),
              }
            }

            return { ...address, main: data.main ? !data.main : address.main }
          })
          .sort((a, b) => (a.main > b.main ? -1 : 1)),
      )
    }
  }

  const { mutateAsync: registerAddressFn } = useMutation({
    mutationFn: registerAddress,
    onSuccess({ addressId }, variables) {
      updateAddressOnCache(addressId, variables)

      reset()
      if (onOpenChange) onOpenChange(false)
    },
  })

  const { mutateAsync: updateAddressFn } = useMutation({
    mutationFn: updateAddress,
    onSuccess(_, { addressId, ...variables }) {
      updateAddressOnCache(addressId, variables)
    },
  })

  async function handleStoreAddress(data: AddressDialogSchema) {
    try {
      if (addressId) {
        const addressClone = structuredClone({
          street: address?.street,
          zipCode: address?.zipCode,
          alias: address?.alias,
          number: address?.number,
          district: address?.district,
          city: address?.city,
          state: address?.state,
          main: address?.main,
        })
        const dataClone = structuredClone({
          street: data?.street,
          zipCode: data?.zipCode,
          alias: data?.alias || null,
          number: data?.number,
          district: data?.district,
          city: data?.city,
          state: data?.state,
          main: data?.main || false,
        })

        if (JSON.stringify(addressClone) !== JSON.stringify(dataClone)) {
          await updateAddressFn({
            addressId,
            street: data?.street,
            zipCode: data?.zipCode,
            alias: data?.alias || null,
            number: data?.number,
            district: data?.district,
            city: data?.city,
            state: data?.state,
            main: data?.main || false,
          })
        }
      } else {
        await registerAddressFn({
          zipCode: data.zipCode,
          street: data.street,
          number: data.number,
          district: data.district,
          city: data.city,
          state: data.state,
          alias: data.alias || null,
          main: data.main || false,
        })
      }

      toast.success(
        addressId
          ? "Endereço atualizado com sucesso!"
          : "Endereço cadastrado com sucesso!",
      )
    } catch (error) {
      toast.error(
        addressId
          ? "Falha ao atualizar o endereço, tente novamente"
          : "Falha ao cadastrar o endereço, tente novamente",
      )
    }
  }

  return (
    <DialogContent
      onEscapeKeyDown={() => reset()}
      onInteractOutside={() => reset()}
      onPointerDownOutside={() => reset()}
    >
      {!address && isEdit ? (
        <AddressDialogSkeleton />
      ) : (
        <>
          <DialogHeader>
            <DialogTitle className="text-xl leading-none">
              {addressId ? "Editar endereço" : "Adicionar endereço"}
            </DialogTitle>
            <DialogDescription>
              {addressId
                ? "Atualize as informações do seu endereço"
                : "Adicione as informações do seu endereço"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(handleStoreAddress)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="alias">Apelido do local</Label>
                <Input
                  id="alias"
                  type="text"
                  {...register("alias")}
                />
                {errors.alias?.message && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.alias.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP</Label>
                <div className="flex gap-1">
                  <Input
                    id="zipCode"
                    type="text"
                    inputMode="numeric"
                    {...register("zipCode")}
                    autoComplete="postal-code"
                  />
                  <Button
                    type="button"
                    className="h-auto"
                    onClick={searchCep}
                  >
                    Buscar
                  </Button>
                </div>
                {errors.zipCode?.message && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.zipCode.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  type="text"
                  {...register("street")}
                  disabled={!isFilled || !!watch("street")}
                  autoComplete="address-line1"
                />
                {errors.street?.message && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.street.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="w-4/5 space-y-2">
                  <Label htmlFor="district">Bairro</Label>
                  <Input
                    id="district"
                    type="text"
                    {...register("district")}
                    disabled={!isFilled || !!watch("district")}
                    autoComplete="address-level3"
                  />
                  {errors.district?.message && (
                    <p className="text-xs text-destructive font-medium">
                      {errors.district.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    type="number"
                    min={1}
                    {...register("number")}
                  />
                  {errors.number?.message && (
                    <p className="text-xs text-destructive font-medium">
                      {errors.number.message}
                    </p>
                  )}
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
                    autoComplete="address-level2"
                  />
                  {errors.city?.message && (
                    <p className="text-xs text-destructive font-medium">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uf">Estado</Label>
                  <Input
                    id="uf"
                    type="text"
                    {...register("state")}
                    disabled={!isFilled || !!watch("state")}
                    autoComplete="address-level1"
                  />
                  {errors.state?.message && (
                    <p className="text-xs text-destructive font-medium">
                      {errors.state.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <Controller
                    name="main"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="main"
                        checked={Boolean(field.value)}
                        onCheckedChange={checked =>
                          field.onChange(Boolean(checked))
                        }
                      />
                    )}
                  />
                  <Label htmlFor="main">Endereço principal</Label>
                </div>
                {errors.main?.message && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.main.message}
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
                disabled={isSubmitting}
              >
                {addressId ? "Salvar" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </form>
        </>
      )}
    </DialogContent>
  )
}
