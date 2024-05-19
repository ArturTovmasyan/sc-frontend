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
import { NgChartjsModule } from 'ng-chartjs';

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
import {LicenseComponent} from './components/license/license.component';
import {UserActivityComponent} from './components/user-activity/user-activity.component';
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

import {ListComponent as AllergenListComponent} from './residents/components/allergen/list.component';
import {FormComponent as AllergenFormComponent} from './residents/components/allergen/form/form.component';

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
import {ViewComponent as FacilityViewComponent} from './residents/components/facility/view/view.component';
import {ListComponent as FacilityViewRoomListComponent} from './residents/components/facility/view/room-list.component';
import {ListComponent as FacilityViewDiningRoomListComponent} from './residents/components/facility/view/dining-room-list.component';
import {ListComponent as FacilityViewDocumentListComponent} from './residents/components/facility/view/document-list.component';

import {ListComponent as FacilityRoomListComponent} from './residents/components/facility-room/list.component';
import {FormComponent as FacilityRoomFormComponent} from './residents/components/facility-room/form/form.component';

import {ListComponent as FacilityDiningRoomListComponent} from './residents/components/facility-dining-room/list.component';
import {FormComponent as FacilityDiningRoomFormComponent} from './residents/components/facility-dining-room/form/form.component';

import {ListComponent as FacilityDocumentListComponent} from './residents/components/facility-document/list.component';
import {FormComponent as FacilityDocumentFormComponent} from './residents/components/facility-document/form/form.component';

import {ListComponent as RegionListComponent} from './residents/components/region/list.component';
import {FormComponent as RegionFormComponent} from './residents/components/region/form/form.component';

import {ResidentSelectorComponent} from './residents/components/resident-selector/resident-selector.component';

import {IndexComponent as ResidentIndexComponent} from './residents/components/resident/index/index.component';
import {DashboardComponent as ResidentDashboardComponent} from './residents/components/dashboard/dashboard.component';
import {DashboardDetailComponent as ResidentDashboardDetailComponent} from './residents/components/dashboard/dashboard-detail.component';
import {ListComponent as ResidentListComponent} from './residents/components/resident/index/list.component';
import {ThumbComponent as ResidentThumbComponent} from './residents/components/resident/index/thumb.component';
import {FormComponent as ResidentFormComponent} from './residents/components/resident/resident/form/form.component';
import {ViewComponent as ResidentViewComponent} from './residents/components/resident/resident/view/view.component';
import {InfoComponent as ResidentInfoComponent} from './residents/components/resident/resident/info/info.component';
import {FormComponent as ResidentMoveComponent} from './residents/components/resident/resident/move/form.component';
import {FormComponent as ResidentSwapFormComponent} from './residents/components/resident/swap-form/form.component';
import {
  ImageEditorComponent,
  ImageEditorComponent as ResidentImageEditorComponent
} from './residents/components/resident/resident/info/img-editor/image-editor.component';

import {ListComponent as ResidentResponsiblePersonListComponent} from './residents/components/resident/responsible-person/list.component';
import {FormComponent as ResidentResponsiblePersonFormComponent} from './residents/components/resident/responsible-person/form/form.component';
import {FormComponent as ResidentResponsiblePersonReorderFormComponent} from './residents/components/resident/responsible-person/reorder/form.component';

import {ListComponent as ResidentPhysicianListComponent} from './residents/components/resident/physician/list.component';
import {FormComponent as ResidentPhysicianFormComponent} from './residents/components/resident/physician/form/form.component';
import {FormComponent as ResidentPhysicianReorderFormComponent} from './residents/components/resident/physician/reorder/form.component';

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

import {CalendarComponent as ResidentCalendarComponent} from './residents/components/resident/event/calendar.component';
import {CalendarComponent as FacilityCalendarComponent} from './residents/components/facility/calendar/calendar.component';
import {CalendarComponent as CorporateCalendarComponent} from './residents/components/calendar/calendar.component';

