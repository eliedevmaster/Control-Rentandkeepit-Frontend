import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';

import { State as AppState, getAuthState, getOrderState } from 'app/store/reducers';
import { Observable } from 'rxjs';
import { ComingSoonModule } from 'app/main/pages/coming-soon/coming-soon.module';

@Injectable()
export class AnalyticsDashboardService implements Resolve<any>
{
    widgets: any[];
    next30: any;
    next60: any;
    next90: any;

    orderList : any[] = [];
    
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private _store: Store<AppState>,
    )
    {
    }
    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise<void>((resolve, reject) => {

            Promise.all([
                this.getWidgets()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get widgets
     *
     * @returns {Promise<any>}
     */
    getWidgets(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/analytics-dashboard-widgets')
                .subscribe((response: any) => {
                    this.widgets = response;
                    this.getOrderState().subscribe(state => {
                        if(state.revenueList != null && state.revenueList['revenue'] != null && state.revenueList['profit'] != null) {
                            this.widgets['revenue']['datasets'] = JSON.parse(JSON.stringify(state.revenueList['revenue']));
                            this.widgets['profit']['datasets'] = JSON.parse(JSON.stringify(state.revenueList['profit']));

                            this.next30 = JSON.parse(JSON.stringify(state.revenueList['next30'][0]));
                            this.next60 = JSON.parse(JSON.stringify(state.revenueList['next60'][0]));
                            this.next90 = JSON.parse(JSON.stringify(state.revenueList['next90'][0]));
                        }
                        if(state.orderList != null) {
                            let orderListTemp : any = state.orderList;
                            orderListTemp = orderListTemp.filter(x => x.status === 'wc-processing');
                            this.orderList = orderListTemp.slice(0, 5);
                            //console.log('orderList : ', this.orderList);
                        }
                        

                    });
                    
                    resolve(this.widgets);
                }, reject);
        });
    }

    getOrderState() 
    {
        return this._store.select(getOrderState);
    }
}
