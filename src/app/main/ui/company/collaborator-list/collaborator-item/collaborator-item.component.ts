import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { CollaboratorListService } from 'app/main/ui/company/collaborator-list/collaborator-list.service';
import { CollaboratorPermissionFormComponent } from 'app/main/ui/company/collaborator-list/collaborator-permission-form/collaborator-permission-form.component';

import { User } from 'app/models/user';
import { Collaborator } from 'app/models/collaboratormanagement/collaborator';

@Component({
  selector: 'app-collaborator-item',
  templateUrl: './collaborator-item.component.html',
  styleUrls: ['./collaborator-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class CollaboratorItemComponent implements OnInit, OnDestroy{

    @ViewChild('dialogContent') dialogContent: TemplateRef<any>;

    willLoad: boolean = true;
    collaboratorList: Array<Collaborator>;
    user: User;
    dataSource: MatTableDataSource<Collaborator> | null;
    displayedColumns = ['checkbox', 'avatar', 'name', 'email', 'phone', 'action'];
    selectedCollaboratorList: Collaborator[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {CollaboratorListService} _collaboratorListService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _collaboratorListService: CollaboratorListService,
        private _cdref: ChangeDetectorRef,
        public _matDialog: MatDialog
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
        
    }

    ngAfterViewChecked(): void 
    {
        if(!this.willLoad)
            return;
        this.dataSource = new MatTableDataSource(this._collaboratorListService.collaboratorList);
        this._collaboratorListService.onSelectedCollaboratorListChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(collaboratorList => {
                this.collaboratorList = collaboratorList;

                this.checkboxes = {};
                collaboratorList.map(collaborator => {
                    this.checkboxes[collaborator.id] = false;
                });
            });

        this._collaboratorListService.onSelectedCollaboratorListChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedCollaboratorList => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedCollaboratorList.includes(id);
                }
                this.selectedCollaboratorList = selectedCollaboratorList;
            });

        this._collaboratorListService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._collaboratorListService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._collaboratorListService.deselectCollaboratorList();
            });

        this._collaboratorListService.onSearchTextChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
            this.dataSource = new MatTableDataSource(this._collaboratorListService.collaboratorList);
        });    
        this._cdref.detectChanges();
        if(this._collaboratorListService.collaboratorList.length != 0)
            this.willLoad = false;

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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Edit contact
     *
     * @param collaborator
     */
    editCollaborator(collaborator): void
    {
        this.dialogRef = this._matDialog.open(CollaboratorPermissionFormComponent, {
            panelClass: 'contact-form-dialog',
            data      : {
                collaborator: collaborator,
                action : 'edit'
            }
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {
                if ( !response )
                {
                    return;
                }
                const actionType: string = response[0];
                const formData: boolean = response[1];
                switch ( actionType )
                {
                    /**
                     * Save
                     */
                    case 'save':
                        //this._collaboratorListService.updateContact(formData.getRawValue());
                        break;
                    /**
                     * Delete
                     */
                    case 'cancel':
                        console.log("cancel....");
                        //this.deleteCollaborator(collaborator);
                        break;
                }
            });
    }

    /**
     * Delete Contact
     */
    deleteCollaborator(collaborator): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._collaboratorListService.deleteCollabroator(collaborator);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param collaboratorId
     */
    onSelectedChange(collaboratorId): void
    {
        this._collaboratorListService.toggleSelectedCollaborator(collaboratorId);
    }

    /**
     * Toggle star
     *
     * @param collaboratorId
     */
    toggleStar(collaboratorId): void
    {
        /*if ( this.user.starred.includes(contactId) )
        {
            this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
        }
        else
        {
            this.user.starred.push(contactId);
        }

        this._collaboratorListService.updateUserData(this.user);*/
    }
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {CollaboratorListService} _collaboratorListService
     */
    constructor(
        private _collaboratorListService: CollaboratorListService
    )
    {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        return this._collaboratorListService.onSelectedCollaboratorListChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
  }