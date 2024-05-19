import {NgModule} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import en from '@angular/common/locales/en';
import {en_US, NgZorroAntdModule, NZ_I18N} from 'ng-zorro-antd';
import {AppAsideModule, AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule} from '@coreui/angular';
import {PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {BsDropdownModule, TabsModule} from 'ngx-bootstrap';
import {ColorPickerModule} from 'ngx-color-picker';

import {CoreRoutingModule} from './core-routing.module';

import {SignUpComponent} from './components/account/sign-up';
import {LoginComponent} from './components/security/login';
import {LogoutComponent} from './components/security/logout';

import {BearerInterceptor} from './interceptors/bearer.interceptor';
import {ErrorInterceptor} from './interceptors/error.interceptor';
import {ForgotPasswordComponent} from './components/account/forgot-password';
import {P404Component} from './components/error/404.component';
import {P500Component} from './components/error/500.component';
import {SharedModule} from '../shared/shared.module';
import {CoreComponent} from './core.component';
import {DefaultLayoutComponent} from './components/default-layout';
import {ChangePasswordComponent} from './components/profile/change-password/change-password.component';
import {ProfileViewComponent} from './components/profile/view/profile-view.component';
import {ProfileEditComponent} from './components/profile/edit/profile-edit.component';

import {ListComponent as UserListComponent} from './admin/components/user/list.component';
// import {FormComponent as UserFormComponent} from './admin/components/roles/form/form.component';

import {ListComponent as RoleListComponent} from './admin/components/role/list.component';
import {FormComponent as RoleFormComponent} from './admin/components/role/form/form.component';

import {ListComponent as AllergensListComponent} from './residents/components/allergen/list.component';
import {FormComponent as AllergensFormComponent} from './residents/components/allergen/form/form.component';

import {ListComponent as CareLevelListComponent} from './residents/components/care-level/list.component';
import {FormComponent as CareLevelFormComponent} from './residents/components/care-level/form/form.component';

import {ListComponent as CityStateZipListComponent} from './residents/components/city-state-zip/list.component';
import {FormComponent as CityStateZipFormComponent} from './residents/components/city-state-zip/form/form.component';

import {ListComponent as DiagnosisListComponent} from './residents/components/diagnosis/list.component';
import {FormComponent as DiagnosisFormComponent} from './residents/components/diagnosis/form/form.component';

import {ListComponent as DietListComponent} from './residents/components/diet/list.component';
import {FormComponent as DietFormComponent} from './residents/components/diet/form/form.component';

import {ListComponent as MedicalHistoryConditionListComponent} from './residents/components/medical-history-condition/list.component';
import {FormComponent as MedicalHistoryConditionFormComponent} from './residents/components/medical-history-condition/form/form.component';

import {ListComponent as MedicationListComponent} from './residents/components/medication/list.component';
import {FormComponent as MedicationFormComponent} from './residents/components/medication/form/form.component';

import {ListComponent as MedicationFormFactorListComponent} from './residents/components/medication-form-factor/list.component';
import {FormComponent as MedicationFormFactorFormComponent} from './residents/components/medication-form-factor/form/form.component';

import {ListComponent as RelationshipListComponent} from './residents/components/relationship/list.component';
import {FormComponent as RelationshipFormComponent} from './residents/components/relationship/form/form.component';

import {ListComponent as SalutationListComponent} from './residents/components/salutation/list.component';
import {FormComponent as SalutationFormComponent} from './residents/components/salutation/form/form.component';

import {ListComponent as PhysicianSpecialityListComponent} from './residents/components/physician-speciality/list.component';
import {FormComponent as PhysicianSpecialityFormComponent} from './residents/components/physician-speciality/form/form.component';

import {ListComponent as PhysicianListComponent} from './residents/components/physician/list.component';
import {FormComponent as PhysicianFormComponent} from './residents/components/physician/form/form.component';

import {ListComponent as ApartmentListComponent} from './residents/components/apartment/list.component';
import {FormComponent as ApartmentFormComponent} from './residents/components/apartment/form/form.component';

import {ListComponent as ApartmentRoomListComponent} from './residents/components/apartment-room/list.component';
import {FormComponent as ApartmentRoomFormComponent} from './residents/components/apartment-room/form/form.component';

import {ListComponent as FacilityListComponent} from './residents/components/facility/list.component';
import {FormComponent as FacilityFormComponent} from './residents/components/facility/form/form.component';

import {ListComponent as FacilityRoomListComponent} from './residents/components/facility-room/list.component';
import {FormComponent as FacilityRoomFormComponent} from './residents/components/facility-room/form/form.component';

import {ListComponent as FacilityDiningRoomListComponent} from './residents/components/facility-dining-room/list.component';
import {FormComponent as FacilityDiningRoomFormComponent} from './residents/components/facility-dining-room/form/form.component';

import {ListComponent as RegionListComponent} from './residents/components/region/list.component';
import {FormComponent as RegionFormComponent} from './residents/components/region/form/form.component';

import {ResidentSelectorComponent} from './residents/components/resident-selector/resident-selector.component';

import {ResidentComponent} from './residents/components/resident/resident.component';
import {InfoComponent as ResidentInfoComponent} from './residents/components/resident/info/info.component';

// import {ListComponent as ResidentResponsiblePersonListComponent} from './residents/components/resident/responsible-person/list.component';
// import {FormComponent as ResidentResponsiblePersonFormComponent} from './residents/components/resident/responsible-person/form/form.component';
//
// import {ListComponent as ResidentEventListComponent} from './residents/components/resident/event/list.component';
// import {FormComponent as ResidentEventFormComponent} from './residents/components/resident/event/form/form.component';
//
// import {ListComponent as ResidentRentListComponent} from './residents/components/resident/rent/list.component';
// import {FormComponent as ResidentRentFormComponent} from './residents/components/resident/rent/form/form.component';
//
// import {ListComponent as ResidentPhysicianListComponent} from './residents/components/resident/physician/list.component';
// import {FormComponent as ResidentPhysicianFormComponent} from './residents/components/resident/physician/form/form.component';

import {ListComponent as ResidentMedicationListComponent} from './residents/components/resident/medication/list.component';
import {FormComponent as ResidentMedicationFormComponent} from './residents/components/resident/medication/form/form.component';

import {HistoryComponent as ResidentHistoryComponent} from './residents/components/resident/history/history.component';

import {ListComponent as ResidentDiagnoseListComponent} from './residents/components/resident/history/diagnose/list.component';
import {FormComponent as ResidentDiagnoseFormComponent} from './residents/components/resident/history/diagnose/form/form.component';

import {ListComponent as ResidentAllergyMedicationListComponent} from './residents/components/resident/history/allergy-medication/list.component';
import {FormComponent as ResidentAllergyMedicationFormComponent} from './residents/components/resident/history/allergy-medication/form/form.component';

import {ListComponent as ResidentAllergyOtherListComponent} from './residents/components/resident/history/allergy-other/list.component';
import {FormComponent as ResidentAllergyOtherFormComponent} from './residents/components/resident/history/allergy-other/form/form.component';

import {ListComponent as ResidentMedicalHistoryListComponent} from './residents/components/resident/history/medical-history/list.component';
import {FormComponent as ResidentMedicalHistoryFormComponent} from './residents/components/resident/history/medical-history/form/form.component';

import {ListComponent as ResidentDietListComponent} from './residents/components/resident/dietary-restriction/list.component';
import {FormComponent as ResidentDietFormComponent} from './residents/components/resident/dietary-restriction/form/form.component';

// import {ListComponent as ResidentAssessmentListComponent} from './residents/components/resident/assessment/list.component';
// import {FormComponent as ResidentAssessmentFormComponent} from './residents/components/resident/assessment/form/form.component';
//
// import {ListComponent as ResidentReportListComponent} from './residents/components/resident/report/list.component';
// import {FormComponent as ResidentReportFormComponent} from './residents/components/resident/report/form/form.component';





import {CityStateZipPipe} from './residents/pipes/csz.pipe';
import {PhysicianPipe} from './residents/pipes/physician.pipe';
import {ResidentPipe} from './residents/pipes/resident.pipe';

registerLocaleData(en);

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    CityStateZipPipe,
    PhysicianPipe,
    ResidentPipe,

    CoreComponent,

    P404Component,
    P500Component,

    LoginComponent,
    LogoutComponent,

    SignUpComponent,
    ForgotPasswordComponent,

    DefaultLayoutComponent,

    ChangePasswordComponent,
    ProfileViewComponent,
    ProfileEditComponent,

    UserListComponent,
    // UserFormComponent,

    RoleListComponent,
    RoleFormComponent,

    AllergensListComponent,
    AllergensFormComponent,

    CareLevelListComponent,
    CareLevelFormComponent,

    CityStateZipListComponent,
    CityStateZipFormComponent,

    DiagnosisListComponent,
    DiagnosisFormComponent,

    DietListComponent,
    DietFormComponent,

    MedicalHistoryConditionListComponent,
    MedicalHistoryConditionFormComponent,

    MedicationListComponent,
    MedicationFormComponent,

    MedicationFormFactorListComponent,
    MedicationFormFactorFormComponent,

    RelationshipListComponent,
    RelationshipFormComponent,

    SalutationListComponent,
    SalutationFormComponent,

    PhysicianSpecialityListComponent,
    PhysicianSpecialityFormComponent,

    PhysicianListComponent,
    PhysicianFormComponent,

    ApartmentListComponent,
    ApartmentFormComponent,

    ApartmentRoomListComponent,
    ApartmentRoomFormComponent,

    FacilityListComponent,
    FacilityFormComponent,

    FacilityRoomListComponent,
    FacilityRoomFormComponent,

    FacilityDiningRoomListComponent,
    FacilityDiningRoomFormComponent,

    RegionListComponent,
    RegionFormComponent,

    ResidentSelectorComponent,

    ResidentComponent,
    ResidentInfoComponent,

    ResidentDietListComponent,
    ResidentDietFormComponent,

    ResidentMedicationListComponent,
    ResidentMedicationFormComponent,

    // ResidentResponsiblePersonListComponent,
    // ResidentResponsiblePersonFormComponent,

    // ResidentEventListComponent,
    // ResidentEventFormComponent,

    // ResidentRentListComponent,
    // ResidentRentFormComponent,

    // ResidentPhysicianListComponent,
    // ResidentPhysicianFormComponent,

    ResidentHistoryComponent,

    ResidentDiagnoseListComponent,
    ResidentDiagnoseFormComponent,

    ResidentAllergyMedicationListComponent,
    ResidentAllergyMedicationFormComponent,

    ResidentAllergyOtherListComponent,
    ResidentAllergyOtherFormComponent,

    ResidentMedicalHistoryListComponent,
    ResidentMedicalHistoryFormComponent,

    // ResidentAssessmentListComponent,
    // ResidentAssessmentFormComponent,

    // ResidentReportListComponent,
    // ResidentReportFormComponent,

  ],
  entryComponents: [
    RoleFormComponent,

    AllergensFormComponent,

    CareLevelFormComponent,

    CityStateZipFormComponent,

    DiagnosisFormComponent,

    DietFormComponent,

    MedicalHistoryConditionFormComponent,

    MedicationFormComponent,

    MedicationFormFactorFormComponent,

    RelationshipFormComponent,

    SalutationFormComponent,

    PhysicianSpecialityFormComponent,

    PhysicianFormComponent,

    ApartmentFormComponent,
    ApartmentRoomFormComponent,

    FacilityFormComponent,
    FacilityRoomFormComponent,
    FacilityDiningRoomFormComponent,

    RegionFormComponent,

    ResidentDietFormComponent,
    ResidentMedicationFormComponent,

    // ResidentResponsiblePersonFormComponent,
    // ResidentEventFormComponent,
    // ResidentRentFormComponent,
    // ResidentPhysicianFormComponent,
    ResidentDiagnoseFormComponent,
    ResidentAllergyMedicationFormComponent,
    ResidentAllergyOtherFormComponent,
    ResidentMedicalHistoryFormComponent,
    // ResidentAssessmentFormComponent,
    // ResidentReportFormComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    NgZorroAntdModule,
    ColorPickerModule,
    CoreRoutingModule,
    SharedModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: BearerInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: NZ_I18N, useValue: en_US}
  ],
  exports: [
    CityStateZipPipe
  ]
})

export class CoreModule {
}
