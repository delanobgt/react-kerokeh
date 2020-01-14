import celestineApi from "src/apis/celestine";
import { IConfig, PConfig } from "./types";
import { PRIMARY_ROUTE } from "./constants";

export const updateConfig = async (config: PConfig): Promise<IConfig> => {
  const response = await celestineApi().patch(
    `${PRIMARY_ROUTE}/${config.id}`,
    config
  );
  return response.data;
};
