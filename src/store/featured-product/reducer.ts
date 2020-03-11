import { Reducer } from "redux";
import {
  EFeaturedProductActionTypes,
  IFeaturedProductState,
  FeaturedProductActionType
} from "./types";

const initialState: IFeaturedProductState = {
  featuredProducts: [],
  realTotal: 0
};

const reducer: Reducer<IFeaturedProductState, FeaturedProductActionType> = (
  state = initialState,
  action: FeaturedProductActionType
): IFeaturedProductState => {
  switch (action.type) {
    case EFeaturedProductActionTypes.FEATURED_PRODUCT_GET: {
      const featuredProducts = action.featuredProducts;
      return {
        ...state,
        featuredProducts,
        realTotal: action.realTotal
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as featuredProductReducer };
