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
import { GetWeekdayListForCompany, RegisterWeekday, UpdateWeekday } from 'app/store';


import { WeekdayListService } from 'app/main/ui/company/courses/course-base/weekday-list/weekday-list.service';
import { WeekdayFormComponent } from 'app/main/ui/company/courses/course-base/weekday-list/weekday-form/weekday-form.component';

import { User } from 'app/models/user';
import { Weekday } from 'app/models/companymanagement/weekday';
import { DeleteWeekday } from 'app/store';

@Component({
  selector: 'app-weekday-item',
  templateUrl: './weekday-item.component.html',
  styleUrls: ['./weekday-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class WeekdayItemComponent implements OnInit {

    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    willLoad: boolean = true;
    weekdayListLength: number = 0;

    weekdayList: Array<Weekday>;
    user: User;
    dataSource: MatTableDataSource<Weekday> | null;
    displayedColumns = ['checkbox', 'avatar', 'name', /*'su',*/ 'mo', 'tu','we', 'th', 'fr', 'sa', 'action'];
    selectedWeekdayList: Weekday[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {WeekdayListService} _weekdayListService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _weekdayListService: WeekdayListService,
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
        if(!this.willLoad  && this.weekdayListLength == this._weekdayListService.weekdayList.length)
            return;
        
        this.dataSource = new MatTableDataSource(this._weekdayListService.weekdayList);
        this._weekdayListService.onSelectedWeekdayListChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(weekdayList => {
                this.weekdayList = weekdayList;

                this.checkboxes = {};
                weekdayList.map(weekday => {
                    this.checkboxes[weekday.id] = false;
                });
            });

        this._weekdayListService.onSelectedWeekdayListChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedWeekdayList => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedWeekdayList.includes(id);
                }
                this.selectedWeekdayList = selectedWeekdayList;
            });

        this._weekdayListService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._weekdayListService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._weekdayListService.deselectWeekdayList();
            });

        this._weekdayListService.onSearchTextChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
            this.dataSource = new MatTableDataSource(this._weekdayListService.weekdayList);
        }); 
        this._cdref.detectChanges();
        this.weekdayListLength = this._weekdayListService.weekdayList.length;

        if(this.weekdayListLength != 0)
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
     * @param weekday
     */
    editWeekday(weekday): void
    {
        this.dialogRef = this._matDialog.open(WeekdayFormComponent, {
            panelClass: 'contact-form-dialog',
            data      : {
                weekday: weekday,
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
                        //this._weekdayListService.updateContact(formData.getRawValue());
                        break;
                    /**
                     * Delete
                     */
                    case 'cancel':
                        console.log("cancel....");
                        //this.deleteWeekday(Weekday);
                        break;
                }
            });
    }

    /**
     * Delete Contact
     */
    deleteWeekday(weekday): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._store.dispatch(new DeleteWeekday({weekdayId : weekday.id}));
                this._weekdayListService.deleteWeekday(weekday);
            }
            this.confirmDialogRef = null;
        });

    }

    duplicateWeekday(weekday): void
    {
        const payload = {
        company_id : this.user.role_relation_id,
        name       : weekday.name,
        days       : weekday.days,
        }
        this._store.dispatch(new RegisterWeekday({ weekday : payload }));
        this._store.dispatch(new GetWeekdayListForCompany({companyId : this.user.role_relation_id})); 
    }

    checkedToggleValue(weekday: any, day: number): boolean 
    {
        let days = JSON.parse(weekday.days);
        let isExsistingDay = days.find(e => e == day);
        if(isExsistingDay)
            return true;
        return false;
    }
    /**
     * On selected change
     *
     * @param weekday
     */
    onSelectedChange(weekdayId): void
    {
        this._weekdayListService.toggleSelectedWeekday(weekdayId);
    }

    /**
     * Toggle star
     *
     * @param weekdayId
     */
    toggleStar(weekdayId): void
    {
        /*if ( this.user.starred.includes(contactId) )
        {
            this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
        }
        else
        {
            this.user.starred.push(contactId);
        }

        this._weekdayListService.updateUserData(this.user);*/
    }
  }

  export class FilesDataSource extends DataSource<any>
  {
  /**
   * Constructor
   *
   * @param {WeekdayListService} _weekdayListService
   */
  constructor(
      private _weekdayListService: WeekdayListService
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
      return this._weekdayListService.onSelectedWeekdayListChanged;
  }

  /**
   * Disconnect
   */
  disconnect(): void
  {
  }
}