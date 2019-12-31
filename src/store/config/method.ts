import celestineApi from "src/apis/celestine";
import { IConfig, PConfig } from "./types";

export const updateConfig = async (config: PConfig): Promise<IConfig> => {
  const response = await celestineApi().patch(
    `/admin/config/${config.id}`,
    config
  );
  return response.data;
};
