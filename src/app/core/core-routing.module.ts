import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './guards/auth.guard';
import {DefaultLayoutComponent} from './components/default-layout/default-layout.component';
import {P404Component} from './components/error/404.component';
import {P500Component} from './components/error/500.component';
import {SignInComponent} from './components/security/sign-in/sign-in.component';
import {SignOutComponent} from './components/security/sign-out/sign-out.component';
import {SignUpComponent} from './components/account/sign-up/sign-up.component';
import {ActivateComponent} from './components/account/activate/activate.component';
import {ForgotPasswordComponent} from './components/account/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './components/account/reset-password/reset-password.component';
import {ChangePasswordComponent} from './components/profile/change-password/change-password.component';
import {ProfileViewComponent} from './components/profile/view/profile-view.component';
import {ProfileEditComponent} from './components/profile/edit/profile-edit.component';


import {ListComponent as UserListComponent} from './admin/components/user/list.component';
import {ListComponent as UserInviteListComponent} from './admin/components/user-invite/list.component';
import {ListComponent as RoleListComponent} from './admin/components/role/list.component';
import {ListComponent as SpaceListComponent} from './admin/components/space/list.component';

import {ListComponent as AllergensListComponent} from './residents/components/allergen/list.component';
import {ListComponent as CareLevelListComponent} from './residents/components/care-level/list.component';
import {ListComponent as CityStateZipListComponent} from './residents/components/city-state-zip/list.component';
import {ListComponent as DiagnosisListComponent} from './residents/components/diagnosis/list.component';
import {ListComponent as DietListComponent} from './residents/components/diet/list.component';
import {ListComponent as MedicalHistoryConditionListComponent} from './residents/components/medical-history-condition/list.component';
import {ListComponent as MedicationListComponent} from './residents/components/medication/list.component';
import {ListComponent as MedicationFormFactorListComponent} from './residents/components/medication-form-factor/list.component';
import {ListComponent as RelationshipListComponent} from './residents/components/relationship/list.component';
import {ListComponent as SalutationListComponent} from './residents/components/salutation/list.component';
import {ListComponent as PhysicianSpecialityListComponent} from './residents/components/physician-speciality/list.component';
import {ListComponent as ResponsiblePersonRoleListComponent} from './residents/components/responsible-person-role/list.component';

import {ListComponent as PhysicianListComponent} from './residents/components/physician/list.component';
import {ListComponent as ResponsiblePersonListComponent} from './residents/components/responsible-person/list.component';
import {ListComponent as ApartmentListComponent} from './residents/components/apartment/list.component';
import {ListComponent as ApartmentRoomListComponent} from './residents/components/apartment-room/list.component';
import {ListComponent as FacilityListComponent} from './residents/components/facility/list.component';
import {ListComponent as FacilityRoomListComponent} from './residents/components/facility-room/list.component';
import {ListComponent as FacilityDiningRoomListComponent} from './residents/components/facility-dining-room/list.component';
import {ListComponent as RegionListComponent} from './residents/components/region/list.component';

import {ListComponent as PaymentSourceListComponent} from './residents/components/payment-source/list.component';
import {ListComponent as EventDefinitionListComponent} from './residents/components/event-definition/list.component';
import {ListComponent as AssessmentCategoryListComponent} from './residents/components/assessment/category/list.component';
import {ListComponent as AssessmentFormListComponent} from './residents/components/assessment/form/list.component';
import {ListComponent as AssessmentCareLevelListComponent} from './residents/components/assessment/care-level/list.component';
import {ListComponent as AssessmentCareLevelGroupListComponent} from './residents/components/assessment/care-level-group/list.component';

