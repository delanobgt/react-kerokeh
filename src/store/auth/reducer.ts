import { Reducer } from "redux";
import { EAuthActionTypes, IAuthState, AuthActionType } from "./types";

const initialState: IAuthState = {
  token: "",
  user: null
};

const reducer: Reducer<IAuthState, AuthActionType> = (
  state = initialState,
  action: AuthActionType
): IAuthState => {
  switch (action.type) {
    case EAuthActionTypes.SIGN_IN: {
      const { token, user } = action.authState;
      return { token, user };
    }
    case EAuthActionTypes.SIGN_OUT: {
      return initialState;
    }
    case EAuthActionTypes.GET_ME: {
      const user = action.user;
      return {
        ...state,
        user
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as authReducer };
