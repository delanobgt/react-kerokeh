import _ from "lodash";
import {
  PSpecialCategoryFilter,
  PSpecialCategoryPagination,
  SpecialCategorySortField,
  ISpecialCategoryGetAction,
  ESpecialCategoryActionTypes
} from "./types";
import celestineApi from "src/apis/celestine";
import { ISort } from "src/util/types";

export const getSpecialCategories = async (
  pagination: PSpecialCategoryPagination,
  filter: PSpecialCategoryFilter,
  sorts: ISort<SpecialCategorySortField>[]
): Promise<ISpecialCategoryGetAction> => {
  const sort = _.chain(sorts)
    .map(sort => `${sort.field}%20${sort.dir}`)
    .join(",")
    .value();
  const params = _.pickBy({ ...pagination, ...filter }, val => val);
  const response = await celestineApi().get(
    `/admin/special-category?sort=${sort}`,
    {
      params
    }
  );
  const specialCategories = response.data.data;
  const meta = response.data.meta;
  return {
    type: ESpecialCategoryActionTypes.SPECIAL_CATEGORY_GET,
    specialCategories,
    realTotal: meta.total
  };
};
