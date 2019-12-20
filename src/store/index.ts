import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { adminUserReducer } from "./adminUser";
import { authReducer } from "./auth";
import { identificationReducer } from "./identification";
import { productCategoryReducer } from "./product-categories";
import { userReducer } from "./user";

// Whenever an action is dispatched, Redux will update each top-level application state property
// using the reducer with the matching name. It's important that the names match exactly, and that
// the reducer acts on the corresponding ApplicationState property type.
export const rootReducer = combineReducers({
  adminUser: adminUserReducer,
  auth: authReducer,
  form: formReducer,
  identification: identificationReducer,
  productCategory: productCategoryReducer,
  user: userReducer
});

export type RootState = ReturnType<typeof rootReducer>;
