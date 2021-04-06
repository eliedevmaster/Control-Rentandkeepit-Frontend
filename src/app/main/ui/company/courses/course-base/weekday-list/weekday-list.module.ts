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

import { WeekdayListService } from './weekday-list.service';

import { WeekdayListComponent } from './weekday-list.component';
import { WeekdayItemComponent } from './weekday-item/weekday-item.component';
import { WeekdayFormComponent } from './weekday-form/weekday-form.component';


const routes: Routes = [
  {
      path     : 'company/course/weekday-list',
      component: WeekdayListComponent,
      resolve  : {
          instructors: WeekdayListService
      }
  }
];

@NgModule({
  declarations: [WeekdayListComponent, WeekdayItemComponent, WeekdayFormComponent],
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
    WeekdayListService
  ],
  entryComponents: [
    WeekdayFormComponent
  ]
})
export class WeekdayListModule { }
