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
    path: '/OTPVerification',
    element: lazy(() => import('./views/auth/signup/OTPVerification'))
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
        path: '/app/dashboard/patients',
        element: lazy(() => import('./layouts/Patients/componets/patients'))
      },
      {
        exact: 'true',
        path: '/addpatients',
        element: lazy(() => import('./layouts/Patients/componets/addpatients'))
      },
      {
        exact: 'true',
        path: '/addpatients/:pat_id',
        element: lazy(() => import('./layouts/Patients/componets/addpatients'))
      },
      // {
      //   exact: 'true',
      //   path: '/app/dashboard/doctors',
      //   element: lazy(() => import('./layouts/Doctors/componets/doctors'))
      // },
      {
        exact: 'true',
        path: '/app/dashboard/doctors',
        element: lazy(() => import('./layouts/Doctors/componets/showdoctors'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/Request-Doctor',
        element: lazy(() => import('./layouts/Doctors/componets/Request'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/My-Doctors',
        element: lazy(() => import('./layouts/Doctors/componets/mydoctors'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/Out-Request',
        element: lazy(() => import('./layouts/Doctors/componets/outrequest'))
      },
      {
        exact: 'true',
        path: '/adddoctors/:id',
        element: lazy(() => import('./layouts/Doctors/componets/adddoctors'))
      },
      {
        exact: 'true',
        path: '/adddoctors',
        element: lazy(() => import('./layouts/Doctors/componets/adddoctors'))
      },


      {
        exact: 'true',
        path: '/app/dashboard/appointments',
        element: lazy(() => import('./layouts/Appointments/componets/appointments'))
        // element: lazy(() => import('./layouts/Appointments/componets/appointmentcard'))
      },
      {
        exact: 'true',
        path: '/addappointments',
        element: lazy(() => import('./layouts/Appointments/componets/addappointments'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/departments',
        element: lazy(() => import('./layouts/Departments/componets/departments'))
      },
      {
        exact: 'true',
        path: '/adddepartments',
        element: lazy(() => import('./layouts/Departments/componets/adddepartments'))
      },
     
      {
        exact: 'true',
        path: '/adddepartments/:dep_id',
        element: lazy(() => import('./layouts/Departments/componets/adddepartments'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/doctorschedule',
        element: lazy(() => import('./layouts/Schedule/componets/doctorschedule'))
      },
      {
        exact: 'true',
        path: '/addshedule',
        element: lazy(() => import('./layouts/Schedule/componets/addshedule'))
      }, 
      {
        exact: 'true',
        path: '/accounts/expenses',
        element: lazy(() => import('./layouts/Accounts/componets/Expenses'))
      },
      {
        exact: 'true',
        path: '/accounts/invoices',
        element: lazy(() => import('./layouts/Accounts/componets/Invoices'))
      },
      {
        exact: 'true',
        path: '/createinvoices',
        element: lazy(() => import('./layouts/Accounts/componets/Createinvoices'))
      },
      {
        exact: 'true',
        path: '/addexpenses',
        element: lazy(() => import('./layouts/Accounts/componets/Addexpenses'))
      },
      {
        exact: 'true',
        path: '/addprovidentfund',
        element: lazy(() => import('./layouts/Accounts/componets/Addprovidentfund'))
      },
      {
        exact: 'true',
        path: '/addtaxes',
        element: lazy(() => import('./layouts/Accounts/componets/Addtaxes'))
      },
      {
        exact: 'true',
        path: '/invoicepdf',
        element: lazy(() => import('./layouts/Accounts/componets/Invoicepdf'))
      },
      {
        exact: 'true',
        path: '/accounts/payments',
        element: lazy(() => import('./layouts/Accounts/componets/Payments'))
      },
      {
        exact: 'true',
        path: '/accounts/providentfund',
        element: lazy(() => import('./layouts/Accounts/componets/Providentfund'))
      },
      {
        exact: 'true',
        path: '/accounts/taxes',
        element: lazy(() => import('./layouts/Accounts/componets/Taxes'))
      },
      {
        exact: 'true',
        path: '/employee/employeelist',
        element: lazy(() => import('./layouts/Employee/components/EmployeeList'))
      },
      {
        exact: 'true',
        path: '/employee/leaves',
        element: lazy(() => import('./layouts/Employee/components/Leave'))
      },
      {
        exact: 'true',
        path: '/employee/holidays',
        element: lazy(() => import('./layouts/Employee/components/Holidays'))
      },
      {
        exact: 'true',
        path: '/employee/attendence',
        element: lazy(() => import('./layouts/Employee/components/Attendence'))
      },
      
      {
        exact: 'true',
        path: '/addemployee',
        element: lazy(() => import('./layouts/Employee/components/Addemployee'))
      },
      {
        exact: 'true',
        path: '/addleave',
        element: lazy(() => import('./layouts/Employee/components/Addleave'))
      },
      {
        exact: 'true',
        path: '/addholidays',
        element: lazy(() => import('./layouts/Employee/components/Addholidays'))
      },
      {
        exact: 'true',
        path: '/addholidays/:holidayId',
        element: lazy(() => import('./layouts/Employee/components/Addholidays'))
      },
      {
        exact: 'true',
        path:"/addemployee/:employeeId",
        element: lazy(() => import('./layouts/Employee/components/Addemployee'))
      },

      {
        exact: 'true',
        path: '/employee/Addleave/:id',
        element: lazy(() => import('./layouts/Employee/components/Addleave'))
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
        exact: 'true',
        path: '/hospitalprofile',
        element: lazy(() => import('./views/auth/hospitalprofile/components/Hprofile'))
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
