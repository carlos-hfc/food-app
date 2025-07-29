export enum ActionTypes {
  ADD_TO_CART = "ADD_TO_CART",
  REMOVE_TO_CART = "REMOVE_TO_CART",
  CLEAN_CART = "CLEAN_CART",
}

interface Item {
  id: string
  name: string
  image: string | null
  price: number
  quantity: number
}

export function addItemToCart(item: Item) {
  return {
    type: ActionTypes.ADD_TO_CART,
    payload: {
      item,
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
