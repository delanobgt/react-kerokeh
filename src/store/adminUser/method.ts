import { INewAdminUser } from "./types";
import celestineApi from "src/apis/celestine";

export const createAdminUser = async (
  adminUser: INewAdminUser
): Promise<void> => {
  await celestineApi().post(`/admin/admin_user`, adminUser);
};

export const updateAdminUser = async (
  id: number,
  adminUser: INewAdminUser
): Promise<void> => {
  await celestineApi().patch(`/admin/admin_user/${id}`, adminUser);
};
