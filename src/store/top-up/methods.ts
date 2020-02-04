import { ITopUp } from "./types";
import celestineApi from "src/apis/celestine";
import { PRIMARY_ROUTE,  } from "./constants";

export const getTopUpById = async (id: number): Promise<ITopUp> => {
  const response = await celestineApi().get(`${PRIMARY_ROUTE}/${id}`);
  const topUp = response.data;
  return topUp;
};
