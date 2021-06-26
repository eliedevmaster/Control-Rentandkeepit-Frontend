import { Action } from '@ngrx/store';
import { Customer } from 'app/models/customer';
import { DEFAULT_ECDH_CURVE } from 'tls';

export enum CustomerActionTypes {

    GET_CUSTOMER_LIST = '[Customer] GET_CUSTOMER_LIST',
    GET_CUSTOMER_LIST_COMPLETE = '[Customer] GET_CUSTOMER_LIST_COMPLETE',
    GET_CUSTOMER_LIST_ERROR = '[Customer] GET_CUSTOMER_LIST_ERROR',

    GET_ORDER_LIST_FOR_CUSTOMER = '[Customer] GET_ORDER_LIST_FOR_CUSTOMER',
    GET_ORDER_LIST_FOR_CUSTOMER_COMPLETE = '[Customer] GET_ORDER_LIST_FOR_CUSTOMER_COMPLETE',
    GET_ORDER_LIST_FOR_CUSTOMER_ERROR = '[Customer] GET_ORDER_LIST_FOR_CUSTOMER_ERROR',

    ADD_CUSTOMER = '[Customer] ADD_CUSTOMER',
    ADD_CUSTOMER_COMPLETE = '[Customer] ADD_CUSTOMER_COMPLETE',
    ADD_CUSTOMER_ERROR = '[Customer] ADD_CUSTOMER_ERROR',

    UPDATE_CUSTOMER = '[Customer] UPDATE_CUSTOMER',
    UPDATE_CUSTOMER_COMLETE = '[Customer] UPDATE_CUSTOMER_COMLETE',
    UPDATE_CUSTOMER_ERROR = '[Customer] UPDATE_CUSTOMER_ERROR',


    GET_USER_LIST = '[Cusotmer] GET_USER_LIST',
    GET_USER_LIST_COMPLETE = '[Cusotmer] GET_USER_LIST_COMPLETE',
    GET_USER_LSIT_ERROR = '[Cusotmer] GET_USER_LSIT_ERROR',

    CREATE_USER = '[Customer] CREATE_USER',
    CREATE_USER_COMPLETE = '[Customer] CREATE_USER_COMPLETE',
    CREATE_USER_ERROR = '[Customer] CREATE_USER_ERROR',
    
    UPDATE_USER = '[Customer] UPDATE_USER',
    UPDATE_USER_COMPLETE = '[Customer] UPDATE_USER_COMPLETE',
    UPDATE_USER_ERROR = '[Customer] UPDATE_USER_ERROR',
    

    DELETE_USER = '[Customer] DELETE_USER',
    DELETE_USER_COMPLETE = '[Customer] DELETE_USER_COMPLETE',
    DELETE_USER_ERROR = '[Customer] DELETE_USER_ERROR',
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

export class AddCustomer implements Action {
    readonly type = CustomerActionTypes.ADD_CUSTOMER;
    constructor (public payload: {customer: any}) {}
}

export class AddCustomerComplete implements Action {
    readonly type = CustomerActionTypes.ADD_CUSTOMER_COMPLETE;
}

export class AddCustomerError implements Action {
    readonly type = CustomerActionTypes.ADD_CUSTOMER_ERROR;
    constructor (public payload: {errorMessage: any}) {}
}


export class UpdateCustomer implements Action {
    readonly type = CustomerActionTypes.UPDATE_CUSTOMER;
    constructor (public payload: {customer: any}) {}
}

export class UpdateCustomerComplete implements Action {
    readonly type = CustomerActionTypes.UPDATE_CUSTOMER_COMLETE;
}

export class UpdateCustomerError implements Action {
    readonly type = CustomerActionTypes.UPDATE_CUSTOMER_ERROR;
    constructor (public payload: {errorMessage: any}) {}
}

export class GetUserList implements Action {
    readonly type = CustomerActionTypes.GET_USER_LIST;
}
  
export class GetUserListComplete implements Action {
    readonly type = CustomerActionTypes.GET_USER_LIST_COMPLETE;
    constructor (public payload: {userList: any}) {}
}
  
export class GetUserListError implements Action {
    readonly type = CustomerActionTypes.GET_USER_LSIT_ERROR;
    constructor (public payload: {errorMessage: string}) {}
}
  
export class CreateUser implements Action {
    readonly type = CustomerActionTypes.CREATE_USER;
    constructor (public payload: {user : any}) {}
}

export class CreateUserComplete implements Action {
    readonly type = CustomerActionTypes.CREATE_USER_COMPLETE;
}

export class CreateUserError implements Action {
    readonly type = CustomerActionTypes.CREATE_USER_ERROR;
    constructor (public payload: {errorMessage: string}) {}
}

export class UpdateUser implements Action {
    readonly type = CustomerActionTypes.UPDATE_USER;
    constructor (public payload: {user : any}) {}
}

export class UpdateUserComplete implements Action {
    readonly type = CustomerActionTypes.UPDATE_USER_COMPLETE;
}

export class UpdateUserError implements Action {
    readonly type = CustomerActionTypes.UPDATE_CUSTOMER_ERROR;
    constructor (public payload: {errorMessage: string}) {}
}

export class DeleteUser implements Action {
    readonly type = CustomerActionTypes.DELETE_USER;
    constructor (public payload: {userId : number}) {}
}

export class DeleteUserComplete implements Action {
    readonly type = CustomerActionTypes.DELETE_USER_COMPLETE;
}

export class DeleteUserError implements Action {
    readonly type = CustomerActionTypes.DELETE_USER_ERROR;
    constructor (public payload: {errorMessage : string}) {}
}

export type CustomerActions
 =  GetCustomerList
 | GetCustomerListComplete
 | GetCustomerListError
 | GetOrderListForCustomer
 | GetOrderListForCustomerComplete
 | GetOrderListForCustomerError
 | AddCustomer
 | AddCustomerComplete
 | AddCustomerError
 | UpdateCustomer
 | UpdateCustomerComplete
 | UpdateCustomerError
 | GetUserList
 | GetUserListComplete
 | GetUserListError
 | CreateUser
 | CreateUserComplete
 | CreateUserError
 | UpdateUser
 | UpdateUserComplete
 | UpdateUserError
 | DeleteUser
 | DeleteUserComplete
 | DeleteUserError;
