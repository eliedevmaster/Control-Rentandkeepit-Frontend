import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectCountryModule } from '@angular-material-extensions/select-country'; 

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { CompanyListService } from './company-list.service';


import { CompanyListComponent } from './company-list.component';
import { CompanyItemComponent } from './company-item/company-item.component';
import { CompanyItemFormComponent } from './company-item-form/company-item-form.component';


const routes: Routes = [
  {
      path     : 'company-list',
      component: CompanyListComponent,
      resolve  : {
          instructors: CompanyListService
      }
  }
];

@NgModule({
  declarations: [CompanyListComponent, CompanyItemComponent, CompanyItemFormComponent],
  imports: [
    RouterModule.forChild(routes),
    MatSelectCountryModule.forRoot('en'), 
    MatSlideToggleModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatTableModule,
    MatToolbarModule,

    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,
  ],
  providers      : [
    CompanyListService
  ],
  entryComponents: [
    CompanyItemFormComponent
]
})
export class CompanyListModule { }
