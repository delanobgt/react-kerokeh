// enums
export enum ETopUpActionTypes {
  TOP_UP_GET = "@@top-up/TOP_UP_GET"
}

// entity types
export interface ITopUp {
  amount: number;
  code: string;
  created_at: string;
  description: string;
  fraud_status: string;
  id: 1;
  invoice_id: null | number;
  payment_channel: string;
  payment_code: string;
  payment_status: string;
  payment_type: string;
  user_id: number;
  username: string;
  virtual_account_number: number;
  wallet_mutation_id: number;
}
export type PTopUp = Partial<ITopUp>;

interface ITopUpFilter {
  code: string;
  payment_status: string;
  created_at_start: string;
  created_at_end: string;
  username: string;
}
export type PTopUpFilter = Partial<ITopUpFilter>;

interface ITopUpPagination {
  limit: number;
  offset: number;
}
export type PTopUpPagination = Partial<ITopUpPagination>;

export type TopUpSortField =
  | "amount"
  | "code"
  | "created_at"
  | "description"
  | "fraud_status"
  | "id"
  | "invoice_id"
  | "payment_channel"
  | "payment_code"
  | "payment_status"
  | "payment_type"
  | "virtual_account_number";

// redux state type
export interface ITopUpState {
  topUps: ITopUp[];
  realTotal: number;
}

// action types
export interface ITopUpGetAction {
  type: ETopUpActionTypes.TOP_UP_GET;
  topUps: ITopUp[];
  realTotal: number;
}

export type TopUpActionType = ITopUpGetAction;
