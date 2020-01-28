import { Reducer } from "redux";
import { EProductRequestActionTypes, IProductRequestState, ProductRequestActionType } from "./types";

const initialState: IProductRequestState = {
  productRequests: [],
  realTotal: 0
};

const reducer: Reducer<IProductRequestState, ProductRequestActionType> = (
  state = initialState,
  action: ProductRequestActionType
): IProductRequestState => {
  switch (action.type) {
    case EProductRequestActionTypes.PRODUCT_REQUEST_GET: {
      const { productRequests, realTotal } = action;
      return {
        ...state,
        productRequests,
        realTotal
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as productRequestReducer };
