import _ from "lodash";
import celestineApi from "src/apis/celestine";
import { IDepositFee, PDepositFee } from "./types";
import shallowDiff from "shallow-diff";

export const createDepositFee = async (depositFee: PDepositFee): Promise<IDepositFee> => {
  const response = await celestineApi().post(
    `/admin/deposit-fee`,
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
    `/admin/deposit-fee/${oldDepositFee.id}`,
    diffDepositFee
  );
  return response.data;
};

export const deleteDepositFee = async (id: number): Promise<void> => {
  await celestineApi().delete(`/admin/deposit-fee/${id}`);
};

