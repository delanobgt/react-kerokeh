import _ from "lodash";
import {
  PTopUpFilter,
  PTopUpPagination,
  TopUpSortField,
  ITopUpGetAction,
  ETopUpActionTypes
} from "./types";
import celestineApi from "src/apis/celestine";
import { ISort } from "src/util/types";
import { PRIMARY_ROUTE } from "./constants";

export const getTopUps = async (
  pagination: PTopUpPagination,
  filter: PTopUpFilter,
  sorts: ISort<TopUpSortField>[]
): Promise<ITopUpGetAction> => {
  const sort = _.chain(sorts)
    .map(sort => `${sort.field}%20${sort.dir}`)
    .join(",")
    .value();
  const created_at = Boolean(filter.created_at_start && filter.created_at_end)
    ? `${filter.created_at_start},${filter.created_at_end}`
    : undefined;
  const params = _.pickBy(
    {
      ...pagination,
      ..._.omit(filter, ["created_at_start", "created_at_end"]),
      created_at
    },
    val => val
  );
  const response = await celestineApi().get(`${PRIMARY_ROUTE}?sort=${sort}`, {
    params
  });
  const topUps = response.data.data;
  const meta = response.data.meta;
  return {
    type: ETopUpActionTypes.TOP_UP_GET,
    topUps,
    realTotal: meta.total
  };
};
