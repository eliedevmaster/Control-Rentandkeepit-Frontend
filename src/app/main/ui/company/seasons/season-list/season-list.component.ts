import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { Store } from '@ngrx/store';
import { State as AppState, getAuthState, } from 'app/store/reducers';
import { GetSeasonListForCompany, Go } from 'app/store/actions';
import { SeasonListService } from 'app/main/ui/company/seasons/season-list/season-list.service';
import { User } from 'app/models/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-season-list',
  templateUrl: './season-list.component.html',
  styleUrls: ['./season-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class SeasonListComponent implements OnInit {

    dialogRef: any;
    hasSelectedSeasons: boolean;
    searchInput: FormControl;
    user: User;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ContactsService} _seasonListService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _seasonListService: SeasonListService,
        private _fuseSidebarService: FuseSidebarService,
        private _store: Store<AppState>,
    )
    {
        // Set the defaults
        this.searchInput = new FormControl('');

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.mapUserStateToModel();
        this._store.dispatch(new GetSeasonListForCompany({companyId : this.user.role_relation_id}));
    }


        // -----------------------------------------------------------------------------------------------------
        // @ Lifecycle hooks
        // -----------------------------------------------------------------------------------------------------

        /**
         * On init
         */
        ngOnInit(): void
        {
            this._seasonListService.onSelectedSeasonListChanged
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(selectedSeasons => {
                    this.hasSelectedSeasons = selectedSeasons.length > 0;
                });

            this.searchInput.valueChanges
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    debounceTime(300),
                    distinctUntilChanged()
                )
                .subscribe(searchText => {
                    this._seasonListService.onSearchTextChanged.next(searchText);
                });
        }

        /**
         * On destroy
         */
        ngOnDestroy(): void
        {
            // Reset the search
            this._seasonListService.onSearchTextChanged.next('');

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
        newSeason(): void
        {
            if(this.user.active == 0) {
                Swal.fire('Ooops!', 'You have to register company at first!', 'error');
                this._store.dispatch(new Go({path: ['/ui/register-company'], query: null, extras: null}));
                return;
            }
            this._store.dispatch(new Go({path: ['/ui/company/register-season/' + 'new/' + 0], query: null, extras: null}));
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
