import _ from "lodash";
import {
  PWithdrawRequestFilter,
  PWithdrawRequestPagination,
  WithdrawRequestSortField,
  IWithdrawRequestGetAction,
  EWithdrawRequestActionTypes
} from "./types";
import celestineApi from "src/apis/celestine";
import { ISort } from "src/util/types";

export const getWithdrawRequests = async (
  pagination: PWithdrawRequestPagination,
  filter: PWithdrawRequestFilter,
  sorts: ISort<WithdrawRequestSortField>[]
): Promise<IWithdrawRequestGetAction> => {
  const sort = _.chain(sorts)
    .map(sort => `${sort.field}%20${sort.dir}`)
    .join(",")
    .value();
  const params = _.pickBy({ ...pagination, ...filter }, val => val);
  const response = await celestineApi().get(`/admin/promo-code?sort=${sort}`, {
    params
  });
  const withdrawRequests = response.data.data;
  const meta = response.data.meta;
  return {
    type: EWithdrawRequestActionTypes.WITHDRAW_REQUEST_GET,
    withdrawRequests,
    realTotal: meta.total
  };
};
