import { Component, Inject, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MatCalendar } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


import { Company } from 'app/models/companymanagement/company';

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
  selector: 'app-company-item-form',
  templateUrl: './company-item-form.component.html',
  styleUrls: ['./company-item-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class CompanyItemFormComponent {

  action: string;
  company: Company;
  companyForm: FormGroup;
  dialogTitle: string;

  /**
   * Constructor
   *
   * @param {MatDialogRef<CompanyItemFormComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   */
  constructor(
      public matDialogRef: MatDialogRef<CompanyItemFormComponent>,
      @Inject(MAT_DIALOG_DATA) private _data: any,
      private _formBuilder: FormBuilder
  )
  {
      // Set the defaults
      this.action = _data.action;

      if ( this.action === 'edit' )
      {
          this.dialogTitle = 'Edit company';
          this.company = _data.company;
      }
      else
      {
          this.dialogTitle = 'New company';
          this.company = new Company({});
      }

      this.companyForm = this.createCompanyForm();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create company form
   *
   * @returns {FormGroup}
   */
  createCompanyForm(): FormGroup
  {
      return this._formBuilder.group({

        country           : [this.company.country],
        email             : [this.company.user.email],
        companyType       : [this.company.company_type.type],
        displayName       : [this.company.display_name],
        fiscalCode        : [this.company.fiscal_code],
        vatCode           : [this.company.vat_code],
        phone             : [this.company.phone],
        fax               : [this.company.fax],
        currency          : [this.company.currency.currency],
        startDate         : [new Date(this.company.start_date)],
        endDate           : [new Date(this.company.end_date)],
        membership        : [this.company.membership.description],
        personalCode      : [this.company.personal_code],

      });
  }
}

