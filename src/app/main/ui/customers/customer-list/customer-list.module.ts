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

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { CustomerListService } from './customer-list.service';


import { CustomerListComponent } from './customer-list.component';
import { CustomerItemComponent } from './customer-item/customer-item.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { SidebarComponent } from './sidebar/sidebar.component';

const routes: Routes = [
  {
      path     : 'customers/customer-list',
      component: CustomerListComponent,
      resolve  : {
          instructors: CustomerListService
      }
  }
];
@NgModule({
  declarations: [CustomerListComponent, CustomerItemComponent, CustomerFormComponent, SidebarComponent],
  imports: [
    RouterModule.forChild(routes),
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
    CustomerListService
  ],
  entryComponents: [
    CustomerFormComponent
  ]
})

export class CustomerListModule { }
