import _ from "lodash";
import {
  PBnibBuyOrderFilter,
  PBnibBuyOrderPagination,
  BnibBuyOrderSortField,
  IBnibBuyOrderGetAction,
  EBnibBuyOrderActionTypes,
  IBnibBuyOrder
} from "./types";
import celestineApi from "src/apis/celestine";
import { ISort } from "src/util/types";
import { PRIMARY_ROUTE } from "./constants";

export const getBnibBuyOrders = async (
  pagination: PBnibBuyOrderPagination,
  filter: PBnibBuyOrderFilter,
  sorts: ISort<BnibBuyOrderSortField>[]
): Promise<IBnibBuyOrderGetAction> => {
  const sort = _.chain(sorts)
    .map(sort => `${sort.field}%20${sort.dir}`)
    .join(",")
    .value();
  const params = _.pickBy({ ...pagination, ...filter }, val => val);
  const response = await celestineApi().get(`${PRIMARY_ROUTE}?sort=${sort}`, {
    params
  });
  const bnibProducts: IBnibBuyOrder[] = response.data.data;
  const meta = response.data.meta;
  return {
    type: EBnibBuyOrderActionTypes.BNIB_BUY_ORDER_GET,
    bnibBuyOrders: bnibProducts,
    realTotal: meta.total
  };
};
