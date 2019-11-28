import { EAuthActionTypes, ISignInAction, ISignOutAction, IGetMeAction } from "./types";
import celestineApi from "src/apis/celestine";

export const signIn = async (credentials: {
  username: string;
  password: string;
}): Promise<ISignInAction> => {
  const response = await celestineApi().post(`/admin/auth/signin`, credentials);
  const authState = response.data;
  localStorage.setItem("auth_token", authState.token);
  return { type: EAuthActionTypes.SIGN_IN, authState };
};

export const signOut = (): ISignOutAction => {
  localStorage.removeItem("auth_token");
  return { type: EAuthActionTypes.SIGN_OUT };
};

export const getMe = async (): Promise<IGetMeAction> => {
  const response = await celestineApi().get(`/admin/auth/me`);
  const { user } = response.data;
  return { type: EAuthActionTypes.GET_ME, user };
};
