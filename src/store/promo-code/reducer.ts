import { Reducer } from "redux";
import {
  EPromoCodeActionTypes,
  IPromoCodeState,
  PromoCodeActionType
} from "./types";

const initialState: IPromoCodeState = {
  promoCodes: [],
  realTotal: 0
};

const reducer: Reducer<IPromoCodeState, PromoCodeActionType> = (
  state = initialState,
  action: PromoCodeActionType
): IPromoCodeState => {
  switch (action.type) {
    case EPromoCodeActionTypes.PROMO_CODE_GET: {
      const { promoCodes } = action;
      return {
        ...state,
        promoCodes,
        realTotal: action.realTotal
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as promoCodeReducer };