import {EventComponent as ResidentEventComponent} from './residents/components/resident/event/event.component';
import {ListComponent as ResidentEventListComponent} from './residents/components/resident/event/list.component';
import {ViewComponent as ResidentEventViewComponent} from './residents/components/resident/event/view/view.component';
import {FormComponent as ResidentEventFormComponent} from './residents/components/resident/event/form/form.component';

import {FormComponent as FacilityEventFormComponent} from './residents/components/facility/event-form/form.component';
import {ViewComponent as FacilityEventViewComponent} from './residents/components/facility/event-form/view.component';
import {FormComponent as CorporateEventFormComponent} from './residents/components/calendar/form/form.component';

import {ListComponent as ResidentAdmissionListComponent} from './residents/components/resident/admission/list.component';
import {FormComponent as ResidentAdmissionFormComponent} from './residents/components/resident/admission/form/form.component';

import {RentComponent as ResidentRentComponent} from './residents/components/resident/rent/rent.component';
import {ListComponent as ResidentRentRoomListComponent} from './residents/components/resident/rent/rent/list.component';
import {FormComponent as ResidentRentRoomFormComponent} from './residents/components/resident/rent/rent/form/form.component';
import {ListComponent as ResidentRentIncreaseListComponent} from './residents/components/resident/rent/rent-increase/list.component';
import {FormComponent as ResidentRentIncreaseFormComponent} from './residents/components/resident/rent/rent-increase/form/form.component';

import {ListComponent as ResidentAssessmentListComponent} from './residents/components/resident/assessment/list.component';
import {FormComponent as ResidentAssessmentFormComponent} from './residents/components/resident/assessment/form/form.component';

import {ListComponent as ReportListComponent} from './residents/components/report/list.component';
import {FormComponent as ReportFormComponent} from './residents/components/report/form/form.component';

import {ListComponent as PaymentSourceListComponent} from './residents/components/payment-source/list.component';
import {FormComponent as PaymentSourceFormComponent} from './residents/components/payment-source/form/form.component';

import {ListComponent as EventDefinitionListComponent} from './residents/components/event-definition/list.component';
import {FormComponent as EventDefinitionFormComponent} from './residents/components/event-definition/form/form.component';

import {ListComponent as AssessmentTypeListComponent} from './residents/components/assessment/type/list.component';
import {FormComponent as AssessmentTypeFormComponent} from './residents/components/assessment/type/form/form.component';
import {ListComponent as AssessmentFormListComponent} from './residents/components/assessment/form/list.component';
import {FormComponent as AssessmentFormFormComponent} from './residents/components/assessment/form/form/form.component';
import {ListComponent as AssessmentCategoryListComponent} from './residents/components/assessment/category/list.component';
import {FormComponent as AssessmentCategoryFormComponent} from './residents/components/assessment/category/form/form.component';
import {ListComponent as AssessmentCareLevelListComponent} from './residents/components/assessment/care-level/list.component';
import {FormComponent as AssessmentCareLevelFormComponent} from './residents/components/assessment/care-level/form/form.component';
import {ListComponent as AssessmentCareLevelGroupListComponent} from './residents/components/assessment/care-level-group/list.component';
import {FormComponent as AssessmentCareLevelGroupFormComponent} from './residents/components/assessment/care-level-group/form/form.component';

import {ListComponent as InsuranceCompanyListComponent} from './residents/components/insurance-company/list.component';
import {FormComponent as InsuranceCompanyFormComponent} from './residents/components/insurance-company/form/form.component';

import {ListComponent as ResidentHealthInsuranceListComponent} from './residents/components/resident/health-insurance/list.component';
import {FormComponent as ResidentHealthInsuranceFormComponent} from './residents/components/resident/health-insurance/form/form.component';

import {ListComponent as ResidentDocumentListComponent} from './residents/components/resident/document/list.component';
import {FormComponent as ResidentDocumentFormComponent} from './residents/components/resident/document/form/form.component';

import {ViewComponent as DocumentViewComponent} from './documents/components/document/view/view.component';
import {FormComponent as DocumentFormComponent} from './documents/components/document/form/form.component';
import {ListComponent as DocumentCategoryListComponent} from './documents/components/category/list.component';
import {FormComponent as DocumentCategoryFormComponent} from './documents/components/category/form/form.component';

