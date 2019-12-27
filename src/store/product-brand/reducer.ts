import { Reducer } from "redux";
import {
  EProductBrandActionTypes,
  IProductBrandState,
  ProductBrandActionType
} from "./types";

const initialState: IProductBrandState = {
  productBrands: [],
  realTotal: 0
};

const reducer: Reducer<IProductBrandState, ProductBrandActionType> = (
  state = initialState,
  action: ProductBrandActionType
): IProductBrandState => {
  switch (action.type) {
    case EProductBrandActionTypes.PRODUCT_BRAND_GET: {
      const productBrands = action.productBrands;
      return {
        ...state,
        productBrands,
        realTotal: action.realTotal
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as productBrandReducer };
