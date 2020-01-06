import _ from "lodash";
import {
  PProductFilter,
  PProductPagination,
  ProductSortField,
  IProductGetAction,
  EProductActionTypes
} from "./types";
import celestineApi from "src/apis/celestine";
import { ISort } from "src/util/types";

export const getProducts = async (
  pagination: PProductPagination,
  filter: PProductFilter,
  sorts: ISort<ProductSortField>[]
): Promise<IProductGetAction> => {
  const sort = _.chain(sorts)
    .map(sort => `${sort.field}%20${sort.dir}`)
    .join(",")
    .value();
  const params = _.pickBy({ ...pagination, ...filter }, val => val);
  const response = await celestineApi().get(`/admin/product?sort=${sort}`, {
    params
  });
  const products = response.data.data;
  const meta = response.data.meta;
  return {
    type: EProductActionTypes.PRODUCT_GET,
    products,
    realTotal: meta.total
  };
};
