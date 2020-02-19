import { IProduct } from "src/store/product";
import { IShippingAddress } from "../user";
import { IBnibTransaction } from "../bnib-transaction";

// enums
export enum EBnibBuyOrderActionTypes {
  BNIB_BUY_ORDER_GET = "@@bnib-buy-order/BNIB_BUY_ORDER_GET"
}

export enum EBnibBuyOrderStatus {
  OnSelling,
  WaitingPaymentFromBuyer,
  WaitingTrackingCode,
  Shipping,
  Expired,
  Dropped,
  Refunded,
  Cancelled,
  Disputed,
  Done
}

// entity types
export interface IBnibBuyOrder {
  bid_fee: number;
  bid_invoice_id: number;
  bid_refund_wallet_mutation_id: number;
  bid_status: boolean | number;
  bid_wallet_mutation_id: number;
  bought_status: boolean | number;
  buyer_id: number;
  buyer_username: string;
  code: string;
  created_at: string;
  direct_match: boolean | number;
  drop_wallet_mutation_id: number;
  dropped: boolean | number;
  id: number;
  locked_status: boolean | number;
  matched: boolean | number;
  matched_bnib_product_id: number;
  payment_invoice: null;
  payment_invoice_id: number;
  payment_wallet_mutation_id: number;
  pre_order: boolean | number;
  price: number;
  product_detail: IProduct;
  product_id: number;
  product_size: string;
  product_size_id: number;
  promo_code_id: number;
  refund_wallet_mutation_id: number;
  refunded: boolean | number;
  refunded_reason: string;
  reviewed: boolean | number;
  shipping_address: IShippingAddress;
  shipping_address_id: number;
  shipping_cost: number;
  shipping_cost_after_promo: number;
  status: number;
  status_message: string;
  transaction: IBnibTransaction;
}
export type PBnibBuyOrder = Partial<IBnibBuyOrder>;

interface IBnibBuyOrderFilter {
  code: string;
  status: string;
  pre_order: string;
  matched: string;
  buyer_username: string;
}
export type PBnibBuyOrderFilter = Partial<IBnibBuyOrderFilter>;

interface IBnibBuyOrderPagination {
  limit: number;
  offset: number;
}
export type PBnibBuyOrderPagination = Partial<IBnibBuyOrderPagination>;

export type BnibBuyOrderSortField =
  | "code"
  | "created_at"
  | "id"
  | "price"
  | "product_size"
  | "buyer_username";

// redux state type
export interface IBnibBuyOrderState {
  bnibBuyOrders: IBnibBuyOrder[];
  realTotal: number;
}

// action types
export interface IBnibBuyOrderGetAction {
  type: EBnibBuyOrderActionTypes.BNIB_BUY_ORDER_GET;
  bnibBuyOrders: IBnibBuyOrder[];
  realTotal: number;
}

export type BnibBuyOrderActionType = IBnibBuyOrderGetAction;
