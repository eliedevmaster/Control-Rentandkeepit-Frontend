import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CustomerListService } from 'app/main/ui/customers/customer-list/customer-list.service';

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

  constructor( private _customerListService: CustomerListService ) 
  {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void 
  {
    this.filterBy = this._customerListService.filterBy || 'all';
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
        this._customerListService.onFilterChanged.next(this.filterBy);
    }

}
