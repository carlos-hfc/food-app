import { ComponentProps } from "react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface AddressItemProps extends ComponentProps<"input"> {
  address: {
    id: string
    zipCode: string
    street: string
    number: number
    district: string
    city: string
    state: string
    alias: string | null
  }
}

export function AddressItem({ address, name, id, ...props }: AddressItemProps) {
  return (
    <Label
      htmlFor={id}
      className={cn(
        "flex justify-between gap-3 cursor-default select-none border rounded-md p-3 relative has-checked:border-primary leading-normal",
      )}
    >
      <input
        id={id}
        name={name}
        type="radio"
        className="absolute invisible inset-0"
        {...props}
      />
      <div className="space-y-2">
        <p className="font-semibold">
          {address.alias
            ? address.alias
            : `${address.street}, ${address.number}`}
        </p>
        <span className="text-sm">
          {address.alias && `${address.street}, ${address.number}`}
          {address.alias && " - "}
          {address.district}, {address.city}, {address.state}
        </span>
      </div>
    </Label>
  )
}
