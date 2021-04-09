import { Component, OnDestroy, OnInit , ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';

import { Back } from 'app/store/actions';
import { Store } from '@ngrx/store';
import { fuseAnimations } from '@fuse/animations';

import { State as AppState, getAuthState, getCustomerState } from 'app/store/reducers';
import { User } from 'app/models/user';
import Swal from 'sweetalert2/dist/sweetalert2.js';  

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';

export const MY_FORMATS = {
  parse: {
      dateInput: 'LL'
  },
  display: {
      dateInput: 'DD-MM-YYYY',
      monthYearLabel: 'YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-generate-form',
  templateUrl: './generate-form.component.html',
  styleUrls: ['./generate-form.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class GenerateFormComponent implements OnInit {

  generateForm: FormGroup;
  user: User;
  type: string;
  
  customerId: number;
  customerName: string;

  customer: any = null;
  products: string[] = [];
  costs: string[] = [];

  order: any;
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {FormBuilder} _formBuilder
   */
  constructor(
      private _formBuilder: FormBuilder,
      private _activatedRoute: ActivatedRoute,
      private _store: Store<AppState>,
  )
  {
      // Set the private defaults
      this._unsubscribeAll = new Subject();
      this.customerId = this._activatedRoute.snapshot.params.customerId;
      this.customerName = this._activatedRoute.snapshot.params.customerName;
      this.order = JSON.parse(localStorage.getItem('order'));
      this.setProuctsAndCostsFromOrder(this.order);
      //this._store.dispatch(new GetCustomerList());
      //this.mapCustomerStateToModel();
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
      this.generateForm = this._formBuilder.group({
        firstName             : ['', Validators.required],
        lastName              : ['', Validators.required],
        phoneNumber           : ['', Validators.required],
        address               : ['', Validators.required],
        city                  : ['', Validators.required],
        postCode              : ['', Validators.required],
        state                 : ['', Validators.required],
        products              : [''],
        costs                 : [''],
        termLength            : ['', Validators.required],
        startDate             : ['', Validators.required],
        finishDate            : ['', Validators.required],
        freqeuncyRepayment    : [52, Validators.required], 
        firstPaymentDate      : ['', Validators.required],
        leaseNumber           : ['', Validators.required],
        totalAmount           : ['', Validators.required],
        
      });
      console.log(this.order); 
      this.mapUserStateToModel();
      this.setinitValue();
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
  onGenerate(): void
  {
    Swal.fire('Yes!', 'The paperwork was succefully generated!', 'success');
  } 

  setinitValue(): void 
  {
    //if(this.customer != null) {
      this.generateForm.controls['firstName'].setValue(this.customerName.split(' ')[0]);
      this.generateForm.controls['lastName'].setValue(this.customerName.split(' ')[1]);
      //this.generateForm.controls['phoneNumber'].setValue(customer.last_name);
      //this.generateForm.controls['address'].setValue(this.customer.city);
      this.generateForm.controls['termLength'].setValue(this.getTermLenght(this.order));
      this.generateForm.controls['startDate'].setValue(new Date(this.order.date_created_gmt).toISOString().substring(0, 10));
      this.generateForm.controls['finishDate'].setValue(this.getFinishDate(this.order).toISOString().substring(0, 10));
      this.generateForm.controls['freqeuncyRepayment'].setValue(0);
      //this.generateForm.controls['firstPaymentDate'].setValue(customer.city);
      //this.generateForm.controls['leaseNumber'].setValue(customer.city);
      //this.generateForm.controls['totalAmount'].setValue(this.order.total_sales);
    //}

  }
  getTermLenght(order: any) : number 
  {
        let order_item_metas: any = order.order_items[0].order_item_metas;

        let order_item_meta: any = order_item_metas.find(x => x.meta_key == 'pa_rental-period');

        let termLength : string = order_item_meta ? order_item_meta.meta_value : '12-months';  

        if(termLength == '12-months')
          return 1;
        return 2;
  }

  getFinishDate(order: any) : Date 
  {
    let plusMonths : number = 12;

    if(this.getTermLenght(order) == 2)
      plusMonths = 24;

    let date: Date = new Date(this.order.date_created_gmt);
    let finishDate:Date = new Date(date.setMonth(date.getMonth() + plusMonths));

    return finishDate;
  }

  setProuctsAndCostsFromOrder(order: any) : void
  {
    console.log(order);
    if(order == null )
      return;
    let order_items: any = order.order_items;
    order_items.forEach(element => {
      if(element.order_item_product.product != null){
        this.products.push(element.order_item_product.product.post_title);
      }
      else
        this.products.push(element.order_item_name);
      
      let cost: number = Number(element.order_item_product.product_gross_revenue) / Number(element.order_item_product.product_qty);
      this.costs.push(cost.toString());
    });
  }

  addProduct(event: MatChipInputEvent) 
  {
      const input = event.input;
      const value = event.value;
      if ( value ) {
          this.products.push(value);
      }

      if ( input ) {
          input.value = '';
      }
  }

  removeProduct(product): void
  {
      this.products = this.products.filter(x => x != product);  
  }

  addCost(event: MatChipInputEvent) 
  {
      const input = event.input;
      const value = event.value;
      if ( value ) {
        if(isNaN(Number(value)))
          this.costs.push('0');
        else
          this.costs.push(value);
      }
      if ( input ) {
          input.value = '';
      }
  }

  removeCost(cost): void
  {
      console.log(this.costs);
      this.costs = this.costs.filter(x => x != cost);  
  }

  onChangeDate() : void 
  {
    let startDate: Date = new Date(this.generateForm.value['startDate']);
    let termLength: number = 12 * this.generateForm.value['termLength'];
    this.generateForm.controls['finishDate'].setValue(new Date(startDate.setMonth(startDate.getMonth() + termLength)).toISOString().substring(0, 10));
  }

  onChangeFreqeuncy(isForTermLenght:boolean = false) : void 
  {
    if(isForTermLenght)
      this.onChangeDate();
    let freqeuncyRepayment = this.generateForm.value['freqeuncyRepayment'];
    let termLength = this.generateForm.value['termLength'];
    this.generateForm.controls['leaseNumber'].setValue(freqeuncyRepayment * termLength);

    let total_amount: number = 0;
    this.costs.forEach(element => {
      let cost = Number(element);
      total_amount += cost * freqeuncyRepayment * termLength;
    });

    this.generateForm.controls['totalAmount'].setValue(total_amount.toFixed(2));
  }
  backPath(): void 
  {
    this._store.dispatch(new Back());
  }

  mapUserStateToModel(): void
  {
    this.getAuthState().subscribe(state => {
      if(state.user != null) {
        this.user = new User(state.user);
      }
    });
  }

  mapCustomerStateToModel() : void
  {
    this.getCustomerState().subscribe(state => {
      if(state.customerList != null) {
        this.customer = state.customerList.find(x => x.customer_id == this.customerId);
      }
    });
    
  }

  getAuthState() 
  {
    return this._store.select(getAuthState);
  }

  getCustomerState()
  {
    return this._store.select(getCustomerState);
  }

}
