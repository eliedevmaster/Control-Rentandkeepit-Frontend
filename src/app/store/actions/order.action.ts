import { Action } from '@ngrx/store';

export enum OrderActionTypes {

    ADD_ORDER = '[Order] ADD_ORDER',
    ADD_ORDER_COMPLETE = '[Order] ADD_ORDER_COMPLETE',
    ADD_ORDER_ERROR = '[Order] ADD_ORDER_ERROR',

    GET_ORDER_LIST = '[Order] GET_ORDER_LIST',
    GET_ORDER_LIST_COMPLETE = '[Order] GET_ORDER_LIST_COMPLETE',
    GET_ORDER_LIST_ERROR = '[Order] GET_ORDER_LIST_ERROR',

    SAVE_AGREEMENT = '[Order] SAVE_AGREEMENT',
    SAVE_AGREEMENT_COMPLETE = '[Order] SAVE_AGREEMENT_COMPLETE',
    SAVE_AGREEMENT_ERROR = '[Order] SAVE_AGREEMENT_ERROR',

    SET_ORDER_STATUS = "[Order] SET_STATUS",
    SET_ORDER_STATUS_COMPLETE = "[Order] SET_STATUS_COMPLETE",
    SET_ORDER_STATUS_ERROR = "[Order] SET_STATUS_ERROR",
}

export class AddOrder implements Action {
    readonly type = OrderActionTypes.ADD_ORDER;
    constructor (public payload: {order: any, customer_id: number}) {}
}

export class AddOrderComplete implements Action {
    readonly type = OrderActionTypes.ADD_ORDER_COMPLETE;
}

export class AddOrderError implements Action {
    readonly type = OrderActionTypes.ADD_ORDER_ERROR;
    constructor (public payload: {errorMessage: string}) {}
}

export class GetOrderList implements Action {
    readonly type = OrderActionTypes.GET_ORDER_LIST;
}

export class GetOrderListComplete implements Action {
    readonly type = OrderActionTypes.GET_ORDER_LIST_COMPLETE;
    constructor (public payload: {orderList: any}) {}
}

export class GetOrderListError implements Action {
    readonly type = OrderActionTypes.GET_ORDER_LIST_ERROR;
    constructor(public payload: {errorMessage: string}) {}
}

export class SaveAgreement implements Action {
    readonly type = OrderActionTypes.SAVE_AGREEMENT;
    constructor (public payload: {agreement: any}) {}
}

export class SaveAgreementComplete implements Action {
    readonly type = OrderActionTypes.SAVE_AGREEMENT_COMPLETE;
}

export class SaveAgreementError implements Action {
    readonly type = OrderActionTypes.SAVE_AGREEMENT_ERROR;
    constructor (public payload: {errorMessage: any}) {}
}

export class SetOrderStatus implements Action {
    readonly type = OrderActionTypes.SET_ORDER_STATUS;
    constructor (public payload: {orderStatus: any}) {}
}

export class SetOrderStatusComplete implements Action {
    readonly type = OrderActionTypes.SET_ORDER_STATUS_COMPLETE;
}

export class SetOrderStatusError implements Action {
    readonly type =  OrderActionTypes.SET_ORDER_STATUS_ERROR;
    constructor (public payload: {errorMessage : string}) {}
}

export type OrderActions
 =  AddOrder
 | AddOrderComplete
 | AddOrderError
 | GetOrderList
 | GetOrderListComplete
 | GetOrderListError
 | SaveAgreement
 | SaveAgreementComplete
 | SaveAgreementError
 | SetOrderStatus
 | SetOrderStatusComplete
 | SetOrderStatusError;