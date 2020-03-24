// enums
export enum EFloatingFundActionTypes {
  FLOATING_FUND_GET = "@@floating_fund/FLOATING_FUND_GET"
}

// entity types
export interface IFloatingFund {
  active_refund_shipping_address_id: number;
  active_shipping_address_id: number;
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
  qr_code: string;
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
export type PFloatingFund = Partial<IFloatingFund>;

interface IFloatingFundFilter {
  id: string;
  username: string;
}
export type PFloatingFundFilter = Partial<IFloatingFundFilter>;

interface IFloatingFundPagination {
  limit: number;
  offset: number;
}
export type PFloatingFundPagination = Partial<IFloatingFundPagination>;

export type FloatingFundSortField = "username";
// redux state type
export interface IFloatingFundState {
  floatingFunds: IFloatingFund[];
  realTotal: number;
}

// action types
export interface IFloatingFundGetAction {
  type: EFloatingFundActionTypes.FLOATING_FUND_GET;
  floatingFunds: IFloatingFund[];
  realTotal: number;
}

export type FloatingFundActionType = IFloatingFundGetAction;
