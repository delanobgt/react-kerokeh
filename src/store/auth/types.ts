export enum EAuthActionTypes {
  SIGN_IN = "@@auth/SIGN_IN",
  SIGN_OUT = "@@auth/SIGN_OUT",
  GET_ME = "@@auth/GET_ME"
}

export interface IUser {
  id: number;
  role: {
    id: number;
    name: string;
  };
  username: string;
}

export interface IAuthState {
  token: null | string;
  user?: null | IUser;
}

export interface ISignInAction {
  type: EAuthActionTypes.SIGN_IN;
  authState: IAuthState;
}

export interface ISignOutAction {
  type: EAuthActionTypes.SIGN_OUT;
}

export interface IGetMeAction {
  type: EAuthActionTypes.GET_ME;
  user: IUser;
}

export type AuthActionType = ISignInAction | ISignOutAction | IGetMeAction;
