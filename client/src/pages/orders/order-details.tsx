import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { InfoIcon, MapPinIcon, StarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/contexts/cart"
import { evaluateOrder } from "@/http/evaluate-order"
import { getMenu } from "@/http/get-menu"
import { getOrder, GetOrderResponse } from "@/http/get-order"
import { getRestarauntInfo } from "@/http/get-restaurant-info"
import { ListOrdersResponse } from "@/http/list-orders"
import { formatPriceNumber } from "@/lib/format-price-number"
import { queryClient } from "@/lib/react-query"
import { cn } from "@/lib/utils"

import { OrderDetailsSkeleton } from "./order-details-skeleton"
import { OrderStatus } from "./order-status"

interface OrderDetailsProps {
  open: boolean
  orderId: string
}

const evaluateOrderSchema = z.object({
  rate: z.coerce.number<number>().max(5),
  comment: z.string().optional(),
})

type EvaluateOrderSchema = z.infer<typeof evaluateOrderSchema>

export function OrderDetails({ open, orderId }: OrderDetailsProps) {
  const { data: order } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrder({ orderId }),
    enabled: open,
  })

  const { data: result } = useQuery({
    queryKey: ["restaurant-info", order?.restaurant.id],
    queryFn: () => getRestarauntInfo({ restaurantId: order!.restaurant.id }),
    enabled: open,
  })

  const { data: menu } = useQuery({
    queryKey: ["restaurant-menu", order?.restaurant.id],
    queryFn: () => getMenu({ restaurantId: order!.restaurant.id! }),
    enabled: open,
  })

  const { addToCart, cleanCart, items } = useCart()

  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<EvaluateOrderSchema>({
    resolver: zodResolver(evaluateOrderSchema),
  })

  function handleAddToCart() {
    const productIdsOnMenu = menu!.map(item => item.id)
    const orderProductsOnMenu = order?.products.filter(item =>
      productIdsOnMenu.includes(item.id),
    )

    if (order?.products.length !== orderProductsOnMenu?.length) {
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
      items.find(item => item.restaurantId !== order?.restaurant.id)
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
                for (const item of order!.products) {
                  addToCart({
                    item: {
                      ...item,
                      restaurantId: order!.restaurant.id,
                    },
                    restaurant: order?.restaurant ?? null,
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

    for (const item of order!.products) {
      addToCart({
        item: {
          ...item,
          restaurantId: order!.restaurant.id,
        },
        restaurant: order?.restaurant ?? null,
      })
    }

    toast.success("Produto adicionado à sacola")
  }

  const { mutateAsync: evaluateOrderFn } = useMutation({
    mutationFn: evaluateOrder,
    onSuccess(_, { orderId, rate }) {
      const cached = queryClient.getQueryData<GetOrderResponse>([
        "order",
        orderId,
      ])

      if (cached) {
        queryClient.setQueryData<GetOrderResponse>(["order", orderId], {
          ...cached,
          rate,
        })
      }

      const ordersListCached = queryClient.getQueryData<ListOrdersResponse>([
        "orders",
      ])

      if (ordersListCached) {
        queryClient.setQueryData<ListOrdersResponse>(
          ["orders"],
          ordersListCached.map(item => {
            if (item.id === orderId) {
              return { ...item, rate }
            }

            return item
          }),
        )
      }
    },
  })

  async function handleEvaluateOrder(data: EvaluateOrderSchema) {
    try {
      await evaluateOrderFn({
        orderId,
        rate: data.rate,
        comment: data.comment || undefined,
      })

      toast.success("Avaliação realizada com sucesso!")
    } catch (error) {
      toast.error("Falha ao avaliar pedido, tente novamente")
    }
  }

  return (
    <DialogContent className="max-h-10/12 overflow-y-auto">
      {order ? (
        <DialogHeader>
          <DialogTitle>{order.restaurant.name}</DialogTitle>
          <DialogDescription>
            Pedido {orderId} -{" "}
            {format(new Date(order.date), "dd/MM 'às' HH:mm")}
          </DialogDescription>
        </DialogHeader>
      ) : (
        <DialogHeader>
          <DialogTitle>
            <Skeleton className="w-52 h-6" />
          </DialogTitle>
          <DialogDescription>
            <Skeleton className="w-full h-4" />
          </DialogDescription>
        </DialogHeader>
      )}

      {order ? (
        <div className="space-y-6">
          {order.status === "DELIVERED" && (
            <div className="bg-accent border flex items-center justify-center gap-1 p-2 text-muted-foreground">
              <OrderStatus status={order.status} />
              às {format(String(order?.deliveredAt), "HH:mm")}
            </div>
          )}

          {order.status === "CANCELED" && (
            <div className="bg-accent border flex items-center justify-center gap-1 p-2 text-muted-foreground">
              <OrderStatus status={order.status} />
              às {format(String(order?.canceledAt), "HH:mm")}
            </div>
          )}

          {order.status === "PENDING" && (
            <div className="bg-accent border flex items-center justify-center gap-1 p-2 text-muted-foreground">
              <OrderStatus status={order.status} />
              às {format(String(order?.date), "HH:mm")}
            </div>
          )}

          {order.status === "PREPARING" && (
            <div className="bg-accent border flex items-center justify-center gap-1 p-2 text-muted-foreground">
              <OrderStatus status={order.status} />
              às {format(String(order?.preparedAt), "HH:mm")}
            </div>
          )}

          {order.status === "ROUTING" && (
            <div className="bg-accent border flex items-center justify-center gap-1 p-2 text-muted-foreground">
              <OrderStatus status={order.status} />
              às {format(String(order?.routedAt), "HH:mm")}
            </div>
          )}

          <div className="space-y-3">
            {order.products.map(product => (
              <div
                key={product.id}
                className="flex items-center gap-2 text-sm"
              >
                <div className="relative">
                  <img
                    src={product.image ?? "/hamburger.webp"}
                    alt={product.name}
                    className="max-w-24"
                  />

                  <span className="absolute bottom-0 right-2 shadow-md bg-primary rounded-full size-4 text-xs text-center text-background font-semibold">
                    {product.quantity}
                  </span>
                </div>
                <p className="uppercase">{product.name}</p>
                <span className="ml-auto">
                  {formatPriceNumber(product.price)}
                </span>
              </div>
            ))}
          </div>

          <div className="text-sm space-y-2">
            <p className="text-base font-bold">Resumo de valores</p>

            <div className="flex items-center justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>
                {formatPriceNumber(order.total - order.restaurant.tax)}
              </span>
            </div>

            <div className="flex items-center justify-between text-muted-foreground">
              <span>Taxa de entrega</span>
              <span>
                {order.restaurant.tax !== 0
                  ? formatPriceNumber(order.restaurant.tax)
                  : "Grátis"}
              </span>
            </div>

            <div className="flex items-center justify-between font-bold">
              <span>Total</span>
              <span>{formatPriceNumber(order.total)}</span>
            </div>
          </div>

          {order.status === "DELIVERED" && (
            <Button
              variant="link"
              className="w-full text-sm! font-semibold"
              onClick={handleAddToCart}
            >
              Adicionar à sacola
            </Button>
          )}

          <div className="text-sm space-y-2">
            <p className="text-base font-bold">Pagamento</p>
            <p>{order.payment}</p>
          </div>

          <div className="text-sm space-y-2">
            <p className="text-base font-bold">Endereço de entrega</p>

            <div className="flex items-center gap-3">
              <MapPinIcon className="size-5" />

              <div className="leading-snug">
                <p>
                  {order.address.street}, {order.address.number}
                </p>
                <p>
                  {order.address.district}, {order.address.city} -{" "}
                  {order.address.state}
                </p>
              </div>
            </div>
          </div>

          {order.status === "DELIVERED" && (
            <div className="space-y-1">
              <p className="text-base font-bold">
                {order.rate ? "Sua avaliação" : "Avalie seu pedido"}
              </p>

              {order.rate ? (
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      aria-label={`Pedido avaliado em ${order.rate}`}
                      className={cn(
                        "size-4 fill-foreground stroke-foreground",
                        Number(order.rate) <= i &&
                          "fill-foreground/50 stroke-foreground/40",
                      )}
                    />
                  ))}
                </div>
              ) : (
                <form
                  className="space-y-4"
                  onSubmit={handleSubmit(handleEvaluateOrder)}
                >
                  <div className="flex flex-row-reverse w-fit">
                    {Array.from({ length: 5 }, (_, i) => i + 1)
                      .map(value => (
                        <Label
                          key={value}
                          htmlFor={`rate-${value}`}
                          className={cn(
                            "peer peer-hover:[&>svg]:fill-foreground hover:[&>svg]:fill-foreground has-checked:[&>svg]:fill-foreground relative",
                            watch("rate"),
                          )}
                        >
                          <span className="sr-only">Avalie em {value}</span>
                          <Input
                            id={`rate-${value}`}
                            type="radio"
                            className="absolute inset-0 invisible"
                            {...register("rate")}
                            value={value}
                          />
                          <StarIcon
                            aria-label={`Avalie em ${value}`}
                            className={cn(
                              "size-4 shrink-0 fill-foreground/50 stroke-foreground/40 hover:fill-foreground",
                              value <= watch("rate") && "fill-foreground",
                            )}
                          />
                        </Label>
                      ))
                      .reverse()}
                  </div>

                  {watch("rate") && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="comment">Comentário</Label>
                        <Textarea
                          id="comment"
                          {...register("comment")}
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => reset()}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          size="sm"
                          disabled={isSubmitting}
                        >
                          Avaliar
                        </Button>
                      </div>
                    </>
                  )}

                  {JSON.stringify(errors)}
                </form>
              )}
            </div>
          )}
        </div>
      ) : (
        <OrderDetailsSkeleton />
      )}
    </DialogContent>
  )
}
