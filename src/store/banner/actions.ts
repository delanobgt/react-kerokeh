import _ from "lodash";
import {
  PBannerFilter,
  PBannerPagination,
  BannerSortField,
  IBannerGetAction,
  EBannerActionTypes
} from "./types";
import celestineApi from "src/apis/celestine";
import { ISort } from "src/util/types";
import { PRIMARY_ROUTE } from "./constants";

export const getBanners = async (
  pagination: PBannerPagination,
  filter: PBannerFilter,
  sorts: ISort<BannerSortField>[]
): Promise<IBannerGetAction> => {
  const sort = _.chain(sorts)
    .map(sort => `${sort.field}%20${sort.dir}`)
    .join(",")
    .value();
  const expired_at = Boolean(filter.expired_at_start && filter.expired_at_end)
    ? `${filter.expired_at_start},${filter.expired_at_end}`
    : undefined;
  const params = _.pickBy(
    {
      ...pagination,
      ..._.omit(filter, ["created_at_start", "created_at_end"]),
      expired_at
    },
    val => val
  );
  const response = await celestineApi().get(`${PRIMARY_ROUTE}?sort=${sort}`, {
    params
  });
  const banners = response.data.data;
  const meta = response.data.meta;
  return {
    type: EBannerActionTypes.BANNER_GET,
    banners,
    realTotal: meta.total
  };
};
