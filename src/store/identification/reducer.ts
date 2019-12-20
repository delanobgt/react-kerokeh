import { Reducer } from "redux";
import {
  EIdentificationActionTypes,
  IIdentificationState,
  UserActionType
} from "./types";

const initialState: IIdentificationState = {
  identifications: [],
  realTotal: 0
};

const reducer: Reducer<IIdentificationState, UserActionType> = (
  state = initialState,
  action: UserActionType
): IIdentificationState => {
  switch (action.type) {
    case EIdentificationActionTypes.IDENTIFICATION_GET: {
      const identifications = action.identifications;
      return {
        ...state,
        identifications,
        realTotal: action.realTotal
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as identificationReducer };
