import { lazy } from 'react';
import Loadable from 'components/Loadable';
const ShipyardPage = Loadable(lazy(() => import('pages/super-admin/Shipyard')));
const SuperAdminUserManagement = Loadable(lazy(() => import('pages/super-admin/UserManage')));
const ManageAdministratorUsers = Loadable(lazy(() => import('pages/admin/ManageAdministratorUsers')));
const ManageClientUser = Loadable(lazy(() => import('pages/admin/ManageClientUser')));
const ManageDepartments = Loadable(lazy(() => import('pages/admin/ManageDepartments')));
const ManageDeptUsers = Loadable(lazy(() => import('pages/admin/ManageDeptUsers')));
const ManageDockingPlaces = Loadable(lazy(() => import('pages/docking-master/ManageDockingPlaces')));
const ManageInventory = Loadable(lazy(() => import('pages/admin/ManageInventory')));
const ManageShips = Loadable(lazy(() => import('pages/admin/ManageShips')));
const ManageDockings = Loadable(lazy(() => import('pages/admin/ManageDockings')));
const ManageRepairs = Loadable(lazy(() => import('pages/admin/ManageRepairs')));
const ManageWorkOrders = Loadable(lazy(() => import('pages/admin/ManageWorkOrders')));
const ShipDetailPage = Loadable(lazy(() => import('pages/admin/ManageShipDetail')));

export const ROLE_BASED_ROUTES = {
  SUPER_ADMIN: [
    { path: 'shipyard', element: <ShipyardPage /> },
    { path: 'users', element: <SuperAdminUserManagement /> }
  ],
  ADMIN: [
    { path: 'administrator-users', element: <ManageAdministratorUsers /> },
    { path: 'client-users', element: <ManageClientUser /> },
    { path: 'departments', element: <ManageDepartments /> },
    { path: 'dept-users', element: <ManageDeptUsers /> },
    { path: 'docking-places', element: <ManageDockingPlaces /> },
    { path: 'inventories', element: <ManageInventory /> },
    { path: 'ships', element: <ManageShips /> },
    { path: 'dockings', element: <ManageDockings /> },
    { path: 'repairs', element: <ManageRepairs /> },
    { path: 'work-orders', element: <ManageWorkOrders /> },
    { path: 'ships/:id', element: <ShipDetailPage /> }
  ],
  CALCULATOR_ENGINEER: [
    { path: 'administrator-users', element: <ManageAdministratorUsers /> },
    { path: 'client-users', element: <ManageClientUser /> },
    { path: 'ships', element: <ManageShips /> },
    { path: 'dockings', element: <ManageDockings /> }
  ],
  PROJECT_MANAGER: [
    { path: 'departments', element: <ManageDepartments /> },
    { path: 'dept-users', element: <ManageDeptUsers /> },
    { path: 'ships', element: <ManageShips /> },
    { path: 'dockings', element: <ManageDockings /> },
    { path: 'repairs', element: <ManageRepairs /> },
    { path: 'work-orders', element: <ManageWorkOrders /> },
    { path: 'ships/:id', element: <ShipDetailPage /> }
  ],
  DOCKING_MASTER: [
    { path: 'docking-places', element: <ManageDockingPlaces /> },
    { path: 'dockings', element: <ManageDockings /> }
  ],
  TECHNICAL_PURCHASER: [{ path: 'inventories', element: <ManageInventory /> }],
  FOREMAN: [{ path: 'work-orders', element: <ManageWorkOrders /> }]
};