import {HelpComponent} from './components/help/help.component';
import {FeedbackComponent} from './components/feedback/feedback.component';
import {FormComponent as FeedbackFormComponent} from './components/feedback/form/form.component';

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
import {IconPickerModule} from 'ngx-icon-picker';
import {AdmissionTypePipe} from './residents/pipes/admission-type.pipe';
import {LeadStatePipe} from './leads/pipes/lead-state.pipe';
import {InvitationComponent} from './components/account/invitation/invitation.component';
// import {LeadModule} from './leads/lead.module';
import {DashboardComponent as LeadDashboardComponent} from './leads/components/dashboard/dashboard.component';
import {ListComponent as DashboardActivityListComponent} from './leads/components/dashboard/activity-list.component';
import {ListComponent as DashboardLeadListComponent} from './leads/components/dashboard/lead-list.component';
import {ListComponent as DashboardContactListComponent} from './leads/components/dashboard/contact-list.component';
import {ListComponent as DashboardChangeLogListComponent} from './leads/components/dashboard/change-log-list.component';
import {ListComponent as LeadContactListComponent} from './leads/components/contact/list.component';
import {FormComponent as LeadContactFormComponent} from './leads/components/contact/form/form.component';
import {ViewComponent as LeadContactViewComponent} from './leads/components/contact/view/view.component';
import {ListComponent as LeadContactActivityComponent} from './leads/components/contact/view/activity-list.component';
import {FormComponent as ActivityStatusFormComponent} from './leads/components/activity-status/form/form.component';
import {FormComponent as ActivityTypeFormComponent} from './leads/components/activity-type/form/form.component';
import {FormComponent as ReferrerTypeFormComponent} from './leads/components/referrer-type/form/form.component';
import {FormComponent as CareTypeFormComponent} from './leads/components/care-type/form/form.component';
import {FormComponent as OrganizationFormComponent} from './leads/components/organization/form/form.component';
import {FormComponent as ReferralFormComponent} from './leads/components/referral/form/form.component';
import {FormComponent as LeadFormComponent} from './leads/components/lead/form/form.component';
import {FormComponent as ActivityFormComponent} from './leads/components/activity/form/form.component';
import {FormComponent as ReferralReportFormComponent} from './leads/components/referral/report-form/form.component';
import {FormComponent as LeadReportFormComponent} from './leads/components/lead/report-form/form.component';
import {FormComponent as ActivityReportFormComponent} from './leads/components/activity/report-form/form.component';
import {ListComponent as ActivityStatusListComponent} from './leads/components/activity-status/list.component';
import {ListComponent as ActivityTypeListComponent} from './leads/components/activity-type/list.component';
import {ListComponent as ReferrerTypeListComponent} from './leads/components/referrer-type/list.component';
import {ListComponent as CareTypeListComponent} from './leads/components/care-type/list.component';
import {ListComponent as OrganizationListComponent} from './leads/components/organization/list.component';
import {ListComponent as ReferralListComponent} from './leads/components/referral/list.component';
import {ListComponent as LeadListComponent} from './leads/components/lead/list.component';
import {ListComponent as ActivityListComponent} from './leads/components/activity/list.component';
import {ViewComponent as OrganizationViewComponent} from './leads/components/organization/view/view.component';
import {ViewComponent as ReferralViewComponent} from './leads/components/referral/view/view.component';
import {ViewComponent as LeadViewComponent} from './leads/components/lead/view/view.component';
import {ListComponent as LeadActivityListComponent} from './leads/components/lead/view/activity-list.component';
import {ListComponent as LeadAssessmentListComponent} from './leads/components/lead/assessment/list.component';
import {FormComponent as LeadAssessmentFormComponent} from './leads/components/lead/assessment/form/form.component';
import {ListComponent as ReferralActivityListComponent} from './leads/components/referral/view/activity-list.component';
import {ListComponent as OrganizationActivityListComponent} from './leads/components/organization/view/activity-list.component';
import {ListComponent as OrganizationReferralListComponent} from './leads/components/organization/view/referral-list.component';
import {ListComponent as NotificationListComponent} from './admin/components/notification/list.component';
import {FormComponent as NotificationFormComponent} from './admin/components/notification/form/form.component';
import {ListComponent as NotificationTypeListComponent} from './admin/components/notification-type/list.component';
import {FormComponent as NotificationTypeFormComponent} from './admin/components/notification-type/form/form.component';
import {FormComponent as TemperatureFormComponent} from './leads/components/temperature/form/form.component';
import {ListComponent as TemperatureListComponent} from './leads/components/temperature/list.component';
import {FormComponent as FunnelStageFormComponent} from './leads/components/funnel-stage/form/form.component';
import {ListComponent as FunnelStageListComponent} from './leads/components/funnel-stage/list.component';
import {FormComponent as LeadFunnelStageFormComponent} from './leads/components/lead/funnel-stage-form/form.component';
import {ListComponent as LeadFunnelStageListComponent} from './leads/components/lead/view/funnel-stage-list.component';
import {FormComponent as LeadTemperatureFormComponent} from './leads/components/lead/temperature-form/form.component';
import {ListComponent as LeadTemperatureListComponent} from './leads/components/lead/view/temperature-list.component';
import {FormComponent as StageChangeReasonFormComponent} from './leads/components/stage-change-reason/form/form.component';
import {ListComponent as StageChangeReasonListComponent} from './leads/components/stage-change-reason/list.component';
import {FormComponent as OutreachFormComponent} from './leads/components/outreach/form/form.component';
import {ListComponent as OutreachListComponent} from './leads/components/outreach/list.component';
import {ViewComponent as OutreachViewComponent} from './leads/components/outreach/view/view.component';
import {ListComponent as OutreachActivityComponent} from './leads/components/outreach/view/activity-list.component';
import {FormComponent as OutreachTypeFormComponent} from './leads/components/outreach-type/form/form.component';
import {ListComponent as OutreachTypeListComponent} from './leads/components/outreach-type/list.component';


