import { useCart } from "@/contexts/cart"

export function useCheckout() {
  const { items, restaurant } = useCart()

  return items.reduce(
    (prevValue, currentItem) => {
      prevValue.subtotal += currentItem.price * currentItem.quantity
      prevValue.total = prevValue.subtotal + prevValue.tax

      return prevValue
    },
    {
      subtotal: 0,
      tax: restaurant?.tax ?? 0,
      total: 0,
    },
  )
}
