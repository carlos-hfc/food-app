import { ComponentProps, PropsWithChildren } from "react"

import { Label } from "@/components/ui/label"

interface PaymentItemProps extends PropsWithChildren, ComponentProps<"input"> {}

export function PaymentItem({
  children,
  name,
  id,
  ...props
}: PaymentItemProps) {
  return (
    <Label
      htmlFor={id}
      className="rounded-md relative flex items-center gap-3 border p-4 has-checked:border-primary"
    >
      {children}
      <input
        id={id}
        name={name}
        type="radio"
        className="absolute invisible inset-0"
        {...props}
      />
    </Label>
  )
}
