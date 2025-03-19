import { lazy, useEffect } from 'react';
import { useMemo } from 'react';
import { useRoutes } from 'react-router-dom';

// project imports
import Loadable from 'components/Loadable';
import useAuth from 'hooks/useAuth';

import DashboardLayout from 'layout/Dashboard';

const WelcomePage = Loadable(lazy(() => import('pages/dashboard/WelcomePage')));
const ShipyardPage = Loadable(lazy(() => import('pages/super-admin/Shipyard')));
const SuperAdminUserManagement = Loadable(lazy(() => import('pages/super-admin/UserManage')));
const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/404')));
import { useDispatch } from 'react-redux';
import { fetchRoles } from '../redux/features/roles/actions';
const ManageAdministratorUsers = Loadable(lazy(() => import('pages/admin/ManageAdministratorUsers')));
const ManageClientUser = Loadable(lazy(() => import('pages/admin/ManageClientUser')));
const ManageDepartments = Loadable(lazy(() => import('pages/admin/ManageDepartments')));
const ManageDeptUsers = Loadable(lazy(() => import('pages/admin/ManageDeptUsers')));
const ManageDockingPlaces = Loadable(lazy(() => import('pages/docking-master/ManageDockingPlaces')));

const MainRoutes = () => {
  const { user } = useAuth();

  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(fetchRoles());
    }
  }, [user]);

  const routes = useMemo(() => {
    const dashboardChildren = [
      { path: 'welcome', element: <WelcomePage /> },
      { path: 'shipyard', element: <ShipyardPage /> },
      { path: 'users', element: <SuperAdminUserManagement /> },
      { path: 'administrator-users', element: <ManageAdministratorUsers /> },
      { path: 'client-users', element: <ManageClientUser /> },
      { path: 'departments', element: <ManageDepartments /> },
      { path: 'dept-users', element: <ManageDeptUsers /> },
      { path: 'docking-places', element: <ManageDockingPlaces /> }
    ];

    return [
      {
        path: '/',
        element: <DashboardLayout />,
        children: [
          {
            path: 'dashboard',
            children: dashboardChildren
          }
        ]
      },
      { path: '*', element: <MaintenanceError /> }
    ];
  }, [user]);

  return useRoutes(routes);
};

export default MainRoutes;
