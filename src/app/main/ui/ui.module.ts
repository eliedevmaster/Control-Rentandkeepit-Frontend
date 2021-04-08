import { NgModule } from '@angular/core';

import { RegisterCompanyModule } from 'app/main/ui/register-company/register-company.module';
import { RegisterCollaboratorModule } from 'app/main/ui/register-collaborator/register-collaborator.module';
import { RegisterInstructorModule } from 'app/main/ui/register-instructor/register-instructor.module';
import { ResetPasswordModule } from 'app/main/ui/reset-password/reset-password.module';

import { CollaboratorListModule } from 'app/main/ui/company/collaborator-list/collaborator-list.module';
import { InstructorListModule } from 'app/main/ui/company/instructor-list/instructor-list.module';
import { CompanyListModule } from 'app/main/ui/owner/company-list/company-list.module';
import { FacilityListModule } from 'app/main/ui/company/facility-list/facility-list.module';
import { FacilityFormModule } from 'app/main/ui/company/facility-form/facility-form.module';
import { RegisterFacilityModule } from 'app/main/ui/company/register-facility/register-facility.module';
import { SeasonListModule } from 'app/main/ui/company/seasons/season-list/season-list.module';
import { RegisterSeasonModule } from 'app/main/ui/company/seasons/register-season/register-season.module';
import { CourseListModule } from 'app/main/ui/company/courses/course-list/course-list.module';
import { CourseFormModule } from 'app/main/ui/company/courses/course-form/course-form.module';
import { WeekdayListModule } from 'app/main/ui/company/courses/course-base/weekday-list/weekday-list.module';
import { TimescheduleListModule } from 'app/main/ui/company/courses/course-base/timeschedule-list/timeschedule-list.module';
import { BasecourseListModule } from 'app/main/ui/company/courses/course-base/basecourse-list/basecourse-list.module';
import { CustomerListModule } from 'app/main/ui/customers/customer-list/customer-list.module';
import { CustomerOrderListModule } from 'app/main/ui/customers/customer-order-list/customer-order-list.module';

//import { SpaceFormModule } from 'app/main/ui/company/space-form/space-form.module';

import { MembershipModule } from 'app/main/ui/company/membership/membership.module';
import { CreditCardFormModule } from 'app/main/ui/company/credit-card-form/credit-card-form.module';

import { UIAngularMaterialModule } from 'app/main/ui/angular-material/angular-material.module';
import { UICardsModule } from 'app/main/ui/cards/cards.module';
import { UIFormsModule } from 'app/main/ui/forms/forms.module';

import { UIIconsModule } from 'app/main/ui/icons/icons.module';
import { UITypographyModule } from 'app/main/ui/typography/typography.module';
import { UIHelperClassesModule } from 'app/main/ui/helper-classes/helper-classes.module';
import { UIPageLayoutsModule } from 'app/main/ui/page-layouts/page-layouts.module';
import { UIColorsModule } from 'app/main/ui/colors/colors.module';

@NgModule({
    imports: [
        RegisterCompanyModule,
        RegisterCollaboratorModule,
        RegisterInstructorModule,
        CollaboratorListModule,
        InstructorListModule,
        CompanyListModule,
        FacilityListModule,
        FacilityFormModule,
       //SpaceFormModule,
        SeasonListModule,
        CourseListModule,
        CourseFormModule,

        WeekdayListModule,
        TimescheduleListModule,
        BasecourseListModule,

        RegisterFacilityModule,
        RegisterSeasonModule,
        
        MembershipModule,
        CreditCardFormModule,
        ResetPasswordModule,
        
        CustomerListModule,
        CustomerOrderListModule,
        
        UIAngularMaterialModule,
        UICardsModule,
        UIFormsModule,
        UIIconsModule,
        UITypographyModule,
        UIHelperClassesModule,
        UIPageLayoutsModule,
        UIColorsModule,

        //DrawSpaceModule
    ],
    declarations: []
})
export class UIModule
{
}
