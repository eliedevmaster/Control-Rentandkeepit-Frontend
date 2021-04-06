import { Action } from '@ngrx/store';

export enum CustomerActionTypes {

    GET_CUSTOMER_LIST = '[Auth] GET_CUSTOMER_LIST',
    GET_CUSTOMER_LIST_COMPLETE = '[Auth] GET_CUSTOMER_LIST_COMPLETE',
    GET_CUSTOMER_LSIT_ERROR = '[Auth] GET_CUSTOMER_LSIT_ERROR',
  
}

export class GetCustomerList implements Action {
    readonly type = CustomerActionTypes.GET_CUSTOMER_LIST;
}
  
export class GetCustomerListComplete implements Action {
    readonly type = CustomerActionTypes.GET_CUSTOMER_LIST_COMPLETE;
    constructor (public payload: {customerList: any}) {}
}
  
export class GetCustomerListError implements Action {
    readonly type = CustomerActionTypes.GET_CUSTOMER_LSIT_ERROR;
    constructor (public payload: {errorMessage: string}) {}
}

export type CustomerActions
 =  GetCustomerList
 | GetCustomerListComplete
 | GetCustomerListError;
