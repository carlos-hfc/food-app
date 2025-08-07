import { ShoppingCartIcon } from "lucide-react"

export function EmptyOrders() {
  return (
    <div className="flex items-center justify-center flex-col gap-4 w-full col-span-full">
      <ShoppingCartIcon className="size-56 text-primary" />

      <div className="text-muted-foreground text-center">
        <p>Seus pedidos realizados</p>

        <span className="text-sm text-balance max-w-3xs">
          Faça um pedido e encontre aqui o seu histórico
        </span>
      </div>
    </div>
  )
}