import {CronJobsModule} from '../cron-jobs/cron-jobs.module';
import {ChangeLogPipe} from './pipes/change-log.pipe';
import {ActivityTypePipe} from './leads/pipes/activity-type.pipe';
import {VgBufferingModule} from 'videogular2/compiled/src/buffering/buffering';
import {VgOverlayPlayModule} from 'videogular2/compiled/src/overlay-play/overlay-play';
import {VgControlsModule} from 'videogular2/compiled/src/controls/controls';
import {VgCoreModule} from 'videogular2/compiled/src/core/core';
import {UserPipe} from './residents/pipes/user.pipe';
import {LeadContactPipe} from './residents/pipes/lead-contact.pipe';
import {LeadPipe} from './residents/pipes/lead.pipe';
import {EmbedVideo} from 'ngx-embed-video/dist';
import {FullCalendarModule} from '@fullcalendar/angular';
import {PaymentPeriodPipe} from './residents/pipes/payment-period.pipe';
import {RentIncreaseReasonPipe} from './residents/pipes/rent-increase-reason.pipe';
import {ViewComponent as ResidentRentViewComponent} from './residents/components/resident/rent/rent/view/view.component';
import {ViewComponent as ResidentRentIncreaseViewComponent} from './residents/components/resident/rent/rent-increase/view/view.component';
import {EventRepeatPipe} from './residents/pipes/event-repeat.pipe';
import {DateInterceptor} from './interceptors/date.interceptor';

