import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Link } from "react-router"

import { listAddress } from "@/http/list-address"
import { AddressItemSkeleton } from "@/pages/address/address-item-skeleton"

import { AddressItem } from "../address-item"

export function ShippingStep() {
  const { data: addresses, isLoading: isLoadingAddress } = useQuery({
    queryKey: ["addresses"],
    queryFn: listAddress,
  })

  const [addressSelected, setAddressSelected] = useState("")

  return (
    <div className="flex flex-col gap-3">
      {isLoadingAddress && <AddressItemSkeleton />}

      {addresses ? (
        addresses?.map(address => (
          <AddressItem
            key={address.id}
            address={{
              ...address,
              selected: addressSelected
                ? addressSelected === address.id
                : address.main,
            }}
            onClick={() => setAddressSelected(address.id)}
          />
        ))
      ) : (
        <div>
          Você não possui endereço cadastrado
          <Link to="/address">Adicionar endereço</Link>
        </div>
      )}
    </div>
  )
}
