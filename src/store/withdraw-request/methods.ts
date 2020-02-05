import _ from "lodash";
import celestineApi from "src/apis/celestine";
import {
  IWithdrawRequest,
  IWalletMutation,
  WalletMutationSortField,
  PWalletMutationFilter,
  PWalletMutationPagination
} from "./types";
import { PRIMARY_ROUTE, SECONDARY_ROUTE } from "./constants";
import { ISort } from "src/util/types";

export const getWithdrawRequestById = async (
  id: number
): Promise<IWithdrawRequest> => {
  const response = await celestineApi().get(`${PRIMARY_ROUTE}/${id}`);
  return response.data;
};

export const approveWithdrawRequest = async (
  id: number
): Promise<IWithdrawRequest> => {
  const response = await celestineApi().post(`${PRIMARY_ROUTE}/${id}/approve`);
  return response.data;
};

export const rejectWithdrawRequest = async (
  id: number,
  rejected_reason: string
): Promise<IWithdrawRequest> => {
  const response = await celestineApi().post(`${PRIMARY_ROUTE}/${id}/reject`, {
    rejected_reason
  });
  return response.data;
};

export const getWalletMutationsByUserId = async (
  user_id: number,
  filter: PWalletMutationFilter,
  pagination: PWalletMutationPagination,
  sorts: ISort<WalletMutationSortField>[]
): Promise<{ data: IWalletMutation[]; realTotal: number }> => {
  const sort = _.chain(sorts)
    .map(sort => `${sort.field}%20${sort.dir}`)
    .join(",")
    .value();
  const params = _.pickBy({ ...pagination, ...filter, user_id }, val => val);
  const response = await celestineApi().get(`${SECONDARY_ROUTE}?sort=${sort}`, {
    params
  });
  return { data: response.data.data, realTotal: response.data.meta.total };
};
