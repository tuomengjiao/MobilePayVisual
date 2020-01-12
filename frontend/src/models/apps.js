// fake apps api handling to bypass all integration issues
const _ = require('lodash');
const moment = require('moment');

export default {
	namespace: 'apps',

	state: {
		list: [],
	},

	effects: {
		*fetchAppList({ payload }, { call, put }) {
			// let response = yield call(queryAppList);
			let response = {};
			if (response) {
				yield put({
					type: 'queryAppList',
					payload: {
						...response,
					},
				});
			}
		},
	},

	reducers: {
		queryAppList(state, action) {
			// let { payload } = action;
			let list = [];
			// _.map(payload, (o) => {
			// 	list.push({
			// 		appId: o.appId,
			// 		icon: appVersionIconUrl(o.versionId),
			// 		title: o.name,
			// 		tags: o.tags,
			// 		description: o.description,
			// 		developer: o.org.name,
			// 		buttonTitle: '打开',
			// 		showButton: true,
			// 		popTitle: o.name,
			// 		showTitlePop: true,
			// 		appVersionId: o.versionId,
			// 		spec: o.spec,
			// 	});
			// });
			list.push({
				appId: 'appId',
				icon: 'versionId',
				title: 'title',
				tags: 'tags',
				description: 'description',
				developer: 'developer',
				buttonTitle: '打开',
				showButton: true,
				popTitle: 'popTitle',
				showTitlePop: true,
				appVersionId: 'appVersionId',
				spec: 'spec',
			});
			return {
				list: list,
			};
		},
	},
};
