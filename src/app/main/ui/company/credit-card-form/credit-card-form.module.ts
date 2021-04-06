import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxStripeModule } from 'ngx-stripe';
import { FuseSharedModule } from '@fuse/shared.module';
import { CreditCardFormComponent } from './credit-card-form.component';

const routes: Routes = [
  {
      path     : 'company/membership/creditcardfrom',
      component: CreditCardFormComponent
  }
];

@NgModule({
  declarations: [CreditCardFormComponent],
  imports: [
        RouterModule.forChild(routes),
        NgxStripeModule.forRoot('pk_test_51IUBURAnQ6KeqVRFpnzL4hJptsPAbLzULMkRFwjreAKn5woRL8KohHaJYduzxtud8kEv5IOJpMs8Ggxw9gnXHWml00AVdTyRDn'),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatStepperModule,

        FuseSharedModule,
  ]
})
export class CreditCardFormModule { }
