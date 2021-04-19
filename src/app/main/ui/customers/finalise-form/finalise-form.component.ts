import { Component, OnDestroy, OnInit , ViewEncapsulation, VERSION } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

import { Back } from 'app/store/actions';
import { Store } from '@ngrx/store';
import { fuseAnimations } from '@fuse/animations';

import { State as AppState, getAuthState, getCustomerState, getProductState } from 'app/store/reducers';
import { User } from 'app/models/user';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { CustomerService } from 'app/core/services/customer.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';  

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
  selector: 'app-finalise-form',
  templateUrl: './finalise-form.component.html',
  styleUrls: ['./finalise-form.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations

})

export class FinaliseFormComponent implements OnInit 
{

  finaliseForm: FormGroup;
    user: User;    
    customerId: number;
    customerName: string;

    productInfo: any;
    products: string[] = [];
    costs: number[] = [];
    actualCosts: number[] = [];

    displayProducts: any[] = [];

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
        private _customerService: CustomerService,
        private _store: Store<AppState>,
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.customerId = this._activatedRoute.snapshot.params.customerId;
        this.customerName = this._activatedRoute.snapshot.params.customerName;
        this.setInitValue();
    }

  /**
    * On init
  */
   ngOnInit(): void
   {
    
      this.setInitValue();
       // Reactive Form
      this.finaliseForm = this._formBuilder.group({
           productList           : [''],
           actualPrice           : [0],
           displayProducts       : [''],
           totalAmount           : ['', Validators.required],
           profitAmount          : ['', Validators.required],
      });
      this.mapUserStateToModel();
      this.setTotalAmount();
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

   
   onFinalise() : void 
   {
      console.log("11111");
      Swal.fire('Yes!', 'You finalise the lease successfully.', 'success');
   }

   setInitValue() : void
   {
      this.productInfo = JSON.parse(localStorage.getItem('productInfo'));
      
      this.products = [];
      this.costs = [];
      this.actualCosts = [];
      
      this.productInfo.products.forEach((element, index) => {
        this.products.push(element);
        this.costs.push(this.productInfo.costs[index]);
        this.actualCosts.push(this.productInfo.costs[index]);
      });

   }

   addProduct() 
   {
      let product = this.finaliseForm.value['productList'];
      let index = this.products.indexOf(product);
      let cost = this.costs[index];
      
      let actualCost = this.finaliseForm.value['actualPrice'];
      
      if(this.displayProducts.length === this.products.length) {
        Swal.fire('Ooops!', 'Sorry, Can not add the product!', 'error');
        return;
      }

      if(cost < actualCost) {
        Swal.fire('Ooops!', 'Sorry, The actual price must be smaller than product price!', 'error');
        return;
      }

      this.actualCosts[index] = actualCost;

      let displayProduct: string  = product + '( $' + cost + ' / $' + actualCost + ' )';
      let displayIndex = index;
      let addingData = {
        index: displayIndex,
        displayData: displayProduct,
      }
      this.displayProducts.push(addingData);
      this.setTotalAmount();
   }

   removeDisplayProduct(displayProduct): void
   {
       let index: number =  this.displayProducts.indexOf(displayProduct);
       
       this.actualCosts[displayProduct.index] = this.costs[displayProduct.index];
       
       this.displayProducts.splice(index, 1);
       this.setTotalAmount();
   }

   setTotalAmount() : void 
   {
      let totalAmount: number = 0;
      let actualAmount : number = 0;
      this.costs.forEach((element, index)=> {
        totalAmount += element * this.productInfo.leaseNumber;

        actualAmount += this.actualCosts[index] * this.productInfo.leaseNumber;    
      });
      let profitAmount = totalAmount - actualAmount;
 
      this.finaliseForm.controls['totalAmount'].setValue(totalAmount.toFixed(2));
      this.finaliseForm.controls['profitAmount'].setValue(profitAmount.toFixed(2));
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

   getAuthState() 
   {
       return this._store.select(getAuthState);
   }

   getCustomerState()
   {
       return this._store.select(getCustomerState);
   }

}
