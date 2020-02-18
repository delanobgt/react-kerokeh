import celestineApi from "src/apis/celestine";
import { IBnibProduct } from "./types";
import { PRIMARY_ROUTE } from "./constants";

export const getBnibProductByCode = async (
  code: string
): Promise<IBnibProduct> => {
  const response = await celestineApi().get(`${PRIMARY_ROUTE}/${code}`);
  const bnibProduct: IBnibProduct = response.data;
  return bnibProduct;
};
