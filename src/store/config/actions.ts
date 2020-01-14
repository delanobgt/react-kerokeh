import _ from "lodash";
import {
  PConfigFilter,
  PConfigPagination,
  ConfigSortField,
  IConfigGetAction,
  EConfigActionTypes
} from "./types";
import celestineApi from "src/apis/celestine";
import { ISort } from "src/util/types";
import { PRIMARY_ROUTE } from "./constants";

export const getConfigs = async (
  pagination: PConfigPagination,
  filter: PConfigFilter,
  sorts: ISort<ConfigSortField>[]
): Promise<IConfigGetAction> => {
  const sort = _.chain(sorts)
    .map(sort => `${sort.field}%20${sort.dir}`)
    .join(",")
    .value();
  const params = _.pickBy({ ...pagination, ...filter }, val => val);
  const response = await celestineApi().get(
    `${PRIMARY_ROUTE}?sort=${sort}`,
    {
      params
    }
  );
  const configs = response.data.data;
  const meta = response.data.meta;
  return {
    type: EConfigActionTypes.CONFIG_GET,
    configs,
    realTotal: meta.total
  };
};
