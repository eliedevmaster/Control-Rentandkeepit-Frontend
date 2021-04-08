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
import { GetOrderListForCustomer } from 'app/store/actions';


import { CustomerOrderListService } from 'app/main/ui/customers/customer-order-list/customer-order-list.service';

import { User } from 'app/models/user';
import { Customer } from 'app/models/customer';

@Component({
  selector: 'app-customer-order-item',
  templateUrl: './customer-order-item.component.html',
  styleUrls: ['./customer-order-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class CustomerOrderItemComponent implements OnInit {

  @ViewChild('dialogContent')
dialogContent: TemplateRef<any>;

willLoad: boolean = true;
orderListLength: number = 0;

orderList: any[];
user: User;
dataSource: MatTableDataSource<any> | null;
displayedColumns = ['checkbox', 'startDate', 'numItemSold', 'totalSales', 'status', 'action'];
selectedOrderList: any[];
checkboxes: {};
dialogRef: any;
confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

// Private
private _unsubscribeAll: Subject<any>;

/**
 * Constructor
 *
 * @param {OrderListService} _customerOrderListService
 * @param {MatDialog} _matDialog
 */
constructor(
    private _customerOrderListService: CustomerOrderListService,
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
    if(!this.willLoad  && this.orderListLength == this._customerOrderListService.orderList.length)
        return;
    
    this.dataSource = new MatTableDataSource(this._customerOrderListService.orderList);
    this._customerOrderListService.onSelectedOrderListChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(orderList => {
            this.orderList = orderList;

            this.checkboxes = {};
            orderList.map(order => {
                this.checkboxes[order.id] = false;
            });
        });

    this._customerOrderListService.onSelectedOrderListChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(selectedOrderList => {
            for ( const id in this.checkboxes )
            {
                if ( !this.checkboxes.hasOwnProperty(id) )
                {
                    continue;
                }

                this.checkboxes[id] = selectedOrderList.includes(id);
            }
            this.selectedOrderList = selectedOrderList;
        });

    this._customerOrderListService.onUserDataChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(user => {
            this.user = user;
        });

    this._customerOrderListService.onFilterChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
            this._customerOrderListService.deselectOrderList();
        });

    this._customerOrderListService.onSearchTextChanged
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(() => {
        this.dataSource = new MatTableDataSource(this._customerOrderListService.orderList);
    }); 
    this._cdref.detectChanges();
    this.orderListLength = this._customerOrderListService.orderList.length;

    if(this.orderListLength != 0)
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
 * @param order
 */
editOrder(order): void
{
    //this._store.dispatch(new GetOrderListForOrder({orderId : order.id}))
    /*this.dialogRef = this._matDialog.open(OrderFormComponent, {
        panelClass: 'contact-form-dialog',
        data      : {
            Order: Order,
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
                
                case 'save':
                    console.log("edit....");
                    //this._customerOrderListService.updateContact(formData.getRawValue());
                    break;
                
                case 'cancel':
                    console.log("cancel....");
                    //this.deleteOrder(Order);
                    break;
            }
        });

        */
}

/**
 * Delete Contact
 */
deleteOrder(order): void
{
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
        if ( result )
        {
            //this._store.dispatch(new DeleteOrder({OrderId : Order.id}));
            this._customerOrderListService.deleteOrder(order);
        }
        this.confirmDialogRef = null;
    });

}


/**
 * On selected change
 *
 * @param order
 */
onSelectedChange(orderId): void
{
    this._customerOrderListService.toggleSelectedOrder(orderId);
}

/**
 * Toggle star
 *
 * @param OrderId
 */
toggleStar(orderId): void
{
    /*if ( this.user.starred.includes(contactId) )
    {
        this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
    }
    else
    {
        this.user.starred.push(contactId);
    }

    this._customerOrderListService.updateUserData(this.user);*/
}
}

export class FilesDataSource extends DataSource<any>
{
/**
* Constructor
*
* @param {OrderListService} _customerOrderListService
*/
constructor(
  private _customerOrderListService: CustomerOrderListService
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
  return this._customerOrderListService.onSelectedOrderListChanged;
}

/**
* Disconnect
*/
disconnect(): void
{
}
}
