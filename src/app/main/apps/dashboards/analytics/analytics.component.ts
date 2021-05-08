import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

import { Go, Back, SaveAgreement, AddCustomer, GetYearsForReport, GetRevenueForReport, GetOrderList } from 'app/store/actions';
import { Store } from '@ngrx/store';

import { State as AppState, getAuthState, getOrderState } from 'app/store/reducers';
import { fuseAnimations } from '@fuse/animations';
import { User } from 'app/models/user';

import { AnalyticsDashboardService } from 'app/main/apps/dashboards/analytics/analytics.service';

@Component({
    selector     : 'analytics-dashboard',
    templateUrl  : './analytics.component.html',
    styleUrls    : ['./analytics.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})

export class AnalyticsDashboardComponent implements OnInit
{
    user: User;
    widgets: any;
    years : any = null;
    revenue: any;

    next30 : any = null;
    next60 : any = null;
    next90 : any = null;

    orderList : any = null;
    widget1SelectedYear = '2020';
    widget5SelectedDay = 'today';

    /**
     * Constructor
     *
     * @param {AnalyticsDashboardService} _analyticsDashboardService
     */
    constructor(
        private _analyticsDashboardService: AnalyticsDashboardService,
        private _store: Store<AppState>,
        private _cdref: ChangeDetectorRef,
    )
    {
        this._store.dispatch(new GetYearsForReport());
        this._store.dispatch(new GetRevenueForReport());
        this._store.dispatch(new GetOrderList());

        // Register the custom chart.js plugin
        this._registerCustomChartJSPlugin();
        this.mapUserStateToModel();
        this.mapRevenueStateToModel();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Get the widgets from the service
        this.widgets = this._analyticsDashboardService.widgets;
    }

    ngAfterViewChecked(): void 
    {   
        if(this.next30 != null && this.next60 != null && this.next90 != null && this.orderList.length === 5)
            return;
        this.next30 = this._analyticsDashboardService.next30;
        this.next60 = this._analyticsDashboardService.next60;
        this.next90 = this._analyticsDashboardService.next90;

        this.orderList = this._analyticsDashboardService.orderList;
        //console.log(this.orderList);
        this._cdref.detectChanges();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // ------------------------------------------------------------------------------------------------------

    goToApplcation() : void
    {
        this._store.dispatch(new Go({path: ['/ui/customers/customer-order-list'], query: null, extras: null}));

    }
    onClick(year : any) 
    {
        this.widget1SelectedYear = year.year
        console.log(this.widgets);
    }

    mapUserStateToModel(): void
    {
        this.getAuthState().subscribe(state => {
            if(state.user != null) {
                this.user = new User(state.user);
            }
        });
    }
    mapRevenueStateToModel() : void
    {
        this.getOrderState().subscribe(state => {
            if(state.years != null && state.years.length != 0) {
                this.years = state.years;
                this.widget1SelectedYear = this.years[0].year;
            }
        });

    }
    getAuthState() 
    {
        return this._store.select(getAuthState);
    }

    getOrderState() 
    {
        return this._store.select(getOrderState);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register a custom plugin
     */
    private _registerCustomChartJSPlugin(): void
    {
        (window as any).Chart.plugins.register({
            
            afterDatasetsDraw: function(chart, easing): any {
                // Only activate the plugin if it's made available
                // in the options

                if (
                    !chart.options.plugins.xLabelsOnTop ||
                    (chart.options.plugins.xLabelsOnTop && chart.options.plugins.xLabelsOnTop.active === false)
                )
                {
                    return;
                }

                // To only draw at the end of animation, check for easing === 1
                const ctx = chart.ctx;

                chart.data.datasets.forEach(function(dataset, i): any {
                    const meta = chart.getDatasetMeta(i);
                    if ( !meta.hidden )
                    {
                        meta.data.forEach(function(element, index): any {

                            // Draw the text in black, with the specified font
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                            const fontSize = 13;
                            const fontStyle = 'normal';
                            const fontFamily = 'Roboto, Helvetica Neue, Arial';
                            ctx.font = (window as any).Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                            // Just naively convert to string for now
                            const dataString = '$' + ((dataset.data[index] * 500).toFixed(2)).toString();

                            // Make sure alignment settings are correct
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            const padding = 15;
                            const startY = 24;
                            const position = element.tooltipPosition();
                            ctx.fillText(dataString, position.x, startY);

                            ctx.save();

                            ctx.beginPath();
                            ctx.setLineDash([5, 3]);
                            ctx.moveTo(position.x, startY + padding);
                            ctx.lineTo(position.x, position.y - padding);
                            ctx.strokeStyle = 'rgba(255,255,255,0.12)';
                            ctx.stroke();

                            ctx.restore();
                        });
                    }
                });
            }
        });
    }
}

