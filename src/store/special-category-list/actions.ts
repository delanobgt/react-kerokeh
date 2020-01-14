import _ from "lodash";
import {
  PSpecialCategoryListFilter,
  PSpecialCategoryListPagination,
  SpecialCategoryListSortField,
  ISpecialCategoryListGetAction,
  ESpecialCategoryListActionTypes
} from "./types";
import celestineApi from "src/apis/celestine";
import { ISort } from "src/util/types";
import { PRIMARY_ROUTE } from "./constants";

export const getSpecialCategoryLists = async (
  pagination: PSpecialCategoryListPagination,
  filter: PSpecialCategoryListFilter,
  sorts: ISort<SpecialCategoryListSortField>[]
): Promise<ISpecialCategoryListGetAction> => {
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
  const specialCategoryLists = response.data.data;
  const meta = response.data.meta;
  return {
    type: ESpecialCategoryListActionTypes.SPECIAL_CATEGORY_LIST_GET,
    specialCategoryLists,
    realTotal: meta.total
  };
};
