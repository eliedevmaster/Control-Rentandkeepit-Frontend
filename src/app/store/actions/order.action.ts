import { Action } from '@ngrx/store';

export enum OrderActionTypes {

    ADD_ORDER = '[Order] ADD_ORDER',
    ADD_ORDER_COMPLETE = '[Order] ADD_ORDER_COMPLETE',
    ADD_ORDER_ERROR = '[Order] ADD_ORDER_ERROR',

    GET_ORDER_LIST = '[Order] GET_ORDER_LIST',
    GET_ORDER_LIST_COMPLETE = '[Order] GET_ORDER_LIST_COMPLETE',
    GET_ORDER_LIST_ERROR = '[Order] GET_ORDER_LIST_ERROR',

    GET_YEARS_FOR_REPORT = '[Order] GET_YEARS',
    GET_YEARS_FOR_REPORT_COMPLETE = '[Order] GET_YEARS_FOR_REPORT_COMPLETE',
    GET_YEARS_FOR_REPORT_ERROR = '[Order] GET_YEARS_FOR_REPORT_ERROR',

    GET_REVENUE_FOR_REPORT = '[Order] GET_REVENUE_FOR_REPORT',
    GET_REVENUE_FOR_REPORT_COMPLETE = '[Order] GET_REVENUE_FOR_REPORT_COMPLETE',
    GET_REVENUE_FOR_REPORT_ERROR = '[Order] GET_REVENUE_FOR_REPORT_ERROR',
    
    SAVE_AGREEMENT = '[Order] SAVE_AGREEMENT',
    SAVE_AGREEMENT_COMPLETE = '[Order] SAVE_AGREEMENT_COMPLETE',
    SAVE_AGREEMENT_ERROR = '[Order] SAVE_AGREEMENT_ERROR',

    SAVE_PROFIT = '[Order] SAVE_PROFIT',
    SAVE_PROFIT_COMPLETE = '[Order] SAVE_PROFIT_COMPLETE',
    SAVE_PROFIT_ERROR = '[Order] SAVE_PROFIT_ERROR',
    
    SET_ORDER_STATUS = "[Order] SET_STATUS",
    SET_ORDER_STATUS_COMPLETE = "[Order] SET_STATUS_COMPLETE",
    SET_ORDER_STATUS_ERROR = "[Order] SET_STATUS_ERROR",

    SAVE_ORDER_META_FIRST = '[Order] SAVE_ORDER_META_FIRST',
    SAVE_ORDER_META_FIRST_COMPLETE = '[Order] SAVE_ORDER_META_FIRST_COMPLETE',
    SAVE_ORDER_META_FIRST_ERROR = '[Order] SAVE_ORDER_META_FIRST_ERROR',

    SAVE_ORDER_META_SECOND = '[Order] SAVE_ORDER_META_SECOND',
    SAVE_ORDER_META_SECOND_COMPLETE = '[Order] SAVE_ORDER_META_SECOND_COMPLETE',
    SAVE_ORDER_META_SECOND_ERROR = '[Order] SAVE_ORDER_META_SECOND_ERROR',

    SAVE_ORDER_META_THIRD = '[Order] SAVE_ORDER_META_THIRD',
    SAVE_ORDER_META_THIRD_COMPLETE = '[Order] SAVE_ORDER_META_THIRD_COMPLETE',
    SAVE_ORDER_META_THIRD_ERROR = '[Order] SAVE_ORDER_META_THIRD_ERROR',
    
