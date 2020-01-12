import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';
import RendererWrapper0 from '/Users/hk/dev/pmXRisk/op_fe/src/pages/.umi/LocaleWrapper.jsx'
import _dvaDynamic from 'dva/dynamic'

let Router = require('dva/router').routerRedux.ConnectedRouter;

let routes = [
  {
    "path": "/user",
    "component": _dvaDynamic({
  
  component: () => import('../../layouts/UserLayout'),
  LoadingComponent: require('/Users/hk/dev/pmXRisk/op_fe/src/components/PageLoading/index').default,
}),
    "routes": [
      {
        "path": "/user",
        "redirect": "/user/login",
        "exact": true
      },
      {
        "path": "/user/userInfo",
        "component": _dvaDynamic({
  
  component: () => import('../setting/UserInfo'),
  LoadingComponent: require('/Users/hk/dev/pmXRisk/op_fe/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "path": "/user/login",
        "component": _dvaDynamic({
  
  component: () => import('../setting/Login'),
  LoadingComponent: require('/Users/hk/dev/pmXRisk/op_fe/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "path": "/user/register",
        "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import('/Users/hk/dev/pmXRisk/op_fe/src/pages/User/models/register.js').then(m => { return { namespace: 'register',...m.default}})
],
  component: () => import('../User/Register'),
  LoadingComponent: require('/Users/hk/dev/pmXRisk/op_fe/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "path": "/user/register-result",
        "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import('/Users/hk/dev/pmXRisk/op_fe/src/pages/User/models/register.js').then(m => { return { namespace: 'register',...m.default}})
],
  component: () => import('../User/RegisterResult'),
  LoadingComponent: require('/Users/hk/dev/pmXRisk/op_fe/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "component": () => React.createElement(require('/Users/hk/dev/pmXRisk/op_fe/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "path": "/",
    "component": _dvaDynamic({
  
  component: () => import('../../layouts/BasicLayout'),
  LoadingComponent: require('/Users/hk/dev/pmXRisk/op_fe/src/components/PageLoading/index').default,
}),
    "Routes": [require('../Authorized').default],
    "routes": [
      {
        "path": "/",
        "redirect": "/user/login",
        "exact": true
      },
      {
        "path": "/welcome",
        "redirect": "/common/pm-list",
        "exact": true
      },
      {
        "path": "/admin",
        "name": "admin",
        "icon": "team",
        "authority": [
          "admin"
        ],
        "routes": [
          {
            "path": "/admin/user-list",
            "name": "user-list",
            "component": _dvaDynamic({
  
  component: () => import('../Admin/UserList'),
  LoadingComponent: require('/Users/hk/dev/pmXRisk/op_fe/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/hk/dev/pmXRisk/op_fe/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/common",
        "name": "common",
        "icon": "table",
        "authority": [
          "admin"
        ],
        "routes": [
          {
            "path": "/common/risk-comment-list",
            "name": "risk-comment-list",
            "component": _dvaDynamic({
  
  component: () => import('../Common/RiskCommentList'),
  LoadingComponent: require('/Users/hk/dev/pmXRisk/op_fe/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/common/city-list",
            "name": "city-list",
            "component": _dvaDynamic({
  
  component: () => import('../Common/CityList'),
  LoadingComponent: require('/Users/hk/dev/pmXRisk/op_fe/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/common/weather-list",
            "name": "weather-list",
            "component": _dvaDynamic({
  
  component: () => import('../Common/WeatherList'),
  LoadingComponent: require('/Users/hk/dev/pmXRisk/op_fe/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/common/pm-list",
            "name": "pm-list",
            "component": _dvaDynamic({
  
  component: () => import('../Common/PmList'),
  LoadingComponent: require('/Users/hk/dev/pmXRisk/op_fe/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/common/notification",
            "name": "notification",
            "component": _dvaDynamic({
  
  component: () => import('../Notification/NotificationList'),
  LoadingComponent: require('/Users/hk/dev/pmXRisk/op_fe/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/hk/dev/pmXRisk/op_fe/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "component": () => React.createElement(require('/Users/hk/dev/pmXRisk/op_fe/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "component": () => React.createElement(require('/Users/hk/dev/pmXRisk/op_fe/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
  }
];
window.g_routes = routes;
window.g_plugins.applyForEach('patchRoutes', { initialValue: routes });

// route change handler
function routeChangeHandler(location, action) {
  window.g_plugins.applyForEach('onRouteChange', {
    initialValue: {
      routes,
      location,
      action,
    },
  });
}
window.g_history.listen(routeChangeHandler);
routeChangeHandler(window.g_history.location);

export default function RouterWrapper() {
  return (
<RendererWrapper0>
          <Router history={window.g_history}>
      { renderRoutes(routes, {}) }
    </Router>
        </RendererWrapper0>
  );
}
