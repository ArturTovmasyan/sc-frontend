import {NgModule} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import en from '@angular/common/locales/en';
import {en_US, NgZorroAntdModule, NZ_I18N, NzFormExplainComponent, NzFormItemComponent} from 'ng-zorro-antd';
import {AppAsideModule, AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule} from '@coreui/angular';
import {PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {BsDropdownModule, TabsModule} from 'ngx-bootstrap';
import {ColorPickerModule} from 'ngx-color-picker';
import {DndModule} from '@beyerleinf/ngx-dnd';

import {CoreRoutingModule} from './core-routing.module';

// import {SignUpComponent} from './components/account/sign-up/sign-up.component';
import {ActivateComponent} from './components/account/activate/activate.component';
import {SignInComponent} from './components/security/sign-in/sign-in.component';
import {SignOutComponent} from './components/security/sign-out/sign-out.component';

import {BearerInterceptor} from './interceptors/bearer.interceptor';
import {ErrorInterceptor} from './interceptors/error.interceptor';
import {ResetPasswordComponent} from './components/account/reset-password/reset-password.component';
import {ForgotPasswordComponent} from './components/account/forgot-password/forgot-password.component';
import {P404Component} from './components/error/404.component';
import {P500Component} from './components/error/500.component';
import {SharedModule} from '../shared/shared.module';
import {CoreComponent} from './core.component';
import {DefaultLayoutComponent} from './components/default-layout/default-layout.component';
import {ChangePasswordComponent} from './components/profile/change-password/change-password.component';
import {ProfileViewComponent} from './components/profile/view/profile-view.component';
import {ProfileEditComponent} from './components/profile/edit/profile-edit.component';

import {ListComponent as UserListComponent} from './admin/components/user/list.component';
import {FormComponent as UserFormComponent} from './admin/components/user/form/form.component';

import {ListComponent as UserInviteListComponent} from './admin/components/user-invite/list.component';
import {FormComponent as UserInviteFormComponent} from './admin/components/user-invite/form/form.component';

import {ListComponent as RoleListComponent} from './admin/components/role/list.component';
import {FormComponent as RoleFormComponent} from './admin/components/role/form/form.component';

import {ListComponent as SpaceListComponent} from './admin/components/space/list.component';
import {FormComponent as SpaceFormComponent} from './admin/components/space/form/form.component';

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

import {ListComponent as ResponsiblePersonRoleListComponent} from './residents/components/responsible-person-role/list.component';
import {FormComponent as ResponsiblePersonRoleFormComponent} from './residents/components/responsible-person-role/form/form.component';

import {ListComponent as PhysicianListComponent} from './residents/components/physician/list.component';
import {FormComponent as PhysicianFormComponent} from './residents/components/physician/form/form.component';

import {ListComponent as ResponsiblePersonListComponent} from './residents/components/responsible-person/list.component';
import {FormComponent as ResponsiblePersonFormComponent} from './residents/components/responsible-person/form/form.component';

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

import {ListComponent as ResidentListComponent} from './residents/components/resident/list.component';
import {FormComponent as ResidentFormComponent} from './residents/components/resident/resident/form/form.component';
import {ViewComponent as ResidentViewComponent} from './residents/components/resident/resident/view/view.component';
import {InfoComponent as ResidentInfoComponent} from './residents/components/resident/resident/info/info.component';
import {FormComponent as ResidentMoveComponent} from './residents/components/resident/resident/move/form.component';
import {
  ImageEditorComponent,
  ImageEditorComponent as ResidentImageEditorComponent
} from './residents/components/resident/resident/info/img-editor/image-editor.component';

import {ListComponent as ResidentResponsiblePersonListComponent} from './residents/components/resident/responsible-person/list.component';
import {FormComponent as ResidentResponsiblePersonFormComponent} from './residents/components/resident/responsible-person/form/form.component';
import {FormComponent as ResidentResponsiblePersonReorderFormComponent} from './residents/components/resident/responsible-person/reorder/form.component';

import {ListComponent as ResidentPhysicianListComponent} from './residents/components/resident/physician/list.component';
import {FormComponent as ResidentPhysicianFormComponent} from './residents/components/resident/physician/form/form.component';

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

import {ListComponent as ResidentEventListComponent} from './residents/components/resident/event/list.component';
import {FormComponent as ResidentEventFormComponent} from './residents/components/resident/event/form/form.component';

import {ListComponent as ResidentAdmissionListComponent} from './residents/components/resident/admission/list.component';
import {FormComponent as ResidentAdmissionFormComponent} from './residents/components/resident/admission/form/form.component';

import {ListComponent as ResidentRentListComponent} from './residents/components/resident/rent/list.component';
import {FormComponent as ResidentRentFormComponent} from './residents/components/resident/rent/form/form.component';

import {ListComponent as ResidentAssessmentListComponent} from './residents/components/resident/assessment/list.component';
import {FormComponent as ResidentAssessmentFormComponent} from './residents/components/resident/assessment/form/form.component';

import {ListComponent as ResidentReportListComponent} from './residents/components/resident/report/list.component';
import {FormComponent as ResidentReportFormComponent} from './residents/components/resident/report/form/form.component';

import {ListComponent as PaymentSourceListComponent} from './residents/components/payment-source/list.component';
import {FormComponent as PaymentSourceFormComponent} from './residents/components/payment-source/form/form.component';

import {ListComponent as EventDefinitionListComponent} from './residents/components/event-definition/list.component';
import {FormComponent as EventDefinitionFormComponent} from './residents/components/event-definition/form/form.component';

import {ListComponent as AssessmentFormListComponent} from './residents/components/assessment/form/list.component';
import {FormComponent as AssessmentFormFormComponent} from './residents/components/assessment/form/form/form.component';
import {ListComponent as AssessmentCategoryListComponent} from './residents/components/assessment/category/list.component';
import {FormComponent as AssessmentCategoryFormComponent} from './residents/components/assessment/category/form/form.component';
import {ListComponent as AssessmentCareLevelListComponent} from './residents/components/assessment/care-level/list.component';
import {FormComponent as AssessmentCareLevelFormComponent} from './residents/components/assessment/care-level/form/form.component';
import {ListComponent as AssessmentCareLevelGroupListComponent} from './residents/components/assessment/care-level-group/list.component';
import {FormComponent as AssessmentCareLevelGroupFormComponent} from './residents/components/assessment/care-level-group/form/form.component';

import {HomeComponent} from './residents/components/home/home.component';

import {CityStateZipPipe} from './residents/pipes/csz.pipe';
import {PhysicianPipe} from './residents/pipes/physician.pipe';
import {ResidentPipe} from './residents/pipes/resident.pipe';
import {ResponsiblePersonPipe} from './residents/pipes/responsible-person.pipe';
import {MomentModule} from 'ngx-moment';
import {GenderPipe} from './residents/pipes/gender.pipe';
import {PhoneTypePipe} from './residents/pipes/phone-type.pipe';
import {LyResizingCroppingImageModule} from '@alyle/ui/resizing-cropping-images';
import {LyButtonModule} from '@alyle/ui/button';
import {LyIconModule} from '@alyle/ui/icon';
import {LY_THEME, LyThemeModule} from '@alyle/ui';
import {MinimaLight} from '@alyle/ui/themes/minima';
import {NgHttpLoaderModule} from 'ng-http-loader';
import {ResidentSelectorPipe} from './residents/pipes/resident-selector.pipe';
import {NgxMaskModule} from 'ngx-mask';
import {FilterPipe} from '../shared/pipes/filter.pipe';
import {KeysPipe} from '../shared/pipes/keys.pipe';
import {IconPickerModule} from 'ngx-icon-picker';
import {AdmissionTypePipe} from './residents/pipes/admission-type.pipe';
import {InvitationComponent} from './components/account/invitation/invitation.component';

// import {ListComponent as ListComponent} from './residents/components//list.component';
// import {FormComponent as FormComponent} from './residents/components//form/form.component';

registerLocaleData(en);

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    GenderPipe,
    PhoneTypePipe,
    AdmissionTypePipe,
    CityStateZipPipe,
    PhysicianPipe,
    ResidentPipe,
    ResidentSelectorPipe,
    ResponsiblePersonPipe,
    FilterPipe,
    KeysPipe,

    CoreComponent,

    P404Component,
    P500Component,

    SignInComponent,
    SignOutComponent,

    // SignUpComponent,
    ActivateComponent,
    InvitationComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,

    DefaultLayoutComponent,

    ChangePasswordComponent,
    ProfileViewComponent,
    ProfileEditComponent,

    UserListComponent,
    UserFormComponent,

    UserInviteListComponent,
    UserInviteFormComponent,

    RoleListComponent,
    RoleFormComponent,

    SpaceListComponent,
    SpaceFormComponent,

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

    ResponsiblePersonRoleListComponent,
    ResponsiblePersonRoleFormComponent,

    PhysicianListComponent,
    PhysicianFormComponent,

    ResponsiblePersonListComponent,
    ResponsiblePersonFormComponent,

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

    ResidentListComponent,
    ResidentFormComponent,
    ImageEditorComponent,
    ResidentViewComponent,
    ResidentInfoComponent,
    ResidentImageEditorComponent,
    ResidentMoveComponent,

    ResidentDietListComponent,
    ResidentDietFormComponent,

    ResidentMedicationListComponent,
    ResidentMedicationFormComponent,

    ResidentResponsiblePersonListComponent,
    ResidentResponsiblePersonFormComponent,
    ResidentResponsiblePersonReorderFormComponent,

    ResidentAdmissionListComponent,
    ResidentAdmissionFormComponent,

    ResidentEventListComponent,
    ResidentEventFormComponent,

    ResidentRentListComponent,
    ResidentRentFormComponent,

    ResidentPhysicianListComponent,
    ResidentPhysicianFormComponent,

    ResidentHistoryComponent,

    ResidentDiagnoseListComponent,
    ResidentDiagnoseFormComponent,

    ResidentAllergyMedicationListComponent,
    ResidentAllergyMedicationFormComponent,

    ResidentAllergyOtherListComponent,
    ResidentAllergyOtherFormComponent,

    ResidentMedicalHistoryListComponent,
    ResidentMedicalHistoryFormComponent,

    ResidentAssessmentListComponent,
    ResidentAssessmentFormComponent,

    ResidentReportListComponent,
    ResidentReportFormComponent,

    PaymentSourceListComponent,
    PaymentSourceFormComponent,

    AssessmentCategoryListComponent,
    AssessmentCategoryFormComponent,

    AssessmentFormListComponent,
    AssessmentFormFormComponent,

    AssessmentCareLevelListComponent,
    AssessmentCareLevelFormComponent,

    AssessmentCareLevelGroupListComponent,
    AssessmentCareLevelGroupFormComponent,

    EventDefinitionListComponent,
    EventDefinitionFormComponent,

    HomeComponent
  ],
  entryComponents: [
    UserFormComponent,
    UserInviteFormComponent,
    RoleFormComponent,
    SpaceFormComponent,

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

    ResponsiblePersonRoleFormComponent,

    PhysicianFormComponent,

    ResponsiblePersonFormComponent,

    ApartmentFormComponent,

    ApartmentRoomFormComponent,

    FacilityFormComponent,

    FacilityRoomFormComponent,

    FacilityDiningRoomFormComponent,

    RegionFormComponent,

    ResidentFormComponent,
    ImageEditorComponent,

    ResidentDietFormComponent,

    ResidentMedicationFormComponent,

    ResidentResponsiblePersonFormComponent,
    ResidentResponsiblePersonReorderFormComponent,

    ResidentAdmissionFormComponent,

    ResidentEventFormComponent,

    ResidentRentFormComponent,

    ResidentPhysicianFormComponent,

    ResidentDiagnoseFormComponent,

    ResidentAllergyMedicationFormComponent,

    ResidentAllergyOtherFormComponent,

    ResidentMedicalHistoryFormComponent,

    ResidentAssessmentFormComponent,

    ResidentReportFormComponent,

    PaymentSourceFormComponent,

    AssessmentCategoryFormComponent,

    AssessmentFormFormComponent,

    AssessmentCareLevelFormComponent,

    AssessmentCareLevelGroupFormComponent,

    EventDefinitionFormComponent,

    ResidentMoveComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    NgHttpLoaderModule.forRoot(),
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
    MomentModule,
    DndModule,
    LyThemeModule.setTheme('minima-light'),
    LyResizingCroppingImageModule,
    LyButtonModule,
    LyIconModule,
    CoreRoutingModule,
    SharedModule,
    IconPickerModule,
    NgxMaskModule.forRoot()
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: BearerInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: NZ_I18N, useValue: en_US},
    {provide: NzFormItemComponent},
    {provide: NzFormExplainComponent},
    {provide: LY_THEME, useClass: MinimaLight, multi: true}, // name: `minima-light`
  ],
  exports: [
    CityStateZipPipe
  ]
})

export class CoreModule {
}
