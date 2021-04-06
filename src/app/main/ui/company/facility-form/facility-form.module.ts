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
import { MatStepperModule } from '@angular/material/stepper';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { ColorPickerModule } from 'ngx-color-picker';
import { ShapeService } from '../draw-space/service/shape.service';

import { ShapeComponent } from '../draw-space/components/shape/shape.component';
import { CircleComponent } from '../draw-space/components/circle/circle.component';
import { EllipseComponent } from '../draw-space/components/ellipse/ellipse.component';
import { RectangleComponent } from '../draw-space/components/rectangle/rectangle.component';
import { SquareComponent } from '../draw-space/components/square/square.component'; 
import { DynamicSvgDirective } from '../draw-space/directives/dynamic-svg.directive';


import { FacilityFormComponent } from './facility-form.component';
import { SpaceItemComponent } from './space-item/space-item.component';
import { FacilityFormService } from './facility-form.service';

const routes: Routes = [
  {
      path     : 'company/facility-form/:parentType/:parentId',
      component: FacilityFormComponent,
      resolve  : {
          facilities: FacilityFormService
      }
  }
];


@NgModule({
  declarations: [
      FacilityFormComponent, 
      SpaceItemComponent, 
      DynamicSvgDirective,
      ShapeComponent,
      CircleComponent,
      EllipseComponent,
      RectangleComponent,
      SquareComponent,
    ],
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
        MatStepperModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,

        ColorPickerModule,
  ],
  
  entryComponents: [
    ShapeComponent, 
    CircleComponent,
    EllipseComponent,
    RectangleComponent,
    SquareComponent,
  ],

  providers : [
    FacilityFormService,
    ShapeService
  ],
})
export class FacilityFormModule { }
