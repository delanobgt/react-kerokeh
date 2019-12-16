import { ISort } from "src/util/types";

// enums
export enum EIdentificationActionTypes {
  IDENTIFICATION_GET = "@@identification/IDENTIFICATION_GET",
  IDENTIFICATION_FILTER_UPDATE = "@@identification/IDENTIFICATION_FILTER_UPDATE",
  IDENTIFICATION_PAGINATION_UPDATE = "@@identification/IDENTIFICATION_PAGINATION_UPDATE",
  IDENTIFICATION_SORTS_UPDATE = "@@identification/IDENTIFICATION_SORTS_UPDATE"
}

// entity types
export interface IIdentification {
  identification_image_url: string;
  identification_with_user_url: string;
  number: string;
  rejected_reason: string | null;
  type: string;
  verification_attempted: boolean;
  verification_rejected: boolean;
  verified: boolean;
}

interface IIdentificationFilter {
  id: string;
  user_id: string;
  type: string;
  verification_attempted: string;
  verified: string;
}
export type PIdentificationFilter = Partial<IIdentificationFilter>;

interface IIdentificationPagination {
  limit: number;
  offset: number;
}
export type PIdentificationPagination = Partial<IIdentificationPagination>;

export type IdentificationSortField =
  | "id"
  | "number"
  | "rejected_reason"
  | "type"
  | "verification_attempted"
  | "verification_rejected"
  | "verified"
  | "verified_by";

// redux state type
export interface IIdentificationState {
  identifications: IIdentification[];
  filter: PIdentificationFilter;
  pagination: PIdentificationPagination;
  sorts: ISort<IdentificationSortField>[];
  realTotal: number;
}

// action types
export interface IIdentificationGetAction {
  type: EIdentificationActionTypes.IDENTIFICATION_GET;
  identifications: IIdentification[];
  realTotal: number;
}

export interface IIdentificationFilterUpdateAction {
  type: EIdentificationActionTypes.IDENTIFICATION_FILTER_UPDATE;
  filter: PIdentificationFilter;
}

export interface IIdentificationPaginationUpdateAction {
  type: EIdentificationActionTypes.IDENTIFICATION_PAGINATION_UPDATE;
  pagination: PIdentificationPagination;
}

export interface IIdentificationSortsUpdateAction {
  type: EIdentificationActionTypes.IDENTIFICATION_SORTS_UPDATE;
  sorts: ISort<IdentificationSortField>[];
}

export type UserActionType =
  | IIdentificationGetAction
  | IIdentificationFilterUpdateAction
  | IIdentificationPaginationUpdateAction
  | IIdentificationSortsUpdateAction;
