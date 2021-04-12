import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { GetProductList, GetProductListComplete, GetProductListError, ProductActionTypes } from '../actions/product.action';

import { Router } from '@angular/router';

import { of } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { Customer } from '../../models/customer';
import Swal from 'sweetalert2/dist/sweetalert2.js';  


@Injectable()
export class ProductEffects
{
    /**
     * Constructor
     *
     * @param {Actions} actions$
     */
    constructor(
        private actions$: Actions,
        private productService: ProductService 
    )
    {
    }

    @Effect()
    products$ = this.actions$.pipe(
        ofType(ProductActionTypes.GET_PRODUCT_LIST),
        switchMap(() => {
            return this.productService.getProductList()
                .pipe(
                map((productList) => {
                    return new GetProductListComplete({productList : productList})
                }),
                catchError((error: Error) => {
                    return of(new GetProductListError({ errorMessage: error.message }));
                })
            );
        })
    );
    
    
}