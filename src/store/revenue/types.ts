// enums
export enum ERevenueActionTypes {
  REVENUE_GET = "@@revenue/REVENUE_GET"
}

// entity types
export interface IRevenue {
  admin_fee: number;
  bid_share: number;
  bnib_transaction_id: number;
  bnib_transaction_code: string;
  buyer_id: number;
  buyer_promo_code_id: number;
  buyer_username: string;
  deposit_share: number;
  id: number;
  seller_id: number;
  seller_promo_code_id: number;
  seller_username: string;
  shipping_revenue: number;
  total_revenue: number;
  type: number;
}
export type PRevenue = Partial<IRevenue>;

interface IRevenueFilter {
  id: string;
  buyer_username: string;
  seller_username: string;
  created_at_start: string;
  created_at_end: string;
}
export type PRevenueFilter = Partial<IRevenueFilter>;

interface IRevenuePagination {
  limit: number;
  offset: number;
}
export type PRevenuePagination = Partial<IRevenuePagination>;

export type RevenueSortField =
  | "admin_fee"
  | "bid_share"
  | "bnib_transaction_id"
  | "buyer_id"
  | "buyer_promo_code_id"
  | "deposit_share"
  | "id"
  | "seller_id"
  | "seller_promo_code_id"
  | "shipping_revenue"
  | "total_revenue"
  | "type";

// redux state type
export interface IRevenueState {
  revenues: IRevenue[];
  realTotal: number;
}

// action types
export interface IRevenueGetAction {
  type: ERevenueActionTypes.REVENUE_GET;
  revenues: IRevenue[];
  realTotal: number;
}

export type RevenueActionType = IRevenueGetAction;
