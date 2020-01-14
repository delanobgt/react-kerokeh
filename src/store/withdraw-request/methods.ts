import celestineApi from "src/apis/celestine";
import { IWithdrawRequest } from "./types";
import { PRIMARY_ROUTE } from "./constants";

export const getWithdrawRequestById = async (
  id: number
): Promise<IWithdrawRequest> => {
  const response = await celestineApi().get(
    `${PRIMARY_ROUTE}/${id}`
  );
  return response.data;
};

export const approveWithdrawRequest = async (
  id: number
): Promise<IWithdrawRequest> => {
  const response = await celestineApi().post(
    `${PRIMARY_ROUTE}/${id}/approve`
  );
  return response.data;
};

export const rejectWithdrawRequest = async (
  id: number,
  rejected_reason: string
): Promise<IWithdrawRequest> => {
  const response = await celestineApi().post(
    `${PRIMARY_ROUTE}/${id}/reject`,
    { rejected_reason }
  );
  return response.data;
};
