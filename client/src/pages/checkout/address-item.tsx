import { cn } from "@/lib/utils"

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
    selected: boolean
  }
  onClick(): void
}

export function AddressItem({ address, onClick }: AddressItemProps) {
  return (
    <div
      className={cn(
        "flex justify-between gap-3 cursor-default select-none border rounded-md p-3",
        address.selected && "border-primary",
      )}
      onClick={onClick}
    >
      <div className="space-y-2">
        <p className="font-semibold">
          {address.alias
            ? address.alias
            : `${address.street}, ${address.number}`}
        </p>
        <span className="text-sm leading-0">
          {address.alias && `${address.street}, ${address.number}`}
          {address.alias && " - "}
          {address.district}, {address.city}, {address.state}
        </span>
      </div>
    </div>
  )
}
