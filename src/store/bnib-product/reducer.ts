import { Reducer } from "redux";
import {
  EBnibProductActionTypes,
  IBnibProductState,
  BnibProductActionType
} from "./types";

const initialState: IBnibProductState = {
  bnibProducts: [],
  realTotal: 0
};

const reducer: Reducer<IBnibProductState, BnibProductActionType> = (
  state = initialState,
  action: BnibProductActionType
): IBnibProductState => {
  switch (action.type) {
    case EBnibProductActionTypes.BNIB_PRODUCT_GET: {
      const bnibTransactions = action.bnibProducts;
      return {
        ...state,
        bnibProducts: bnibTransactions,
        realTotal: action.realTotal
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as bnibProductReducer };
