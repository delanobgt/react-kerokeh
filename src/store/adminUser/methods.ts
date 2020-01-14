import { INewAdminUser } from "./types";
import celestineApi from "src/apis/celestine";
import { PRIMARY_ROUTE } from "./constants";

export const createAdminUser = async (
  adminUser: INewAdminUser
): Promise<void> => {
  await celestineApi().post(PRIMARY_ROUTE, adminUser);
};

export const updateAdminUser = async (
  id: number,
  adminUser: INewAdminUser
): Promise<void> => {
  await celestineApi().patch(`${PRIMARY_ROUTE}/${id}`, adminUser);
};

export const deleteAdminUser = async (
  adminUserId: number
): Promise<void> => {
  await celestineApi().delete(`${PRIMARY_ROUTE}/${adminUserId}`);
};
