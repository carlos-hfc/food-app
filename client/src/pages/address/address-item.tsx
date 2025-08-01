import { useMutation } from "@tanstack/react-query"
import { CheckCircle2Icon, EllipsisVerticalIcon } from "lucide-react"
import { toast } from "sonner"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ListAddressResponse } from "@/http/list-address"
import { selectMainAddress } from "@/http/select-main-address"
import { queryClient } from "@/lib/react-query"
import { cn } from "@/lib/utils"

interface AddressItemProps {
  address: {
    id: string
    zipCode: string
    address: string
    number: number | null
    district: string
    city: string
    uf: string
    alias: string | null
    main: boolean
    clientId: string
  }
}

export function AddressItem({ address }: AddressItemProps) {
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

  return (
    <div
      className={cn(
        "flex justify-between gap-3 cursor-default select-none border rounded-md p-3",
        address.main && "border-primary",
      )}
    >
      <div className="space-y-2">
        <p className="font-semibold">
          {address.alias ? address.alias : address.address}
        </p>
        <span className="text-sm leading-0">
          {address.alias ? address.address : ""}
          {address.number && `, ${address.number}`}
          {address.alias && address.number && " - "}
          {address.district}, {address.city}, {address.uf}
        </span>
      </div>

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

        <DropdownMenu>
          <DropdownMenuTrigger
            className="h-min"
            aria-label="Abrir menu"
          >
            <EllipsisVerticalIcon className="size-4 text-primary" />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem>Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
