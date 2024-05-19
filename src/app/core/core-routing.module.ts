import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './guards/auth.guard';
import {DefaultLayoutComponent} from './components/default-layout/default-layout.component';
import {P404Component} from './components/error/404.component';
import {P500Component} from './components/error/500.component';
import {SignInComponent} from './components/security/sign-in/sign-in.component';
import {SignOutComponent} from './components/security/sign-out/sign-out.component';
// import {SignUpComponent} from './components/account/sign-up/sign-up.component';
import {ActivateComponent} from './components/account/activate/activate.component';
import {ForgotPasswordComponent} from './components/account/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './components/account/reset-password/reset-password.component';
import {ChangePasswordComponent} from './components/profile/change-password/change-password.component';
import {ProfileViewComponent} from './components/profile/view/profile-view.component';
import {ProfileEditComponent} from './components/profile/edit/profile-edit.component';


import {ListComponent as SpaceListComponent} from './admin/components/space/list.component';
import {ListComponent as RoleListComponent} from './admin/components/role/list.component';
import {ListComponent as UserListComponent} from './admin/components/user/list.component';
import {ListComponent as UserInviteListComponent} from './admin/components/user-invite/list.component';

import {ListComponent as AllergensListComponent} from './residents/components/allergen/list.component';
import {ListComponent as CareLevelListComponent} from './residents/components/care-level/list.component';
import {ListComponent as CityStateZipListComponent} from './residents/components/city-state-zip/list.component';
import {ListComponent as DiagnosisListComponent} from './residents/components/diagnosis/list.component';
import {ListComponent as DietListComponent} from './residents/components/diet/list.component';
import {ListComponent as EventDefinitionListComponent} from './residents/components/event-definition/list.component';
import {ListComponent as MedicalHistoryConditionListComponent} from './residents/components/medical-history-condition/list.component';
import {ListComponent as MedicationListComponent} from './residents/components/medication/list.component';
import {ListComponent as MedicationFormFactorListComponent} from './residents/components/medication-form-factor/list.component';
import {ListComponent as RelationshipListComponent} from './residents/components/relationship/list.component';
import {ListComponent as SalutationListComponent} from './residents/components/salutation/list.component';
import {ListComponent as PhysicianSpecialityListComponent} from './residents/components/physician-speciality/list.component';
import {ListComponent as RentReasonListComponent} from './residents/components/rent-reason/list.component';
import {ListComponent as ResponsiblePersonRoleListComponent} from './residents/components/responsible-person-role/list.component';

import {ListComponent as PhysicianListComponent} from './residents/components/physician/list.component';
import {ListComponent as ResponsiblePersonListComponent} from './residents/components/responsible-person/list.component';
import {ListComponent as ApartmentListComponent} from './residents/components/apartment/list.component';
import {ListComponent as ApartmentRoomListComponent} from './residents/components/apartment-room/list.component';
import {ListComponent as FacilityListComponent} from './residents/components/facility/list.component';
import {ViewComponent as FacilityViewComponent} from './residents/components/facility/view/view.component';
import {ListComponent as FacilityRoomListComponent} from './residents/components/facility-room/list.component';
import {ListComponent as FacilityRoomTypeListComponent} from './residents/components/facility-room-type/list.component';
import {ListComponent as FacilityDiningRoomListComponent} from './residents/components/facility-dining-room/list.component';
import {ListComponent as RegionListComponent} from './residents/components/region/list.component';

import {ListComponent as PaymentSourceListComponent} from './residents/components/payment-source/list.component';
import {ListComponent as AssessmentCategoryListComponent} from './residents/components/assessment/category/list.component';
import {ListComponent as AssessmentFormListComponent} from './residents/components/assessment/form/list.component';
import {ListComponent as AssessmentCareLevelListComponent} from './residents/components/assessment/care-level/list.component';
import {ListComponent as AssessmentCareLevelGroupListComponent} from './residents/components/assessment/care-level-group/list.component';

