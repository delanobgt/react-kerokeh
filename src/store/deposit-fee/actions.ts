import _ from "lodash";
import {
  PDepositFeeFilter,
  PDepositFeePagination,
  DepositFeeSortField,
  IDepositFeeGetAction,
  EDepositFeeActionTypes
} from "./types";
import celestineApi from "src/apis/celestine";
import { ISort } from "src/util/types";
import { PRIMARY_ROUTE } from "./constants";

export const getDepositFees = async (
  pagination: PDepositFeePagination,
  filter: PDepositFeeFilter,
  sorts: ISort<DepositFeeSortField>[]
): Promise<IDepositFeeGetAction> => {
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
  const depositFees = response.data.data;
  const meta = response.data.meta;
  return {
    type: EDepositFeeActionTypes.DEPOSIT_FEE_GET,
    depositFees,
    realTotal: meta.total
  };
};
