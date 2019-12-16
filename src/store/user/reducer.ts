import { Reducer } from "redux";
import { EUserActionTypes, IUserState, UserActionType } from "./types";
import moment from "moment";

const initialState: IUserState = {
  users: [],
  filter: {
    created_at_start: moment(0).format("YYYY-MM-DD"),
    created_at_end: moment().format("YYYY-MM-DD")
  },
  pagination: { limit: 5, offset: 0 },
  sorts: [],
  realTotal: 0
};

const reducer: Reducer<IUserState, UserActionType> = (
  state = initialState,
  action: UserActionType
): IUserState => {
  switch (action.type) {
    case EUserActionTypes.USER_GET: {
      const users = action.users;
      return {
        ...state,
        users,
        realTotal: action.realTotal
      };
    }
    case EUserActionTypes.USER_FILTER_UPDATE: {
      return {
        ...state,
        filter: {
          ...state.filter,
          ...action.filter
        }
      };
    }
    case EUserActionTypes.USER_PAGINATION_UPDATE: {
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.pagination
        }
      };
    }
    case EUserActionTypes.USER_SORTS_UPDATE: {
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