registerLocaleData(en);

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    GenderPipe,
    PhoneTypePipe,
    EventRepeatPipe,
    AdmissionTypePipe,
    CityStateZipPipe,
    PhysicianPipe,
    ResidentPipe,
    LeadPipe,
    LeadContactPipe,
    UserPipe,
    ResidentSelectorPipe,
    ResponsiblePersonPipe,
    LeadStatePipe,
    ChangeLogPipe,
    ActivityTypePipe,
    PaymentPeriodPipe,
    RentIncreaseReasonPipe,

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
    LicenseComponent,
    UserActivityComponent,

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

    AllergenListComponent,
    AllergenFormComponent,

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
    FacilityViewComponent,
    FacilityViewRoomListComponent,
    FacilityViewDiningRoomListComponent,
    FacilityViewDocumentListComponent,

    FacilityRoomListComponent,
    FacilityRoomFormComponent,

    FacilityDiningRoomListComponent,
    FacilityDiningRoomFormComponent,

    FacilityDocumentListComponent,
    FacilityDocumentFormComponent,

    RegionListComponent,
    RegionFormComponent,

    ResidentSelectorComponent,

    ResidentDashboardComponent,
    ResidentDashboardDetailComponent,

    ResidentIndexComponent,
    ResidentListComponent,
    ResidentThumbComponent,

    ResidentFormComponent,
    ImageEditorComponent,
    ResidentViewComponent,
    ResidentInfoComponent,
    ResidentImageEditorComponent,
    ResidentMoveComponent,
    ResidentSwapFormComponent,

    ResidentDietListComponent,
    ResidentDietFormComponent,

    ResidentMedicationListComponent,
    ResidentMedicationFormComponent,

    ResidentResponsiblePersonListComponent,
    ResidentResponsiblePersonFormComponent,
    ResidentResponsiblePersonReorderFormComponent,

    ResidentAdmissionListComponent,
    ResidentAdmissionFormComponent,

    ResidentCalendarComponent,
    FacilityCalendarComponent,
    CorporateCalendarComponent,

    ResidentEventComponent,
    ResidentEventListComponent,
    ResidentEventViewComponent,
    ResidentEventFormComponent,
    FacilityEventFormComponent,
    FacilityEventViewComponent,
    CorporateEventFormComponent,

    ResidentRentViewComponent,
    ResidentRentIncreaseViewComponent,

    ResidentRentComponent,
    ResidentRentRoomListComponent,
    ResidentRentRoomFormComponent,
    ResidentRentIncreaseListComponent,
    ResidentRentIncreaseFormComponent,

    ResidentPhysicianListComponent,
    ResidentPhysicianFormComponent,
    ResidentPhysicianReorderFormComponent,

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

    ReportListComponent,
    ReportFormComponent,

    PaymentSourceListComponent,
    PaymentSourceFormComponent,

    AssessmentCategoryListComponent,
    AssessmentCategoryFormComponent,

    AssessmentTypeListComponent,
    AssessmentTypeFormComponent,

    AssessmentFormListComponent,
    AssessmentFormFormComponent,

    AssessmentCareLevelListComponent,
    AssessmentCareLevelFormComponent,

    AssessmentCareLevelGroupListComponent,
    AssessmentCareLevelGroupFormComponent,

    EventDefinitionListComponent,
    EventDefinitionFormComponent,

    HelpComponent,

    FeedbackComponent,
    FeedbackFormComponent,

    HomeComponent,

    LeadDashboardComponent,
    DashboardActivityListComponent,
    DashboardLeadListComponent,
    DashboardContactListComponent,
    DashboardChangeLogListComponent,
    ActivityStatusListComponent,
    ActivityStatusFormComponent,
    ActivityTypeListComponent,
    ActivityTypeFormComponent,
    ReferrerTypeListComponent,
    ReferrerTypeFormComponent,
    CareTypeListComponent,
    CareTypeFormComponent,
    TemperatureFormComponent,
    TemperatureListComponent,
    FunnelStageFormComponent,
    FunnelStageListComponent,
    LeadFunnelStageFormComponent,
    LeadFunnelStageListComponent,
    LeadTemperatureFormComponent,
    LeadTemperatureListComponent,
    StageChangeReasonListComponent,
    StageChangeReasonFormComponent,
    OutreachListComponent,
    OutreachFormComponent,
    OutreachActivityComponent,
    OutreachViewComponent,
    OutreachTypeListComponent,
    OutreachTypeFormComponent,

    LeadContactListComponent,
    LeadContactFormComponent,
    LeadContactViewComponent,
    LeadContactActivityComponent,

    OrganizationListComponent,
    OrganizationFormComponent,

    ReferralListComponent,
    ReferralFormComponent,

    LeadFormComponent,
    LeadListComponent,

    ActivityFormComponent,
    ActivityListComponent,

    OrganizationReferralListComponent,
    OrganizationActivityListComponent,
    LeadActivityListComponent,
    ReferralActivityListComponent,
    LeadAssessmentListComponent,
    LeadAssessmentFormComponent,

    ReferralReportFormComponent,
    LeadReportFormComponent,
    ActivityReportFormComponent,

    OrganizationViewComponent,
    ReferralViewComponent,
    LeadViewComponent,

    NotificationListComponent,
    NotificationFormComponent,
    NotificationTypeListComponent,
    NotificationTypeFormComponent,


    InsuranceCompanyListComponent,
    InsuranceCompanyFormComponent,
    ResidentHealthInsuranceListComponent,
    ResidentHealthInsuranceFormComponent,

    ResidentDocumentListComponent,
    ResidentDocumentFormComponent,

    DocumentViewComponent,
    DocumentFormComponent,
    DocumentCategoryListComponent,
    DocumentCategoryFormComponent
  ],
  entryComponents: [
    UserFormComponent,
    UserInviteFormComponent,
    RoleFormComponent,
    SpaceFormComponent,

    AllergenFormComponent,

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

    FacilityDocumentFormComponent,

    RegionFormComponent,

    ResidentFormComponent,
    ImageEditorComponent,

    ResidentDietFormComponent,

    ResidentMedicationFormComponent,

    ResidentResponsiblePersonFormComponent,
    ResidentResponsiblePersonReorderFormComponent,

    ResidentAdmissionFormComponent,

    ResidentEventViewComponent,
    ResidentEventFormComponent,
    FacilityEventFormComponent,
    FacilityEventViewComponent,
    CorporateEventFormComponent,

    ResidentRentViewComponent,
    ResidentRentIncreaseViewComponent,

    ResidentRentRoomFormComponent,
    ResidentRentIncreaseFormComponent,

    ResidentPhysicianFormComponent,

    ResidentPhysicianReorderFormComponent,

    ResidentDiagnoseFormComponent,

    ResidentAllergyMedicationFormComponent,

    ResidentAllergyOtherFormComponent,

    ResidentMedicalHistoryFormComponent,

    ResidentAssessmentFormComponent,

    ReportFormComponent,

    PaymentSourceFormComponent,

    AssessmentCategoryFormComponent,

    AssessmentTypeFormComponent,

    AssessmentFormFormComponent,

    AssessmentCareLevelFormComponent,

    AssessmentCareLevelGroupFormComponent,

    EventDefinitionFormComponent,

    ResidentMoveComponent,
    ResidentSwapFormComponent,

    ActivityStatusFormComponent,
    ActivityTypeFormComponent,
    ReferrerTypeFormComponent,
    CareTypeFormComponent,
    OrganizationFormComponent,
    ReferralFormComponent,
    LeadFormComponent,
    ActivityFormComponent,
    TemperatureFormComponent,
    FunnelStageFormComponent,
    LeadFunnelStageFormComponent,
    LeadTemperatureFormComponent,
    StageChangeReasonFormComponent,
    OutreachFormComponent,
    OutreachTypeFormComponent,

    LeadContactFormComponent,
    LeadAssessmentFormComponent,

    ReferralReportFormComponent,
    LeadReportFormComponent,
    ActivityReportFormComponent,

    NotificationFormComponent,
    NotificationTypeFormComponent,

    InsuranceCompanyFormComponent,
    ResidentHealthInsuranceFormComponent,
    ResidentDocumentFormComponent,

    DocumentFormComponent,
    DocumentCategoryFormComponent,

    FeedbackFormComponent
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
    NgxMaskModule.forRoot(),
    CronJobsModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    EmbedVideo.forRoot(),
    NgChartjsModule.registerPlugin([]),
    FullCalendarModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: BearerInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: DateInterceptor, multi: true},
    {provide: NZ_I18N, useValue: en_US},
    {provide: NzFormItemComponent},
    {provide: NzFormExplainComponent},
    {provide: LY_THEME, useClass: MinimaLight, multi: true}, // name: `minima-light`
  ],
  exports: [
    CityStateZipPipe
  ],
})

export class CoreModule {
}
