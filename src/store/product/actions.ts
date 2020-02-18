import _ from "lodash";
import {
  PProductFilter,
  PProductPagination,
  ProductSortField,
  IProductGetAction,
  EProductActionTypes,
  IProduct
} from "./types";
import celestineApi from "src/apis/celestine";
import { ISort } from "src/util/types";
import { PRIMARY_ROUTE } from "./constants";

export const getProducts = async (
  pagination: PProductPagination,
  filter: PProductFilter,
  sorts: ISort<ProductSortField>[]
): Promise<IProductGetAction> => {
  const sort = _.chain(sorts)
    .map(sort => `${sort.field}%20${sort.dir}`)
    .join(",")
    .value();
  const release_date = Boolean(
    filter.release_date_start && filter.release_date_end
  )
    ? `${filter.release_date_start},${filter.release_date_end}`
    : undefined;
  const params = _.pickBy(
    {
      ...pagination,
      ..._.omit(filter, ["release_date_start", "release_date_end"]),
      release_date
    },
    val => val
  );
  const response = await celestineApi().get(`${PRIMARY_ROUTE}?sort=${sort}`, {
    params
  });
  const products: IProduct[] = response.data.data;
  for (let product of products) {
    product.detail_image_urls = Boolean(product.detail_image_url)
      ? product.detail_image_url.split(",")
      : [];
  }
  const meta = response.data.meta;
  return {
    type: EProductActionTypes.PRODUCT_GET,
    products,
    realTotal: meta.total
  };
};
