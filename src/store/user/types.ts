import { ISort } from "src/util/types";

// enums
export enum EUserActionTypes {
  USER_GET = "@@user/USER_GET",
  USER_FILTER_UPDATE = "@@user/USER_FILTER_UPDATE",
  USER_PAGINATION_UPDATE = "@@user/USER_PAGINATION_UPDATE",
  USER_SORTS_UPDATE = "@@user/USER_SORTS_UPDATE"
}

// entity types
export interface IUser {
  active_refund_shipping_address_id: number | null;
  active_shipping_address_id: number | null;
  bank: {
    id: number;
    name: string;
    number: string;
    owner: string;
    used_for_withdraw: boolean;
    user_id: number;
  };
  banned: boolean;
  birthday: string;
  country_code: string;
  created_at: string;
  email: string;
  failed_login_count: number;
  froze: boolean;
  full_name: string;
  gender: string;
  id: number;
  is_seller: false;
  last_login_at: string;
  last_login_device: string;
  last_login_ip: string;
  login_count: number;
  phone: string;
  phone_verification_counter: number;
  referral_code: string;
  referrer_id: number | null;
  store_close_end_date: string | null;
  store_close_start_date: string | null;
  store_closed: boolean;
  username: string;
  verified_email: string | null;
  verified_phone: string;
  wallet: {
    amount: number;
    id: number;
    user_id: number;
  };
}

interface IUserFilter {
  id: string;
  username: string;
  full_name: string;
  email: string;
  store_closed: string;
  banned: string;
  froze: string;
  is_seller: string;
  created_at_start: string;
  created_at_end: string;
}
export type PUserFilter = Partial<IUserFilter>;

interface IUserPagination {
  limit: number;
  offset: number;
}
export type PUserPagination = Partial<IUserPagination>;

export type UserSortField = "id" | "username" | "full_name" | "email";

// redux state type
export interface IUserState {
  users: IUser[];
  filter: PUserFilter;
  pagination: PUserPagination;
  sorts: ISort<UserSortField>[];
  realTotal: number;
}

// action types
export interface IUserGetAction {
  type: EUserActionTypes.USER_GET;
  users: IUser[];
  realTotal: number;
}

export interface IUserFilterUpdateAction {
  type: EUserActionTypes.USER_FILTER_UPDATE;
  filter: PUserFilter;
}

export interface IUserPaginationUpdateAction {
  type: EUserActionTypes.USER_PAGINATION_UPDATE;
  pagination: PUserPagination;
}

export interface IUserSortsUpdateAction {
  type: EUserActionTypes.USER_SORTS_UPDATE;
  sorts: ISort<UserSortField>[];
}

export interface IShippingAddress {
  additional_info: string | null;
  address: string;
  city: string;
  country: string;
  id: number;
  name: string;
  phone: string;
  province: string;
  recipient: string;
  used_for_transaction: boolean;
  user_id: number;
  zip_code: string;
}

export type UserActionType =
  | IUserGetAction
  | IUserFilterUpdateAction
  | IUserPaginationUpdateAction
  | IUserSortsUpdateAction;
