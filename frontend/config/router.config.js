export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/userInfo', component: './setting/UserInfo'},
      { path: '/user/login', component: './setting/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    // authority: ['admin', 'virtualdept'],
    routes: [
      { path: '/', redirect: '/user/login' },
      { path: '/welcome', redirect: '/common/pm-list' },
      {
        path: '/admin',
        name: 'admin',
        icon: 'team',
        authority: ['admin'],
        routes: [
          {
            path: '/admin/user-list',
            name: 'user-list',
            component: './Admin/UserList',
          },
        ]
      },
      {
        path: '/common',
        name: 'common',
        icon: 'table',
        authority: ['admin'],
        routes: [
          {
            path: '/common/risk-comment-list',
            name: 'risk-comment-list',
            component: './Common/RiskCommentList',
          },
          {
            path: '/common/city-list',
            name: 'city-list',
            component: './Common/CityList',
          },
          {
            path: '/common/weather-list',
            name: 'weather-list',
            component: './Common/WeatherList',
          },
          {
            path: '/common/pm-list',
            name: 'pm-list',
            component: './Common/PmList',
          },
          {
            path: '/common/notification',
            name: 'notification',
            component: './Notification/NotificationList',
          },
        ]
      },
    ],
  },
];
