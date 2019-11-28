import {
  EAdminUserActionTypes,
  IAdminUser,
  INewAdminUser,
  AdminUserActionType,
  IUserDeleteAction,
  IUserGetAction
} from "./types";
import celestineApi from "src/apis/celestine";

export const createAdminUser = async (
  adminUser: INewAdminUser
): Promise<void> => {
  await celestineApi().post(`/admin/admin_user`, adminUser);
};

export const getAdminUsers = async (
  limit = 100
): Promise<IUserGetAction> => {
  const response = await celestineApi().get(`/admin/admin_user`, {
    query: {
      limit
    }
  });
  const adminUsers = response.data.data;
  return {
    type: EAdminUserActionTypes.USER_GET,
    adminUsers
  };
};

export const updateAdminUser = async (
  id: number,
  adminUser: INewAdminUser
): Promise<void> => {
  await celestineApi().patch(`/admin/admin_user/${id}`, adminUser);
};

export const deleteAdminUser = async (
  adminUserId: number
): Promise<IUserDeleteAction> => {
  await celestineApi().delete(`/admin/admin_user/${adminUserId}`);
  return {
    type: EAdminUserActionTypes.USER_DELETE,
    adminUserId
  };
};
