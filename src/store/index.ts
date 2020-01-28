import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { adminUserReducer } from "./adminUser";
import { authReducer } from "./auth";
import { bannerReducer } from "./banner";
import { bnibTransactionReducer } from "./bnib-transaction";
import { configReducer } from "./config";
import { depositFeeReducer } from "./deposit-fee";
import { identificationReducer } from "./identification";
import { productReducer } from "./product";
import { productBrandReducer } from "./product-brand";
import { productCategoryReducer } from "./product-category";
import { productRequestReducer } from './product-request';
import { specialCategoryReducer } from "./special-category";
import { specialCategoryListReducer } from "./special-category-list";
import { topUpReducer } from "./top-up";
import { userReducer } from "./user";
import { promoCodeReducer } from "./promo-code";
import { withdrawRequestReducer } from "./withdraw-request";

// Whenever an action is dispatched, Redux will update each top-level application state property
// using the reducer with the matching name. It's important that the names match exactly, and that
// the reducer acts on the corresponding ApplicationState property type.
export const rootReducer = combineReducers({
  adminUser: adminUserReducer,
  auth: authReducer,
  banner: bannerReducer,
  bnibTransaction: bnibTransactionReducer,
  depositFee: depositFeeReducer,
  config: configReducer,
  form: formReducer,
  identification: identificationReducer,
  product: productReducer,
  productBrand: productBrandReducer,
  productCategory: productCategoryReducer,
  productRequest: productRequestReducer,
  promoCode: promoCodeReducer,
  specialCategory: specialCategoryReducer,
  specialCategoryList: specialCategoryListReducer,
  topUp: topUpReducer,
  user: userReducer,
  withdrawRequest: withdrawRequestReducer
});

export type RootState = ReturnType<typeof rootReducer>;
