import { Reducer } from "redux";
import { ERevenueActionTypes, IRevenueState, RevenueActionType } from "./types";

const initialState: IRevenueState = {
  revenues: [],
  realTotal: 0
};

const reducer: Reducer<IRevenueState, RevenueActionType> = (
  state = initialState,
  action: RevenueActionType
): IRevenueState => {
  switch (action.type) {
    case ERevenueActionTypes.REVENUE_GET: {
      const { revenues: depositFees } = action;
      return {
        ...state,
        revenues: depositFees,
        realTotal: action.realTotal
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as revenueReducer };
