import celestineApi from "src/apis/celestine";
import { IBnibBuyOrder } from "./types";
import { PRIMARY_ROUTE } from "./constants";

export const getBnibBuyOrderByCode = async (
  code: string
): Promise<IBnibBuyOrder> => {
  const response = await celestineApi().get(`${PRIMARY_ROUTE}/${code}`);
  const bnibProduct: IBnibBuyOrder = response.data;
  return bnibProduct;
};