    SAVE_ORDER_META_FORTH = '[Order] SAVE_ORDER_META_FORTH',
    SAVE_ORDER_META_FORTH_COMPLETE = '[Order] SAVE_ORDER_META_FORTH_COMPLETE',
    SAVE_ORDER_META_FORTH_ERROR = '[Order] SAVE_ORDER_META_FORTH_ERROR',
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

export class GetYearsForReport implements Action {
    readonly type = OrderActionTypes.GET_YEARS_FOR_REPORT;
}

export class GetYearsForReportComplete implements Action {
    readonly type = OrderActionTypes.GET_YEARS_FOR_REPORT_COMPLETE;
    constructor(public payload : {years : any}) {}
}

export class GetYearsForReportError implements Action {
    readonly type = OrderActionTypes.GET_YEARS_FOR_REPORT_ERROR;
    constructor(public payload : {errorMessage : string}) {}
}

export class GetRevenueForReport implements Action {
    readonly type = OrderActionTypes.GET_REVENUE_FOR_REPORT;
}

export class GetReveneForReportComplete implements Action {
    readonly type = OrderActionTypes.GET_REVENUE_FOR_REPORT_COMPLETE;
    constructor (public payload : {revenueList : any}) {}
}
export class GetRevenueForReportError implements Action {
    readonly type = OrderActionTypes.GET_REVENUE_FOR_REPORT_ERROR;
    constructor (public payload : {errorMessage : string}) {}
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

export class SaveProfit implements Action {
    readonly type = OrderActionTypes.SAVE_PROFIT;
    constructor (public payload: {profit: any}) {}
}

export class SaveProfitComplete implements Action {
    readonly type = OrderActionTypes.SAVE_PROFIT_COMPLETE;
}

export class SaveProfitError implements Action {
    readonly type = OrderActionTypes.SAVE_PROFIT_ERROR;
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

///////////
export class SaveOrderMetaFirst implements Action {
    readonly type = OrderActionTypes.SAVE_ORDER_META_FIRST;
    constructor (public payload: {orderMetaFirst : any}) {}
}

export class SaveOrderMetaFirstComplete implements Action {
    readonly type = OrderActionTypes.SAVE_ORDER_META_FIRST_COMPLETE;
}

export class SaveOrderMetaFirstError implements Action {
    readonly type = OrderActionTypes.SAVE_ORDER_META_FIRST_ERROR;
    constructor (public payload: {errorMessage : string}) {}
}


///////////////////
export class SaveOrderMetaSecond implements Action {
    readonly type = OrderActionTypes.SAVE_ORDER_META_SECOND;
    constructor (public payload: {orderMetaSecond : any}) {}
}

export class SaveOrderMetaSecondComplete implements Action {
    readonly type = OrderActionTypes.SAVE_ORDER_META_SECOND_COMPLETE;
}

export class SaveOrderMetaSecondError implements Action {
    readonly type = OrderActionTypes.SAVE_ORDER_META_SECOND_ERROR;
    constructor (public payload: {errorMessage : string}) {}
}

///////////////////
export class SaveOrderMetaThird implements Action {
    readonly type = OrderActionTypes.SAVE_ORDER_META_THIRD;
    constructor (public payload: {orderMetaThird : any}) {}
}

export class SaveOrderMetaThirdComplete implements Action {
    readonly type = OrderActionTypes.SAVE_ORDER_META_THIRD_COMPLETE;
}

export class SaveOrderMetaThirdError implements Action {
    readonly type = OrderActionTypes.SAVE_ORDER_META_THIRD_ERROR;
    constructor (public payload: {errorMessage : string}) {}
}

/////////////////////
export class SaveOrderMetaForth implements Action {
    readonly type = OrderActionTypes.SAVE_ORDER_META_FORTH;
    constructor (public payload: {orderMetaForth : any}) {}
}

export class SaveOrderMetaForthComplete implements Action {
    readonly type = OrderActionTypes.SAVE_ORDER_META_FORTH_COMPLETE;
}

export class SaveOrderMetaForthError implements Action {
    readonly type = OrderActionTypes.SAVE_ORDER_META_FORTH_ERROR;
    constructor (public payload: {errorMessage : string}) {}
}


export type OrderActions
 =  AddOrder
 | AddOrderComplete
 | AddOrderError
 | GetOrderList
 | GetOrderListComplete
 | GetOrderListError
 | GetYearsForReport
 | GetYearsForReportComplete
 | GetYearsForReportError
 | GetRevenueForReport
 | GetReveneForReportComplete
 | GetRevenueForReportError
 | SaveAgreement
 | SaveAgreementComplete
 | SaveAgreementError
 | SaveProfit
 | SaveProfitComplete
 | SaveProfitError
 | SetOrderStatus
 | SetOrderStatusComplete
 | SetOrderStatusError
 | SaveOrderMetaFirst
 | SaveOrderMetaFirstComplete
 | SaveOrderMetaFirstError
 | SaveOrderMetaSecond
 | SaveOrderMetaSecondComplete
 | SaveOrderMetaSecondError
 | SaveOrderMetaThird
 | SaveOrderMetaThirdComplete
 | SaveOrderMetaThirdError
 | SaveOrderMetaForth
 | SaveOrderMetaForthComplete
 | SaveOrderMetaForthError;