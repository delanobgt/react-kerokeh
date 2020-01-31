import { IProduct } from "src/store/product";
import { IShippingAddress } from "../user";

// enums
export enum EBnibTransactionActionTypes {
  BNIB_TRANSACTION_GET = "@@bnib-transaction/BNIB_TRANSACTION_GET"
}

export enum EBnibTransactionStatus {
  WaitingPaymentFromBuyer,
  WaitingTrackingCode,
  SellerExpired,
  BuyerExpired,
  ShippingToDepatu,
  ArrivedAtDepatu,
  LegitChecking,
  LegitCheckAuthentic,
  LegitCheckIndefinable,
  LegitCheckFake,
  RefundedByDepatu,
  DisputedByDepatu,
  AcceptedByDepatu,
  DefectProceedApproval,
  DefectReject,
  ShippingToBuyer,
  ArrivedAtBuyer,
  ShippingToSeller,
  ArrivedAtSeller,
  BuyerConfirmation,
  SellerCancel,
  Done
}

export enum EAccessLogStatus {
  WaitingSellerInputTrack = "waiting-seller-input-track",
	WaitingBuyerPayment     = "waiting-buyer-payment",
	BuyerPaid               = "buyer-paid",
	SellerInputTrack        = "seller-input-track",
	Arrived                 = "arrived",
	Accepted                = "accepted",
	Rejected                = "rejected",
	ArrivedAtBuyer          = "arrived-at-buyer",
	ConfirmationBuyer       = "arrived-at-buyer",
	DefectTrue              = "defect-true",
	DefectFalse             = "defect-false",
	DefectTrueAccept        = "defect-true-accept",
	DefectTrueReject        = "defect-true-reject",
	Disputed                = "disputed",
	LegitCheckFake          = "legit-check-fake",
	LegitCheckIndefinable   = "legit-check-indefinable",
	LegitCheckAuthentic     = "legit-check-authentic",
	Refunded                = "refunded", // send back to seller
	SellerCancel            = "seller-cancel",
	DepatuSend              = "depatu-send", // send to buyer
}

// entity types
export interface IAccessLogItem {
  admin_username: string;
  user_id: number;
  time: string;
}

export interface IBnibTransaction {
  access_log: string;
  accessLog: Record<EAccessLogStatus, IAccessLogItem>;
  bid_payment_expired_at: string;
  bnib_buy_order_id: number;
  bnib_buy_order_invoice_code: string;
  bnib_product_id: number;
  buyer_confirmation: number | boolean;
  buyer_confirmation_expired_at: string;
  buyer_id: number;
  buyer_username: string;
  buyer_shipping_address_id: number;
  buyer_shipping_cost: number;
  buyer_shipping_provider: string;
  buyer_shipping_tracking_code: string;
  code: string;
  created_at: string;
  defected_buyer_approval: boolean | number;
  defected_buyer_approval_expired_at: string;
  defected_image_url: string;
  defected_image_urls: string[];
  defected_note: string;
  id: number;
  is_defected: number | boolean;
  legit_checked: number | boolean;
  legit_status: string;
  office_shipping_input_expired_at: string;
  office_shipping_provider: string;
  office_shipping_tracking_code: string;
  product_detail: IProduct;
  refund_shipping_address_id: number;
  refund_shipping_provider: string;
  refund_shipping_tracking_code: string;
  seller_confirmation_expired_at: string;
  seller_id: number;
  seller_username: string;
  shipping_address: IShippingAddress;
  status: number;
  status_message: string;
  refund_reason: string;
}
export type PBnibTransaction = Partial<IBnibTransaction>;

export interface ILegitCheck {
  bnib_transaction_id: number;
  created_by: string;
  final_result: string;
  id: number;
  image_url: string;
  image_urls: string[];
  legit_check_detail: ILegitCheckDetail[];
  notes: string;
  result_published_by: string;
}
export type PLegitCheck = Partial<ILegitCheck>;

export interface ILegitCheckDetail {
  checker_initial: string;
  created_by: string;
  currency: string;
  id: number;
  legit_check_id: number;
  price: number;
  result: string;
  updated_by: string;
}
export type PLegitCheckDetail = Partial<ILegitCheckDetail>;

interface IBnibTransactionFilter {
  code: string;
  status: string;
  buyer_username: string;
  seller_username: string;
  office_shipping_tracking_code: string;
  buyer_shipping_tracking_code: string;
  refund_shipping_tracking_code: string;
}
export type PBnibTransactionFilter = Partial<IBnibTransactionFilter>;

interface IBnibTransactionPagination {
  limit: number;
  offset: number;
}
export type PBnibTransactionPagination = Partial<IBnibTransactionPagination>;

export type BnibTransactionSortField =
  | "code"
  | "created_at"
  | "id"
  | "is_defected"
  | "legit_checked"
  | "legit_status"
  | "status"
  | "office_shipping_tracking_code"
  | "buyer_shipping_tracking_code"
  | "refund_shipping_tracking_code";

// redux state type
export interface IBnibTransactionState {
  bnibTransactions: IBnibTransaction[];
  realTotal: number;
}

// action types
export interface IBnibTransactionGetAction {
  type: EBnibTransactionActionTypes.BNIB_TRANSACTION_GET;
  bnibTransactions: IBnibTransaction[];
  realTotal: number;
}

export type BnibTransactionActionType = IBnibTransactionGetAction;
