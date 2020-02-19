import { IProduct } from "src/store/product";
import { IShippingAddress } from "../user";
import { IBnibTransaction } from "../bnib-transaction";

// enums
export enum EBnibProductActionTypes {
  BNIB_PRODUCT_GET = "@@bnib-product/BNIB_PRODUCT_GET"
}

export enum EBnibProductStatus {
  OnBidding,
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
export interface IBnibProduct {
  admin_fee: number;
  admin_fee_after_promo: number;
  code: string;
  created_at: string;
  deposit_fee: number;
  deposit_invoice_id: number;
  deposit_refund_wallet_mutation_id: number;
  deposit_status: boolean | number;
  deposit_wallet_mutation_id: number;
  direct_match: boolean | number;
  drop_wallet_mutation_id: number;
  dropped: boolean | number;
  id: number;
  locked_status: boolean | number;
  matched: boolean | number;
  matched_bnib_buy_order_id: number;
  payout_wallet_mutation_id: number;
  pre_order: boolean | number;
  price: number;
  product_detail: IProduct;
  product_id: number;
  product_size: string;
  product_size_id: number;
  promo_code_id: number;
  refund_shipping_address: IShippingAddress;
  refund_shipping_address_id: number;
  refund_wallet_mutation_id: number;
  refunded: boolean | number;
  refunded_reason: string;
  seller_id: number;
  seller_username: string;
  sold_status: boolean | number;
  status: number;
  status_message: string;
  transaction: IBnibTransaction;
}
export type PBnibProduct = Partial<IBnibProduct>;

interface IBnibProductFilter {
  code: string;
  status: string;
  pre_order: string;
  matched: string;
  seller_username: string;
}
export type PBnibProductFilter = Partial<IBnibProductFilter>;

interface IBnibProductPagination {
  limit: number;
  offset: number;
}
export type PBnibProductPagination = Partial<IBnibProductPagination>;

export type BnibProductSortField =
  | "code"
  | "created_at"
  | "id"
  | "price"
  | "product_size"
  | "seller_username";

// redux state type
export interface IBnibProductState {
  bnibProducts: IBnibProduct[];
  realTotal: number;
}

// action types
export interface IBnibProductGetAction {
  type: EBnibProductActionTypes.BNIB_PRODUCT_GET;
  bnibProducts: IBnibProduct[];
  realTotal: number;
}

export type BnibProductActionType = IBnibProductGetAction;
