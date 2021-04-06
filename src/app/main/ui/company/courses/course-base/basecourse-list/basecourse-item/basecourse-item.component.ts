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
import { GetBasecourseListForCompany, RegisterBasecourse, UpdateBasecourse } from 'app/store';


import { BasecourseListService } from 'app/main/ui/company/courses/course-base/basecourse-list/basecourse-list.service';
import { BasecourseFormComponent } from 'app/main/ui/company/courses/course-base/basecourse-list/basecourse-form/basecourse-form.component';

import { User } from 'app/models/user';
import { Basecourse } from 'app/models/companymanagement/basecourse';
import { DeleteBasecourse } from 'app/store';

@Component({
  selector: 'app-basecourse-item',
  templateUrl: './basecourse-item.component.html',
  styleUrls: ['./basecourse-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class BasecourseItemComponent implements OnInit {

    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    willLoad: boolean = true;
    basecourseListLength: number = 0;

    basecourseList: Array<Basecourse>;
    user: User;
    dataSource: MatTableDataSource<Basecourse> | null;
    displayedColumns = ['checkbox', 'avatar', 'type', 'name', 'price', 'minNumber', 'maxNumber', 'action'];
    selectedBasecourseList: Basecourse[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {BasecourseListService} _basecourseListService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _basecourseListService: BasecourseListService,
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
        if(!this.willLoad  && this.basecourseListLength == this._basecourseListService.basecourseList.length)
            return;
        
        this.dataSource = new MatTableDataSource(this._basecourseListService.basecourseList);
        this._basecourseListService.onSelectedBasecourseListChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(basecourseList => {
                this.basecourseList = basecourseList;

                this.checkboxes = {};
                basecourseList.map(basecourse => {
                    this.checkboxes[basecourse.id] = false;
                });
            });

        this._basecourseListService.onSelectedBasecourseListChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedBasecourseList => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedBasecourseList.includes(id);
                }
                this.selectedBasecourseList = selectedBasecourseList;
            });

        this._basecourseListService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._basecourseListService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._basecourseListService.deselectBasecourseList();
            });

        this._basecourseListService.onSearchTextChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
            this.dataSource = new MatTableDataSource(this._basecourseListService.basecourseList);
        }); 
        this._cdref.detectChanges();
        this.basecourseListLength = this._basecourseListService.basecourseList.length;

        if(this.basecourseListLength != 0)
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
     * @param basecourse
     */
    editBasecourse(basecourse): void
    {
        this.dialogRef = this._matDialog.open(BasecourseFormComponent, {
            panelClass: 'contact-form-dialog',
            data      : {
                basecourse: basecourse,
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
                        //this._basecourseListService.updateContact(formData.getRawValue());
                        break;
                    /**
                     * Delete
                     */
                    case 'cancel':
                        console.log("cancel....");
                        //this.deleteBasecourse(Basecourse);
                        break;
                }
            });
    }

    /**
     * Delete Contact
     */
    deleteBasecourse(basecourse): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._store.dispatch(new DeleteBasecourse({basecourseId : basecourse.id}));
                this._basecourseListService.deleteBasecourse(basecourse);
            }
            this.confirmDialogRef = null;
        });
    }

    duplicateBasecourse(basecourse): void
    {
        const payload = {
          company_id       : this.user.role_relation_id,
          type             : basecourse.type,
          name             : basecourse.name,
          price            : basecourse.price,
          currency_id      : basecourse.currency_id,
          min_number       : basecourse.min_number,
          max_number       : basecourse.max_number,
          description      : basecourse.description,
        }
        this._store.dispatch(new RegisterBasecourse({ basecourse : payload }));
        this._store.dispatch(new GetBasecourseListForCompany({companyId : this.user.role_relation_id})); 
    }

    /**
     * On selected change
     *
     * @param basecourse
     */
    onSelectedChange(basecourseId): void
    {
        this._basecourseListService.toggleSelectedBasecourse(basecourseId);
    }

    /**
     * Toggle star
     *
     * @param basecourseId
     */
    toggleStar(basecourseId): void
    {
        /*if ( this.user.starred.includes(contactId) )
        {
            this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
        }
        else
        {
            this.user.starred.push(contactId);
        }

        this._basecourseListService.updateUserData(this.user);*/
    }
  }

  export class FilesDataSource extends DataSource<any>
  {
  /**
   * Constructor
   *
   * @param {BasecourseListService} _basecourseListService
   */
  constructor(
      private _basecourseListService: BasecourseListService
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
      return this._basecourseListService.onSelectedBasecourseListChanged;
  }

  /**
   * Disconnect
   */
  disconnect(): void
  {
  }
}
