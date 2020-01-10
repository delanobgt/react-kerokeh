import { Reducer } from "redux";
import { EBannerActionTypes, IBannerState, BannerActionType } from "./types";

const initialState: IBannerState = {
  banners: [],
  realTotal: 0
};

const reducer: Reducer<IBannerState, BannerActionType> = (
  state = initialState,
  action: BannerActionType
): IBannerState => {
  switch (action.type) {
    case EBannerActionTypes.BANNER_GET: {
      const { banners } = action;
      return {
        ...state,
        banners,
        realTotal: action.realTotal
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as bannerReducer };
