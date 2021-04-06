import { CustomerActionTypes, CustomerActions } from '../actions/customer.action';
import { Customer } from '../../models/customer'

export interface State {
  customerList: any | null;
  errorMessage: string | null; 
}

export const initialState: State = {
    customerList: null,
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
        
        default: {
            return state;
            }
        }
  }
  
  export const selectCustomer = (state: State)  => state.customerList;