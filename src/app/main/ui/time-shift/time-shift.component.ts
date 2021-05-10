import { Component, OnDestroy, OnInit , ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, of } from 'rxjs';  
import { catchError, map } from 'rxjs/operators';  
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';

import { Back, GetCustomerList } from 'app/store/actions';
import { Store } from '@ngrx/store';
import { fuseAnimations } from '@fuse/animations';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import Swal from 'sweetalert2/dist/sweetalert2.js';  

import { State as AppState, getAuthState, getCustomerState } from 'app/store/reducers';
import { User } from 'app/models/user';

export const MY_FORMATS = {
  parse: {
      dateInput: 'LL'
  },
  display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-time-shift',
  templateUrl: './time-shift.component.html',
  styleUrls: ['./time-shift.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class TimeShiftComponent implements OnInit {

  timeShiftForm: FormGroup;
  user: User;
  type: string;

  customerList: any;
  agreementListForCustomer: any;

  existAgreements : boolean = true;
  email : string;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {FormBuilder} _formBuilder
   */
  constructor(
      private _formBuilder: FormBuilder,
      private _store: Store<AppState>,
  )
  {
      // Set the private defaults
      this._unsubscribeAll = new Subject();
      this._store.dispatch(new GetCustomerList());
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void
  {
      this.mapCustomerListStateToModel();
      this.mapUserStateToModel();
      // Reactive Form
      this.timeShiftForm = this._formBuilder.group({
        customer          : ['', Validators.required],
        finishDate        : ['', Validators.required],
        agreement         : ['', Validators.required],   
        note              : ['', Validators.required]
      });
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
  onSave(): void
  {
    
    let payload = {
      customer                : this.timeShiftForm.value['customer'],
      finish_date             : this.timeShiftForm.value['finishDate'],
      agreement               : this.timeShiftForm.value['agreement'],
      note                    : this.timeShiftForm.value['note'],
    }

    //console.log(this.timeShiftForm.value['agreement']);
    Swal.fire('Yes', "You have changed the finish date successfully.", 'success');
    //this._store.dispatch(new UpdateCustomer({ customer : payload }));
  } 

  backPath(): void 
  {
    this._store.dispatch(new Back());
  }

  onChangeCustomer($event) : void
  {
    let customer = this.customerList.filter(x => x.customer_id === $event.value);
    //console.log(customer);
    this.agreementListForCustomer = customer[0].orders;
    if(this.agreementListForCustomer.length == 0)
      this.existAgreements = false;
    else
      this.existAgreements = true;
    //console.log(this.agreementListForCustomer);
  }

  showAgreemetName(order: any) : string
  {  
      let name: string  = '';
      order.order_items.forEach(element => {
        name += element.order_item_name + ',  ';
      });
      return name;
  } 

  mapUserStateToModel(): void
  {
    this.getAuthState().subscribe(state => {
      if(state.user != null) {
        this.user = new User(state.user);
      }
    });
  }

  mapCustomerListStateToModel(): void 
  {
    this.getCustomerState().subscribe(state => {
      if(state.customerList != null) {
        this.customerList = state.customerList;
        //console.log('customer : ', this.customerList);
      }
    });
  }

  getCustomerState() 
  {
    return this._store.select(getCustomerState);
  }
  getAuthState() 
  {
    return this._store.select(getAuthState);
  }

}
