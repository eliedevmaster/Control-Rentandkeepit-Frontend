import { Component, OnInit , ViewChild } from '@angular/core';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import { StripeService, StripeCardComponent } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';

import { Store } from '@ngrx/store';
import { State as AppState, getCompanyState, getAuthState } from 'app/store/reducers';
import { SetMembership } from 'app/store/actions';

import { Company } from 'app/models/companymanagement/company';
import { User } from 'app/models/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-credit-card-form',
  templateUrl: './credit-card-form.component.html',
  styleUrls: ['./credit-card-form.component.scss'],
})
export class CreditCardFormComponent implements OnInit {

    @ViewChild(StripeCardComponent) card: StripeCardComponent;
    creditCardForm: FormGroup;
    stripeToken: any;
    user: User;
    company: Company;

    cardOptions: StripeCardElementOptions = {
        hidePostalCode: true,
        style: {
          base: {
            iconColor: '#666EE8',
            color: '#31325F',
            fontWeight: '300',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSize: '25px',
            '::placeholder': {
              color: '#CFD7E0',
            },
          },
        },
      };
    
      elementsOptions: StripeElementsOptions = {
        locale: 'en',
      };

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
        private _stripeService: StripeService,    
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

        this.creditCardForm = this._formBuilder.group({
            cardName: ['', Validators.required]
        });
        
        this.mapUserStateToModel();
        this.mapCompanyStateToModel();
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

    onSubmit(): void
    {
        //console.log(this.creditCardForm.value['cardName']);
        //return;
        if(this.user.active == 0) {
            Swal.fire('Sorry!', 'You have to register the company informations at first.', 'error');
            return;
        }
        else {
            this.createToken();
        }       
    }

    createToken(): any {
        const name = this.creditCardForm.value['cardName'];
        this._stripeService
            .createToken(this.card.element, { name })
            .subscribe((result) => {
                if (result.token) {
                // Use the token
                    this.stripeToken = result.token.id;
                    const payload = {
                        companyId   : this.company.id,
                        cardName    : this.creditCardForm.value['cardName'],
                        stripeToken : this.stripeToken,
                    };
                    this._store.dispatch(new SetMembership({card : payload}));
                } 
                else if (result.error) {
                    console.log(result.error.message);
                    Swal.fire('Sorry!', result.error.message, 'error');
            }
        });
    }

    mapUserStateToModel(): void
    {
        this.getAuthState().subscribe(state => {
            if(state.user != null) {
                this.user = new User(state.user);
            }
        });
    }

    mapCompanyStateToModel(): void
    {
        this.getCompanyState().subscribe(state => {
            if(state.company != null) {                
                this.company = new Company(state.company);
            }
        });
    }

    getAuthState()
    {
        return this._store.select(getAuthState);
    }

    getCompanyState()
    {
        return this._store.select(getCompanyState);
    }

}
