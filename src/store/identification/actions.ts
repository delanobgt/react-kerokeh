import _ from "lodash";
import {
  PIdentificationFilter,
  PIdentificationPagination,
  IdentificationSortField,
  IIdentificationGetAction,
  EIdentificationActionTypes,
  IIdentificationFilterUpdateAction,
  IIdentificationPaginationUpdateAction,
  IIdentificationSortsUpdateAction
} from "./types";
import celestineApi from "src/apis/celestine";
import { ISort } from "src/util/types";

export const getIdentifications = async (
  pagination: PIdentificationPagination,
  filter: PIdentificationFilter,
  sorts: ISort<IdentificationSortField>[]
): Promise<IIdentificationGetAction> => {
  const sort = _.chain(sorts)
    .map(sort => `${sort.field}%20${sort.dir}`)
    .join(",")
    .value();
  const params = _.pickBy({ ...pagination, ...filter }, val => val);
  const response = await celestineApi().get(`/admin/user?sort=${sort}`, {
    params
  });
  const identifications = response.data.data;
  const meta = response.data.meta;
  return {
    type: EIdentificationActionTypes.IDENTIFICATION_GET,
    identifications,
    realTotal: meta.total
  };
};

export const updateUserFilter = (
  filter: PIdentificationFilter
): IIdentificationFilterUpdateAction => {
  return {
    type: EIdentificationActionTypes.IDENTIFICATION_FILTER_UPDATE,
    filter
  };
};

export const updateUserPagination = (
  pagination: PIdentificationPagination
): IIdentificationPaginationUpdateAction => {
  return {
    type: EIdentificationActionTypes.IDENTIFICATION_PAGINATION_UPDATE,
    pagination
  };
};

export const updateUserSorts = (
  sorts: ISort<IdentificationSortField>[]
): IIdentificationSortsUpdateAction => {
  return {
    type: EIdentificationActionTypes.IDENTIFICATION_SORTS_UPDATE,
    sorts
  };
};
