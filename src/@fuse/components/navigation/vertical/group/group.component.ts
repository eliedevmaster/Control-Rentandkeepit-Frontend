import { ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseNavigationItem } from '@fuse/types';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';

import { Store } from '@ngrx/store';
import {State as AppState, getAuthState} from 'app/store/reducers';

@Component({
    selector   : 'fuse-nav-vertical-group',
    templateUrl: './group.component.html',
    styleUrls  : ['./group.component.scss']
})
export class FuseNavVerticalGroupComponent implements OnInit, OnDestroy
{
    @HostBinding('class')
    classes = 'nav-group nav-item';

    @Input()
    item: FuseNavigationItem;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     */

    /**
     *
     * @param {ChangeDetectorRef} _changeDetectorRef
     * @param {FuseNavigationService} _fuseNavigationService
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseNavigationService: FuseNavigationService,
        private _store: Store<AppState>,
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to navigation item
        merge(
            this._fuseNavigationService.onNavigationItemAdded,
            this._fuseNavigationService.onNavigationItemUpdated,
            this._fuseNavigationService.onNavigationItemRemoved
        ).pipe(takeUntil(this._unsubscribeAll))
         .subscribe(() => {

             // Mark for check
             this._changeDetectorRef.markForCheck();
         });

        /* this.getAuthstate().subscribe(state => {
            
            if(this.item.id == "companymanagement") {
                if(state.user != null && state.user.role == "Owner") {
                    this.item.hidden = null;
                }
                else
                    this.item.hidden = true;
            }
            
            if(this.item.id == "register") {
                if(state.user != null && state.user.role == "Owner") 
                    this.item.hidden = true;
                else this.item.hidden = null;       
            }
            if(this.item.id == "permission" || this.item.id == "course") {
                if(state.user != null && state.user.role != "Super User") 
                    this.item.hidden = true;
                else this.item.hidden = null;
            }
                
         });*/
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getAuthstate()
    {
        return this._store.select(getAuthState);
    }

}
