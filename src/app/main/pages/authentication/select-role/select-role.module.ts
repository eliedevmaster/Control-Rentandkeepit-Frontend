import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { SelectRoleComponent } from "app/main/pages/authentication/select-role/select-role.component";

const routes = [
    {
        path     : 'auth/select-role',
        component: SelectRoleComponent
    }
];

@NgModule({
    declarations: [
        SelectRoleComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        TranslateModule.forChild(),    
        FuseSharedModule
    ]
})
export class SelectRoleModule
{
}
