import { useQuery } from "@tanstack/react-query"

import { Seo } from "@/components/seo"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { listAddress } from "@/http/list-address"

import { AddressDialog } from "./address-dialog"
import { AddressItem } from "./address-item"
import { AddressItemSkeleton } from "./address-item-skeleton"

export function Address() {
  const { data: addresses, isLoading: isLoadingAddress } = useQuery({
    queryKey: ["addresses"],
    queryFn: listAddress,
  })

  return (
    <div className="flex flex-col gap-6">
      <Seo title="Endereços" />

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-xl lg:text-2xl block font-bold">
            Meus endereços
          </span>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">Adicionar endereço</Button>
            </DialogTrigger>

            <AddressDialog />
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoadingAddress && <AddressItemSkeleton />}

          {addresses?.map(address => (
            <AddressItem
              key={address.id}
              address={address}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
