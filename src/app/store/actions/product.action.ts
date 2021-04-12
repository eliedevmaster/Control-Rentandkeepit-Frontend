import { Action } from '@ngrx/store';

export enum ProductActionTypes {
    GET_PRODUCT_LIST = '[Product] GET_PRODUCT_LIST',
    GET_PRODUCT_LIST_COMPLETE = '[Product] GET_PRODUCT_LIST_COMPLETE',
    GET_PRODUCT_LIST_ERROR = '[Product] GET_PRODUCT_LIST_ERROR',
}

export class GetProductList implements Action {
    readonly type = ProductActionTypes.GET_PRODUCT_LIST;
}
  
export class GetProductListComplete implements Action {
    readonly type = ProductActionTypes.GET_PRODUCT_LIST_COMPLETE;
    constructor (public payload: {productList: any}) {}
}
  
export class GetProductListError implements Action {
    readonly type = ProductActionTypes.GET_PRODUCT_LIST_ERROR;
    constructor (public payload: {errorMessage: string}) {}
}

export type ProductActions
 =  GetProductList
 | GetProductListComplete
 | GetProductListError;