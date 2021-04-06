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

import { Store } from '@ngrx/store';
import { State as AppState, getAuthState } from 'app/store/reducers';
import { GetTimescheduleListForCompany, RegisterTimeschedule, UpdateTimeschedule } from 'app/store';


import { TimescheduleListService } from 'app/main/ui/company/courses/course-base/timeschedule-list/timeschedule-list.service';
import { TimescheduleFormComponent } from 'app/main/ui/company/courses/course-base/timeschedule-list/timeschedule-form/timeschedule-form.component';

import { User } from 'app/models/user';
import { Timeschedule } from 'app/models/companymanagement/timeschedule';
import { DeleteTimeschedule } from 'app/store';

@Component({
  selector: 'app-timeschedule-item',
  templateUrl: './timeschedule-item.component.html',
  styleUrls: ['./timeschedule-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class TimescheduleItemComponent implements OnInit {


    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    willLoad: boolean = true;
    timescheduleListLength: number = 0;

    timescheduleList: Array<Timeschedule>;
    user: User;
    dataSource: MatTableDataSource<Timeschedule> | null;
    displayedColumns = ['checkbox', 'avatar', 'name', 'startTime', 'endTime', 'action'];
    selectedTimescheduleList: Timeschedule[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {TimescheduleListService} _timescheduleListService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _timescheduleListService: TimescheduleListService,
        private _cdref: ChangeDetectorRef,
        private _store: Store<AppState>,
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
        if(!this.willLoad  && this.timescheduleListLength == this._timescheduleListService.timescheduleList.length)
            return;
        
        this.dataSource = new MatTableDataSource(this._timescheduleListService.timescheduleList);
        this._timescheduleListService.onSelectedTimescheduleListChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(timescheduleList => {
                this.timescheduleList = timescheduleList;

                this.checkboxes = {};
                timescheduleList.map(timeschedule => {
                    this.checkboxes[timeschedule.id] = false;
                });
            });

        this._timescheduleListService.onSelectedTimescheduleListChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedTimescheduleList => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedTimescheduleList.includes(id);
                }
                this.selectedTimescheduleList = selectedTimescheduleList;
            });

        this._timescheduleListService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._timescheduleListService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._timescheduleListService.deselectTimescheduleList();
            });

        this._timescheduleListService.onSearchTextChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
            this.dataSource = new MatTableDataSource(this._timescheduleListService.timescheduleList);
        }); 
        this._cdref.detectChanges();
        this.timescheduleListLength = this._timescheduleListService.timescheduleList.length;

        if(this.timescheduleListLength != 0)
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
     * @param timeschedule
     */
    editTimeschedule(timeschedule): void
    {
        this.dialogRef = this._matDialog.open(TimescheduleFormComponent, {
            panelClass: 'contact-form-dialog',
            data      : {
              timeschedule: timeschedule,
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
                        //this._timescheduleListService.updateContact(formData.getRawValue());
                        break;
                    /**
                     * Delete
                     */
                    case 'cancel':
                        console.log("cancel....");
                        //this.deleteTimeschedule(Timeschedule);
                        break;
                }
            });
    }

    /**
     * Delete Contact
     */
    deleteTimeschedule(timeschedule): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._store.dispatch(new DeleteTimeschedule({timescheduleId : timeschedule.id}));
                this._timescheduleListService.deleteTimeschedule(timeschedule);
            }
            this.confirmDialogRef = null;
        });

    }

    duplicateTimeschedule(timeschedule): void
    {
        const payload = {
          company_id : this.user.role_relation_id,
          name       : timeschedule.name,
          start_time : timeschedule.start_time,
          end_time   : timeschedule.end_time,
        }
        this._store.dispatch(new RegisterTimeschedule({ timeschedule : payload }));
        this._store.dispatch(new GetTimescheduleListForCompany({companyId : this.user.role_relation_id})); 
    }

    checkedToggleValue(timeschedule: any, day: number): boolean 
    {
        let days = JSON.parse(timeschedule.days);
        let isExsistingDay = days.find(e => e == day);
        if(isExsistingDay)
            return true;
        return false;
    }
    /**
     * On selected change
     *
     * @param timeschedule
     */
    onSelectedChange(timescheduleId): void
    {
        this._timescheduleListService.toggleSelectedTimeschedule(timescheduleId);
    }

    /**
     * Toggle star
     *
     * @param timescheduleId
     */
    toggleStar(timescheduleId): void
    {
        /*if ( this.user.starred.includes(contactId) )
        {
            this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
        }
        else
        {
            this.user.starred.push(contactId);
        }

        this._timescheduleListService.updateUserData(this.user);*/
    }
  }

  export class FilesDataSource extends DataSource<any>
  {
  /**
   * Constructor
   *
   * @param {TimescheduleListService} _timescheduleListService
   */
  constructor(
      private _timescheduleListService: TimescheduleListService
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
      return this._timescheduleListService.onSelectedTimescheduleListChanged;
  }

  /**
   * Disconnect
   */
  disconnect(): void
  {
  }
}