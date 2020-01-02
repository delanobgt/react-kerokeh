import { Reducer } from "redux";
import {
  EWithdrawRequestActionTypes,
  IWithdrawRequestState,
  WithdrawRequestActionType
} from "./types";

const initialState: IWithdrawRequestState = {
  withdrawRequests: [],
  realTotal: 0
};

const reducer: Reducer<IWithdrawRequestState, WithdrawRequestActionType> = (
  state = initialState,
  action: WithdrawRequestActionType
): IWithdrawRequestState => {
  switch (action.type) {
    case EWithdrawRequestActionTypes.WITHDRAW_REQUEST_GET: {
      const { withdrawRequests } = action;
      return {
        ...state,
        withdrawRequests,
        realTotal: action.realTotal
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as withdrawRequestReducer };
