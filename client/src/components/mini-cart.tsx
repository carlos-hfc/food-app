import { ShoppingBagIcon } from "lucide-react"

export function MiniCart() {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <ShoppingBagIcon className="size-6 shrink-0 text-primary" />

      <div className="text-muted-foreground text-xs">
        <span className="block">R$ 0,00</span>
        <span>0 itens</span>
      </div>
    </div>
  )
}
