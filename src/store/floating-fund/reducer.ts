import { Reducer } from "redux";
import {
  EFloatingFundActionTypes,
  IFloatingFundState,
  FloatingFundActionType
} from "./types";

const initialState: IFloatingFundState = {
  floatingFunds: [],
  realTotal: 0
};

const reducer: Reducer<IFloatingFundState, FloatingFundActionType> = (
  state = initialState,
  action: FloatingFundActionType
): IFloatingFundState => {
  switch (action.type) {
    case EFloatingFundActionTypes.FLOATING_FUND_GET: {
      const { floatingFunds } = action;
      return {
        ...state,
        floatingFunds,
        realTotal: action.realTotal
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as floatingFundReducer };
