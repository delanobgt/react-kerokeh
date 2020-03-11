import _ from "lodash";
import {
  PFeaturedProductFilter,
  PFeaturedProductPagination,
  FeaturedProductSortField,
  IFeaturedProductGetAction,
  EFeaturedProductActionTypes
} from "./types";
import celestineApi from "src/apis/celestine";
import { ISort } from "src/util/types";
import { PRIMARY_ROUTE } from "./constants";

export const getFeaturedProducts = async (
  pagination: PFeaturedProductPagination,
  filter: PFeaturedProductFilter,
  sorts: ISort<FeaturedProductSortField>[]
): Promise<IFeaturedProductGetAction> => {
  const sort = _.chain(sorts)
    .map(sort => `${sort.field}%20${sort.dir}`)
    .join(",")
    .value();
  const params = _.pickBy({ ...pagination, ...filter }, val => val);
  const response = await celestineApi().get(`${PRIMARY_ROUTE}?sort=${sort}`, {
    params
  });
  const featuredProducts = response.data.data;
  const meta = response.data.meta;
  return {
    type: EFeaturedProductActionTypes.FEATURED_PRODUCT_GET,
    featuredProducts,
    realTotal: meta.total
  };
};
