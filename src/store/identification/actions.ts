import _ from "lodash";
import {
  PIdentificationFilter,
  PIdentificationPagination,
  IdentificationSortField,
  IIdentificationGetAction,
  EIdentificationActionTypes
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
  const response = await celestineApi().get(
    `/admin/identification?sort=${sort}`,
    {
      params
    }
  );
  const identifications = response.data.data;
  const meta = response.data.meta;
  return {
    type: EIdentificationActionTypes.IDENTIFICATION_GET,
    identifications,
    realTotal: meta.total
  };
};
