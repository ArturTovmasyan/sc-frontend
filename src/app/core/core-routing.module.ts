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
import {ListComponent as RoleListComponent} from './admin/components/role/list.component';

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
import {ViewComponent as ResidentViewComponent} from './residents/components/resident/view/view.component';
import {ListComponent as ResidentResponsiblePersonListComponent} from './residents/components/resident/responsible-person/list.component';
import {ListComponent as ResidentEventListComponent} from './residents/components/resident/event/list.component';
import {ListComponent as ResidentContractListComponent} from './residents/components/resident/contract/list.component';
import {ListComponent as ResidentPaymentListComponent} from './residents/components/resident/payment/list.component';
import {ListComponent as ResidentPhysicianListComponent} from './residents/components/resident/physician/list.component';
import {ListComponent as ResidentMedicationListComponent} from './residents/components/resident/medication/list.component';
import {ListComponent as ResidentDietListComponent} from './residents/components/resident/dietary-restriction/list.component';
import {ListComponent as ResidentAssessmentListComponent} from './residents/components/resident/assessment/list.component';
import {ListComponent as ResidentReportListComponent} from './residents/components/resident/report/list.component';
import {HistoryComponent as ResidentHistoryComponent} from './residents/components/resident/history/history.component';


const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    data: {title: 'Home', roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN', 'ROLE_USER']},
    children: [
      {
        path: 'users', component: UserListComponent, data: {
          title: 'Users',
          roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'roles', component: RoleListComponent, data: {
          title: 'Roles',
          roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN']
        },
        canActivate: [AuthGuard]
      },

      {
        path: 'residents', component: ResidentListComponent, data: {
          title: 'Residents',
          roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN']
        },
        canActivate: [AuthGuard]
      },

      {
        path: 'facilities', component: FacilityListComponent, data: {
          title: 'Facilities',
          roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'facility-rooms', component: FacilityRoomListComponent, data: {
          title: 'Facility Rooms',
          roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'facility-dining-rooms', component: FacilityDiningRoomListComponent, data: {
          title: 'Facility Dining Rooms',
          roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN']
        },
        canActivate: [AuthGuard]
      },

      {
        path: 'apartments', component: ApartmentListComponent, data: {
          title: 'Apartments',
          roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'apartment-rooms', component: ApartmentRoomListComponent, data: {
          title: 'Apartment Rooms',
          roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'regions', component: RegionListComponent, data: {
          title: 'Regions',
          roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN']
        },
        canActivate: [AuthGuard]
      },

      {
        path: 'physicians', component: PhysicianListComponent, data: {
          title: 'Physicians',
          roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'physician-specialities', component: PhysicianSpecialityListComponent, data: {
          title: 'Physician Specialities',
          roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'responsible-persons', component: ResponsiblePersonListComponent,
        data: {
          title: 'Responsible Persons',
          roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN', 'ROLE_USER']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'allergens', component: AllergensListComponent, data: {
          title: 'Allergens',
          roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'care-levels', component: CareLevelListComponent, data: {
          title: 'Care Levels',
          roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'city-state-zips', component: CityStateZipListComponent, data: {
          title: 'City/State/Zip',
          roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'diagnoses', component: DiagnosisListComponent, data: {
          title: 'Diagnoses',
          roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'diets', component: DietListComponent, data: {
          title: 'Diets',
          roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'medical-history-conditions', component: MedicalHistoryConditionListComponent, data: {
          title: 'Medical History Condition',
          roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'medications', component: MedicationListComponent, data: {
          title: 'Medications',
          roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'medication-form-factors', component: MedicationFormFactorListComponent, data: {
          title: 'Medication Form Factors',
          roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'relationships', component: RelationshipListComponent, data: {
          title: 'Relationships',
          roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'salutations', component: SalutationListComponent, data: {
          title: 'Salutations',
          roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'payment-sources', component: PaymentSourceListComponent, data: {
          title: 'Payment Sources',
          roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'event-definitions', component: EventDefinitionListComponent, data: {
          title: 'Event Definitions',
          roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN']
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'assessment', data: {title: 'Assessment'},
        children: [
          {
            path: 'categories', component: AssessmentCategoryListComponent, data: {
              title: 'Categories',
              roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN']
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'forms', component: AssessmentFormListComponent, data: {
              title: 'Forms',
              roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN']
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'care-levels', component: AssessmentCareLevelListComponent, data: {
              title: 'Care Levels',
              roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN']
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'care-level-groups', component: AssessmentCareLevelGroupListComponent, data: {
              title: 'Care Level Groups',
              roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN']
            },
            canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: 'profile', data: {title: 'Profile'},
        children: [
          {
            path: 'edit', component: ProfileEditComponent, data: {
              title: 'Edit Profile',
              roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN', 'ROLE_USER']
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'me', component: ProfileViewComponent, data: {
              title: 'My Profile',
              roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN', 'ROLE_USER']
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'change-password', component: ChangePasswordComponent, data: {
              title: 'Change Password',
              roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN', 'ROLE_USER']
            },
            canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: 'resident/:id',
        component: ResidentViewComponent,
        canActivate: [AuthGuard],
        data: {title: 'Resident', roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN', 'ROLE_USER']},
        children: [
          {
            path: 'responsible-persons',
            component: ResidentResponsiblePersonListComponent,
            outlet: 'resident-details',
            pathMatch: 'full',
            data: {
              title: 'Responsible Persons',
              roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN', 'ROLE_USER']
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
              roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN', 'ROLE_USER']
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'contracts',
            component: ResidentContractListComponent,
            outlet: 'resident-details',
            pathMatch: 'full',
            data: {
              title: 'Contracts',
              roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN', 'ROLE_USER']
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'payments',
            component: ResidentPaymentListComponent,
            outlet: 'resident-details',
            pathMatch: 'full',
            data: {
              title: 'Payments',
              roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN', 'ROLE_USER']
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
              roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN', 'ROLE_USER']
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
              roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN', 'ROLE_USER']
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
              roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN', 'ROLE_USER']
            },
            canActivate: [AuthGuard],
            children: [
            ]
          },
          {
            path: 'diets',
            component: ResidentDietListComponent,
            outlet: 'resident-details',
            pathMatch: 'full',
            data: {
              title: 'Dietary Restrictions',
              roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN', 'ROLE_USER']
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
              roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN', 'ROLE_USER']
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
              roles: ['ROLE_ADMIN', 'ROLE_SPACE_ADMIN', 'ROLE_USER']
            },
            canActivate: [AuthGuard]
          },

        ]
      }
    ]
  },

  {path: 'sign-up', component: SignUpComponent, data: {title: 'Sign Up'}},
  {path: 'activate', component: ActivateComponent, data: {title: 'Account Activation'}},
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
