import { HeartIcon } from "lucide-react"

export function EmptyFavorites() {
  return (
    <div className="flex items-center justify-center flex-col gap-4 w-full col-span-full">
      <HeartIcon className="fill-zinc-300 stroke-zinc-300 size-56" />

      <div className="text-muted-foreground text-center">
        <p>
          Restaurantes guardados no seu{" "}
          <HeartIcon className="size-3.5 inline" />
        </p>

        <span className="text-sm text-balance max-w-3xs">
          Toque em <HeartIcon className="size-3.5 inline" /> para salvar e
          encontrar aqui seus restaurantes favoritos
        </span>
      </div>
    </div>
  )
}
