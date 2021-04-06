import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';


import { GetCollaboratorListForMe } from 'app/store/actions';
import { Store } from '@ngrx/store';
import { State as AppState, getAuthState } from 'app/store/reducers';

import { CollaboratorListService } from 'app/main/ui/company/collaborator-list/collaborator-list.service';
import { CollaboratorPermissionFormComponent } from './collaborator-permission-form/collaborator-permission-form.component';
import { User } from 'app/models/user';

@Component({
    selector: 'app-collaborator-list',
    templateUrl: './collaborator-list.component.html',
    styleUrls: ['./collaborator-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations

})

export class CollaboratorListComponent implements OnInit, OnDestroy {

    dialogRef: any;
    hasSelectedCollaborators: boolean;
    searchInput: FormControl;
    user: User;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ContactsService} _collaboratorListService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _collaboratorListService: CollaboratorListService,
        private _fuseSidebarService: FuseSidebarService,
        private _store: Store<AppState>,
        private _matDialog: MatDialog,
    )
    {
        // Set the defaults
        this.searchInput = new FormControl('');

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.mapUserStateToModel();
        this._store.dispatch(new GetCollaboratorListForMe({companyId : this.user.role_relation_id}));
    }


        // -----------------------------------------------------------------------------------------------------
        // @ Lifecycle hooks
        // -----------------------------------------------------------------------------------------------------

        /**
         * On init
         */
        ngOnInit(): void
        {
            this._collaboratorListService.onSelectedCollaboratorListChanged
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(selectedCollaborators => {
                    this.hasSelectedCollaborators = selectedCollaborators.length > 0;
                });

            this.searchInput.valueChanges
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    debounceTime(300),
                    distinctUntilChanged()
                )
                .subscribe(searchText => {
                    this._collaboratorListService.onSearchTextChanged.next(searchText);
                });
        }

        /**
         * On destroy
         */
        ngOnDestroy(): void
        {
            // Reset the search
            this._collaboratorListService.onSearchTextChanged.next('');

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
        newCollaborator(): void
        {
            this.dialogRef = this._matDialog.open(CollaboratorPermissionFormComponent, {
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

                    this._collaboratorListService.updateContact(response.getRawValue());
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
