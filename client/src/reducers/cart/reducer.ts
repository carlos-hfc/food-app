import { ActionTypes } from "./actions"

interface Item {
  id: string
  name: string
  image: string | null
  price: number
  quantity: number
}

interface CartState {
  numberOfItems: number
  items: Item[]
}

interface CartAction {
  type: string
  payload?: any
}

export function cartReducer(state: CartState, action: CartAction) {
  switch (action.type) {
    case ActionTypes.ADD_TO_CART:
      const itemIndex = state.items.findIndex(
        item => item.id === action.payload.item.id,
      )

      if (itemIndex >= 0) {
        return {
          ...state,
          items: [
            ...state.items.slice(0, itemIndex),
            {
              ...state.items[itemIndex],
              quantity:
                state.items[itemIndex].quantity + action.payload.item.quantity,
            },
            ...state.items.slice(itemIndex + 1),
          ],
        }
      }

      return {
        items: [...state.items, action.payload.item],
        numberOfItems: state.numberOfItems + 1,
      }

    case ActionTypes.REMOVE_TO_CART:
      const items = state.items.filter(item => item.id !== action.payload.id)

      return {
        items,
        numberOfItems: state.numberOfItems - 1,
      }

    case ActionTypes.CLEAN_CART:
      return {
        items: [],
        numberOfItems: 0,
      }

    default:
      return state
  }
}
