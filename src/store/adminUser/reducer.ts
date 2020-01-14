import _ from "lodash";
import { Reducer } from "redux";
import {
  EAdminUserActionTypes,
  IAdminUserState,
  AdminUserActionType
} from "./types";

const initialState: IAdminUserState = {
  adminUsers: {}
};

const reducer: Reducer<IAdminUserState, AdminUserActionType> = (
  state = initialState,
  action: AdminUserActionType
): IAdminUserState => {
  switch (action.type) {
    case EAdminUserActionTypes.USER_GET: {
      const adminUsers = action.adminUsers;
      return {
        adminUsers: _.mapKeys(adminUsers, "id")
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as adminUserReducer };
