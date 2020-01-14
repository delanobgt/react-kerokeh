import _ from "lodash";
import {
  PProductCategoryFilter,
  PProductCategoryPagination,
  ProductCategorySortField,
  IProductCategoryGetAction,
  EProductCategoryActionTypes
} from "./types";
import celestineApi from "src/apis/celestine";
import { ISort } from "src/util/types";
import { PRIMARY_ROUTE } from "./constants";

export const getProductCategories = async (
  pagination: PProductCategoryPagination,
  filter: PProductCategoryFilter,
  sorts: ISort<ProductCategorySortField>[]
): Promise<IProductCategoryGetAction> => {
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
  const productCategories = response.data.data;
  const meta = response.data.meta;
  return {
    type: EProductCategoryActionTypes.PRODUCT_CATEGORY_GET,
    productCategories,
    realTotal: meta.total
  };
};
