import {
  EAuthActionTypes,
  ISignInAction,
  ISignOutAction,
  IGetMeAction,
  ISignUpAction,
} from "./types";
import kerokehApi from "src/apis/kerokeh";
import { PRIMARY_ROUTE } from "./constants";

export const signIn = async (credentials: {
  email: string;
  password: string;
}): Promise<ISignInAction> => {
  const response = await kerokehApi().post(
    `${PRIMARY_ROUTE}/login`,
    credentials
  );
  const authState = response.data;
  localStorage.setItem("auth_token", authState.token);
  return { type: EAuthActionTypes.SIGN_IN, authState };
};

export const signUp = async (credentials: {
  name: string;
  email: string;
  password: string;
}): Promise<ISignUpAction> => {
  const response = await kerokehApi().post(
    `${PRIMARY_ROUTE}/signup`,
    credentials
  );
  const authState = response.data;
  localStorage.setItem("auth_token", authState.token);
  return { type: EAuthActionTypes.SIGN_UP, authState };
};

export const signOut = (): ISignOutAction => {
  localStorage.removeItem("auth_token");
  return { type: EAuthActionTypes.SIGN_OUT };
};

export const getMe = async (): Promise<IGetMeAction> => {
  const response = await kerokehApi().get(`${PRIMARY_ROUTE}/me`);
  const user = response.data;
  return { type: EAuthActionTypes.GET_ME, user };
};

export const updateMe = async (
  name: string,
  email: string
): Promise<IGetMeAction> => {
  const response = await kerokehApi().put(`${PRIMARY_ROUTE}/me`, {
    name,
    email,
  });
  const user = response.data;
  return { type: EAuthActionTypes.GET_ME, user };
};
