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
import { fetchShipyard } from '../redux/features/shipyard/actions';
import ShipDetails from 'pages/admin/ManageShipDetails';
const ManageAdministratorUsers = Loadable(lazy(() => import('pages/admin/ManageAdministratorUsers')));
const ManageClientUser = Loadable(lazy(() => import('pages/admin/ManageClientUser')));
const ManageDepartments = Loadable(lazy(() => import('pages/admin/ManageDepartments')));
const ManageDeptUsers = Loadable(lazy(() => import('pages/admin/ManageDeptUsers')));
const ManageDockingPlaces = Loadable(lazy(() => import('pages/docking-master/ManageDockingPlaces')));
const ManageShips = Loadable(lazy(() => import('pages/admin/ManageShips')));
const ManageDockings = Loadable(lazy(() => import('pages/admin/ManageDockings')));
const ManageRepairs = Loadable(lazy(() => import('pages/admin/ManageRepairs')));
const ManageInventory = Loadable(lazy(() => import('pages/admin/ManageInventory')));

const MainRoutes = () => {
  const { user } = useAuth();

  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(fetchRoles());
      user?.shipyard_id && dispatch(fetchShipyard(user.shipyard_id));
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
      { path: 'docking-places', element: <ManageDockingPlaces /> },
      { path: 'ships', element: <ManageShips /> },
      { path: 'ships/:id', element: <ShipDetails /> },
      { path: 'dockings', element: <ManageDockings /> },
      { path: 'repairs', element: <ManageRepairs /> },
      { path: 'inventories', element: <ManageInventory /> }
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
