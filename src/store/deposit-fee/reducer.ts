import { Reducer } from "redux";
import {
  EDepositFeeActionTypes,
  IDepositFeeState,
  DepositFeeActionType
} from "./types";

const initialState: IDepositFeeState = {
  depositFees: [],
  realTotal: 0
};

const reducer: Reducer<IDepositFeeState, DepositFeeActionType> = (
  state = initialState,
  action: DepositFeeActionType
): IDepositFeeState => {
  switch (action.type) {
    case EDepositFeeActionTypes.DEPOSIT_FEE_GET: {
      const { depositFees } = action;
      return {
        ...state,
        depositFees,
        realTotal: action.realTotal
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as depositFeeReducer };
