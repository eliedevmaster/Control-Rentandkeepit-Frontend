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
import { MatSelectModule } from '@angular/material/select';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { BasecourseListService } from './basecourse-list.service';

import { BasecourseListComponent } from './basecourse-list.component';
import { BasecourseItemComponent } from './basecourse-item/basecourse-item.component';
import { BasecourseFormComponent } from './basecourse-form/basecourse-form.component';

const routes: Routes = [
  {
      path     : 'company/course/basecourse-list',
      component: BasecourseListComponent,
      resolve  : {
          instructors: BasecourseListService
      }
  }
];

@NgModule({
  declarations: [BasecourseListComponent, BasecourseItemComponent, BasecourseFormComponent],
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
    MatSelectModule,
    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,
  ],
  providers      : [
    BasecourseListService
  ],
  entryComponents: [
    BasecourseFormComponent
  ]
})
export class BasecourseListModule { }
