import { Component, OnDestroy, OnInit , ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, of } from 'rxjs';  
import { ChangeDetectorRef } from '@angular/core';

import { catchError, map } from 'rxjs/operators';  
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { fuseAnimations } from '@fuse/animations';
import { FileUploadService } from  'app/core/services/file-upload.service';

import { Back, SaveOrderMetaFirst, SaveOrderMetaSecond, SaveOrderMetaThird, SaveOrderMetaForth, SetOrderStatus } from 'app/store/actions';

import { Store } from '@ngrx/store';
import { State as AppState, getAuthState } from 'app/store/reducers';
import { User } from 'app/models/user';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import Swal from 'sweetalert2/dist/sweetalert2.js';  
import { OrderService } from 'app/core/services/order.service';

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
    selector: 'app-application-form',
    templateUrl: './application-form.component.html',
    styleUrls: ['./application-form.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
    ],
})
export class ApplicationFormComponent implements OnInit {

    orderMeta: any = null;
    orderId : number;
    flag: boolean = false;
    uploadedURL_1: string;
    uploadedURL_2: string;

    // Horizontal Stepper
    horizontalStepperStep1: FormGroup;
    horizontalStepperStep2: FormGroup;
    horizontalStepperStep3: FormGroup;
    horizontalStepperStep4: FormGroup;
    horizontalStepperStep5: FormGroup;
    
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _orderService: OrderService,
        private _activatedRoute: ActivatedRoute,
        private _cdref: ChangeDetectorRef,
        private _store: Store<AppState>,

    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.orderId = this._activatedRoute.snapshot.params.orderId;
    }

    get sharedOrderMeta(): any {
        return this._orderService.orderMeta;
    }

    set sharedOrderMeta(value: any) {
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
       
            this.horizontalStepperStep1 = this._formBuilder.group({
                firstName               :   [this.getDataFromMeta('_billing_first_name'), Validators.required],
                lastName                :   [this.getDataFromMeta('_billing_last_name'), Validators.required],
                middleName              :   [this.getDataFromMeta('_billing_middle_name')],
                email                   :   [this.getDataFromMeta('_billing_email'), Validators.required],
                streetAddress           :   [this.getDataFromMeta('_billing_address_1'), Validators.required],
                state                   :   [this.getDataFromMeta('_billing_state'), Validators.required], 
                city                    :   [this.getDataFromMeta('_billing_city'), Validators.required],
                postCode                :   [this.getDataFromMeta('_billing_postcode'), Validators.required],
                phone                   :   [this.getDataFromMeta('_billing_phone'), Validators.required],
                mobile                  :   [this.getDataFromMeta('_billing_mobile')],
    
                notes                   :   [''],
            });
    
            this.horizontalStepperStep2 = this._formBuilder.group({
                identificationType      :   [this.getDataFromMeta('id_type'), Validators.required],
                idNumber                :   [this.getDataFromMeta('id_number'), Validators.required],
                expiryDate              :   [new Date(this.getDataFromMeta('id_expiry_date')), Validators.required],
                birthday                :   [new Date(this.getDataFromMeta('id_date_of_birth')), Validators.required],
                age                     :   ['', Validators.required],
                existingCustomer        :   [this.getDataFromMeta('id_existing_customer'), Validators.required],
    
                notes                   :   [''],
            });
    
            this.horizontalStepperStep3 = this._formBuilder.group({
                //Income
                employmentStatus        :   [this.getDataFromMeta('employment_status'), Validators.required],
                employerName            :   [this.getDataFromMeta('employer_name'), Validators.required],
                employerPhone           :   [this.getDataFromMeta('employer_phone'), Validators.required],
                employerTime            :   [this.getDataFromMeta('employer_time'), Validators.required],
                totalWeeklyIncome       :   [this.getDataFromMeta('_order_total'), Validators.required],
            
                //Residential Details
                residentalStatus        :   [this.getDataFromMeta('residential_status'), Validators.required],
                timeAtAdress            :   [this.getDataFromMeta('residential_time'), Validators.required],
                mortgageAmount          :   [this.getDataFromMeta('owner_mortgage'), Validators.required],
            
                //Other Exprenses
                loanList                :   [this.getDataFromMeta('debt_list'), Validators.required],
                loanTotalAmount         :   [this.getDataFromMeta('debt_amount'), Validators.required],
                repayAmountWeekly       :   [this.getDataFromMeta('debt_repayments'), Validators.required],
                weeklyBillAmount        :   [this.getDataFromMeta('expenses_bills'), Validators.required],
                weeklyHouseHold         :   [this.getDataFromMeta('expenses_household'), Validators.required],
    
                notes                   :   [''],
            });
            
            this.horizontalStepperStep4 = this._formBuilder.group({
                name                    :   [this.getDataFromMeta('referee_name'), Validators.required],
                address                 :   [this.getDataFromMeta('referee_address'), Validators.required],
                phone                   :   [this.getDataFromMeta('referee_phone'), Validators.required],
                relationship            :   [this.getDataFromMeta('referee_relationship'), Validators.required],
    
                notes                   :   [''],
            });
    }

    ngAfterViewChecked(): void 
    {    
        if(this.orderMeta == null)
            this.orderMeta = this.sharedOrderMeta;
        if(this.orderMeta != null && this.flag == false)
        {
            this.horizontalStepperStep1.controls['firstName'].setValue(this.getDataFromMeta('_billing_first_name'));
            this.horizontalStepperStep1.controls['lastName'].setValue(this.getDataFromMeta('_billing_last_name'));
            this.horizontalStepperStep1.controls['middleName'].setValue(this.getDataFromMeta('_billing_middle_name'));
            this.horizontalStepperStep1.controls['email'].setValue(this.getDataFromMeta('_billing_email'));
            this.horizontalStepperStep1.controls['streetAddress'].setValue(this.getDataFromMeta('_billing_address_1'));
            this.horizontalStepperStep1.controls['state'].setValue(this.getDataFromMeta('_billing_state'));
            this.horizontalStepperStep1.controls['city'].setValue(this.getDataFromMeta('_billing_city'));
            this.horizontalStepperStep1.controls['postCode'].setValue(this.getDataFromMeta('_billing_postcode'));
            this.horizontalStepperStep1.controls['phone'].setValue(this.getDataFromMeta('_billing_phone'));
            this.horizontalStepperStep1.controls['mobile'].setValue(this.getDataFromMeta('_billing_mobile'));

            this.horizontalStepperStep2.controls['identificationType'].setValue(this.getDataFromMeta('id_type'));
            this.horizontalStepperStep2.controls['idNumber'].setValue(this.getDataFromMeta('id_number'));
            this.horizontalStepperStep2.controls['expiryDate'].setValue(new Date(this.getDataFromMeta('id_expiry_date')));
            this.horizontalStepperStep2.controls['birthday'].setValue(new Date(this.getDataFromMeta('id_date_of_birth')));
            this.onAge();
            this.horizontalStepperStep2.controls['existingCustomer'].setValue(this.getDataFromMeta('id_existing_customer'));
            
            this.horizontalStepperStep3.controls['employmentStatus'].setValue(this.getDataFromMeta('employment_status'));
            this.horizontalStepperStep3.controls['employerName'].setValue(this.getDataFromMeta('employer_name'));
            this.horizontalStepperStep3.controls['employerPhone'].setValue(this.getDataFromMeta('employer_phone'));
            this.horizontalStepperStep3.controls['employerTime'].setValue(this.getDataFromMeta('employer_time'));
            this.horizontalStepperStep3.controls['totalWeeklyIncome'].setValue(this.getDataFromMeta('_order_total'));
            this.horizontalStepperStep3.controls['residentalStatus'].setValue(this.getDataFromMeta('residential_status'));
            this.horizontalStepperStep3.controls['timeAtAdress'].setValue(this.getDataFromMeta('residential_time'));
            this.horizontalStepperStep3.controls['mortgageAmount'].setValue(this.getDataFromMeta('owner_mortgage'));
            this.horizontalStepperStep3.controls['loanList'].setValue(this.getDataFromMeta('debt_list'));
            this.horizontalStepperStep3.controls['loanTotalAmount'].setValue(this.getDataFromMeta('debt_amount'));
            this.horizontalStepperStep3.controls['repayAmountWeekly'].setValue(this.getDataFromMeta('debt_repayments'));
            this.horizontalStepperStep3.controls['weeklyBillAmount'].setValue(this.getDataFromMeta('expenses_bills'));
            this.horizontalStepperStep3.controls['weeklyHouseHold'].setValue(this.getDataFromMeta('expenses_household'));

            this.horizontalStepperStep4.controls['name'].setValue(this.getDataFromMeta('referee_name'));
            this.horizontalStepperStep4.controls['address'].setValue(this.getDataFromMeta('referee_address'));
            this.horizontalStepperStep4.controls['phone'].setValue(this.getDataFromMeta('referee_phone'));
            this.horizontalStepperStep4.controls['relationship'].setValue(this.getDataFromMeta('referee_relationship'));
            this.flag = true;
        }
        this._cdref.detectChanges();

         
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

    initValue(): void 
    {

    }

    back() : void 
    {
        this._store.dispatch(new Back());
        const payload = {
            order_id  : this.orderId,
            type      : 4
          }
          this._store.dispatch(new SetOrderStatus({orderStatus : payload}));
    }
    onModifyFirst() : void 
    {
        let notes = this.horizontalStepperStep1.value['notes'];
        if(notes == '') {
            Swal.fire('Ooops', "You didn't modify the data.<br>To modify it, please give me the reason.", 'warning');
            return;
        }

        const payload = {
            order_id              : this.orderId,
            _billing_first_name   : this.horizontalStepperStep1.value['firstName'],
            _billing_last_name    : this.horizontalStepperStep1.value['lastName'],
            billing_middle_name   : this.horizontalStepperStep1.value['middleName'],
            _billing_email        : this.horizontalStepperStep1.value['email'],
            _billing_address_1    : this.horizontalStepperStep1.value['streetAddress'],
            _billing_state        : this.horizontalStepperStep1.value['state'], 
            _billing_city         : this.horizontalStepperStep1.value['city'],
            _billing_postcode     : this.horizontalStepperStep1.value['postCode'],
            _billing_phone        : this.horizontalStepperStep1.value['phone'],
            billing_mobile        : this.horizontalStepperStep1.value['mobile']
        }

        this._store.dispatch(new SaveOrderMetaFirst({ orderMetaFirst : payload }));
    }

    onModifySecond() : void 
    {
        let notes = this.horizontalStepperStep2.value['notes'];
        if(notes == '') {
            Swal.fire('Ooops', "You didn't modify the data.<br>To modify it, please give me the reason.", 'warning');
            return;
        }

        const payload = {
            order_id                : this.orderId,
            id_type                 : this.horizontalStepperStep2.value['identificationType'],
            id_number               : this.horizontalStepperStep2.value['idNumber'],
            id_expiry_date          : this.horizontalStepperStep2.value['expiryDate'],
            id_date_of_birth        : this.horizontalStepperStep2.value['birthday'],
            id_existing_customer    : this.horizontalStepperStep2.value['existingCustomer'],
           
        }

        this._store.dispatch(new SaveOrderMetaSecond({ orderMetaSecond : payload }));

    }

    onModifyThird() : void
    {
        let notes = this.horizontalStepperStep3.value['notes'];
        if(notes == '') {
            Swal.fire('Ooops', "You didn't modify the data.<br>To modify it, please give me the reason.", 'warning');
            return;
        }

        const payload = {
            order_id                    : this.orderId,
            employment_status           : this.horizontalStepperStep3.value['employmentStatus'],
            employer_name               : this.horizontalStepperStep3.value['employerName'],
            employer_phone              : this.horizontalStepperStep3.value['employerPhone'],
            employer_time               : this.horizontalStepperStep3.value['employerTime'],
            _order_total                : this.horizontalStepperStep3.value['totalWeeklyIncome'],
            residential_status          : this.horizontalStepperStep3.value['residentalStatus'],
            residential_time            : this.horizontalStepperStep3.value['timeAtAdress'],
            owner_mortgage              : this.horizontalStepperStep3.value['mortgageAmount'],
            debt_list                   : this.horizontalStepperStep3.value['loanList'],
            debt_amount                 : this.horizontalStepperStep3.value['loanTotalAmount'],
            debt_repayments             : this.horizontalStepperStep3.value['repayAmountWeekly'],
            expenses_bills              : this.horizontalStepperStep3.value['weeklyBillAmount'],
            expenses_household          : this.horizontalStepperStep3.value['weeklyHouseHold'],
        }

        this._store.dispatch(new SaveOrderMetaThird({ orderMetaThird : payload }));
    }

    onModifyForth() : void
    {
        let notes = this.horizontalStepperStep4.value['notes'];
        if(notes == '') {
            Swal.fire('Ooops', "You didn't modify the data.<br>To modify it, please give me the reason.", 'warning');
            return;
        }

        const payload = {
            order_id                    : this.orderId,
            referee_name                : this.horizontalStepperStep4.value['name'],
            referee_address             : this.horizontalStepperStep4.value['address'],
            referee_phone               : this.horizontalStepperStep4.value['phone'],
            referee_relationship        : this.horizontalStepperStep4.value['relationship'],
        }

        this._store.dispatch(new SaveOrderMetaForth({ orderMetaForth : payload }));
        this.back();
    }

    onAge() : void
    {
        let date = new Date(this.horizontalStepperStep2.value['birthday']);
        let timeDiff = Math.abs(Date.now() - date.getTime());
        let age = Math.floor((timeDiff / (1000 * 3600 * 24))/365.25);

        this.horizontalStepperStep2.controls['age'].setValue(age);

    }

    getDataFromMeta(metaKey: string): string 
    {              
        let emptyStr: string = '';
        if(this.orderMeta == null)
            return emptyStr;
        
        let data: any = this.orderMeta.filter(x => x.meta_key == metaKey);

        if(data.length == 0)
            return emptyStr;
        
        if(metaKey == 'id_date_of_birth' || metaKey == 'id_expiry_date') {
  
            return this.setDataAsISO(data[0].meta_value);
        }
        
        return data[0].meta_value;
    }

    setDataAsISO (dateStr : string) : string 
    {   
        //var res = str.split(" ");
        if(dateStr.includes("/")) {
            let strTemp = dateStr.split('/');
            let dateISO = strTemp[2] + '-' + strTemp[1] + '-' + strTemp[0];
            return dateISO;
        }
        return dateStr;
    }

    getFileUrls() : void 
    {
        let data: any = this.orderMeta.filter(x => x.meta_key == 'expenses_electricity' || x.meta_key == 'expenses_phone');
        console.log('ddd : ', data);
        if(data.length == 0) {
            this.uploadedURL_1 = '#';
            this.uploadedURL_2 = '#';
            return;
        }

        else if(data.lenght == 1) {
            let fileInfo: any = JSON.parse(data[0].meta_value);
            this.uploadedURL_1 = fileInfo.url; 
            console.log('1 : ',  fileInfo);
        }

        else {
            let fileInfo: any = JSON.parse(data[0].meta_value);
            this.uploadedURL_1 = fileInfo.url; 

            fileInfo = JSON.parse(data[1].meta_value);
            this.uploadedURL_2 = fileInfo.url;

            console.log('2 : ',  fileInfo);

        }
    }

    onModifySuccess(): void 
    {
        Swal.fire('Yes', 'The application was modified successfully.', 'success');  
    }
    /**
     * Finish the horizontal stepper
     */
    finishHorizontalStepper(): void
    {
        Swal.fire('Yes', 'The application was modified successfully.', 'success');
    }

    /**
     * Finish the vertical stepper
     */
    finishVerticalStepper(): void
    {
        alert('You have finished the vertical stepper!');
    }

}
