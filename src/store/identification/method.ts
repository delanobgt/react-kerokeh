import celestineApi from "src/apis/celestine";
import { IIdentification } from "./types";

export const getIdentificationByUserId = async (
  userId: number
  ): Promise<IIdentification> => {
  const response = await celestineApi().get(`/admin/identification/${userId}`);
  const identification = response.data;
  return identification
};

export const acceptIdentificationById = async (
  id: number
  ): Promise<IIdentification> => {
  const response = await celestineApi().post(`/admin/identification/${id}/approve`);
  const identification = response.data;
  return identification
};

export const rejectIdentificationById = async (
  id: number, rejected_reason: string
  ): Promise<IIdentification> => {
  const response = await celestineApi().post(`/admin/identification/${id}/reject`, {
    rejected_reason
  });
  const identification = response.data;
  return identification
};
