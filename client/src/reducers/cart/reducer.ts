import { ActionTypes, CartItem, RestaurantItem } from "./actions"

interface CartState {
  numberOfItems: number
  items: CartItem[]
  restaurant: RestaurantItem
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

      const numberOfItems = action.payload.item.quantity + state.numberOfItems

      if (itemIndex >= 0) {
        return {
          ...state,
          numberOfItems,
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
        numberOfItems,
        restaurant: action.payload.restaurant,
      }

    case ActionTypes.REMOVE_TO_CART:
      const items = state.items.filter(item => item.id !== action.payload.id)

      return {
        ...state,
        items,
        numberOfItems: state.numberOfItems - 1,
      }

    case ActionTypes.CLEAN_CART:
      return {
        items: [],
        numberOfItems: 0,
        restaurant: null,
      }

    default:
      return state
  }
}
