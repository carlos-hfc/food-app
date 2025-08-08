import { useMutation } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import {
  CheckCircle2Icon,
  Edit2Icon,
  EllipsisVerticalIcon,
  Trash2Icon,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteAddress } from "@/http/delete-address"
import { ListAddressResponse } from "@/http/list-address"
import { selectMainAddress } from "@/http/select-main-address"
import { queryClient } from "@/lib/react-query"
import { cn } from "@/lib/utils"

import { AddressDialog } from "./address-dialog"

interface AddressItemProps {
  address: {
    id: string
    zipCode: string
    street: string
    number: number
    district: string
    city: string
    state: string
    alias: string | null
    main: boolean
  }
}

export function AddressItem({ address }: AddressItemProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const { mutateAsync: selectMainAddressFn } = useMutation({
    mutationFn: selectMainAddress,
    onSuccess(_, { addressId }) {
      const cached = queryClient.getQueryData<ListAddressResponse>([
        "addresses",
      ])

      if (cached) {
        queryClient.setQueryData<ListAddressResponse>(
          ["addresses"],
          cached
            .map(item => {
              if (item.id === addressId) {
                return { ...item, main: true }
              }

              return { ...item, main: false }
            })
            .sort((a, b) => (a.main > b.main ? -1 : 1)),
        )
      }
    },
  })

  const { mutateAsync: deleteAddressFn, isPending: isDeletingAddress } =
    useMutation({
      mutationFn: deleteAddress,
      onSuccess(_, { addressId }) {
        const cached = queryClient.getQueryData<ListAddressResponse>([
          "addresses",
        ])

        if (cached) {
          queryClient.setQueryData<ListAddressResponse>(
            ["addresses"],
            cached.filter(item => item.id !== addressId),
          )
        }
      },
    })

  async function handleSelectMain() {
    try {
      if (address.main) return

      await selectMainAddressFn({
        addressId: address.id,
      })

      toast.success("Endereço salvo como principal com sucesso!")
    } catch (error) {
      toast.error("Falha ao selecionar o endereço principal, tente novamente")
    }
  }

  async function handleDeleteAddress() {
    try {
      await deleteAddressFn({ addressId: address.id })

      toast.success("Endereço excluído com sucesso!")
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.data.message === "Prisma error") {
          toast.error(
            "Você não pode deletar um endereço utilizado em um pedido",
          )

          return
        }
      }
      toast.error("Falha ao excluir endereço, tente novamente")
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 cursor-default select-none border rounded-md p-3",
        address.main && "border-primary",
      )}
    >
      <div className="flex justify-between">
        <p className="font-semibold">
          {address.alias
            ? address.alias
            : `${address.street}, ${address.number}`}
        </p>

        <div className="flex gap-3">
          <CheckCircle2Icon
            aria-label="Endereço principal"
            className={cn(
              address.main
                ? "size-[18px] fill-primary stroke-background pointer-events-none"
                : "size-4 text-primary",
            )}
            onClick={handleSelectMain}
          />

          <Dialog
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
          >
            <DropdownMenu>
              <DropdownMenuTrigger
                className="h-min"
                aria-label="Abrir menu"
              >
                <EllipsisVerticalIcon className="size-4 text-primary" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DialogTrigger asChild>
                  <DropdownMenuItem asChild>
                    <button className="w-full">
                      <Edit2Icon />
                      Editar
                    </button>
                  </DropdownMenuItem>
                </DialogTrigger>

                <DropdownMenuItem asChild>
                  <button
                    className="w-full"
                    disabled={isDeletingAddress}
                    onClick={handleDeleteAddress}
                  >
                    <Trash2Icon />
                    Excluir
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <AddressDialog
              open={isDetailsOpen}
              addressId={address.id}
              isEdit
            />
          </Dialog>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-sm leading-0">
          {address.alias && `${address.street}, ${address.number}`}
          {address.alias && " - "}
          {address.district}, {address.city}, {address.state}
        </span>
      </div>
    </div>
  )
}
