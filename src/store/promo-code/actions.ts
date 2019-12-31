import _ from "lodash";
import {
  PPromoCodeFilter,
  PPromoCodePagination,
  PromoCodeSortField,
  IPromoCodeGetAction,
  EPromoCodeActionTypes
} from "./types";
import celestineApi from "src/apis/celestine";
import { ISort } from "src/util/types";

export const getPromoCodes = async (
  pagination: PPromoCodePagination,
  filter: PPromoCodeFilter,
  sorts: ISort<PromoCodeSortField>[]
): Promise<IPromoCodeGetAction> => {
  const sort = _.chain(sorts)
    .map(sort => `${sort.field}%20${sort.dir}`)
    .join(",")
    .value();
  const params = _.pickBy({ ...pagination, ...filter }, val => val);
  const response = await celestineApi().get(`/admin/promo-code?sort=${sort}`, {
    params
  });
  const depositFees = response.data.data;
  const meta = response.data.meta;
  return {
    type: EPromoCodeActionTypes.PROMO_CODE_GET,
    promoCodes: depositFees,
    realTotal: meta.total
  };
};
