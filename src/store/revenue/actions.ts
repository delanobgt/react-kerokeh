import _ from "lodash";
import {
  PRevenueFilter,
  PRevenuePagination,
  RevenueSortField,
  IRevenueGetAction,
  ERevenueActionTypes
} from "./types";
import celestineApi from "src/apis/celestine";
import { ISort } from "src/util/types";
import { PRIMARY_ROUTE } from "./constants";

export const getRevenues = async (
  pagination: PRevenuePagination,
  filter: PRevenueFilter,
  sorts: ISort<RevenueSortField>[]
): Promise<IRevenueGetAction> => {
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
  const depositFees = response.data.data;
  const meta = response.data.meta;
  return {
    type: ERevenueActionTypes.REVENUE_GET,
    revenues: depositFees,
    realTotal: meta.total
  };
};
