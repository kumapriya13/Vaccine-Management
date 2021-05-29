export const IDLE_TIMEOUT = 1800;

export enum AdminToken {
  superAdmin = 'super_admin',
  siteAdmin = 'site_admin-token',
  facilityAdmin = 'facility_admin',
  receptionist = 'receptionist',
  providerAdmin = 'provider_admin',
}
export * from './admin-types';
export * from './route';
