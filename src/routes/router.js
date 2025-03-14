import { lazy } from 'react';

import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';

import Loadable from 'components/Loadable';

const PagesLanding = Loadable(lazy(() => import('pages/landing')));
import { useRoutes } from 'react-router-dom';

// ==============================|| ROUTING RENDER ||============================== //

const AppRoutes = () => {
  return useRoutes([
    {
      path: '/',
      element: <PagesLanding />
    },
    LoginRoutes,
    { path: '/*', element: <MainRoutes /> }
  ]);
};

export default AppRoutes;
