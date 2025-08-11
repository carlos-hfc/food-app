import { useQuery } from "@tanstack/react-query"
import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form"
import { Link } from "react-router"

import { listAddress } from "@/http/list-address"
import { AddressItemSkeleton } from "@/pages/address/address-item-skeleton"

import { AddressItem } from "../address-item"

interface ShippingStepProps<T extends FieldValues> {
  name: Path<T>
  register: UseFormRegister<T>
  watch: UseFormWatch<T>
  options?: RegisterOptions<T, Path<T>>
}

export function ShippingStep<T extends FieldValues>({
  name,
  register,
  watch,
  options,
}: ShippingStepProps<T>) {
  const { data: addresses, isLoading: isLoadingAddress } = useQuery({
    queryKey: ["addresses"],
    queryFn: listAddress,
  })

  return (
    <div className="flex flex-col gap-3">
      {isLoadingAddress ? (
        <AddressItemSkeleton />
      ) : addresses ? (
        addresses?.map(address => (
          <AddressItem
            key={address.id}
            address={address}
            {...register(name, options)}
            checked={watch(name) === address.id}
            id={address.id}
            value={address.id}
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
