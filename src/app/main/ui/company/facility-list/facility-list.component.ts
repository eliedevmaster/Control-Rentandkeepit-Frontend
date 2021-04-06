import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { Store } from '@ngrx/store';
import { State as AppState, getAuthState, } from 'app/store/reducers';
import { GetFacilityListForMe, Go } from 'app/store/actions';
import { FacilityListService } from 'app/main/ui/company/facility-list/facility-list.service';
import { User } from 'app/models/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facility-list',
  templateUrl: './facility-list.component.html',
  styleUrls: ['./facility-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class FacilityListComponent implements OnInit {

    dialogRef: any;
    hasSelectedFacilitys: boolean;
    searchInput: FormControl;
    user: User;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ContactsService} _facilityListService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _facilityListService: FacilityListService,
        private _fuseSidebarService: FuseSidebarService,
        private _store: Store<AppState>,
    )
    {
        // Set the defaults
        this.searchInput = new FormControl('');

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.mapUserStateToModel();
        this._store.dispatch(new GetFacilityListForMe({companyId : this.user.role_relation_id}));
    }


        // -----------------------------------------------------------------------------------------------------
        // @ Lifecycle hooks
        // -----------------------------------------------------------------------------------------------------

        /**
         * On init
         */
        ngOnInit(): void
        {
            this._facilityListService.onSelectedFacilityListChanged
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(selectedFacilitys => {
                    this.hasSelectedFacilitys = selectedFacilitys.length > 0;
                });

            this.searchInput.valueChanges
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    debounceTime(300),
                    distinctUntilChanged()
                )
                .subscribe(searchText => {
                    this._facilityListService.onSearchTextChanged.next(searchText);
                });
        }

        /**
         * On destroy
         */
        ngOnDestroy(): void
        {
            // Reset the search
            this._facilityListService.onSearchTextChanged.next('');

            // Unsubscribe from all subscriptions
            this._unsubscribeAll.next();
            this._unsubscribeAll.complete();
        }
    // -----------------------------------------------------------------------------------------------------
        // @ Public methods
        // -----------------------------------------------------------------------------------------------------

        /**
         * New contact
         */
        newFacility(): void
        {
            if(this.user.active == 0) {
                Swal.fire('Ooops!', 'You have to register company at first!', 'error');
                this._store.dispatch(new Go({path: ['/ui/register-company'], query: null, extras: null}));
                return;
            }
            this._store.dispatch(new Go({path: ['/ui/company/register-facility/' + this.user.role_relation_id], query: null, extras: null}));
        }
        /**
         * Toggle the sidebar
         *
         * @param name
         */
        toggleSidebar(name): void
        {
            this._fuseSidebarService.getSidebar(name).toggleOpen();
        }

        mapUserStateToModel(): void
        {
            this.getAuthState().subscribe(state => {
                if(state.user != null) {
                    this.user = new User(state.user);
                }
            });
        }

        getAuthState()
        {
            return this._store.select(getAuthState);
        }

}
