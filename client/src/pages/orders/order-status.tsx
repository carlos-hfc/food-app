import {
  CheckCircle2Icon,
  CircleDashedIcon,
  CircleIcon,
  XCircleIcon,
} from "lucide-react"
import { JSX } from "react"

export type OrderStatusType =
  | "PENDING"
  | "PREPARING"
  | "ROUTING"
  | "DELIVERED"
  | "CANCELED"

interface OrderStatusProps {
  status: OrderStatusType
}

const orderStatusMap: Record<OrderStatusType, string> = {
  CANCELED: "Pedido cancelado",
  DELIVERED: "Pedido concluído",
  PENDING: "Aguardando confirmação do restaurante",
  PREPARING: "Pedido em preparo",
  ROUTING: "Pedido saiu para entrega",
}

const orderStatusIconMap: Record<OrderStatusType, JSX.Element> = {
  CANCELED: (
    <XCircleIcon className="size-4 md:size-5 fill-foreground stroke-background" />
  ),
  DELIVERED: (
    <CheckCircle2Icon className="size-4 md:size-5 fill-emerald-600 stroke-background" />
  ),
  PENDING: <CircleDashedIcon className="size-4 md:size-5 text-amber-500" />,
  PREPARING: (
    <CircleIcon className="size-4 md:size-5 fill-amber-500 stroke-background animate-pulse" />
  ),
  ROUTING: (
    <CircleIcon className="size-4 md:size-5 fill-amber-500 stroke-background animate-pulse" />
  ),
}

export function OrderStatus({ status }: OrderStatusProps) {
  return (
    <div className="flex items-center gap-1">
      {orderStatusIconMap[status]}
      <span className="text-muted-foreground">{orderStatusMap[status]}</span>
    </div>
  )
}
