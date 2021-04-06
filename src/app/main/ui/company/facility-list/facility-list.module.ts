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

import { FacilityListComponent } from './facility-list.component';
import { FacilityItemComponent } from './facility-item/facility-item.component';
import { FacilityListService } from './facility-list.service';



const routes: Routes = [
  {
      path     : 'company/facility-list',
      component: FacilityListComponent,
      resolve  : {
          facilities: FacilityListService
      }
  }
];

@NgModule({
  declarations: [FacilityListComponent, FacilityItemComponent],
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
    FacilityListService
  ],
})
export class FacilityListModule { }
