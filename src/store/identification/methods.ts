import celestineApi from "src/apis/celestine";
import { IIdentification } from "./types";
import { PRIMARY_ROUTE } from "./constants";

export const getIdentificationByUserId = async (
  userId: number
  ): Promise<IIdentification> => {
  const response = await celestineApi().get(`${PRIMARY_ROUTE}/${userId}`);
  const identification = response.data;
  return identification
};

export const acceptIdentificationById = async (
  id: number
  ): Promise<IIdentification> => {
  const response = await celestineApi().post(`${PRIMARY_ROUTE}/${id}/approve`);
  const identification = response.data;
  return identification
};

export const rejectIdentificationById = async (
  id: number, rejected_reason: string
  ): Promise<IIdentification> => {
  const response = await celestineApi().post(`${PRIMARY_ROUTE}/${id}/reject`, {
    rejected_reason
  });
  const identification = response.data;
  return identification
};
