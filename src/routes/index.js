import { createBrowserRouter } from 'react-router-dom';
import AppRoutes from './router';

const router = createBrowserRouter([
  {
    path: '*',
    element: <AppRoutes />
  }
]);

export default router;