import {IndexComponent as ResidentIndexComponent} from './residents/components/resident/index/index.component';
import {ViewComponent as ResidentViewComponent} from './residents/components/resident/resident/view/view.component';
import {ListComponent as ResidentResponsiblePersonListComponent} from './residents/components/resident/responsible-person/list.component';
import {ListComponent as ResidentHealthInsuranceListComponent} from './residents/components/resident/health-insurance/list.component';
import {ListComponent as ResidentDocumentListComponent} from './residents/components/resident/document/list.component';
import {ListComponent as ResidentAdmissionListComponent} from './residents/components/resident/admission/list.component';
import {EventComponent as ResidentEventComponent} from './residents/components/resident/event/event.component';
import {RentComponent as ResidentRentComponent} from './residents/components/resident/rent/rent.component';
import {ListComponent as ResidentPhysicianListComponent} from './residents/components/resident/physician/list.component';
import {ListComponent as ResidentMedicationListComponent} from './residents/components/resident/medication/list.component';
import {ListComponent as ResidentDietListComponent} from './residents/components/resident/dietary-restriction/list.component';
import {ListComponent as ResidentAssessmentListComponent} from './residents/components/resident/assessment/list.component';
import {ListComponent as ReportListComponent} from './residents/components/report/list.component';
import {HistoryComponent as ResidentHistoryComponent} from './residents/components/resident/history/history.component';
import {HomeComponent} from './residents/components/home/home.component';
import {InvitationComponent} from './components/account/invitation/invitation.component';
import {LoggedActivate} from './guards/logged.guard';


