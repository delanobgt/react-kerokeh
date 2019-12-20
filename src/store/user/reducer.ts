import { Reducer } from "redux";
import { EUserActionTypes, IUserState, UserActionType } from "./types";

const initialState: IUserState = {
  users: [],
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
    default: {
      return state;
    }
  }
};

export { reducer as userReducer };
