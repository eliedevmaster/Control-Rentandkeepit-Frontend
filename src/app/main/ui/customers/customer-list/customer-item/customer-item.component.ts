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
import { Go, GetOrderListForCustomer } from 'app/store/actions';


import { CustomerListService } from 'app/main/ui/customers/customer-list/customer-list.service';
import { CustomerFormComponent } from 'app/main/ui/customers/customer-list/customer-form/customer-form.component';

import { User } from 'app/models/user';
import { Customer } from 'app/models/customer';

@Component({
  selector: 'app-customer-item',
  templateUrl: './customer-item.component.html',
  styleUrls: ['./customer-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class CustomerItemComponent implements OnInit {

  @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    willLoad: boolean = true;
    customerListLength: number = 0;

    customerList: Array<Customer>;
    user: User;
    dataSource: MatTableDataSource<Customer> | null;
    displayedColumns = ['checkbox', 'email', 'lastactive', 'dateregistered', 'country', 'postcode', 'action'];
    selectedCustomerList: Customer[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {CustomerListService} _customerListService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _customerListService: CustomerListService,
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
        if(!this.willLoad  && this.customerListLength == this._customerListService.customerList.length)
            return;
        
        this.dataSource = new MatTableDataSource(this._customerListService.customerList);
        this._customerListService.onSelectedCustomerListChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(customerList => {
                this.customerList = customerList;

                this.checkboxes = {};
                customerList.map(customer => {
                    this.checkboxes[customer.id] = false;
                });
            });

        this._customerListService.onSelectedCustomerListChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedCustomerList => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedCustomerList.includes(id);
                }
                this.selectedCustomerList = selectedCustomerList;
            });

        this._customerListService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._customerListService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._customerListService.deselectCustomerList();
            });

        this._customerListService.onSearchTextChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
            this.dataSource = new MatTableDataSource(this._customerListService.customerList);
        }); 
        this._cdref.detectChanges();
        this.customerListLength = this._customerListService.customerList.length;

        if(this.customerListLength != 0)
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
     * @param customer
     */
    editCustomer(customer): void 
    {
        this._store.dispatch(new Go({path: ['/ui/customers/customer-order-list/' + customer.id], query: null, extras: null}));
    }

    /**
     * Delete Contact
     */
    deleteCustomer(customer): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                //this._store.dispatch(new DeleteCustomer({customerId : customer.id}));
                this._customerListService.deleteCustomer(customer);
            }
            this.confirmDialogRef = null;
        });

    }

    
    /**
     * On selected change
     *
     * @param customer
     */
    onSelectedChange(customerId): void
    {
        this._customerListService.toggleSelectedCustomer(customerId);
    }

    /**
     * Toggle star
     *
     * @param customerId
     */
    toggleStar(customerId): void
    {
        /*if ( this.user.starred.includes(contactId) )
        {
            this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
        }
        else
        {
            this.user.starred.push(contactId);
        }

        this._customerListService.updateUserData(this.user);*/
    }
  }

  export class FilesDataSource extends DataSource<any>
  {
  /**
   * Constructor
   *
   * @param {CustomerListService} _customerListService
   */
  constructor(
      private _customerListService: CustomerListService
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
      return this._customerListService.onSelectedCustomerListChanged;
  }

  /**
   * Disconnect
   */
  disconnect(): void
  {
  }
}