import {ListComponent as ActivityStatusListComponent} from './leads/components/activity-status/list.component';
import {ListComponent as ActivityTypeListComponent} from './leads/components/activity-type/list.component';
import {ListComponent as CareTypeListComponent} from './leads/components/care-type/list.component';
import {ListComponent as ReferrerTypeListComponent} from './leads/components/referrer-type/list.component';
import {ListComponent as OrganizationListComponent} from './leads/components/organization/list.component';
import {ListComponent as ReferralListComponent} from './leads/components/referral/list.component';
import {ListComponent as ActivityListComponent} from './leads/components/activity/list.component';
import {ListComponent as LeadListComponent} from './leads/components/lead/list.component';
import {ViewComponent as OrganizationViewComponent} from './leads/components/organization/view/view.component';
import {ViewComponent as ReferralViewComponent} from './leads/components/referral/view/view.component';
import {ViewComponent as LeadViewComponent} from './leads/components/lead/view/view.component';
import {ListComponent as NotificationListComponent} from './admin/components/notification/list.component';
import {ListComponent as NotificationTypeListComponent} from './admin/components/notification-type/list.component';
import {ListComponent as InsuranceCompanyListComponent} from './residents/components/insurance-company/list.component';
import {ViewComponent as DocumentViewComponent} from './documents/components/document/view/view.component';
import {HelpComponent} from './components/help/help.component';
import {DashboardComponent as LeadDashboardComponent} from './leads/components/dashboard/dashboard.component';
import {ListComponent as LeadContactListComponent} from './leads/components/contact/list.component';
import {ListComponent as TemperatureListComponent} from './leads/components/temperature/list.component';
import {ListComponent as FunnelStageListComponent} from './leads/components/funnel-stage/list.component';
import {ListComponent as StageChangeReasonListComponent} from './leads/components/stage-change-reason/list.component';
import {ViewComponent as OutreachViewComponent} from './leads/components/outreach/view/view.component';
import {ListComponent as OutreachListComponent} from './leads/components/outreach/list.component';
import {ListComponent as OutreachTypeListComponent} from './leads/components/outreach-type/list.component';
import {ViewComponent as LeadContactViewComponent} from './leads/components/contact/view/view.component';
import {ListComponent as DocumentCategoryListComponent} from './documents/components/category/list.component';
import {DashboardComponent as ResidentDashboardComponent} from './residents/components/dashboard/dashboard.component';
import {DashboardDetailComponent as ResidentDashboardDetailComponent} from './residents/components/dashboard/dashboard-detail.component';
import {ViewComponent as FacilityDocumentViewComponent} from './residents/components/facility-document/view/view.component';
import {CalendarComponent as CorporateCalendarComponent} from './residents/components/calendar/calendar.component';
import {ListComponent as AssessmentTypeListComponent} from './residents/components/assessment/type/list.component';
import {ListComponent as FacilityBedListComponent} from './residents/components/facility-bed/list.component';
import {ListComponent as ApartmentBedListComponent} from './residents/components/apartment-bed/list.component';
import {ListComponent as FacilityRoomBaseRateListComponent} from './residents/components/facility-room-base-rate/list.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    data: {title: 'Home', permissions: []},
    children: [
      {
        path: 'help', component: HelpComponent,
        data: {
          title: 'Help',
          permissions: []
        },
        canActivate: [AuthGuard]
      },
      {
        path: '', component: HomeComponent,
        data: {
          title: 'Home',
          permissions: []
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'lead',
        children: [
          {
            path: 'lead/:id',
            component: LeadViewComponent,
            canActivate: [AuthGuard],
            data: {
              title: 'Lead',
              permissions: ['persistence-lead-lead']
            }
          },
          {
            path: 'contact/:id',
            component: LeadContactViewComponent,
            canActivate: [AuthGuard],
            data: {
              title: 'Contact',
              permissions: ['persistence-lead-contact']
            }
          },
          {
            path: 'outreach/:id',
            component: OutreachViewComponent,
            canActivate: [AuthGuard],
            data: {
              title: 'Outreach',
              permissions: ['persistence-lead-outreach']
            }
          },
          {
            path: 'dashboard',
            component: LeadDashboardComponent,
            canActivate: [AuthGuard],
            data: {
              nav: {show: true, group: 'Leads'},
              title: 'My Dashboard',
              permissions: ['persistence-lead-lead']
            }
          },
          {
            path: 'outreach', component: OutreachListComponent,
            data: {
              nav: {show: true, group: 'Leads'},
              title: 'Outreach',
              permissions: ['persistence-lead-outreach']
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'leads', component: LeadListComponent,
            data: {
              nav: {show: true, group: 'Leads'},
              title: 'Leads',
              permissions: ['persistence-lead-lead']
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'activities',
            data: {
              nav: {show: true, group: 'Leads'},
              title: 'Activity Logs',
              permissions: ['persistence-lead-activity']
            },
            children: [
              {
                path: 'all', component: ActivityListComponent,
                data: {
                  nav: {show: true, group: 'Leads'},
                  title: 'All Activity Logs',
                  permissions: ['persistence-lead-activity']
                },
                canActivate: [AuthGuard]
              },
              {
                path: 'my', component: ActivityListComponent,
                data: {
                  nav: {show: true, group: 'Leads'},
                  title: 'My Activity Logs',
                  permissions: ['persistence-lead-activity']
                },
                canActivate: [AuthGuard]
              },
            ]
          },
          {
            path: 'referral',
            data: {
              nav: {show: true, group: 'Leads'},
              title: 'Referral',
              permissions: []
            },
            canActivate: [AuthGuard],
            children: [
              {
                path: 'organization/:id',
                component: OrganizationViewComponent,
                canActivate: [AuthGuard],
                data: {
                  nav: {show: false, group: 'Leads'},
                  title: 'Organization',
                  permissions: ['persistence-lead-organization']
                }
              },
              {
                path: 'referrals', component: ReferralListComponent,
                data: {
                  nav: {show: true, group: 'Leads'},
                  title: 'Referrals',
                  permissions: ['persistence-lead-referral']
                },
                canActivate: [AuthGuard]
              },
              {
                path: 'organizations', component: OrganizationListComponent,
                data: {
                  nav: {show: true, group: 'Leads'},
                  title: 'Organizations',
                  permissions: ['persistence-lead-organization']
                },
                canActivate: [AuthGuard]
              },
              {
                path: 'contacts', component: LeadContactListComponent,
                data: {
                  nav: {show: true, group: 'Leads'},
                  title: 'Contacts',
                  permissions: ['persistence-lead-contact']
                },
                canActivate: [AuthGuard]
              },
              {
                path: 'referrer-type', component: ReferrerTypeListComponent,
                data: {
                  nav: {show: true, group: 'Leads'},
                  title: 'Referrer Types',
                  permissions: ['persistence-lead-referrer_type']
                },
                canActivate: [AuthGuard]
              },
              {
                path: ':id',
                component: ReferralViewComponent,
                canActivate: [AuthGuard],
                data: {
                  nav: {show: false, group: 'Leads'},
                  title: 'Referral',
                  permissions: ['persistence-lead-referral']
                }
              }
            ]
          },
          {
            path: 'admin',
            data: {
              nav: {show: true, group: 'Leads'},
              title: 'Admin Items',
              permissions: ['activity-lead_admin']
            },
            children: [
              {
                path: 'funnel-stage', component: FunnelStageListComponent,
                data: {
                  nav: {show: true, group: 'Leads'},
                  title: 'Funnel Stage',
                  permissions: ['activity-lead_admin', 'persistence-lead-funnel_stage']
                },
                canActivate: [AuthGuard]
              },
              {
                path: 'temperature', component: TemperatureListComponent,
                data: {
                  nav: {show: true, group: 'Leads'},
                  title: 'Temperature',
                  permissions: ['activity-lead_admin', 'persistence-lead-temperature']
                },
                canActivate: [AuthGuard]
              },
              {
                path: 'stage-change-reason', component: StageChangeReasonListComponent,
                data: {
                  nav: {show: true, group: 'Leads'},
                  title: 'Stage Change Reasons',
                  permissions: ['activity-lead_admin', 'persistence-lead-stage_change_reason']
                },
                canActivate: [AuthGuard]
              },
              {
                path: 'activity-status', component: ActivityStatusListComponent,
                data: {
                  nav: {show: true, group: 'Leads'},
                  title: 'Activity Statuses',
                  permissions: ['activity-lead_admin', 'persistence-lead-activity_status']
                },
                canActivate: [AuthGuard]
              },
              {
                path: 'outreach-type', component: OutreachTypeListComponent,
                data: {
                  nav: {show: true, group: 'Leads'},
                  title: 'Outreach Types',
                  permissions: ['activity-lead_admin', 'persistence-lead-outreach_type']
                },
                canActivate: [AuthGuard]
              },
              {
                path: 'activity-type', component: ActivityTypeListComponent,
                data: {
                  nav: {show: true, group: 'Leads'},
                  title: 'Activity Types',
                  permissions: ['activity-lead_admin', 'persistence-lead-activity_type']
                },
                canActivate: [AuthGuard]
              },
              {
                path: 'care-type', component: CareTypeListComponent,
                data: {
                  nav: {show: true, group: 'Leads'},
                  title: 'Care Types',
                  permissions: ['activity-lead_admin', 'persistence-lead-care_type']
                },
                canActivate: [AuthGuard]
              }
            ]
          }
        ]
      },
      {
        path: 'dashboard',
        children: [
          {
            path: '',
            component: ResidentDashboardComponent,
            data: {
              nav: {show: true, group: 'Corporate'},
              title: 'Dashboard',
              permissions: ['activity-corporate-dashboard']
            }
          },
          {
            path: ':id',
            component: ResidentDashboardDetailComponent,
            data: {
              nav: {show: false, group: 'Corporate'},
              title: 'Dashboard',
              permissions: ['activity-corporate-dashboard']
            }
          }
        ]
      },
      {
        path: 'calendar',
        component: CorporateCalendarComponent,
        data: {
          nav: {show: true, group: 'Corporate'},
          title: 'Calendar',
          permissions: ['activity-corporate-calendar']
        }
      },
      {
        path: 'documents', component: DocumentViewComponent,
        data: {
          nav: {show: true, group: 'Corporate'},
          title: 'Documents',
          permissions: ['persistence-common-document']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'facility/list', component: FacilityListComponent,
        data: {
          nav: {show: true, group: 'Facility', title: 'List'},
          title: 'Facilities',
          permissions: ['persistence-facility']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'facility/rooms', component: FacilityRoomListComponent,
        data: {
          nav: {show: true, group: 'Facility', title: 'Rooms'},
          title: 'Facility Rooms',
          permissions: ['persistence-facility', 'persistence-facility_room']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'facility/beds', component: FacilityBedListComponent,
        data: {
          nav: {show: true, group: 'Facility', title: 'Beds'},
          title: 'Facility Beds',
          permissions: ['persistence-facility', 'persistence-facility_room', 'persistence-facility_bed']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'facility/dining-rooms', component: FacilityDiningRoomListComponent,
        data: {
          nav: {show: true, group: 'Facility', title: 'Dining Rooms'},
          title: 'Facility Dining Rooms',
          permissions: ['persistence-facility', 'persistence-dining_room']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'facility/room-types', component: FacilityRoomTypeListComponent,
        data: {
          nav: {show: true, group: 'Facility', title: 'Room Types'},
          title: 'Facility Room Types',
          permissions: ['persistence-facility', 'persistence-facility_room_type']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'facility/room-base-rates', component: FacilityRoomBaseRateListComponent,
        data: {
          nav: {show: true, group: 'Facility', title: 'Room Base Rates'},
          title: 'Facility Room Base Rates',
          permissions: ['persistence-facility', 'persistence-facility_room_base_rate']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'rent-reasons', component: RentReasonListComponent,
        data: {
          nav: {show: true, group: 'Facility'},
          title: 'Rent Reasons',
          permissions: ['activity-reference', 'persistence-common-rent_reason']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'facility/documents', component: FacilityDocumentViewComponent,
        data: {
          nav: {show: true, group: 'Facility', title: 'Documents'},
          title: 'Facility Documents',
          permissions: ['persistence-facility', 'persistence-facility_document']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'facility/:id',
        component: FacilityViewComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Facility',
          permissions: ['persistence-facility']
        }
      },
      {
        path: 'apartment/list', component: ApartmentListComponent,
        data: {
          nav: {show: true, group: 'Apartment', title: 'List'},
          title: 'Apartments',
          permissions: ['persistence-apartment']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'apartment/rooms', component: ApartmentRoomListComponent,
        data: {
          nav: {show: true, group: 'Apartment', title: 'Rooms'},
          title: 'Apartment Rooms',
          permissions: ['persistence-apartment', 'persistence-apartment_room']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'apartment/beds', component: ApartmentBedListComponent,
        data: {
          nav: {show: true, group: 'Apartment', title: 'Beds'},
          title: 'Apartment Beds',
          permissions: ['persistence-apartment', 'persistence-apartment_room', 'persistence-apartment_bed']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'regions', component: RegionListComponent,
        data: {
          nav: {show: true, group: 'Region', title: 'List'},
          title: 'Regions',
          permissions: ['persistence-region']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'residents',
        data: {
          nav: {show: true, group: 'Residents'},
          title: 'Residents',
          permissions: ['persistence-resident-resident']
        },
        canActivate: [AuthGuard],
        children: [
          {
            path: ':type/:group', component: ResidentIndexComponent,
            data: {
              title: 'Residents',
              permissions: ['persistence-resident-resident']
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'active', component: ResidentIndexComponent,
            data: {
              nav: {show: true, group: 'Active'},
              title: 'Active',
              permissions: ['persistence-resident-resident']
            }
          },
          {
            path: 'inactive', component: ResidentIndexComponent,
            data: {
              nav: {show: true, group: 'Inactive'},
              title: 'Inactive',
              permissions: ['persistence-resident-resident']
            }
          },
          {
            path: 'no-admission', component: ResidentIndexComponent,
            data: {
              nav: {show: true, group: 'Pre-Admit'},
              title: 'Pre-Admit',
              permissions: ['persistence-resident-resident']
            }
          }
        ]
      },
      {
        path: 'responsible-persons', component: ResponsiblePersonListComponent,
        data: {
          nav: {show: true, group: 'Residents'},
          title: 'Responsible Persons',
          permissions: ['persistence-common-responsible_person']
        },
        canActivate: [AuthGuard]
      },

      {
        path: 'physicians', component: PhysicianListComponent,
        data: {
          nav: {show: true, group: 'Residents'},
          title: 'Physicians',
          permissions: ['persistence-common-physician']
        },
        canActivate: [AuthGuard]
      },

      {
        path: 'assessment',
        data: {
          nav: {show: true, group: 'Residents'},
          title: 'Assessments'
        },
        children: [
          {
            path: 'types', component: AssessmentTypeListComponent,
            data: {
              nav: {show: true, group: 'Residents'},
              title: 'Types',
              permissions: ['persistence-assessment-assessment_type']
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'categories', component: AssessmentCategoryListComponent,
            data: {
              nav: {show: true, group: 'Residents'},
              title: 'Categories',
              permissions: ['persistence-assessment-category']
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'forms', component: AssessmentFormListComponent,
            data: {
              nav: {show: true, group: 'Residents'},
              title: 'Forms',
              permissions: ['persistence-assessment-form']
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'care-levels', component: AssessmentCareLevelListComponent,
            data: {
              nav: {show: true, group: 'Residents'},
              title: 'Care Levels',
              permissions: ['persistence-assessment-care_level']
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'care-level-groups', component: AssessmentCareLevelGroupListComponent,
            data: {
              nav: {show: true, group: 'Residents'},
              title: 'Care Level Groups',
              permissions: ['persistence-assessment-care_level_group']
            },
            canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: 'reports', component: ReportListComponent,
        data: {
          nav: {show: true, group: 'Residents'},
          title: 'Reports',
          permissions: ['report-group']
        }
      },
      {
        path: 'document-categories', component: DocumentCategoryListComponent,
        data: {
          nav: {show: true, group: 'Reference'},
          title: 'Document Categories',
          permissions: ['persistence-common-document_category']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'relationships', component: RelationshipListComponent,
        data: {
          nav: {show: true, group: 'Reference'},
          title: 'Relationships',
          permissions: ['activity-reference', 'persistence-common-relationship']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'care-levels', component: CareLevelListComponent,
        data: {
          nav: {show: true, group: 'Reference'},
          title: 'Care Levels',
          permissions: ['activity-reference', 'persistence-common-care_level']
        },
        canActivate: [AuthGuard]
      },

      {
        path: 'event-types', component: EventDefinitionListComponent,
        data: {
          nav: {show: true, group: 'Reference'},
          title: 'Event Types',
          permissions: ['activity-reference', 'activity-event_definition', 'persistence-common-event_definition']
        },
        canActivate: [AuthGuard]
      },

      {
        path: 'payment-sources', component: PaymentSourceListComponent,
        data: {
          nav: {show: true, group: 'Reference'},
          title: 'Payment Sources',
          permissions: ['activity-reference', 'persistence-common-payment_source']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'city-state-zips', component: CityStateZipListComponent,
        data: {
          nav: {show: true, group: 'Reference'},
          title: 'City, State, Zip Code',
          permissions: ['activity-reference', 'persistence-common-city_state_zip']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'salutations', component: SalutationListComponent,
        data: {
          nav: {show: true, group: 'Reference'},
          title: 'Salutations',
          permissions: ['activity-reference', 'persistence-common-category']
        },
        canActivate: [AuthGuard]
      },


      {
        path: 'insurance-companies', component: InsuranceCompanyListComponent,
        data: {
          nav: {show: true, group: 'Reference'},
          title: 'Insurance Companies',
          permissions: ['activity-reference', 'persistence-common-insurance_company']
        },
        canActivate: [AuthGuard]
      },

      {
        path: 'medications', component: MedicationListComponent,
        data: {
          nav: {show: true, group: 'Reference'},
          title: 'Medications',
          permissions: ['activity-reference', 'persistence-common-medication']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'medication-form-factors', component: MedicationFormFactorListComponent,
        data: {
          nav: {show: true, group: 'Reference'},
          title: 'Medication Form Factors',
          permissions: ['activity-reference', 'persistence-common-medication_form_factor']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'medical-history-conditions', component: MedicalHistoryConditionListComponent,
        data: {
          nav: {show: true, group: 'Reference'},
          title: 'Medical History Conditions',
          permissions: ['activity-reference', 'persistence-common-medical_history_condition']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'diets', component: DietListComponent,
        data: {
          nav: {show: true, group: 'Reference'},
          title: 'Dietary Restriction Categories',
          permissions: ['activity-reference', 'persistence-common-diet']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'diagnoses', component: DiagnosisListComponent,
        data: {
          nav: {show: true, group: 'Reference'},
          title: 'Diagnoses',
          permissions: ['activity-reference', 'persistence-common-diagnosis']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'allergens', component: AllergensListComponent,
        data: {
          nav: {show: true, group: 'Reference'},
          title: 'Allergens',
          permissions: ['activity-reference', 'persistence-common-allergen']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'physician-specialities', component: PhysicianSpecialityListComponent,
        data: {
          nav: {show: true, group: 'Reference'},
          title: 'Physician Specialities',
          permissions: ['activity-reference', 'persistence-common-speciality']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'responsible-person-roles', component: ResponsiblePersonRoleListComponent,
        data: {
          nav: {show: true, group: 'Reference'},
          title: 'Responsible Person Roles',
          permissions: ['activity-reference', 'persistence-common-responsible-person-role']
        },
        canActivate: [AuthGuard]
      },

      {
        path: 'resident/:id',
        component: ResidentViewComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Resident',
          permissions: ['persistence-resident-resident']
        },
        children: [
          {
            path: 'responsible-persons',
            component: ResidentResponsiblePersonListComponent,
            outlet: 'resident-details',
            pathMatch: 'full',
            data: {
              title: 'Responsible Persons',
              permissions: ['persistence-resident-resident_responsible_person']
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'health-insurance',
            component: ResidentHealthInsuranceListComponent,
            outlet: 'resident-details',
            pathMatch: 'full',
            data: {
              title: 'Health Insurance',
              permissions: ['persistence-resident-resident_health_insurance']
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'documents',
            component: ResidentDocumentListComponent,
            outlet: 'resident-details',
            pathMatch: 'full',
            data: {
              title: 'Documents',
              permissions: ['persistence-resident-resident_document']
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'admissions',
            component: ResidentAdmissionListComponent,
            outlet: 'resident-details',
            pathMatch: 'full',
            data: {
              title: 'Admission and Room Assignments',
              permissions: ['persistence-resident-admission']
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'events',
            component: ResidentEventComponent,
            outlet: 'resident-details',
            pathMatch: 'full',
            data: {
              title: 'Events',
              permissions: ['persistence-resident-resident_event']
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'rents',
            component: ResidentRentComponent,
            outlet: 'resident-details',
            pathMatch: 'full',
            data: {
              title: 'Rents',
              permissions: ['persistence-resident-resident_rent']
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'physicians',
            component: ResidentPhysicianListComponent,
            outlet: 'resident-details',
            pathMatch: 'full',
            data: {
              title: 'Physicians',
              permissions: ['persistence-resident-resident_physician']
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'medications',
            component: ResidentMedicationListComponent,
            outlet: 'resident-details',
            pathMatch: 'full',
            data: {
              title: 'Medications',
              permissions: ['persistence-resident-resident_medication']
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'history',
            component: ResidentHistoryComponent,
            outlet: 'resident-details',
            pathMatch: 'full',
            data: {
              title: 'History',
              permissions: ['persistence-resident-resident_medical_history_condition']
            },
            canActivate: [AuthGuard],
            children: []
          },
          {
            path: 'diets',
            component: ResidentDietListComponent,
            outlet: 'resident-details',
            pathMatch: 'full',
            data: {
              title: 'Dietary Restrictions',
              permissions: ['persistence-resident-resident_diet']
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'assessments',
            component: ResidentAssessmentListComponent,
            outlet: 'resident-details',
            pathMatch: 'full',
            data: {
              title: 'Assessments',
              permissions: ['persistence-resident-assessment-assessment']
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'reports',
            component: ReportListComponent,
            outlet: 'resident-details',
            pathMatch: 'full',
            data: {
              title: 'Reports',
              permissions: []
            },
            canActivate: [AuthGuard]
          },

        ]
      },

      {
        path: 'notifications', component: NotificationListComponent,
        data: {
          nav: {show: true, group: 'Administration'},
          title: 'Notifications',
          permissions: ['persistence-common-notification']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'notification-types', component: NotificationTypeListComponent,
        data: {
          nav: {show: true, group: 'Administration'},
          title: 'Notification Types',
          permissions: ['persistence-common-notification_type']
        },
        canActivate: [AuthGuard]
      },

      {
        path: 'users', component: UserListComponent,
        data: {
          nav: {show: true, group: 'Administration'},
          title: 'Users',
          permissions: ['persistence-security-user']
        },
        canActivate: [AuthGuard]
      },

      {
        path: 'user-invites', component: UserInviteListComponent,
        data: {
          nav: {show: true, group: 'Administration'},
          title: 'Invitation',
          permissions: ['persistence-security-user_invite']
        },
        canActivate: [AuthGuard]
      },

      {
        path: 'spaces', component: SpaceListComponent,
        data: {
          nav: {show: true, group: 'Administration'},
          title: 'Spaces',
          permissions: ['activity-security-space', 'persistence-security-space']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'roles', component: RoleListComponent,
        data: {
          nav: {show: true, group: 'Administration'},
          title: 'Roles',
          permissions: ['activity-security-space', 'persistence-security-role']
        },
        canActivate: [AuthGuard]
      },

      {
        path: 'profile',
        data: {title: 'Profile'},
        children: [
          {
            path: 'edit', component: ProfileEditComponent,
            data: {
              title: 'Edit Profile',
              permissions: []
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'me', component: ProfileViewComponent,
            data: {
              title: 'My Profile',
              permissions: []
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'change-password', component: ChangePasswordComponent,
            data: {
              title: 'Change Password',
              permissions: []
            },
            canActivate: [AuthGuard]
          }
        ]
      }
    ]
  },

  // {path: 'sign-up', component: SignUpComponent, data: {title: 'Sign Up'}, canActivate: [LoggedActivate]},
  {path: 'activate', component: ActivateComponent, data: {title: 'Account Activation'}, canActivate: [LoggedActivate]},
  {path: 'accept', component: InvitationComponent, data: {title: 'Accept Invitation'}, canActivate: [LoggedActivate]},
  {path: 'forgot-password', component: ForgotPasswordComponent, data: {title: 'Forgot password'}, canActivate: [LoggedActivate]},
  {path: 'reset-password', component: ResetPasswordComponent, data: {title: 'Reset password'}, canActivate: [LoggedActivate]},
  {path: 'sign-in', component: SignInComponent, data: {title: 'Sign In'}, canActivate: [LoggedActivate]},
  {path: 'sign-out', component: SignOutComponent, data: {title: 'Sign Out'}},

  {path: '404', component: P404Component, data: {title: 'Page 404'}},
  {path: '500', component: P500Component, data: {title: 'Page 500'}},

  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {
}
