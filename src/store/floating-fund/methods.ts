import celestineApi from "src/apis/celestine";
import { PRIMARY_ROUTE } from "./constants";

export const getFloatingFundExcelData = async (): Promise<any> => {
  const response = await celestineApi({ responseType: "blob" }).get(
    `${PRIMARY_ROUTE}/download`
  );
  return response.data;
};
