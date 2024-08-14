const menuItems = {
  items: [
    {
      id: 'navigation',
      // title: 'Navigation',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/dashboard/default'
        },
        {
          id: 'Doctors',
          title: 'Doctors',
          type: 'collapse',
          icon: 'feather icon-menu',
          children: [
           
            {
              id: 'Doctors',
              title: 'New Doctors',
              type: 'item',
              icon: 'feather icon-file-text',
              url: '/app/dashboard/doctors'
            },
            {
              id: 'Request',
              title: 'My Doctors',
              type: 'item',
              icon: 'feather icon-power',
              url: '/app/dashboard/My-Doctors'
            },
            {
              id: 'Request',
              title: 'Doctor Request',
              type: 'item',
              icon: 'feather icon-book',
              url: '/app/dashboard/Request-Doctor'
            },
            {
              id: 'Doctors',
              title: 'Your Request',
              type: 'item',
              icon: 'feather icon-server',
              url: '/app/dashboard/Out-Request'
            }
           
          ]
        },
        {
          id: 'patients',
          title: 'Patients',
          type: 'item',
          icon: 'feather icon-pie-chart',
          url: '/app/dashboard/patients'
        },
        // {
        //   id: 'doctors',
        //   title: 'Doctors',
        //   type: 'item',
        //   icon: 'feather icon-file-text',
        //   url: '/app/dashboard/doctors'
        // },
        {
          id: 'appointments',
          title: 'Appointments',
          type: 'item',
          icon: 'feather icon-server',
          url: '/app/dashboard/appointments'
        },
        {
          id: 'departments',
          title: 'Departments',
          type: 'item',
          icon: 'feather icon-lock',
          url: '/app/dashboard/departments'
        },
        {
          id: 'doctorschedule',
          title: 'Doctor Schedule',
          type: 'item',
          icon: 'feather icon-pie-chart',
          url: '/app/dashboard/doctorschedule'
        },
       
    


        // {
        //   id: 'accounts',
        //   title: 'Accounts',
        //   type: 'collapse',
        //   icon: 'feather icon-menu',
        //   children: [
           
        //     {
        //       id: 'table',
        //       title: 'Invoices',
        //       type: 'item',
        //       icon: 'feather icon-server',
        //       url: '/accounts/invoices'
        //     },
        //     {
        //       id: 'payments',
        //       title: 'Payments',
        //       type: 'item',
        //       icon: 'feather icon-file-text',
        //       url: '/accounts/payments'
        //     },
        //     {
        //       id: 'forms',
        //       title: 'Expenses',
        //       type: 'item',
        //       icon: 'feather icon-file-text',
        //       url: '/accounts/expenses'
        //     },
          
        //     {
        //       id: 'providentfund',
        //       title: 'Provident Fund',
        //       type: 'item',
        //       icon: 'feather icon-book',
        //       url: '/accounts/providentfund'
        //     },
        //     {
        //       id: 'taxes',
        //       title: 'Taxes',
        //       type: 'item',
        //       icon: 'feather icon-server',
        //       url: '/accounts/taxes'
        //     }
            
            
        //   ]
        // },

        // {
        //   id: 'employee',
        //   title: 'Employee',
        //   type: 'collapse',
        //   icon: 'feather icon-menu',
        //   children: [
           
        //     {
        //       id: 'employees list',
        //       title: 'Employees List',
        //       type: 'item',
        //       icon: 'feather icon-server',
        //       url: '/employee/employeelist'
        //     },
        //     {
        //       id: 'holidays',
        //       title: 'Holidays',
        //       type: 'item',
        //       icon: 'feather icon-file-text',
        //       url: '/employee/holidays'
        //     },
        //     {
        //       id: 'leaves',
        //       title: 'Leaves',
        //       type: 'item',
        //       icon: 'feather icon-file-text',
        //       url: '/employee/leaves'
        //     },
          
        //     {
        //       id: 'attendence',
        //       title: 'Attendence',
        //       type: 'item',
        //       icon: 'feather icon-book',
        //       url: '/employee/attendence'
        //     },
           
            
        //   ]
        // },


      ]
    },
    // {
    //   id: 'ui-element',
    //   type: 'group',
     
    //   children: [
    //     {
    //       id: 'doctors',
    //       title: 'Doctors',
    //       type: 'collapse',
    //       icon: 'feather icon-box',
    //       children: [
    //         {
    //           id: 'button',
    //           title: 'My Doctors',
    //           type: 'item',
    //           url: '/app/dashboard/doctors'
    //         },
    //         {
    //           id: 'badges',
    //           title: 'Come Request',
    //           type: 'item',
    //           url: '/app/dashboard/doctors'
    //         }
    //       ]
    //     }
    //   ]
    // },
      
    // {
    //   id: 'chart-maps',
    //   title: 'Chart & Maps',
    //   type: 'group',
    //   icon: 'icon-charts',
    //   children: [
    //     {
    //       id: 'charts',
    //       title: 'Charts',
    //       type: 'item',
    //       icon: 'feather icon-pie-chart',
    //       url: '/charts/nvd3'
    //     },
    //     {
    //       id: 'maps',
    //       title: 'Maps',
    //       type: 'item',
    //       icon: 'feather icon-map',
    //       url: '/maps/google-map'
    //     }
    //   ]
    // },
    // {
    //   id: 'pages',
    //   title: 'Pages',
    //   type: 'group',
    //   icon: 'icon-pages',
    //   children: [
    //     {
    //       id: 'auth',
    //       title: 'Authentication',
    //       type: 'collapse',
    //       icon: 'feather icon-lock',
    //       badge: {
    //         title: 'New',
    //         type: 'label-danger'
    //       },
    //       children: [
    //         {
    //           id: 'signup-1',
    //           title: 'Sign up',
    //           type: 'item',
    //           url: '/auth/signup-1',
    //           target: true,
    //           breadcrumbs: false
    //         },
    //         {
    //           id: 'signin-1',
    //           title: 'Sign in',
    //           type: 'item',
    //           url: '/auth/signin-1',
    //           target: true,
    //           breadcrumbs: false
    //         }
    //       ]
    //     },
    //     {
    //       id: 'sample-page',
    //       title: 'Sample Page',
    //       type: 'item',
    //       url: '/sample-page',
    //       classes: 'nav-item',
    //       icon: 'feather icon-sidebar'
    //     },
    //     {
    //       id: 'documentation',
    //       title: 'Documentation',
    //       type: 'item',
    //       icon: 'feather icon-book',
    //       classes: 'nav-item',
    //       url: 'https://codedthemes.gitbook.io/datta/',
    //       target: true,
    //       external: true
    //     },
    //     {
    //       id: 'menu-level',
    //       title: 'Menu Levels',
    //       type: 'collapse',
    //       icon: 'feather icon-menu',
    //       children: [
    //         {
    //           id: 'menu-level-1.1',
    //           title: 'Menu Level 1.1',
    //           type: 'item',
    //           url: '#!'
    //         },
    //         {
    //           id: 'menu-level-1.2',
    //           title: 'Menu Level 2.2',
    //           type: 'collapse',
    //           children: [
    //             {
    //               id: 'menu-level-2.1',
    //               title: 'Menu Level 2.1',
    //               type: 'item',
    //               url: '#'
    //             },
    //             {
    //               id: 'menu-level-2.2',
    //               title: 'Menu Level 2.2',
    //               type: 'collapse',
    //               children: [
    //                 {
    //                   id: 'menu-level-3.1',
    //                   title: 'Menu Level 3.1',
    //                   type: 'item',
    //                   url: '#'
    //                 },
    //                 {
    //                   id: 'menu-level-3.2',
    //                   title: 'Menu Level 3.2',
    //                   type: 'item',
    //                   url: '#'
    //                 }
    //               ]
    //             }
    //           ]
    //         }
    //       ]
    //     },
    //     {
    //       id: 'disabled-menu',
    //       title: 'Disabled Menu',
    //       type: 'item',
    //       url: '#',
    //       classes: 'nav-item disabled',
    //       icon: 'feather icon-power'
    //     }
    //   ]
    // }
  ]
};

export default menuItems;
