import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

import { BASE_URL } from './config/constant';

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes = [
  {
    exact: true,
    path: '/Dashbaord',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },
  
  {
    exact: true,
    path: '/Registerform',
    element: lazy(() => import('./views/auth/signup/Registerform'))
  },
  {
    exact: true,
    path: '/TermsAndConditions',
    element: lazy(() => import('./views/auth/signup/TermsAndConditions'))
  },
  {
    exact: true,
    path: '/enter-email',
    element: lazy(() => import('./views/auth/signup/EnterEmailpage'))
  },
  
  {
    exact: true,
    path: '/OTPVerification',
    element: lazy(() => import('./views/auth/signup/OTPVerification'))
  },
  {
    exact: true,
    path: '/Registerform/:patientID',
    element: lazy(() => import('./views/auth/signup/Registerform'))
  },
  
  
  {
    exact: true,
    path: '/login',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },
  {
    exact: 'true',
    path: '/auth/signup-1',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },
  {
    exact: 'true',
    path: '/auth/reset-password-1',
    element: lazy(() => import('./views/auth/reset-password/ResetPassword1'))
  },
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        exact: 'true',
        path: '/app/dashboard/default',
        element: lazy(() => import('./views/dashboard'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/doctors',
        element: lazy(() => import('./layouts/Doctors/componets/doctors'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/hospital',
        element: lazy(() => import('./layouts/Hospital/components/hospitallist'))
      },

      {
        exact: 'true',
        path: '/app/dashboard/appointments',
        element: lazy(() => import('./layouts/Appointments/componets/appointments'))
      },
      {
        exact: 'true',
        path: '/addappointments',
        element: lazy(() => import('./layouts/Appointments/componets/addappointments'))
      },
      {
        exact: 'true',
        path: '/addappointments/:appointmentId',
        element: lazy(() => import('./layouts/Appointments/componets/addappointments'))
      },
      {
        exact: 'true',
        path: '/viewappointment/:appointmentId',
        element: lazy(() => import('./layouts/Appointments/componets/viewappointment'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/departments',
        element: lazy(() => import('./layouts/Departments/componets/departments'))
      },
      {
        exact: 'true',
        path: '/hospital/:hospitalId',
        element: lazy(() => import('./layouts/Hospital/components/drhospital'))
      },
      {
        exact: 'true',
        path: '/basic/button',
        element: lazy(() => import('./views/ui-elements/basic/BasicButton'))
      },
      
      {
        exact: 'true',
        path: '/basic/badges',
        element: lazy(() => import('./views/ui-elements/basic/BasicBadges'))
      },
      {
        exact: 'true',
        path: '/basic/breadcrumb',
        element: lazy(() => import('./views/ui-elements/basic/BasicBreadcrumb'))
      },
      {
        exact: 'true',
        path: '/basic/pagination',
        element: lazy(() => import('./views/ui-elements/basic/BasicPagination'))
      },
      {
        exact: 'true',
        path: '/basic/collapse',
        element: lazy(() => import('./views/ui-elements/basic/BasicCollapse'))
      },
      {
        exact: 'true',
        path: '/basic/tabs-pills',
        element: lazy(() => import('./views/ui-elements/basic/BasicTabsPills'))
      },
      {
        exact: 'true',
        path: '/basic/typography',
        element: lazy(() => import('./views/ui-elements/basic/BasicTypography'))
      },
      {
        exact: 'true',
        path: '/forms/form-basic',
        element: lazy(() => import('./views/forms/FormsElements'))
      },
      {
        exact: 'true',
        path: '/tables/bootstrap',
        element: lazy(() => import('./views/tables/BootstrapTable'))
      },
      {
        exact: 'true',
        path: '/charts/nvd3',
        element: lazy(() => import('./views/charts/nvd3-chart'))
      },
      {
        exact: 'true',
        path: '/maps/google-map',
        element: lazy(() => import('./views/maps/GoogleMaps'))
      },
      {
        exact: 'true',
        path: '/sample-page',
        element: lazy(() => import('./views/extra/SamplePage'))
      },
      {
        exact: 'true',
        path: '/Profile',
        element: lazy(() => import('./views/auth/Profile'))
      },
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default routes;
