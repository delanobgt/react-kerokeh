import { Reducer } from "redux";
import {
  EIdentificationActionTypes,
  IIdentificationState,
  UserActionType
} from "./types";

const initialState: IIdentificationState = {
  identifications: [],
  filter: {},
  pagination: { limit: 5, offset: 0 },
  sorts: [],
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
    case EIdentificationActionTypes.IDENTIFICATION_FILTER_UPDATE: {
      return {
        ...state,
        filter: {
          ...state.filter,
          ...action.filter
        }
      };
    }
    case EIdentificationActionTypes.IDENTIFICATION_PAGINATION_UPDATE: {
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.pagination
        }
      };
    }
    case EIdentificationActionTypes.IDENTIFICATION_SORTS_UPDATE: {
      return {
        ...state,
        sorts: action.sorts
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as userReducer };
