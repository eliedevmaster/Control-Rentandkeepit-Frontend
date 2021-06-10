import { Component, OnDestroy, OnInit , ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Subject, of } from 'rxjs';  
import { catchError, map } from 'rxjs/operators';  
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';

import { fuseAnimations } from '@fuse/animations';
import { FileUploadService } from  'app/core/services/file-upload.service';

import { Back, SaveProfit, SetOrderStatus } from 'app/store/actions';
import { Store } from '@ngrx/store';
import { State as AppState, getAuthState, getCustomerState, getProductState } from 'app/store/reducers';
import { User } from 'app/models/user';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { CustomerService } from 'app/core/services/customer.service';

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

    totalAmount: number;
    actualPrice: number;
    totalProfit: number;
    
    installmentWeekAmount: number;
    installmentFortnightAmount: number;
    installmentMonthAmount: number;

    revenuePerMonth : number;

    @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;files  = [];


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
        private _fileUploadService: FileUploadService,
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
            invoice                      : ['', Validators.required],
            supplier                     : ['', Validators.required],
            actualPrice                  : ['', Validators.required],
            totalAmount                  : ['', Validators.required],
            totalProfit                  : ['', Validators.required],
            installmentWeekAmount        : ['', Validators.required],
            installmentFortnightAmount   : ['', Validators.required],
            installmentMonthAmount       : ['', Validators.required]

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
      
      const payload = {
        order_id  : this.productInfo.order_id,
        type      : 3
      }
      this._store.dispatch(new SetOrderStatus({orderStatus : payload}));

      const payload_profit = {
        customer_id                 : this.customerId,
        order_id                    : this.productInfo.order_id,
        rental_amount_total         : this.finaliseForm.value['totalAmount'],
        profit_total                : this.totalProfit,
        profit_per_week             : this.installmentWeekAmount,
        profit_per_fortnight        : this.installmentFortnightAmount,
        profit_per_month            : this.installmentMonthAmount,

        revenue_per_month           : this.revenuePerMonth,
      } 

      this._store.dispatch(new SaveProfit({profit : payload_profit}));
   }

   onChange() : void 
   {
      this.totalProfit = Number((this.totalAmount - this.actualPrice).toFixed(2));
      if(this.productInfo.frequency == 'Weekly') {
        this.installmentWeekAmount = Number((this.totalProfit / this.productInfo.leaseNumber).toFixed(2));
        this.installmentFortnightAmount = this.installmentWeekAmount * 2;
      }
      else {
        this.installmentFortnightAmount = Number((this.totalProfit / this.productInfo.leaseNumber).toFixed(2));
        this.installmentWeekAmount = Number((this.installmentFortnightAmount / 2).toFixed(2));
      }
      this.installmentMonthAmount = Number((this.totalProfit / Number(this.productInfo.termLength)).toFixed(2));
      this.revenuePerMonth = Number((this.totalAmount / Number(this.productInfo.termLength)).toFixed(2));
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


   setTotalAmount() : void 
   {
      let totalAmountPrice: number = 0;
      let actualAmount : number = 0;
      this.costs.forEach((element, index)=> {
        totalAmountPrice += element * this.productInfo.leaseNumber;
        actualAmount += this.actualCosts[index] * this.productInfo.leaseNumber;    
      });

      this.totalAmount = Number(totalAmountPrice.toFixed(2));
   }

   backPath(): void 
   {
       this._store.dispatch(new Back());
   }


   uploadFile(file) {  
    const formData = new FormData();  
    formData.append('file', file.data);  
    file.inProgress = true;  
    this._fileUploadService.upload(formData).pipe(  
      map(event => {  
        switch (event.type) {  
          case HttpEventType.UploadProgress:  
            file.progress = Math.round(event.loaded * 100 / event.total);  
            break;  
          case HttpEventType.Response:  
            return event;  
        }  
      }),  
      catchError((error: HttpErrorResponse) => {  
        file.inProgress = false;  
        return of(`${file.data.name} upload failed.`);  
      })).subscribe((event: any) => {  
        if (typeof (event) === 'object') {  
          console.log(event.body);  
        }  
      });  
  }

 uploadFiles() {  
    this.fileUpload.nativeElement.value = '';  
    this.files.forEach(file => {  
      this.uploadFile(file);  
    });  
}

  onClick() {       
      const fileUpload = this.fileUpload.nativeElement;
      fileUpload.onchange = () => {  
        for (let index = 0; index < fileUpload.files.length; index++)  
        {  
            const file = fileUpload.files[index];
            this.files.push({ data: file, inProgress: false, progress: 0});  
        }  
        this.uploadFiles();  
      };  
      fileUpload.click();  
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
