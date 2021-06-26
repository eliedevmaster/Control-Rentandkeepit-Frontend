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

import { UserListService } from './user-list.service';

import { UserListComponent } from './user-list.component';
import { UserItemComponent } from './user-item/user-item.component';


const routes: Routes = [
  {
      path     : 'users/user-list',
      component: UserListComponent,
      resolve  : {
          instructors: UserListService
      }
  }
];


@NgModule({
  declarations: [UserListComponent, UserItemComponent],
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
    UserListService
  ],
  
})
export class UserListModule { }
