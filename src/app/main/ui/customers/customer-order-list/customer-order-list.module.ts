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

import { CustomerOrderListService } from './customer-order-list.service';


import { CustomerOrderListComponent } from './customer-order-list.component';
import { CustomerOrderItemComponent } from './customer-order-item/customer-order-item.component';
import { SidebarComponent } from './sidebar/sidebar.component';

const routes: Routes = [
  {
      path     : 'customers/customer-order-list',
      component: CustomerOrderListComponent,
      resolve  : {
          instructors: CustomerOrderListService
      }
  }
];

@NgModule({
  declarations: [CustomerOrderListComponent, CustomerOrderItemComponent, SidebarComponent],
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
    CustomerOrderListService
  ]
})
export class CustomerOrderListModule { }
