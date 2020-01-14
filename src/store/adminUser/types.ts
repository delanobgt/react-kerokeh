// enums
export enum EAdminUserActionTypes {
  USER_GET = "@@adminUser/USER_GET",
}

// entity types
export interface IAdminUser {
  id: number;
  role: {
    id: number;
    name: string;
  };
  username: string;
}

export interface INewAdminUser {
  username: string;
  password: string;
  role_id: number;
}

// action types
export interface IAdminUserGetAction {
  type: EAdminUserActionTypes.USER_GET;
  adminUsers: IAdminUser[];
}

export type AdminUserActionType = IAdminUserGetAction;

// redux state type
export interface IAdminUserState {
  adminUsers: { [key: string]: IAdminUser };
}
