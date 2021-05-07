import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';

import { State as AppState, getAuthState, getOrderState } from 'app/store/reducers';
import { Observable } from 'rxjs';

@Injectable()
export class AnalyticsDashboardService implements Resolve<any>
{
    widgets: any[];

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
                        if(state.revenueList != null) {
                            this.widgets['revenue']['datasets'] = JSON.parse(JSON.stringify(state.revenueList['revenue']));
                            this.widgets['profit']['datasets'] = JSON.parse(JSON.stringify(state.revenueList['profit']));
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
