import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react"

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

  const addToCart = useCallback((data: AddItemToCartParams) => {
    dispatch(addItemToCart(data))
  }, [])

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
