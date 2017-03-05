import * as paths from './paths';

export const companyNavLinks = [
  {
    translate: 'navLinks.employees',
    pathName: paths.COMPANY_EMPLOYEES,
  },
  /*{
    displayName: 'History',
    pathName: paths.COMPANY_HISTORY,
  },*/
];

// these links will be available for each team that exists
export const teamNavLinks = [
  {
    translate: 'navLinks.scheduler',
    pathName: paths.TEAM_SCHEDULING,
  },
  {
    translate: 'navLinks.settings',
    pathName: paths.TEAM_SETTINGS,
  },
  /*{
    displayName: 'Shift Board',
    pathName: paths.TEAM_SHIFT_BOARD,
  },*/
];
