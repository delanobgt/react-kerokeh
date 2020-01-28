import _ from "lodash";
import {
  PProductRequestFilter,
  PProductRequestPagination,
  ProductRequestSortField,
  IProductRequestGetAction,
  EProductRequestActionTypes
} from "./types";
import celestineApi from "src/apis/celestine";
import { ISort } from "src/util/types";
import { PRIMARY_ROUTE } from "./constants";

export const getProductRequests = async (
  pagination: PProductRequestPagination,
  filter: PProductRequestFilter,
  sorts: ISort<ProductRequestSortField>[]
): Promise<IProductRequestGetAction> => {
  const sort = _.chain(sorts)
    .map(sort => `${sort.field}%20${sort.dir}`)
    .join(",")
    .value();
  const params = _.pickBy(
    {
      ...pagination,
      ...filter,
    },
    val => val
  );
  const response = await celestineApi().get(`${PRIMARY_ROUTE}?sort=${sort}`, {
    params
  });
  const productRequests = response.data.data;
  const meta = response.data.meta;
  return {
    type: EProductRequestActionTypes.PRODUCT_REQUEST_GET,
    productRequests,
    realTotal: meta.total
  };
};
