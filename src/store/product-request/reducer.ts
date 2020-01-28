import { Reducer } from "redux";
import { ETopUpActionTypes, ITopUpState, TopUpActionType } from "./types";

const initialState: ITopUpState = {
  topUps: [],
  realTotal: 0
};

const reducer: Reducer<ITopUpState, TopUpActionType> = (
  state = initialState,
  action: TopUpActionType
): ITopUpState => {
  switch (action.type) {
    case ETopUpActionTypes.TOP_UP_GET: {
      const { topUps } = action;
      return {
        ...state,
        topUps,
        realTotal: action.realTotal
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as topUpReducer };
