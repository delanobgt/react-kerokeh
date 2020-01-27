import _ from "lodash";
import {
  PBnibTransactionFilter,
  PBnibTransactionPagination,
  BnibTransactionSortField,
  IBnibTransactionGetAction,
  EBnibTransactionActionTypes,
  IBnibTransaction,
} from "./types";
import celestineApi from "src/apis/celestine";
import { ISort } from "src/util/types";
import { PRIMARY_ROUTE } from "./constants";

export const getBnibTransactions = async (
  pagination: PBnibTransactionPagination,
  filter: PBnibTransactionFilter,
  sorts: ISort<BnibTransactionSortField>[]
): Promise<IBnibTransactionGetAction> => {
  const sort = _.chain(sorts)
    .map(sort => `${sort.field}%20${sort.dir}`)
    .join(",")
    .value();
  const params = _.pickBy({ ...pagination, ...filter }, val => val);
  const response = await celestineApi().get(`${PRIMARY_ROUTE}?sort=${sort}`, {
    params
  });
  const bnibTransactions: IBnibTransaction[] = response.data.data;
  const meta = response.data.meta;
  return {
    type: EBnibTransactionActionTypes.BNIB_TRANSACTION_GET,
    bnibTransactions,
    realTotal: meta.total
  };
};
