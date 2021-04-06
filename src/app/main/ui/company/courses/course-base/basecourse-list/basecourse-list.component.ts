import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { Go, GetBasecourseListForCompany } from 'app/store/actions';
import { Store } from '@ngrx/store';
import { State as AppState, getAuthState } from 'app/store/reducers';

import { BasecourseListService } from 'app/main/ui/company/courses/course-base/basecourse-list/basecourse-list.service';
import { BasecourseFormComponent } from './basecourse-form/basecourse-form.component';
import { User } from 'app/models/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-basecourse-list',
  templateUrl: './basecourse-list.component.html',
  styleUrls: ['./basecourse-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})


export class BasecourseListComponent implements OnInit {

    dialogRef: any;
    hasSelectedBasecourses: boolean;
    searchInput: FormControl;
    user: User;
    
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {BasecourseListService}_basecourseListService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _basecourseListService: BasecourseListService,
        private _fuseSidebarService: FuseSidebarService,
        private _store: Store<AppState>,
        private _matDialog: MatDialog
    )
    {
        // Set the defaults
        this.searchInput = new FormControl('');

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.mapUserStateToModel();
        this._store.dispatch(new GetBasecourseListForCompany({companyId : this.user.role_relation_id}));

    }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._basecourseListService.onSelectedBasecourseListChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedBasecourses => {
                this.hasSelectedBasecourses = selectedBasecourses.length > 0;
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._basecourseListService.onSearchTextChanged.next(searchText);
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Reset the search
        this._basecourseListService.onSearchTextChanged.next('');

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
    newBasecourse(): void
    {

        if(this.user.active == 0) {
            Swal.fire('Ooops!', 'You have to register company at first!', 'error');
            this._store.dispatch(new Go({path: ['/ui/register-company'], query: null, extras: null}));
            return;
        }
        if(this.user.active == 0) {
          Swal.fire('Ooops!', 'You have to register company at first!', 'error');
          this._store.dispatch(new Go({path: ['/ui/register-company'], query: null, extras: null}));
          return;
        }
        this.dialogRef = this._matDialog.open(BasecourseFormComponent, {
            panelClass: 'contact-form-dialog',
            data      : {
                action: 'new'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if ( !response )
                {
                    return;
                }
                //this._basecourseListService.updateBasecourse();
            });
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
