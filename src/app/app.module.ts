import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { TranslateModule } from '@ngx-translate/core';
import { DynaformModule } from 'dynaform';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { FakeDbService } from 'app/fake-db/fake-db.service';
import { AppComponent } from 'app/app.component';
import { AppStoreModule } from 'app/store/store.module';
import { LayoutModule } from 'app/layout/layout.module';

import { AuthService } from 'app/core/services/auth.service';
import { AuthGuard } from 'app/core/guard/auth.guard';
import { MatSelectCountryModule } from '@angular-material-extensions/select-country';

const appRoutes: Routes = [
    {
        path        : 'apps',
        loadChildren: () => import('./main/apps/apps.module').then(m => m.AppsModule),
        canActivate: [AuthGuard]
    },
    {
        path        : 'pages',
        loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule),

    },
    {
        path        : 'ui',
        loadChildren: () => import('./main/ui/ui.module').then(m => m.UIModule),
        canActivate: [AuthGuard]
    },
    {
        path        : 'documentation',
        loadChildren: () => import('./main/documentation/documentation.module').then(m => m.DocumentationModule),
        canActivate: [AuthGuard]
    },
    {
        path      : '**',
        redirectTo: 'pages/auth/login'
    },

    {
        path      : 'apps',
        redirectTo: 'apps/e-commerce/products'
    },
];

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),
        DynaformModule,
        TranslateModule.forRoot(),
        InMemoryWebApiModule.forRoot(FakeDbService, {
            delay             : 0,
            passThruUnknownUrl: true
        }),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        AppStoreModule,
        MatSelectCountryModule
    ],
    bootstrap   : [
        AppComponent
    ],
    providers: [AuthService]
})
export class AppModule
{
}
