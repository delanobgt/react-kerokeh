import _ from "lodash";
import { INewAdminUser } from "./types";
import celestineApi from "src/apis/celestine";
import { PRIMARY_ROUTE } from "./constants";
import shallowDiff from "shallow-diff";

export const createAdminUser = async (
  adminUser: INewAdminUser
): Promise<void> => {
  await celestineApi().post(PRIMARY_ROUTE, adminUser);
};

export const updateAdminUser = async (
  id: number,
  oldAdminUser: Partial<INewAdminUser>,
  newAdminUser: INewAdminUser
): Promise<void> => {
  const diffAdminUser = _.pick(
    newAdminUser,
    shallowDiff(oldAdminUser, newAdminUser).updated
  );
  console.log(diffAdminUser);
  await celestineApi().patch(`${PRIMARY_ROUTE}/${id}`, diffAdminUser);
};

export const deleteAdminUser = async (adminUserId: number): Promise<void> => {
  await celestineApi().delete(`${PRIMARY_ROUTE}/${adminUserId}`);
};
