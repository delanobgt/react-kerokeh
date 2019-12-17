import {
  EAdminUserActionTypes,
  IAdminUserDeleteAction,
  IAdminUserGetAction
} from "./types";
import celestineApi from "src/apis/celestine";

export const getAdminUsers = async (
  limit = 100
): Promise<IAdminUserGetAction> => {
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

export const deleteAdminUser = async (
  adminUserId: number
): Promise<IAdminUserDeleteAction> => {
  await celestineApi().delete(`/admin/admin_user/${adminUserId}`);
  return {
    type: EAdminUserActionTypes.USER_DELETE,
    adminUserId
  };
};
