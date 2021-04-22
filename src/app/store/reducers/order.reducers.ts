import { Actions } from '@ngrx/effects';
import { OrderActionTypes, OrderActions } from '../actions/order.action';

export interface State {
    orderList: any | null;
    errorMessage: string | null; 
}
  
export const initialState: State = {
  
    orderList: null,
    errorMessage: '',
};

export function reducer(state = initialState, action: OrderActions): State {
    switch (action.type) {

        case OrderActionTypes.ADD_ORDER_ERROR: {
            return {
                ...state,
                errorMessage : action.payload.errorMessage,
            }
        }
        
        case OrderActionTypes.GET_ORDER_LIST_COMPLETE: {
            return {
                ...state,
                orderList : action.payload.orderList,
            }
        }

         
        case OrderActionTypes.SAVE_AGREEMENT_COMPLETE: {
            return {
                ...state,
            };
          }
  
        case OrderActionTypes.SAVE_AGREEMENT_ERROR: {
            return {
                ...state,
                errorMessage : action.payload.errorMessage,
            }
        }

        case OrderActionTypes.SET_ORDER_STATUS_COMPLETE: {
            return {
                ...state,
            };
        }
        default: {
            return state;
        }
    }
}
  
export const selectOrder = (state: State)  => state.orderList;