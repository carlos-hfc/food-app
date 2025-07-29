export enum ActionTypes {
  ADD_TO_CART = "ADD_TO_CART",
  REMOVE_TO_CART = "REMOVE_TO_CART",
  CLEAN_CART = "CLEAN_CART",
}

export interface CartItem {
  id: string
  restaurantId: string
  name: string
  image: string | null
  price: number
  quantity: number
}

export type RestaurantItem = {
  id: string
  name: string
  image: string | null
} | null

export interface AddItemToCartParams {
  item: CartItem
  restaurant: RestaurantItem
}

export function addItemToCart({ item, restaurant }: AddItemToCartParams) {
  return {
    type: ActionTypes.ADD_TO_CART,
    payload: {
      item,
      restaurant,
    },
  }
}

export function removeItemToCart(id: string) {
  return {
    type: ActionTypes.REMOVE_TO_CART,
    payload: {
      id,
    },
  }
}

export function cleanCartItems() {
  return {
    type: ActionTypes.CLEAN_CART,
  }
}
