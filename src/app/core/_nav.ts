export const navItems = [
  // {
  //   name: 'Dashboard',
  //   url: '/dashboard',
  //   icon: 'icon-speedometer',
  //   badge: {
  //     variant: 'info',
  //     text: 'NEW'
  //   }
  // },
  {
    divider: true
  },
  {
    title: true,
    name: 'Space',
  },
  {
    url: '/residents',
    name: 'Residents',
    icon: 'icon-people',
  },
  {
    url: '/facilities',
    name: 'Facilities',
    icon: 'icon-people',
    children: [
      {
        url: '/facilities',
        name: 'List',
        icon: 'icon-puzzle'
      },
      {
        url: '/facility-dining-rooms',
        name: 'Dining Rooms',
        icon: 'icon-puzzle'
      },
      {
        url: '/facility-rooms',
        name: 'Rooms',
        icon: 'icon-puzzle'
      },
    ]
  },
  {
    url: '/apartments',
    name: 'Apartments',
    icon: 'icon-people',
    children: [
      {
        url: '/apartments',
        name: 'List',
        icon: 'icon-puzzle'
      },
      {
        url: '/apartment-rooms',
        name: 'Rooms',
        icon: 'icon-puzzle'
      },
    ]
  },
  {
    url: '/regions',
    name: 'Regions',
    icon: 'icon-people'
  },
  {
    url: '/responsible-persons',
    name: 'Responsible Persons',
    icon: 'icon-people'
  },
  {
    url: '/physicians',
    name: 'Physicians',
    icon: 'icon-people'
  },
  {
    url: '/physician-specialities',
    name: 'Physician Specialities',
    icon: 'icon-people'
  },
  {
    url: '/assessment',
    name: 'Assessments',
    icon: 'icon-people',
    children: [
      {
        url: '/assessment/categories',
        name: 'Categories',
        icon: 'icon-puzzle'
      },
      {
        url: '/assessment/forms',
        name: 'Forms',
        icon: 'icon-puzzle'
      },
      {
        url: '/assessment/care-levels',
        name: 'Care Levels',
        icon: 'icon-puzzle'
      },
      {
        url: '/assessment/care-level-groups',
        name: 'Care Level Groups',
        icon: 'icon-puzzle'
      }
    ]
  },
  {
    title: true,
    name: 'Common',
  },
  {
    url: '/allergens',
    name: 'Allergens',
    icon: 'icon-people'
  },
  {
    url: '/diagnoses',
    name: 'Diagnoses',
    icon: 'icon-people'
  },
  {
    url: '/diets',
    name: 'Diets',
    icon: 'icon-people'
  },
  {
    url: '/medical-history-conditions',
    name: 'Medical History Condition',
    icon: 'icon-people'
  },
  {
    url: '/medications',
    name: 'Medications',
    icon: 'icon-people'
  },
  {
    url: '/medication-form-factors',
    name: 'Medication Form Factors',
    icon: 'icon-people'
  },
  {
    url: '/relationships',
    name: 'Relationships',
    icon: 'icon-people'
  },
  {
    url: '/care-levels',
    name: 'Care Levels',
    icon: 'icon-people'
  },
  {
    url: '/city-state-zips',
    name: 'City/State/Zip',
    icon: 'icon-people'
  },
  {
    url: '/salutations',
    name: 'Salutations',
    icon: 'icon-people'
  },
  {
    url: '/payment-sources',
    name: 'Payment Sources',
    icon: 'icon-people'
  },
  {
    url: '/event-definitions',
    name: 'Event Definitions',
    icon: 'icon-people'
  },
  {
    title: true,
    name: 'Administration',
  },
  {
    url: '/roles',
    name: 'Roles',
    icon: 'icon-people'
  },
  {
    url: '/users',
    name: 'Users',
    icon: 'icon-user'
  }
];
