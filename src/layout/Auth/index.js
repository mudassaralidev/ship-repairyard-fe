import { Outlet } from 'react-router-dom';

// project import used
import GuestGuard from 'utils/route-guard/GuestGuard';

// ==============================|| LAYOUT - AUTH ||============================== //

const AuthLayout = () => (
  <GuestGuard>
    <Outlet />
  </GuestGuard>
);

export default AuthLayout;
