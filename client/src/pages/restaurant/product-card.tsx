interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    image: string | null
  }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="flex flex-col border rounded-md space-y-3 px-3 py-4 hover:shadow-2xs transition-all">
      <div className="flex justify-between gap-4">
        <div className="flex flex-col gap-3">
          <p className="font-bold md:text-lg line-clamp-2 leading-snug">
            {product.name}
          </p>
          <span className="text-sm text-muted-foreground leading-tight line-clamp-3">
            {product.description}
          </span>
        </div>

        <img
          src={product.image ?? "/hamburger.webp"}
          alt={product.name}
          className="max-w-24 max-h-24 md:max-w-32 md:max-h-32 lg:max-w-36 lg:max-h-36 self-center shrink-0 object-cover rounded-md"
        />
      </div>

      <span className="text-green-600 font-semibold mt-auto">
        {product.price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </span>
    </div>
  )
}
