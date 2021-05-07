import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Go, Back, SaveAgreement, AddCustomer, GetYearsForReport, GetRevenueForReport } from 'app/store/actions';
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
    years : any;
    revenue: any;

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
    )
    {
        this._store.dispatch(new GetYearsForReport());
        this._store.dispatch(new GetRevenueForReport());
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
        console.log(this.widgets);
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
            if(state.years != null) {
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
                            const dataString = '$' + (dataset.data[index] * 500).toString();

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

