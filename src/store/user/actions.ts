import _ from "lodash";
import {
  EUserActionTypes,
  IUserGetAction,
  PUserFilter,
  PUserPagination,
  UserSortField
} from "./types";
import celestineApi from "src/apis/celestine";
import { ISort } from "src/util/types";
import { PRIMARY_ROUTE } from "./constants";

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
  const response = await celestineApi().get(`${PRIMARY_ROUTE}?sort=${sort}`, {
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
