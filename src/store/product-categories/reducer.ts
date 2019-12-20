import { Reducer } from "redux";
import {
  EProductCategoryActionTypes,
  IProductCategoryState,
  ProductCategoryActionType
} from "./types";

const initialState: IProductCategoryState = {
  productCategories: [],
  realTotal: 0
};

const reducer: Reducer<IProductCategoryState, ProductCategoryActionType> = (
  state = initialState,
  action: ProductCategoryActionType
): IProductCategoryState => {
  switch (action.type) {
    case EProductCategoryActionTypes.PRODUCT_CATEGORY_GET: {
      const productCategories = action.productCategories;
      return {
        ...state,
        productCategories,
        realTotal: action.realTotal
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as productCategoryReducer };
