import { AdminTypes } from '../constants';

export interface RoutePath {
  path: string;
  title: string;
}

export const retriveMenuFromAdminType = (adminType: string): RoutePath[] => {
  switch (adminType) {
    case AdminTypes.providerAdmin:
      return [
        { path: '/provider/dashboard', title: 'Home' },
        { path: '/provider/me', title: `Provider` },
        { path: '/provider/users', title: 'Users' },
        { path: '/provider/site', title: 'Site' },
        { path: '/provider/notification', title: 'Notification' },
      ] as RoutePath[];
    default:
      break;
  }
};
