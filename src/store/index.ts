import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { adminUserReducer } from "./adminUser";
import { authReducer } from "./auth";
import { configReducer } from "./config";
import { depositFeeReducer } from "./deposit-fee";
import { identificationReducer } from "./identification";
import { productBrandReducer } from "./product-brand";
import { productCategoryReducer } from "./product-category";
import { specialCategoryReducer } from "./special-category";
import { userReducer } from "./user";
import { promoCodeReducer } from "./promo-code";
import { withdrawRequestReducer } from "./withdraw-request";

// Whenever an action is dispatched, Redux will update each top-level application state property
// using the reducer with the matching name. It's important that the names match exactly, and that
// the reducer acts on the corresponding ApplicationState property type.
export const rootReducer = combineReducers({
  adminUser: adminUserReducer,
  auth: authReducer,
  config: configReducer,
  depositFee: depositFeeReducer,
  form: formReducer,
  identification: identificationReducer,
  productBrand: productBrandReducer,
  productCategory: productCategoryReducer,
  promoCode: promoCodeReducer,
  specialCategory: specialCategoryReducer,
  user: userReducer,
  withdrawRequest: withdrawRequestReducer
});

export type RootState = ReturnType<typeof rootReducer>;
