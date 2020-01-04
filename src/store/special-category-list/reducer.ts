import { Reducer } from "redux";
import {
  ESpecialCategoryListActionTypes,
  ISpecialCategoryListState,
  SpecialCategoryListActionType
} from "./types";

const initialState: ISpecialCategoryListState = {
  specialCategoryLists: [],
  realTotal: 0
};

const reducer: Reducer<ISpecialCategoryListState, SpecialCategoryListActionType> = (
  state = initialState,
  action: SpecialCategoryListActionType
): ISpecialCategoryListState => {
  switch (action.type) {
    case ESpecialCategoryListActionTypes.SPECIAL_CATEGORY_LIST_GET: {
      const { specialCategoryLists } = action;
      return {
        ...state,
        specialCategoryLists,
        realTotal: action.realTotal
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as specialCategoryListReducer };
