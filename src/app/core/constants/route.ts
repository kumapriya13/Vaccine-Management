import { AdminTypes } from './admin-types';

export const ROUTE = {
  [AdminTypes.superAdmin]: 'super-admin',
  [AdminTypes.providerAdmin]: 'provider',
  [AdminTypes.siteAdmin]: 'site-admin',
  [AdminTypes.facilityAdmin]: 'facility-admin',
  [AdminTypes.receptionist]: 'receptionist',
  [AdminTypes.vaccinator]: 'vaccinator',
  [AdminTypes.dailysite]: 'dailysite',

}
