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

import { TimescheduleListService } from './timeschedule-list.service';

import { TimescheduleListComponent } from './timeschedule-list.component';
import { TimescheduleItemComponent } from './timeschedule-item/timeschedule-item.component';
import { TimescheduleFormComponent } from './timeschedule-form/timeschedule-form.component';

const routes: Routes = [
  {
      path     : 'company/course/timeschedule-list',
      component: TimescheduleListComponent,
      resolve  : {
          instructors: TimescheduleListService
      }
  }
];

@NgModule({
  declarations: [TimescheduleListComponent, TimescheduleItemComponent, TimescheduleFormComponent],
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
    TimescheduleListService
  ],
  entryComponents: [
    TimescheduleFormComponent
  ]
})
export class TimescheduleListModule { }
