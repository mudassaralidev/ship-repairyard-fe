import { useEffect } from 'react';
import useAuth from 'hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// ==============================|| LANDING PAGE ||============================== //

const Landing = () => {
  const history = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      history('/dashboard/welcome');
    } else {
      history('/login');
    }
  }, [isLoggedIn]);
};

export default Landing;
