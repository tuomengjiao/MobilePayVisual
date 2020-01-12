import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'apps', ...(require('/Users/hk/dev/pmXRisk/op_fe/src/models/apps.js').default) });
app.model({ namespace: 'city', ...(require('/Users/hk/dev/pmXRisk/op_fe/src/models/city.js').default) });
app.model({ namespace: 'dataSource', ...(require('/Users/hk/dev/pmXRisk/op_fe/src/models/dataSource.js').default) });
app.model({ namespace: 'global', ...(require('/Users/hk/dev/pmXRisk/op_fe/src/models/global.js').default) });
app.model({ namespace: 'list', ...(require('/Users/hk/dev/pmXRisk/op_fe/src/models/list.js').default) });
app.model({ namespace: 'login', ...(require('/Users/hk/dev/pmXRisk/op_fe/src/models/login.js').default) });
app.model({ namespace: 'notification', ...(require('/Users/hk/dev/pmXRisk/op_fe/src/models/notification.js').default) });
app.model({ namespace: 'pm', ...(require('/Users/hk/dev/pmXRisk/op_fe/src/models/pm.js').default) });
app.model({ namespace: 'project', ...(require('/Users/hk/dev/pmXRisk/op_fe/src/models/project.js').default) });
app.model({ namespace: 'riskComment', ...(require('/Users/hk/dev/pmXRisk/op_fe/src/models/riskComment.js').default) });
app.model({ namespace: 'setting', ...(require('/Users/hk/dev/pmXRisk/op_fe/src/models/setting.js').default) });
app.model({ namespace: 'tags', ...(require('/Users/hk/dev/pmXRisk/op_fe/src/models/tags.js').default) });
app.model({ namespace: 'user', ...(require('/Users/hk/dev/pmXRisk/op_fe/src/models/user.js').default) });
app.model({ namespace: 'userBB', ...(require('/Users/hk/dev/pmXRisk/op_fe/src/models/userBB.js').default) });
app.model({ namespace: 'weather', ...(require('/Users/hk/dev/pmXRisk/op_fe/src/models/weather.js').default) });
