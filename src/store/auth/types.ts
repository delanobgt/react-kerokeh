// enums
export enum EAuthActionTypes {
  SIGN_IN = "@@auth/SIGN_IN",
  SIGN_OUT = "@@auth/SIGN_OUT",
  GET_ME = "@@auth/GET_ME"
}

// entity types
export interface IAuthUser {
  id: number;
  role: {
    id: number;
    name: string;
  };
  username: string;
}

// redux state type
export interface IAuthState {
  token: null | string;
  user?: null | IAuthUser;
}

// action types
export interface ISignInAction {
  type: EAuthActionTypes.SIGN_IN;
  authState: IAuthState;
}

export interface ISignOutAction {
  type: EAuthActionTypes.SIGN_OUT;
}

export interface IGetMeAction {
  type: EAuthActionTypes.GET_ME;
  user: IAuthUser;
}

export type AuthActionType = ISignInAction | ISignOutAction | IGetMeAction;
