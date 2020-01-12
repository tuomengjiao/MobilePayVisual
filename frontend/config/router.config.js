export default [
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      { path: '/', redirect: 'welcome' },
      { path: '/welcome', redirect: '/transaction/daily-report' },
      {
        path: '/transaction',
        name: 'transaction',
        icon: 'table',
        routes: [
          {
            path: '/transaction/daily-report',
            name: 'transaction-daily-report',
            component: './Transaction/DailyReport',
          }
        ]
      }
    ]
  }
];
