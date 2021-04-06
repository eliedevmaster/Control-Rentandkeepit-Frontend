import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { ChangeDetectorRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { CompanyListService } from 'app/main/ui/owner/company-list/company-list.service';
import { CompanyItemFormComponent } from 'app/main/ui/owner/company-list/company-item-form/company-item-form.component';

import { User } from 'app/models/user';
import { Company } from 'app/models/companymanagement/company';

@Component({
  selector: 'app-company-item',
  templateUrl: './company-item.component.html',
  styleUrls: ['./company-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class CompanyItemComponent implements OnInit {

    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    willLoad: boolean = true;
    companyList: Array<Company>;
    user: User;
    dataSource: MatTableDataSource<Company> | null;
    displayedColumns = ['checkbox', 'avatar', 'companyname', 'email', 'phone', 'personalcode', 'country', 'action'];
    selectedCompanyList: Company[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {CompanyListService} _CompanyListService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _companyListService: CompanyListService,
        private _cdref: ChangeDetectorRef,
        public _matDialog: MatDialog
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();      
    }
    ngOnInit(): void
    {
        
    }
    ngAfterViewChecked(): void {
        //Called after every check of the component's view. Applies to components only.
        //Add 'implements AfterViewChecked' to the class.
        if(!this.willLoad)
            return;
        this.dataSource = new MatTableDataSource(this._companyListService.companyList);
        this._companyListService.onSelectedCompanyListChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(companyList => {
                this.companyList = companyList;

                this.checkboxes = {};
                companyList.map(company => {
                    this.checkboxes[company.id] = false;
                });
            });

        this._companyListService.onSelectedCompanyListChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedCompanyList => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedCompanyList.includes(id);
                }
                this.selectedCompanyList = selectedCompanyList;
            });

        this._companyListService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._companyListService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._companyListService.deselectCompanyList();
            });

        this._companyListService.onSearchTextChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
            this.dataSource = new MatTableDataSource(this._companyListService.companyList);
        });
        this._cdref.detectChanges();
        if(this._companyListService.companyList.length != 0)
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
     * @param company
     */
    editCompany(company): void
    {
        this.dialogRef = this._matDialog.open(CompanyItemFormComponent, {
            panelClass: 'contact-form-dialog',
            data      : {
                company: company,
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
                        //this._companyListService.updateContact(formData.getRawValue());
                        break;
                    /**
                     * Delete
                     */
                    case 'cancel':
                        console.log("cancel....");
                        //this.deleteCompany(Company);
                        break;
                }
            });
    }

    /**
     * Delete Contact
     */
    deleteCompany(company): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._companyListService.deleteCompany(company);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param company
     */
    onSelectedChange(companyId): void
    {
        this._companyListService.toggleSelectedCompany(companyId);
    }

    /**
     * Toggle star
     *
     * @param companyId
     */
    toggleStar(companyId): void
    {
        /*if ( this.user.starred.includes(contactId) )
        {
            this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
        }
        else
        {
            this.user.starred.push(contactId);
        }

        this._companyListService.updateUserData(this.user);*/
    }
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {CompanyListService} _companyListService
     */
    constructor(
        private _companyListService: CompanyListService
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
        return this._companyListService.onSelectedCompanyListChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
