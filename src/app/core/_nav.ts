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
    name: 'Space???',
  },
  {
    name: 'Facilities',
    url: '/facilities',
    icon: 'icon-people',
    children: [
      {
        name: 'List',
        url: '/facilities',
        icon: 'icon-puzzle'
      },
      {
        name: 'Dining Rooms',
        url: '/facility-dining-rooms',
        icon: 'icon-puzzle'
      },
      {
        name: 'Rooms',
        url: '/facility-rooms',
        icon: 'icon-puzzle'
      },
    ]
  },
  {
    name: 'Apartments',
    url: '/apartments',
    icon: 'icon-people',
    children: [
      {
        name: 'List',
        url: '/apartments',
        icon: 'icon-puzzle'
      },
      {
        name: 'Rooms',
        url: '/apartment-rooms',
        icon: 'icon-puzzle'
      },
    ]
  },
  {
    name: 'Regions',
    url: '/regions',
    icon: 'icon-people'
  },
  {
    name: 'Physicians',
    url: '/physicians',
    icon: 'icon-people'
  },
  {
    name: 'Physician Specialities',
    url: '/physician-specialities',
    icon: 'icon-people'
  },
  {
    title: true,
    name: 'Common',
  },
  {
    name: 'Allergens',
    url: '/allergens',
    icon: 'icon-people'
  },
  {
    name: 'Diagnoses',
    url: '/diagnoses',
    icon: 'icon-people'
  },
  {
    name: 'Diets',
    url: '/diets',
    icon: 'icon-people'
  },
  {
    name: 'Medical History Condition',
    url: '/medical-history-conditions',
    icon: 'icon-people'
  },
  {
    name: 'Medications',
    url: '/medications',
    icon: 'icon-people'
  },
  {
    name: 'Medication Form Factors',
    url: '/medication-form-factors',
    icon: 'icon-people'
  },
  {
    name: 'Relationships',
    url: '/relationships',
    icon: 'icon-people'
  },
  {
    name: 'Care Levels',
    url: '/care-levels',
    icon: 'icon-people'
  },
  {
    name: 'City/State/Zip',
    url: '/city-state-zips',
    icon: 'icon-people'
  },
  {
    name: 'Salutations',
    url: '/salutations',
    icon: 'icon-people'
  },
  {
    title: true,
    name: 'Administration',
  },
  {
    name: 'Roles',
    url: '/roles',
    icon: 'icon-people'
  },
  {
    name: 'Users',
    url: '/users',
    icon: 'icon-user'
  }
];
