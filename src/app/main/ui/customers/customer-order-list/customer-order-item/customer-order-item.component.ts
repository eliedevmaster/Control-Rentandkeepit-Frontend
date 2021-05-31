import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { Store } from '@ngrx/store';
import { State as AppState } from 'app/store/reducers';
import { Go, SetOrderStatus, GetOrderList } from 'app/store/actions';

import { CustomerOrderListService } from 'app/main/ui/customers/customer-order-list/customer-order-list.service';
import { User } from 'app/models/user';
import Swal from 'sweetalert2/dist/sweetalert2.js'; 
import { OrderService } from 'app/core/services/order.service';


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
    displayedColumns = ['checkbox', 'customerName',  'startDate', 'numItemSold', 'termLength', 'status', 'allocate', 'action1', 'action2', 'action3'];
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
        private _orderService: OrderService,
        private _cdref: ChangeDetectorRef,
        private _store: Store<AppState>,
        private _activatedRoute: ActivatedRoute,
        public _matDialog: MatDialog
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    get orderMeta(): any {
        return this._orderService.orderMeta;
    }

    set orderMeta(value: any) {
        this._orderService.orderMeta = value;
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
        
        //if(!this.willLoad  && this.orderListLength == this._customerOrderListService.orderList.length)
        //    return;
        
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

    generatePaperWork(order: any) : void 
    {   
        let customerName = order.customer.first_name + ' ' + order.customer.last_name;
        localStorage.setItem('order', JSON.stringify(order));
        this._store.dispatch(new Go({path: ['/ui/customers/generate-form/' + order.customer.customer_id + '/' + customerName], query: null, extras: null}));
    }

    decline(order: any) : void
    {   
        const payload = {
            order_id : order.order_id,
            type : 2, // declined.
        }

        Swal.fire({
            title: 'Are you sure?',
            text: 'You will decline this application!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, decline it!',
            cancelButtonText: 'No, keep it'
            }).then((result) => {
                if (result.value) {
                    this._store.dispatch(new SetOrderStatus({orderStatus : payload}));
                    this._store.dispatch(new GetOrderList());
                    Swal.fire('Yes!', 'This application is diclined', 'success');
                } 
                else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire('Cancelled', 'This application is safe', 'error');
                }
            });
    }

    finished(order: any) : void
    {
        const payload = {
            order_id : order.order_id,
            type : 4, // finished.
        }

        Swal.fire({
            title: 'Are you sure?',
            text: 'You will finish this application!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, finish it!',
            cancelButtonText: 'No, keep it'
            }).then((result) => {
                if (result.value) {
                    this._store.dispatch(new SetOrderStatus({orderStatus : payload}));
                    this._store.dispatch(new GetOrderList());
                    Swal.fire('Yes!', 'This application is finished', 'success');
                } 
                else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire('Cancelled', 'This application is safe', 'error');
                }
            });
    }

    showDate(date: string): string 
    {
        let displayDate: string = new Date(date).toISOString().substring(0, 10);
        let dateTmp : any = displayDate.split('-');

        let result: string = dateTmp[2] + '/' + dateTmp[1] + '/' + dateTmp[0];
        return result;
    }

    showTotalAmount(order: any): number 
    { 
        return 0;
    }
    getTermLength(order: any) : string 
    {
        let order_item_metas: any = order.order_items[0].order_item_metas;
        
        let order_item_meta: any = order_item_metas.find(x => x.meta_key == 'pa_rental-period');

        let termLength : string = order_item_meta ? order_item_meta.meta_value : '12-months';  

        return termLength;

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
        this.orderMeta = order.post_meta;
        this._store.dispatch(new Go({path: ['/ui/customers/application-form/' + order.order_id], query: null, extras: null}));
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
    constructor( private _customerOrderListService: CustomerOrderListService )
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
