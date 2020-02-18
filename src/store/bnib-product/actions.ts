import _ from "lodash";
import {
  PBnibProductFilter,
  PBnibProductPagination,
  BnibProductSortField,
  IBnibProductGetAction,
  EBnibProductActionTypes,
  IBnibProduct
} from "./types";
import celestineApi from "src/apis/celestine";
import { ISort } from "src/util/types";
import { PRIMARY_ROUTE } from "./constants";

export const getBnibProducts = async (
  pagination: PBnibProductPagination,
  filter: PBnibProductFilter,
  sorts: ISort<BnibProductSortField>[]
): Promise<IBnibProductGetAction> => {
  const sort = _.chain(sorts)
    .map(sort => `${sort.field}%20${sort.dir}`)
    .join(",")
    .value();
  const params = _.pickBy({ ...pagination, ...filter }, val => val);
  const response = await celestineApi().get(`${PRIMARY_ROUTE}?sort=${sort}`, {
    params
  });
  const bnibProducts: IBnibProduct[] = response.data.data;
  const meta = response.data.meta;
  return {
    type: EBnibProductActionTypes.BNIB_PRODUCT_GET,
    bnibProducts,
    realTotal: meta.total
  };
};
