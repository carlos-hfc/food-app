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
  cleanCartItems,
  removeItemToCart,
} from "@/reducers/cart/actions"
import { cartReducer } from "@/reducers/cart/reducer"

interface CartItem {
  id: string
  name: string
  image: string | null
  price: number
  quantity: number
}

interface CartContextProps {
  items: CartItem[]
  numberOfItems: number
  addToCart(data: CartItem): void
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

  const { items, numberOfItems } = cartState

  // useEffect(() => {
  //   const cartItemsJSON = JSON.stringify(cartState)

  //   localStorage.setItem("@cart_items", cartItemsJSON)
  // }, [cartState])

  const addToCart = useCallback((data: CartItem) => {
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
      addToCart,
      removeToCart,
      cleanCart,
    }),
    [items, numberOfItems, addToCart, removeToCart, cleanCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
