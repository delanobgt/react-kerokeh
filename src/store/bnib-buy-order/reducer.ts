import { Reducer } from "redux";
import {
  EBnibBuyOrderActionTypes,
  IBnibBuyOrderState,
  BnibBuyOrderActionType
} from "./types";

const initialState: IBnibBuyOrderState = {
  bnibBuyOrders: [],
  realTotal: 0
};

const reducer: Reducer<IBnibBuyOrderState, BnibBuyOrderActionType> = (
  state = initialState,
  action: BnibBuyOrderActionType
): IBnibBuyOrderState => {
  switch (action.type) {
    case EBnibBuyOrderActionTypes.BNIB_BUY_ORDER_GET: {
      const bnibTransactions = action.bnibBuyOrders;
      return {
        ...state,
        bnibBuyOrders: bnibTransactions,
        realTotal: action.realTotal
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as bnibBuyOrderReducer };
