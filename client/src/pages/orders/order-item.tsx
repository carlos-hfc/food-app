import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronRightIcon, InfoIcon, StarIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart"
import { getMenu } from "@/http/get-menu"
import { getRestarauntInfo } from "@/http/get-restaurant-info"
import { cn } from "@/lib/utils"

import { OrderStatus, OrderStatusType } from "./order-status"

interface OrderItemProps {
  order: {
    id: string
    status: string
    payment: string
    date: string
    preparedAt: string | null
    routedAt: string | null
    deliveredAt: string | null
    canceledAt: string | null
    rate: number | null
    restaurant: {
      id: string
      name: string
      image: string | null
    }
    products: {
      id: string
      quantity: number
      name: string
      image: string | null
      price: number
    }[]
  }
}

export function OrderItem({ order }: OrderItemProps) {
  const { data: result } = useQuery({
    queryKey: ["restaurant-info", order.restaurant.id],
    queryFn: () => getRestarauntInfo({ restaurantId: order.restaurant.id }),
  })

  const { data: menu } = useQuery({
    queryKey: ["restaurant-menu", order.restaurant.id],
    queryFn: () => getMenu({ restaurantId: order.restaurant.id }),
  })

  const { addToCart, cleanCart, items } = useCart()

  const orderDate = format(new Date(order.date), "EEEEEE dd MMMM yyyy", {
    locale: ptBR,
  })

  function handleAddToCart() {
    const productIdsOnMenu = menu!.map(item => item.id)
    const orderProductsOnMenu = order.products.filter(item =>
      productIdsOnMenu.includes(item.id),
    )

    if (order.products.length !== orderProductsOnMenu.length) {
      toast.error("Itens indisponíveis no catálogo da loja")

      return
    }

    if (!result?.restaurant.isOpen) {
      toast.error(
        `Este restaurante abre hoje às ${result?.restaurant.openingAt}`,
        {
          description:
            "Mas você pode olhar o cardápio à vontade e voltar quando ele estiver aberto.",
          action: {
            label: "Ok, entendi",
            onClick: () => toast.dismiss(),
          },
        },
      )

      return
    }

    if (
      items.length > 0 &&
      items.find(item => item.restaurantId !== order.restaurant.id)
    ) {
      toast(
        <div className="space-y-2">
          <div className="flex gap-1">
            <InfoIcon className="size-4" />

            <div>
              <p className="text-sm font-bold leading-none">
                Você só pode adicionar itens de uma loja por vez
              </p>
              <span className="text-xs font-semibold leading-none">
                Deseja esvaziar a sacola e adicionar este item?
              </span>
            </div>
          </div>

          <div className="space-x-2">
            <Button
              variant="secondary"
              size="sm"
              className="h-6! text-xs!"
              onClick={() => toast.dismiss()}
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              size="sm"
              className="h-6! text-xs!"
              onClick={() => {
                cleanCart()
                for (const item of order.products) {
                  addToCart({
                    item: {
                      ...item,
                      restaurantId: order.restaurant.id,
                    },
                    restaurant: order?.restaurant,
                  })
                }
                toast.dismiss()
              }}
            >
              Esvaziar sacola e adicionar
            </Button>
          </div>
        </div>,
        {
          classNames: {
            toast: "bg-[var(--info-bg)]! text-[var(--info-text)]!",
          },
        },
      )

      return
    }

    for (const item of order.products) {
      addToCart({
        item: {
          ...item,
          restaurantId: order.restaurant.id,
        },
        restaurant: order?.restaurant,
      })
    }

    toast.success("Produto adicionado à sacola")
  }

  return (
    <div className="space-y-2">
      <time
        dateTime={order.date}
        title={orderDate}
        className="text-muted-foreground text-xs md:text-sm block capitalize"
      >
        {orderDate}
      </time>

      <div className="rounded-md shadow-md p-3 md:px-6 divide-y space-y-3 *:pb-3">
        <div className="flex items-center gap-2 md:gap-4">
          <img
            src={order.restaurant.image ?? "/hamburger.webp"}
            alt={order.restaurant.name}
            className="rounded-full object-cover size-16 md:size-24"
          />

          <span className="text-sm md:text-base font-semibold">
            {order.restaurant.name}
          </span>

          <ChevronRightIcon
            className="size-4 md:size-6 ml-auto"
            aria-label="Ver pedido"
          />
        </div>

        <div className="text-xs md:text-sm space-y-1">
          <OrderStatus status={order.status as OrderStatusType} />

          <div className="flex items-center gap-1">
            <span className="rounded-sm bg-accent px-1">
              {order.products.at(0)?.quantity}
            </span>
            <p className="text-muted-foreground">
              {order.products.at(0)?.name}
            </p>
          </div>

          {order.products.length > 1 && (
            <span className="font-semibold text-muted-foreground">
              mais {order.products.length - 1} item(s)
            </span>
          )}
        </div>

        {order.rate && (
          <div className="flex text-sm justify-between">
            <span className="text-muted-foreground">Avaliação</span>

            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  className={cn(
                    "size-4 fill-foreground stroke-foreground",
                    Number(order.rate) <= i &&
                      "fill-foreground/50 stroke-foreground/40",
                  )}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pb-0!">
          <Button
            variant="link"
            size="sm"
            className="text-sm! flex-1"
          >
            Detalhes
          </Button>
          <div className="h-auto w-px bg-border" />
          <Button
            variant="link"
            size="sm"
            className="text-sm! flex-1"
            onClick={handleAddToCart}
          >
            Adicionar à sacola
          </Button>
        </div>
      </div>
    </div>
  )
}
