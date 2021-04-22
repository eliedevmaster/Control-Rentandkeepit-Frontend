import { CustomerActionTypes, CustomerActions } from '../actions/customer.action';

export interface State {
  customerList: any | null;
  orderListForCustomer: any | null;
  errorMessage: string | null; 
}

export const initialState: State = {
    customerList: null,
    orderListForCustomer : null,
    errorMessage: '',
  };
  
  export function reducer(state = initialState, action: CustomerActions): State {
    switch (action.type) {
      
        case CustomerActionTypes.GET_CUSTOMER_LIST_COMPLETE: {
            return {
                ...state,
                customerList: action.payload.customerList,
            };
        }

        case CustomerActionTypes.GET_ORDER_LIST_FOR_CUSTOMER_COMPLETE: {
          return {
              ...state,
              orderListForCustomer : action.payload.orderList,
          };
        }
       
        
        default: {
            return state;
            }
        }
  }
  
  export const selectCustomer = (state: State)  => state.customerList;