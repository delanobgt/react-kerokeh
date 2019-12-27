// enums
export enum EDepositFeeActionTypes {
  DEPOSIT_FEE_GET = "@@deposit-fee/DEPOSIT_FEE_GET"
}

// entity types
export interface IDepositFee {
  id: number;
  fee: number;
  starting_price: number;
  created_by: string;
  updated_by: string;
}
export type PDepositFee = Partial<IDepositFee>;

interface IDepositFeeFilter {}
export type PDepositFeeFilter = Partial<IDepositFeeFilter>;

interface IDepositFeePagination {
  limit: number;
  offset: number;
}
export type PDepositFeePagination = Partial<IDepositFeePagination>;

export type DepositFeeSortField = "";

// redux state type
export interface IDepositFeeState {
  depositFees: IDepositFee[];
  realTotal: number;
}

// action types
export interface IDepositFeeGetAction {
  type: EDepositFeeActionTypes.DEPOSIT_FEE_GET;
  depositFees: IDepositFee[];
  realTotal: number;
}

export type DepositFeeActionType = IDepositFeeGetAction;
