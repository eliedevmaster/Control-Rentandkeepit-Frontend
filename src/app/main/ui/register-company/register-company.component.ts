import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country } from '@angular-material-extensions/select-country'; 
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatCalendar } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {takeUntil} from 'rxjs/operators';

import { RegisterCompany, UpdateCompany, SetActive } from 'app/store/actions';
import { Store } from '@ngrx/store';
import { State as AppState, getCompanyState, getAuthState } from 'app/store/reducers';

import { BaseService } from 'app/core/services/base.service';

import { User } from 'app/models/user';
import { Company } from 'app/models/companymanagement/company';
import { CompanyType } from 'app/models/companymanagement/companytype';
import { Currency } from 'app/models/base/currency';

export const MY_FORMATS = {
    parse: {
      dateInput: 'LL',
    },
    display: {
      dateInput: 'DD/MMM',
      monthYearLabel: 'MMM',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMM',
    },
  };


@Component({
  selector: 'app-register-company',
  templateUrl: './register-company.component.html',
  styleUrls: ['./register-company.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class RegisterCompanyComponent implements OnInit {

    customDate = CustomDate;
    companyForm: FormGroup;
    
    user: User;
    company: Company;
    
    companyTypes: CompanyType[] = [];
    currencies: Currency[] = [];
    countryList: Array<any> = [];
    isActive: boolean = false;

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
        private _baseService: BaseService,
        private _router: Router,
    
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.mapUserStateToModel();
        if(this.user.role != "Super User") {
            this._router.navigate(['pages/errors/error-permission']);
        }

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
        this.companyForm = this._formBuilder.group({
            companyType   : ['', Validators.required],
            displayName   : ['', Validators.required],
            fiscalCode    : ['', Validators.required],
            vatCode       : ['', Validators.required],
            vatCountry    : ['', Validators.required],
            phoneNumber   : ['', Validators.required],
            fax           : [''],
            currency      : ['', Validators.required],
            startDate     : ['', Validators.required],
            endDate       : ['', Validators.required],
        });


        this.mapCompanyTypesToModel();
        this.mapCurrenciesToModel();

        this.mapCompanyStateToModel();
        this.setInitFormValues();
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

    onRegisterOrUpdate(): void
    {
        let formData = {
          company_type_id : this.companyForm.value['companyType'],
          display_name    : this.companyForm.value['displayName'],
          fiscal_code     : this.companyForm.value['fiscalCode'],
          vat_code        : this.companyForm.value['vatCode'],
          country         : this.companyForm.value['vatCountry'],
          phone           : this.companyForm.value['phoneNumber'],
          fax             : this.companyForm.value['fax'],
          currency_id     : this.companyForm.value['currency'],
          start_date      : this.companyForm.value['startDate'],
          end_date        : this.companyForm.value['endDate'],
        };
        let payload = new Company(formData);

        if(this.user.active == 0) {
            this._store.dispatch(new RegisterCompany({company : payload}));
            //this._store.dispatch(new SetActive());
            this.reloadCompanyInfo();
        }
            
        else if(this.user.active == 1) {
            payload.id = this.company.id;
            this._store.dispatch(new UpdateCompany({company : payload}));
        }
        
     }
    
    onCountrySelected($event : Country)
    {
       console.log($event);
    }
    setInitFormValues(): void
    {
        if(this.user != null && this.company != null && this.user.active == 1) {
            this.companyForm.controls['companyType'].setValue(this.company.company_type.id);
            this.companyForm.controls['displayName'].setValue(this.company.display_name);
            this.companyForm.controls['fiscalCode'].setValue(this.company.fiscal_code);
            this.companyForm.controls['vatCountry'].setValue(this.company.country);
            this.companyForm.controls['vatCode'].setValue(this.company.vat_code);
            this.companyForm.controls['phoneNumber'].setValue(this.company.phone);
            this.companyForm.controls['fax'].setValue(this.company.fax);
            this.companyForm.controls['currency'].setValue(this.company.currency.id);
            this.companyForm.controls['startDate'].setValue(new Date(this.company.start_date));
            this.companyForm.controls['endDate'].setValue(new Date(this.company.end_date));
        }
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Map methods
    // ----
    
    mapCompanyTypesToModel(): void
    {
        this._baseService.getCompanyTypes().subscribe(companyTypes => {
            companyTypes.forEach(element => {
                this.companyTypes.push(element);
            });
        });
    }

    mapCurrenciesToModel(): void
    {
        this._baseService.getCurrencies().subscribe(currencies => {
            currencies.forEach(element => {
                this.currencies.push(element);
            });
        });
    }

    mapUserStateToModel(): void
    {
        this.getAuthState().subscribe(state => {
            if(state.user != null) {
                this.user = new User(state.user);
                if(this.user.active == 0 && this.isActive == true)
                    this.user.active = 1;
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


    reloadCompanyInfo(): void
    {
        if(this.user != null) {
            this.user.active = 1;
            this.isActive = true;
            localStorage.removeItem('user');
            localStorage.setItem('user', JSON.stringify(this.user));

        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ State methods
    // ----
    
    getAuthState()
    {
        return this._store.select(getAuthState);
    }

    getCompanyState()
    {
        return this._store.select(getCompanyState);
    }

}



/** Custom header component for datepicker. */
@Component({
    selector: 'custom-Date',
    styles: [`
      .custom-Date {
        display: flex;
        align-items: center;
        padding: 0.5em;
      }
  
      .example-header-label {
        flex: 1;
        height: 1em;
        font-weight: 500;
        text-align: center;
      }
  
      .example-double-arrow .mat-icon {
        margin: -22%;
      }
    `],
    template: `
      <div class="custom-Date">
        <button mat-icon-button (click)="previousClicked('month')">
          <
        </button>
        <span class="example-header-label">{{periodLabel}}</span>
        <button mat-icon-button (click)="nextClicked('month')">
          >
        </button>
      </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class CustomDate<D> implements OnDestroy {
    private _destroyed = new Subject<void>();
  
    constructor(
        private _calendar: MatCalendar<D>, private _dateAdapter: DateAdapter<D>,
        @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats, cdr: ChangeDetectorRef) {
      _calendar.stateChanges
          .pipe(takeUntil(this._destroyed))
          .subscribe(() => cdr.markForCheck());
    }
  
    ngOnDestroy() {
      this._destroyed.next();
      this._destroyed.complete();
    }
  
    get periodLabel() {
      return this._dateAdapter
          .format(this._calendar.activeDate, this._dateFormats.display.monthYearLabel)
          .toLocaleUpperCase();
    }
  
    previousClicked(mode: 'month' | 'year') {
    console.log(this._calendar.activeDate);
      this._calendar.activeDate = mode === 'month' ?
          this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1) :
          this._dateAdapter.addCalendarYears(this._calendar.activeDate, 0);
    }
  
    nextClicked(mode: 'month' | 'year') {
      this._calendar.activeDate = mode === 'month' ?
          this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1) :
          this._dateAdapter.addCalendarYears(this._calendar.activeDate, 0);
    }
  }
