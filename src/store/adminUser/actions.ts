import {
  EAdminUserActionTypes,
  IAdminUserGetAction
} from "./types";
import celestineApi from "src/apis/celestine";
import { PRIMARY_ROUTE } from "./constants";

export const getAdminUsers = async (
  limit = 100
): Promise<IAdminUserGetAction> => {
  const response = await celestineApi().get(PRIMARY_ROUTE, {
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
