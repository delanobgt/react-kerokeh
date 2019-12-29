// enums
export enum EConfigActionTypes {
  CONFIG_GET = "@@config/CONFIG_GET"
}

// entity types
export interface IConfig {
  created_by: string;
  id: number;
  name: string;
  updated_by: string;
  value: number;
}
export type PConfig = Partial<IConfig>;

interface IConfigFilter {}
export type PConfigFilter = Partial<IConfigFilter>;

interface IConfigPagination {
  limit: number;
  offset: number;
}
export type PConfigPagination = Partial<IConfigPagination>;

export type ConfigSortField = "";

// redux state type
export interface IConfigState {
  configs: IConfig[];
  realTotal: number;
}

// action types
export interface IConfigGetAction {
  type: EConfigActionTypes.CONFIG_GET;
  configs: IConfig[];
  realTotal: number;
}

export type ConfigActionType = IConfigGetAction;
