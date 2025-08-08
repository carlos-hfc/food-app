import { MinusIcon, PlusIcon } from "lucide-react"
import { ComponentProps } from "react"

import { cn } from "@/lib/utils"

import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface InputNumberProps extends ComponentProps<"input"> {
  onDecrement(): void
  onIncrement(): void
  containerClassName?: string
}

export function InputNumber({
  className,
  onDecrement,
  onIncrement,
  containerClassName,
  ...props
}: InputNumberProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-md border w-fit",
        containerClassName,
      )}
    >
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={onDecrement}
        aria-label="Diminuir quantidade"
      >
        <MinusIcon className="size-4" />
      </Button>

      <Input
        type="number"
        className={cn(
          "[&::-webkit-inner-spin-button]:hidden ring-0! text-center w-8 p-0 border-none shadow-none text-foreground font-bold",
          className,
        )}
        min={0}
        readOnly
        {...props}
      />

      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={onIncrement}
        aria-label="Aumentar quantidade"
      >
        <PlusIcon className="size-4" />
      </Button>
    </div>
  )
}
