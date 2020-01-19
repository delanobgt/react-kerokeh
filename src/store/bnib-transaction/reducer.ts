import { Reducer } from "redux";
import {
  EBnibTransactionActionTypes,
  IBnibTransactionState,
  BnibTransactionActionType
} from "./types";

const initialState: IBnibTransactionState = {
  bnibTransactions: [],
  realTotal: 0
};

const reducer: Reducer<IBnibTransactionState, BnibTransactionActionType> = (
  state = initialState,
  action: BnibTransactionActionType
): IBnibTransactionState => {
  switch (action.type) {
    case EBnibTransactionActionTypes.BNIB_TRANSACTION_GET: {
      const bnibTransactions = action.bnibTransactions;
      return {
        ...state,
        bnibTransactions,
        realTotal: action.realTotal
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as bnibTransactionReducer };
