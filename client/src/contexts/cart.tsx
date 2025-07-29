import { InfoIcon } from "lucide-react"
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  addItemToCart,
  AddItemToCartParams,
  CartItem,
  cleanCartItems,
  removeItemToCart,
  RestaurantItem,
} from "@/reducers/cart/actions"
import { cartReducer } from "@/reducers/cart/reducer"

interface CartContextProps {
  items: CartItem[]
  numberOfItems: number
  restaurant: RestaurantItem
  addToCart(data: AddItemToCartParams): void
  removeToCart(id: string): void
  cleanCart(): void
}

export const CartContext = createContext({} as CartContextProps)

export const useCart = () => useContext(CartContext)

export function CartProvider({ children }: PropsWithChildren) {
  const [cartState, dispatch] = useReducer(
    cartReducer,
    {
      items: [],
      numberOfItems: 0,
      restaurant: null,
    },
    initialState => {
      // const cartItemsStorage = localStorage.getItem("@cart_items")

      // if (cartItemsStorage) {
      //   const parsedCartItems = JSON.parse(cartItemsStorage)

      //   return parsedCartItems
      // }

      return initialState
    },
  )

  const { items, numberOfItems, restaurant } = cartState

  // useEffect(() => {
  //   const cartItemsJSON = JSON.stringify(cartState)

  //   localStorage.setItem("@cart_items", cartItemsJSON)
  // }, [cartState])

  const addToCart = useCallback(
    (data: AddItemToCartParams) => {
      if (
        items.length > 0 &&
        items.find(item => item.restaurantId !== data.item.restaurantId)
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
                  dispatch(cleanCartItems())
                  dispatch(addItemToCart(data))
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

      dispatch(addItemToCart(data))

      toast.success("Produto adicionado à sacola")
    },
    [items],
  )

  const removeToCart = useCallback((id: string) => {
    dispatch(removeItemToCart(id))
  }, [])

  const cleanCart = useCallback(() => {
    dispatch(cleanCartItems())
  }, [])

  const value = useMemo(
    () => ({
      items,
      numberOfItems,
      restaurant,
      addToCart,
      removeToCart,
      cleanCart,
    }),
    [items, numberOfItems, restaurant, addToCart, removeToCart, cleanCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
