import { ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseNavigationItem } from '@fuse/types';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';

import { Store } from '@ngrx/store';
import {State as AppState, getAuthState} from 'app/store/reducers';

@Component({
    selector   : 'fuse-nav-vertical-item',
    templateUrl: './item.component.html',
    styleUrls  : ['./item.component.scss']
})
export class FuseNavVerticalItemComponent implements OnInit, OnDestroy
{
    @HostBinding('class')
    classes = 'nav-item';

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

         /*this.getAuthstate().subscribe(state => {
            if(state.user != null) {
                if(state.user.role == "Super User") {
                    if(this.item.id == "collaborator-forms" || this.item.id == "instructor-forms") {
                        this.item.hidden = true;
                    }
                    else 
                        this.item.hidden = null;
                }
                else if(state.user.role == 'Collaborator/Employee') {
                    if(this.item.id == "company-forms" || this.item.id == "instructor-forms" || this.item.id == "membership") {
                        this.item.hidden = true;
                    }
                    else 
                        this.item.hidden = null;
                }
                else if(state.user.role == 'Instructor') {
                    if(this.item.id == "company-forms" || this.item.id == "collaborator-forms"|| this.item.id == "membership") {
                        this.item.hidden = true;
                    }
                    else 
                        this.item.hidden = null;
                }
                else 
                    this.item.hidden = null;
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
