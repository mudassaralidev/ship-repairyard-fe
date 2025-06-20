import { lazy, useEffect } from 'react';
import { useMemo } from 'react';
import { useRoutes } from 'react-router-dom';

// project imports
import Loadable from 'components/Loadable';
import useAuth from 'hooks/useAuth';

import DashboardLayout from 'layout/Dashboard';

const WelcomePage = Loadable(lazy(() => import('pages/dashboard/WelcomePage')));
const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/404')));
import { useDispatch } from 'react-redux';
import { fetchRoles } from '../redux/features/roles/actions';
import { fetchShipyard } from '../redux/features/shipyard/actions';
import ShipDetails from 'pages/admin/ManageShipDetails';
import { ROLE_BASED_ROUTES } from './RoleBasedRoutes';

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
      ...(ROLE_BASED_ROUTES[user?.role] || [])

      // { path: 'ships/:id', element: <ShipDetails /> },
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
