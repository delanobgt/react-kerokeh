import { Reducer } from "redux";
import { EProductActionTypes, IProductState, ProductActionType } from "./types";

const initialState: IProductState = {
  products: [],
  realTotal: 0
};

const reducer: Reducer<IProductState, ProductActionType> = (
  state = initialState,
  action: ProductActionType
): IProductState => {
  switch (action.type) {
    case EProductActionTypes.PRODUCT_GET: {
      const products = action.products;
      return {
        ...state,
        products,
        realTotal: action.realTotal
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as productReducer };
