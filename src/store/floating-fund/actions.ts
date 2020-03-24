import _ from "lodash";
import {
  PFloatingFundFilter,
  PFloatingFundPagination,
  FloatingFundSortField,
  IFloatingFundGetAction,
  EFloatingFundActionTypes
} from "./types";
import celestineApi from "src/apis/celestine";
import { ISort } from "src/util/types";
import { PRIMARY_ROUTE } from "./constants";

export const getFloatingFunds = async (
  pagination: PFloatingFundPagination,
  filter: PFloatingFundFilter,
  sorts: ISort<FloatingFundSortField>[]
): Promise<IFloatingFundGetAction> => {
  const sort = _.chain(sorts)
    .map(sort => `${sort.field}%20${sort.dir}`)
    .join(",")
    .value();

  const params = _.pickBy(
    {
      ...pagination,
      ...filter
    },
    val => val
  );
  const response = await celestineApi().get(`${PRIMARY_ROUTE}?sort=${sort}`, {
    params
  });
  const floatingFunds = response.data.data;
  const meta = response.data.meta;
  return {
    type: EFloatingFundActionTypes.FLOATING_FUND_GET,
    floatingFunds,
    realTotal: meta.total
  };
};
