import _ from "lodash";
import celestineApi from "src/apis/celestine";
import { IDepositFee, PDepositFee } from "./types";
import shallowDiff from "shallow-diff";
import { PRIMARY_ROUTE } from "./constants";

export const createDepositFee = async (depositFee: PDepositFee): Promise<IDepositFee> => {
  const response = await celestineApi().post(
    PRIMARY_ROUTE,
    depositFee
  );
  return response.data;
};

export const updateDepositFee = async (
  oldDepositFee: PDepositFee,
  newDepositFee: PDepositFee
): Promise<IDepositFee> => {
  const diffDepositFee = _.pick(
    newDepositFee,
    shallowDiff(oldDepositFee, newDepositFee).updated
  );
  const response = await celestineApi().patch(
    `${PRIMARY_ROUTE}/${oldDepositFee.id}`,
    diffDepositFee
  );
  return response.data;
};

export const deleteDepositFee = async (id: number): Promise<void> => {
  await celestineApi().delete(`${PRIMARY_ROUTE}/${id}`);
};

