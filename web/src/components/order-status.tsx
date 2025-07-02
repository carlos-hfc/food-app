import clsx from "clsx"

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
  CANCELED: "Cancelado",
  PREPARING: "Em preparo",
  PENDING: "Pendente",
  ROUTING: "Em entrega",
  DELIVERED: "Entregue",
}

export function OrderStatus({ status }: OrderStatusProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        data-testid="badge"
        className={clsx(
          "size-2 rounded-full",
          status === "CANCELED" && "bg-rose-500",
          status === "PENDING" && "bg-slate-400",
          status === "DELIVERED" && "bg-emerald-500",
          ["PREPARING", "ROUTING"].includes(status) && "bg-amber-500",
        )}
      />
      <span className="font-medium text-muted-foreground">
        {orderStatusMap[status]}
      </span>
    </div>
  )
}
