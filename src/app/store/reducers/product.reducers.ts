import { ProductActionTypes, ProductActions } from '../actions/product.action';

export interface State {
    productList: any | null;
    errorMessage : string | null;
}

export const initialState: State = {
    productList : null,
    errorMessage: '',
};

export function reducer(state = initialState, action: ProductActions): State {
    switch (action.type) {
      
        case ProductActionTypes.GET_PRODUCT_LIST_COMPLETE: {
            return {
                ...state,
                productList: action.payload.productList,
            };
        }
        
        default: {
            return state;
            }
        }
  }
  
  export const selectProduct = (state: State)  => state.productList;