import { Component, OnDestroy, OnInit , ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, of } from 'rxjs';  
import { catchError, map } from 'rxjs/operators';  
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';

import { Back, UpdateCustomer } from 'app/store/actions';
import { Store } from '@ngrx/store';
import { fuseAnimations } from '@fuse/animations';
import { FileUploadService } from  'app/core/services/file-upload.service';

import { State as AppState, getAuthState } from 'app/store/reducers';
import { User } from 'app/models/user';
import { VAlign } from 'docx';
import Swal from 'sweetalert2/dist/sweetalert2.js';  

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss']
})
export class ApplicationFormComponent implements OnInit {

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
        private _formBuilder: FormBuilder
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {

        // Horizontal Stepper form steps
        this.horizontalStepperStep1 = this._formBuilder.group({
            comment                 :  ['', Validators.required],
        });
        
        this.horizontalStepperStep2 = this._formBuilder.group({
            firstName               :   ['asdf', Validators.required],
            lastName                :   ['asdf', Validators.required],
            middleName              :   ['K'],
            email                   :   ['test@gmail.com', Validators.required],
            streetAddress           :   ['test street', Validators.required],
            state                   :   ['state', Validators.required], 
            city                    :   ['city', Validators.required],
            postCode                :   ['2000', Validators.required],
            phone                   :   ['0434161268', Validators.required],
            mobile                  :   [''],
        });

        this.horizontalStepperStep3 = this._formBuilder.group({
            identificationType  :  ['Proof of Age Card', Validators.required],
            idNumber            :  ['0119801785', Validators.required],
            expiryDate          :  [new Date('16/08/2026'), Validators.required],
            birthday            :  [new Date('16/08/1993'), Validators.required],
            existingCustomer    :  [2, Validators.required],
        });

        this.horizontalStepperStep4 = this._formBuilder.group({
            //Income
            employmentStatus    :   ['Part Time', Validators.required],
            employerName        :   ['New horizones', Validators.required],
            employerPhone       :   ['02692323', Validators.required],
            employerTime        :   ['5 months', Validators.required],
            totalWeeklyIncome   :   [50, Validators.required],
        
            //Residential Details
            residentalStatus    :   ['Renting', Validators.required],
            timeAtAdress        :   ['2 years 5 months', Validators.required],
            MortgageAmount      :   ['20', Validators.required],
        
            //Other Exprenses
            loanList            :   ['asdf', Validators.required],
            loanTotalAmount     :   ['520', Validators.required],
            repayAmountWeekly   :   [31, Validators.required],
            weeklyBillAmount    :   [180, Validators.required],
            weeklyHouseHold     :   [90, Validators.required],
            
        });
        
        this.horizontalStepperStep5 = this._formBuilder.group({
            name                :   ['Denise', Validators.required],
            address             :   ['5 pitt street taree', Validators.required],
            phone               :   ['0421645969', Validators.required],
            relationship        :   ['Friend', Validators.required]
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
