import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CustomerOrderListService } from 'app/main/ui/customers/customer-order-list/customer-order-list.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  filterBy: string;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CustomerListService} _customerListService
   */

  constructor( private _customerOrderListService: CustomerOrderListService ) 
  {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void 
  {
    this.filterBy = this._customerOrderListService.filterBy || 'unprocessed';
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
   * Change the filter
   *
   * @param filter
   */
    changeFilter(filter): void
    {
        this.filterBy = filter;
        this._customerOrderListService.onFilterChanged.next(this.filterBy);
    }
}
