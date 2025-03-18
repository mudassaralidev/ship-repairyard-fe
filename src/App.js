import { RouterProvider } from 'react-router-dom';

import router from 'routes';
import ThemeCustomization from 'themes';

import Locales from 'components/Locales';
import RTLLayout from 'components/RTLLayout';
import ScrollTop from 'components/ScrollTop';
import Snackbar from 'components/@extended/Snackbar';
import Notistack from 'components/third-party/Notistack';
import { Provider } from 'react-redux';
import store from './redux/store';

import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
import { ToastContainer } from 'react-toastify';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

const App = () => {
  return (
    <ThemeCustomization>
      <RTLLayout>
        <Locales>
          <ScrollTop>
            <AuthProvider>
              <Provider store={store}>
                <>
                  <Notistack>
                    <RouterProvider router={router} />
                    <Snackbar />
                  </Notistack>
                </>
              </Provider>
            </AuthProvider>
          </ScrollTop>
        </Locales>
      </RTLLayout>
      <ToastContainer />
    </ThemeCustomization>
  );
};

export default App;
