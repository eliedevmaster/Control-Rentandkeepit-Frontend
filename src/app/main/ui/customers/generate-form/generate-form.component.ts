import { Component, OnDestroy, OnInit , ViewEncapsulation, VERSION } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { environment as env } from '../../../../../environments/environment';

import { Go, Back, SaveAgreement } from 'app/store/actions';
import { Store } from '@ngrx/store';
import { fuseAnimations } from '@fuse/animations';

import { State as AppState, getAuthState, getCustomerState, getProductState } from 'app/store/reducers';
import { User } from 'app/models/user';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {  MomentDateAdapter } from '@angular/material-moment-adapter';
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

    productList : any[] = [];

    customer: any = null;

    products: string[] = [];
    costs: number[] = [];
    displayProducts: string[] = [];

    order: any;

    enableFinaliseButton: boolean = false;

    headImage: any;
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

        this.order = JSON.parse(localStorage.getItem('order'));
        this.setProuctsAndCostsFromOrder(this.order);

    }

    get productInfo(): any {
        return this._customerService.productInfo;
    }

    set productInfo(value: any) {
        this._customerService.productInfo = value;
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
        localStorage.removeItem('productInfo');
        this.generateForm = this._formBuilder.group({
            firstName             : ['', Validators.required],
            lastName              : ['', Validators.required],
            phoneNumber           : ['', Validators.required],
            address               : ['', Validators.required],
            city                  : ['', Validators.required],
            postCode              : ['', Validators.required],
            state                 : ['', Validators.required],
            productName           : [''],
            productPrice          : [0],
            displayProducts       : [''],
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

    makeId() : string 
    {
        var text = "";
        var possible = "0123456789";
    
        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
    
    onGenerate(): void
    {   
        let eachRepayment : number = 0;
        
        if(this.products.length == 0) {
            Swal.fire('Ooops', 'There are no products.', 'error');
            return;
        }

        this.costs.forEach((element) => {
            eachRepayment += element;
        });

        let startDate = new Date(this.generateForm.value['startDate']);

        let products: string = '';
        
        this.products.forEach(element => {
            products = products + element + ',';
        });
        let productText: string = products.slice(0, -1); 

        let firstPaymentDate = new Date(this.generateForm.value['firstPaymentDate']);
        let firstPaymentDateString: string = firstPaymentDate.getDate().toString() + '-' + (firstPaymentDate.getMonth() + 1).toString() + '-' + firstPaymentDate.getFullYear().toString()

        const param = {
            refKey              : this.makeId(),
            customerName        : this.generateForm.value['firstName'] + ' ' + this.generateForm.value['lastName'],
            address             : this.generateForm.value['address'] + ', ' + this.generateForm.value['city'] + ', ' + this.generateForm.value['state'] + ', ' + this.generateForm.value['postCode'],
            phoneNumber         : this.generateForm.value['phoneNumber'],
            postCode            : this.generateForm.value['postCode'],
            products            : productText,
            term                : this.generateForm.value['termLength'] == 1 ? '12 months' : '24 months',
            startDate_day       : startDate.getDate().toString(),
            startDate_month     : startDate.toLocaleString('default', { month: 'long' }),
            startDate_year      : startDate.getFullYear().toString(),
            eachRepayment       : eachRepayment,
            firstPaymentDate    : firstPaymentDateString, 
            frequency           : this.generateForm.value['freqeuncyRepayment'] == 52 ? 'Weekly' : 'Fortnightly',
            leaseNumber         : this.generateForm.value['leaseNumber'],
            totalAmount         : this.generateForm.value['totalAmount'],
        }

        window.location.href =  `${env.backendBaseUrl}/download/` + param.refKey + '/'
                                                                  + param.customerName + '/'
                                                                  + param.address + '/'
                                                                  + param.phoneNumber + '/'
                                                                  + param.postCode + '/'
                                                                  + param.products + '/'
                                                                  + param.term + '/'
                                                                  + param.startDate_day + '/'
                                                                  + param.startDate_month + '/'
                                                                  + param.startDate_year + '/'
                                                                  + param.eachRepayment + '/'
                                                                  + param.firstPaymentDate + '/'
                                                                  + param.frequency + '/'
                                                                  + param.leaseNumber + '/'
                                                                  + param.totalAmount;       
        const payload = {
            customer_id : this.customerId,
            order_id : this.order.order_id,
            meta_key : param.refKey,
        }

        if(this.customerId != 0)
            this._store.dispatch(new SaveAgreement({agreement : payload}));
        else 
            Swal.fire('Yes!', 'The agreement has successfully saved', 'success');

        this.enableFinaliseButton = true;
    } 

    onFinalise(): void
    {
        const orderedProdcuts = {
            products    : this.products,
            costs       : this.costs,
            leaseNumber : this.generateForm.value['leaseNumber'],
            termLength  : this.generateForm.value['termLength'] == 1 ? 12 : 24,
            frequency   : this.generateForm.value['freqeuncyRepayment'] == 52 ? 'Weekly' : 'Fortnightly'
        };

        localStorage.setItem('productInfo', JSON.stringify(orderedProdcuts));
        this._store.dispatch(new Go({path: ['/ui/customers/finalise-form/' + this.customerId + '/' + this.customerName], query: null, extras: null}));
    }

    setinitValue(): void 
    {
        if(this.customerId != 0) {

            this.generateForm.controls['firstName'].setValue(this.customerName.split(' ')[0]);
            this.generateForm.controls['lastName'].setValue(this.customerName.split(' ')[1]);
        
            this.generateForm.controls['termLength'].setValue(this.getTermLenght(this.order));
            let start_date = new Date(this.order.date_created_gmt).toISOString().substring(0, 10);
            this.generateForm.controls['startDate'].setValue(start_date);
            this.generateForm.controls['finishDate'].setValue(this.getFinishDate(this.order, start_date).toISOString().substring(0, 10));
            this.generateForm.controls['freqeuncyRepayment'].setValue(0);
        }

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

    getFinishDate(order: any, start_date: string) : Date 
    {
        let plusMonths : number = 12;

        if(this.getTermLenght(order) == 2)
            plusMonths = 24;

        let date: Date = new Date(start_date);
        let finishDate:Date = new Date(date.setMonth(date.getMonth() + plusMonths));

        return finishDate;
    }

    changeDate ()
    {
        let start_date = new Date(this.generateForm.value['startDate']).toISOString().substring(0, 10);
        this.generateForm.controls['finishDate'].setValue(this.getFinishDate(this.order, start_date).toISOString().substring(0, 10));
    }

    setProuctsAndCostsFromOrder(order: any) : void
    {
        if(order == null || this.customerId == 0)
            return;
        
        let order_items: any = order.order_items;

        order_items.forEach(element => {
            if(element.order_item_product.product != null){
                this.products.push(element.order_item_product.product.post_title);
            }
            else
                this.products.push(element.order_item_name);
            
            let cost: number = Number(element.order_item_product.product_gross_revenue) / Number(element.order_item_product.product_qty);
            this.costs.push(cost);

            let displayProduct: string  = element.order_item_name + '( $' + cost + ' ) ';
            this.displayProducts.push(displayProduct);
        });
    }

    addProduct() 
    {
        this.products.push(this.generateForm.value['productName']);
        this.costs.push(Number(this.generateForm.value['productPrice']));

        let displayProduct: string  = this.generateForm.value['productName'] + '( $' + this.generateForm.value['productPrice'] + ' )';
        this.displayProducts.push(displayProduct);
        this.setTotalAmount();
    }

    removeDisplayProduct(displayProduct): void
    {
        let index: number =  this.displayProducts.indexOf(displayProduct);
        this.products.splice(index, 1);
        this.costs.splice(index, 1);
        //this.displayProducts = this.displayProducts.filter(x => x != displayProduct);  
        this.displayProducts.splice(index, 1);
        this.setTotalAmount();
    }

    onChangeDate() : void 
    {
        if(this.generateForm.value['startDate'] == "")
            return;
         
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

        this.setTotalAmount();
    }

    setTotalAmount() : void 
    {
        let total_amount: number = 0;

        let freqeuncyRepayment = this.generateForm.value['freqeuncyRepayment'];
        let termLength = this.generateForm.value['termLength'];

        this.costs.forEach(element => {
            total_amount += element *  freqeuncyRepayment * termLength;
        })
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

    mapProductStateToModel() : void
    {
        this.getProductState().subscribe(state => {
        if(state.productList != null) {
            this.productList = [];
            state.productList.forEach(element => {
                this.productList.push(element);
            });
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

    getProductState ()
    {
        return this._store.select(getProductState);
    }

}
