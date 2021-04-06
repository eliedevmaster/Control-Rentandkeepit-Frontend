import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { InstructorListService } from 'app/main/ui/company/instructor-list/instructor-list.service';
import { InstructorPermissionFormComponent } from 'app/main/ui/company/instructor-list/instructor-permission-form/instructor-permission-form.component';

import { User } from 'app/models/user';
import { Instructor } from 'app/models/instructormanagement/instructor';

@Component({
    selector: 'app-instructor-item',
    templateUrl: './instructor-item.component.html',
    styleUrls: ['./instructor-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class InstructorItemComponent implements OnInit, OnDestroy {

    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    willLoad: boolean = true;
    instructorList: Array<Instructor>;
    user: User;
    dataSource: MatTableDataSource<Instructor> | null;
    displayedColumns = ['checkbox', 'avatar', 'name', 'email', 'phone', 'action'];
    selectedInstructorList: Instructor[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {InstructorListService} _instructorListService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _instructorListService: InstructorListService,
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
        this.dataSource = new MatTableDataSource(this._instructorListService.instructorList);
        this._instructorListService.onSelectedInstructorListChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(instructorList => {
                this.instructorList = instructorList;

                this.checkboxes = {};
                instructorList.map(instructor => {
                    this.checkboxes[instructor.id] = false;
                });
            });

        this._instructorListService.onSelectedInstructorListChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedInstructorList => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedInstructorList.includes(id);
                }
                this.selectedInstructorList = selectedInstructorList;
            });

        this._instructorListService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._instructorListService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._instructorListService.deselectInstructorList();
            });

        this._instructorListService.onSearchTextChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
            this.dataSource = new MatTableDataSource(this._instructorListService.instructorList);
        }); 
        this._cdref.detectChanges();

        if(this._instructorListService.instructorList.length != 0)
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
     * @param instructor
     */
    editInstructor(instructor): void
    {
        this.dialogRef = this._matDialog.open(InstructorPermissionFormComponent, {
            panelClass: 'contact-form-dialog',
            data      : {
                instructor: instructor,
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
                        console.log("edit....");
                        //this._instructorListService.updateContact(formData.getRawValue());
                        break;
                    /**
                     * Delete
                     */
                    case 'cancel':
                        console.log("cancel....");
                        //this.deleteInstructor(instructor);
                        break;
                }
            });
    }

    /**
     * Delete Contact
     */
    deleteInstructor(instructor): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._instructorListService.deleteCollabroator(instructor);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param instructor
     */
    onSelectedChange(instructorId): void
    {
        this._instructorListService.toggleSelectedInstructor(instructorId);
    }

    /**
     * Toggle star
     *
     * @param instructorId
     */
    toggleStar(instructorId): void
    {
        /*if ( this.user.starred.includes(contactId) )
        {
            this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
        }
        else
        {
            this.user.starred.push(contactId);
        }

        this._instructorListService.updateUserData(this.user);*/
    }
    }

    export class FilesDataSource extends DataSource<any>
    {
    /**
     * Constructor
     *
     * @param {InstructorListService} _instructorListService
     */
    constructor(
        private _instructorListService: InstructorListService
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
        return this._instructorListService.onSelectedInstructorListChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}