import {ListComponent as ResidentListComponent} from './residents/components/resident/list.component';
import {ViewComponent as ResidentViewComponent} from './residents/components/resident/resident/view/view.component';
import {ListComponent as ResidentResponsiblePersonListComponent} from './residents/components/resident/responsible-person/list.component';
import {ListComponent as ResidentAdmissionListComponent} from './residents/components/resident/admission/list.component';
import {ListComponent as ResidentEventListComponent} from './residents/components/resident/event/list.component';
import {ListComponent as ResidentRentListComponent} from './residents/components/resident/rent/list.component';
import {ListComponent as ResidentPhysicianListComponent} from './residents/components/resident/physician/list.component';
import {ListComponent as ResidentMedicationListComponent} from './residents/components/resident/medication/list.component';
import {ListComponent as ResidentDietListComponent} from './residents/components/resident/dietary-restriction/list.component';
import {ListComponent as ResidentAssessmentListComponent} from './residents/components/resident/assessment/list.component';
import {ListComponent as ResidentReportListComponent} from './residents/components/resident/report/list.component';
import {HistoryComponent as ResidentHistoryComponent} from './residents/components/resident/history/history.component';
import {HomeComponent} from './residents/components/home/home.component';
import {InvitationComponent} from './components/account/invitation/invitation.component';


