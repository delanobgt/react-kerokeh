import { Reducer } from "redux";
import {
  EConfigActionTypes,
  IConfigState,
  ConfigActionType
} from "./types";

const initialState: IConfigState = {
  configs: [],
  realTotal: 0
};

const reducer: Reducer<IConfigState, ConfigActionType> = (
  state = initialState,
  action: ConfigActionType
): IConfigState => {
  switch (action.type) {
    case EConfigActionTypes.CONFIG_GET: {
      const { configs } = action;
      return {
        ...state,
        configs,
        realTotal: action.realTotal
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as configReducer };
