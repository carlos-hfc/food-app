export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <img
        src="/cart.svg"
        alt="Carrinho vazio"
        className="size-32"
      />

      <div className="text-center space-y-2">
        <p className="text-lg font-bold">Sua sacola está vazia</p>
        <span className="font-medium text-muted-foreground">
          Adicione itens
        </span>
      </div>
    </div>
  )
}
