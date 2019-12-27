import _ from "lodash";
import {
  PProductBrandFilter,
  PProductBrandPagination,
  ProductBrandSortField,
  IProductBrandGetAction,
  EProductBrandActionTypes
} from "./types";
import celestineApi from "src/apis/celestine";
import { ISort } from "src/util/types";

export const getProductBrands = async (
  pagination: PProductBrandPagination,
  filter: PProductBrandFilter,
  sorts: ISort<ProductBrandSortField>[]
): Promise<IProductBrandGetAction> => {
  const sort = _.chain(sorts)
    .map(sort => `${sort.field}%20${sort.dir}`)
    .join(",")
    .value();
  const params = _.pickBy({ ...pagination, ...filter }, val => val);
  const response = await celestineApi().get(
    `/admin/product-brand?sort=${sort}`,
    {
      params
    }
  );
  const productBrands = response.data.data;
  const meta = response.data.meta;
  return {
    type: EProductBrandActionTypes.PRODUCT_BRAND_GET,
    productBrands,
    realTotal: meta.total
  };
};
