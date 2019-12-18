import _ from "lodash";
import {
  EUserActionTypes,
  IUserGetAction,
  IUserFilterUpdateAction,
  PUserFilter,
  PUserPagination,
  IUserPaginationUpdateAction,
  IUserSortsUpdateAction,
  UserSortField
} from "./types";
import celestineApi from "src/apis/celestine";
import { ISort } from "src/util/types";

export const getUsers = async (
  pagination: PUserPagination,
  filter: PUserFilter,
  sorts: ISort<UserSortField>[]
): Promise<IUserGetAction> => {
  const sort = _.chain(sorts)
    .map(sort => `${sort.field}%20${sort.dir}`)
    .join(",")
    .value();
  const created_at = Boolean(filter.created_at_start && filter.created_at_end)
    ? `${filter.created_at_start},${filter.created_at_end}`
    : undefined;
  const params = _.pickBy(
    {
      ...pagination,
      ..._.omit(filter, ["created_at_start", "created_at_end"]),
      created_at
    },
    val => val
  );
  const response = await celestineApi().get(`/admin/user?sort=${sort}`, {
    params
  });
  const users = response.data.data;
  const meta = response.data.meta;
  return {
    type: EUserActionTypes.USER_GET,
    users,
    realTotal: meta.total
  };
};

export const updateUserFilter = (
  filter: PUserFilter
): IUserFilterUpdateAction => {
  return {
    type: EUserActionTypes.USER_FILTER_UPDATE,
    filter
  };
};

export const updateUserPagination = (
  pagination: PUserPagination
): IUserPaginationUpdateAction => {
  return {
    type: EUserActionTypes.USER_PAGINATION_UPDATE,
    pagination
  };
};

export const updateUserSorts = (
  sorts: ISort<UserSortField>[]
): IUserSortsUpdateAction => {
  return {
    type: EUserActionTypes.USER_SORTS_UPDATE,
    sorts
  };
};
