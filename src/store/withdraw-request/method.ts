import celestineApi from "src/apis/celestine";
import { IWithdrawRequest } from "./types";

export const getWithdrawRequestById = async (
  id: number
): Promise<IWithdrawRequest> => {
  const response = await celestineApi().get(
    `/admin/withdraw-request/${id}`
  );
  return response.data;
};


export const approveWithdrawRequest = async (
  id: number
): Promise<IWithdrawRequest> => {
  const response = await celestineApi().post(
    `/admin/withdraw-request/${id}/approve`
  );
  return response.data;
};

export const rejectWithdrawRequest = async (
  id: number,
  rejected_reason: string
): Promise<IWithdrawRequest> => {
  console.log({rejected_reason})
  const response = await celestineApi().post(
    `/admin/withdraw-request/${id}/reject`,
    { rejected_reason }
  );
  return response.data;
};