const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    data: {title: 'Home', permissions: []},
    children: [
      {
        path: '', component: HomeComponent,
        data: {
          title: 'Home',
          permissions: []
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'residents', component: ResidentListComponent,
        data: {
          nav: {show: true, group: 'Residents'},
          title: 'Residents',
          permissions: ['persistence-resident-resident']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'residents/:type/:group', component: ResidentListComponent,
        data: {
          title: 'Residents',
          permissions: ['persistence-resident-resident']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'facility',
        data: {
          nav: {show: true, group: 'Residents'},
          title: 'Facilities',
          permissions: ['persistence-facility']
        },
        children: [
          {
            path: 'list', component: FacilityListComponent,
            data: {
              nav: {show: true, group: 'Residents', title: 'List'},
              title: 'Facilities',
              permissions: ['persistence-facility']
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'rooms', component: FacilityRoomListComponent,
            data: {
              nav: {show: true, group: 'Residents'},
              title: 'Facility Rooms',
              permissions: ['persistence-facility_room']
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'dining-rooms', component: FacilityDiningRoomListComponent,
            data: {
              nav: {show: true, group: 'Residents'},
              title: 'Facility Dining Rooms',
              permissions: ['persistence-dining_room']
            },
            canActivate: [AuthGuard]
          },
        ],
        canActivate: [AuthGuard]
      },

      {
        path: 'apartment',
        data: {
          nav: {show: true, group: 'Residents'},
          title: 'Apartments',
          permissions: ['persistence-apartment']
        },
        children: [
          {
            path: 'list', component: ApartmentListComponent,
            data: {
              nav: {show: true, group: 'Residents', title: 'List'},
              title: 'Apartments',
              permissions: ['persistence-facility']
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'rooms', component: ApartmentRoomListComponent,
            data: {
              nav: {show: true, group: 'Residents'},
              title: 'Apartment Rooms',
              permissions: ['persistence-apartment_room']
            },
            canActivate: [AuthGuard]
          },
        ],
        canActivate: [AuthGuard]
      },
      {
        path: 'regions', component: RegionListComponent,
        data: {
          nav: {show: true, group: 'Residents'},
          title: 'Regions',
          permissions: ['persistence-region']
        },
        canActivate: [AuthGuard]
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
        path: 'responsible-person-roles', component: ResponsiblePersonRoleListComponent,
        data: {
          nav: {show: true, group: 'Residents'},
          title: 'Responsible Person Roles',
          permissions: ['persistence-common-responsible-person-role']
        },
        canActivate: [AuthGuard]
      },

      {
        path: 'physician-specialities', component: PhysicianSpecialityListComponent,
        data: {
          nav: {show: true, group: 'Residents'},
          title: 'Physician Specialities',
          permissions: ['persistence-common-speciality']
        },
        canActivate: [AuthGuard]
      },

      {
        path: 'assessment',
        data: {
          nav: {show: true, group: 'Residents'},
          title: 'Assessment'
        },
        children: [
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
        path: 'allergens', component: AllergensListComponent,
        data: {
          nav: {show: true, group: 'Residents'},
          title: 'Allergens',
          permissions: ['persistence-common-allergen']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'diagnoses', component: DiagnosisListComponent,
        data: {
          nav: {show: true, group: 'Residents'},
          title: 'Diagnoses',
          permissions: ['persistence-common-diagnosis']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'diets', component: DietListComponent,
        data: {
          nav: {show: true, group: 'Residents'},
          title: 'Dietary Restriction Category',
          permissions: ['persistence-common-diet']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'medical-history-conditions', component: MedicalHistoryConditionListComponent,
        data: {
          nav: {show: true, group: 'Residents'},
          title: 'Medical History Condition',
          permissions: ['persistence-common-medical_history_condition']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'medications', component: MedicationListComponent,
        data: {
          nav: {show: true, group: 'Residents'},
          title: 'Medications',
          permissions: ['persistence-common-medication']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'medication-form-factors', component: MedicationFormFactorListComponent,
        data: {
          nav: {show: true, group: 'Residents'},
          title: 'Medication Form Factors',
          permissions: ['persistence-common-medication_form_factor']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'relationships', component: RelationshipListComponent,
        data: {
          nav: {show: true, group: 'Residents'},
          title: 'Relationships',
          permissions: ['persistence-common-relationship']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'salutations', component: SalutationListComponent,
        data: {
          nav: {show: true, group: 'Residents'},
          title: 'Salutations',
          permissions: ['persistence-common-salutation']
        },
        canActivate: [AuthGuard]
      },

      {
        path: 'care-levels', component: CareLevelListComponent,
        data: {
          nav: {show: true, group: 'Residents'},
          title: 'Care Levels',
          permissions: ['persistence-common-care_level']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'city-state-zips', component: CityStateZipListComponent,
        data: {
          nav: {show: true, group: 'Residents'},
          title: 'City/State/Zip',
          permissions: ['persistence-common-city_state_zip']
        },
        canActivate: [AuthGuard]
      },

      {
        path: 'payment-sources', component: PaymentSourceListComponent,
        data: {
          nav: {show: true, group: 'Residents'},
          title: 'Payment Sources',
          permissions: ['persistence-common-payment_source']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'event-types', component: EventDefinitionListComponent,
        data: {
          nav: {show: true, group: 'Residents'},
          title: 'Event Types',
          permissions: ['persistence-common-event_definition']
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
            path: 'admissions',
            component: ResidentAdmissionListComponent,
            outlet: 'resident-details',
            pathMatch: 'full',
            data: {
              title: 'Admissions',
              permissions: ['persistence-resident-admission']
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'events',
            component: ResidentEventListComponent,
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
            component: ResidentRentListComponent,
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
            component: ResidentReportListComponent,
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
        path: 'spaces', component: SpaceListComponent,
        data: {
          nav: {show: true, group: 'Administration'},
          title: 'Spaces',
          permissions: ['persistence-security-space']
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
        path: 'roles', component: RoleListComponent,
        data: {
          nav: {show: true, group: 'Administration'},
          title: 'Roles',
          permissions: ['persistence-security-role']
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

  {path: 'sign-up', component: SignUpComponent, data: {title: 'Sign Up'}},
  {path: 'activate', component: ActivateComponent, data: {title: 'Account Activation'}},
  {path: 'accept', component: InvitationComponent, data: {title: 'Accept Invitation'}},
  {path: 'forgot-password', component: ForgotPasswordComponent, data: {title: 'Forgot password'}},
  {path: 'reset-password', component: ResetPasswordComponent, data: {title: 'Reset password'}},
  {path: 'sign-in', component: SignInComponent, data: {title: 'Sign In'}},
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
