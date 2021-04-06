import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MembershipComponent } from './membership.component';

import { FuseSharedModule } from '@fuse/shared.module';


const routes = [
  {
      path     : 'company/membership',
      component: MembershipComponent
  },
];

@NgModule({
  declarations: [MembershipComponent],
  imports: [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatDividerModule,

        FuseSharedModule,
  ]
})
export class MembershipModule { }
