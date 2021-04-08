import { Action } from '@ngrx/store';

export enum CustomerActionTypes {

    GET_CUSTOMER_LIST = '[Customer] GET_CUSTOMER_LIST',
    GET_CUSTOMER_LIST_COMPLETE = '[Customer] GET_CUSTOMER_LIST_COMPLETE',
    GET_CUSTOMER_LIST_ERROR = '[Customer] GET_CUSTOMER_LIST_ERROR',

    GET_ORDER_LIST_FOR_CUSTOMER = '[Customer] GET_ORDER_LIST_FOR_CUSTOMER',
    GET_ORDER_LIST_FOR_CUSTOMER_COMPLETE = '[Customer] GET_ORDER_LIST_FOR_CUSTOMER_COMPLETE',
    GET_ORDER_LIST_FOR_CUSTOMER_ERROR = '[Customer] GET_ORDER_LIST_FOR_CUSTOMER_ERROR',
  
}

export class GetCustomerList implements Action {
    readonly type = CustomerActionTypes.GET_CUSTOMER_LIST;
}
  
export class GetCustomerListComplete implements Action {
    readonly type = CustomerActionTypes.GET_CUSTOMER_LIST_COMPLETE;
    constructor (public payload: {customerList: any}) {}
}
  
export class GetCustomerListError implements Action {
    readonly type = CustomerActionTypes.GET_CUSTOMER_LIST_ERROR;
    constructor (public payload: {errorMessage: string}) {}
}

export class GetOrderListForCustomer implements Action {
    readonly type = CustomerActionTypes.GET_ORDER_LIST_FOR_CUSTOMER;
    constructor (public payload: {customerId: number}) {}
}
  
export class GetOrderListForCustomerComplete implements Action {
    readonly type = CustomerActionTypes.GET_ORDER_LIST_FOR_CUSTOMER_COMPLETE;
    constructor (public payload: {orderList: any}) {}
}

export class GetOrderListForCustomerError implements Action {
    readonly type = CustomerActionTypes.GET_ORDER_LIST_FOR_CUSTOMER_ERROR;
    constructor (public payload: {errorMessage: string}) {}
}

export type CustomerActions
 =  GetCustomerList
 | GetCustomerListComplete
 | GetCustomerListError
 | GetOrderListForCustomer
 | GetOrderListForCustomerComplete
 | GetOrderListForCustomerError;
