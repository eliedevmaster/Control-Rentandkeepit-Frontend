import { Component, OnDestroy, OnInit , ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, of } from 'rxjs';  
import { catchError, map } from 'rxjs/operators';  
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';

import { Back, GetCustomerList, SavePaymentManual } from 'app/store/actions';
import { Store } from '@ngrx/store';
import { fuseAnimations } from '@fuse/animations';
import { FileUploadService } from  'app/core/services/file-upload.service';

import { State as AppState, getAuthState, getCustomerState } from 'app/store/reducers';
import { User } from 'app/models/user';

import Swal from 'sweetalert2/dist/sweetalert2.js';  

@Component({
  selector: 'app-manual-payment',
  templateUrl: './manual-payment.component.html',
  styleUrls: ['./manual-payment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class ManualPaymentComponent implements OnInit {

  manualPaymentForm: FormGroup;
  user: User;
  customerList: any[] = [];
  agreementListForCustomer: any;
  existAgreements : boolean = true;

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
      // Reactive Form
      this.manualPaymentForm = this._formBuilder.group({
        customer            : ['', Validators.required],
        agreement           : ['', Validators.required],
        amountToPay         : [0, Validators.required],
        refund              : [0, Validators.required],
        paidDate            : ['', Validators.required],
        paymentMethod       : ['', Validators.required]
      });
      
      this.mapUserStateToModel();
      this.mapCustomerListToModel();
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
  onConfirm(): void
  {
    const payload = {
      customer_id    : this.manualPaymentForm.value['customer'],
      order_id       : this.manualPaymentForm.value['agreement'],
      date           : this.manualPaymentForm.value['paidDate'].toISOString().substring(0, 10),
      paid_amount    : this.manualPaymentForm.value['amountToPay'],
      refund         : this.manualPaymentForm.value['refund'],
      payment_method : this.manualPaymentForm.value['paymentMethod'],
    }

    this._store.dispatch(new SavePaymentManual({paymentData : payload}));
  } 

  backPath(): void 
  {
    this._store.dispatch(new Back());
  }

  onChangeCustomer($event) : void
  {
    let customer = this.customerList.filter(x => x.customer_id === $event.value);
    console.log(customer[0].orders);
    let orders = customer[0].orders.filter(x => x.status == "wc-processing_1");
    this.agreementListForCustomer = orders;
    if(this.agreementListForCustomer.length == 0)
      this.existAgreements = false;
    else
      this.existAgreements = true;
    console.log(this.agreementListForCustomer);
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

  mapCustomerListToModel() : void
  {
    this.getCustomerList().subscribe(state => {
      if(state.customerList != null) {
        this.customerList = [];
        state.customerList.forEach(element => {
          this.customerList.push(element);
        });    
      }
    });
  }

  getAuthState() 
  {
    return this._store.select(getAuthState);
  }

  getCustomerList()
  {
    return this._store.select(getCustomerState)
  }

}
