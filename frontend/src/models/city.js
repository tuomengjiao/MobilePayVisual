import { getCityList, editCity, deleteCity } from '@/services/cityOps';
import { message } from 'antd';
import { buildOptionsByTags } from '../utils/utils';

export default {
	namespace: 'city',

	state: {
		data: [],
		total: 0,
	},

	effects: {
		*init({payload, callback}, {call, put}) {
			const response = yield call(getCityList, {page:1, pageSize: 100});
			if (!response.code || response.code != 'SUCCESS') {
				message.error('获取城市列表数据失败!');
				return;
			}

			yield put({
				type: 'saveCity',
				payload: response.data,
			});
		},

		*fetch({payload, callback}, {call, put}) {
			const response = yield call(getCityList, payload);
			if (!response.code || response.code != 'SUCCESS') {
				message.error('获取城市列表数据失败!');
				return;
			}

			yield put({
				type: 'saveList',
				payload: response.data,
			});
		},

		*edit({payload, callback}, {call, put}) {
			const rs0 = yield call(editCity, payload.updateParams);
			if (!rs0.code || rs0.code != 'SUCCESS') {
				message.error('修改城市失败!');
				return;
			} else {
				message.success('修改城市成功!');
			}

			const response = yield call(getCityList, payload.queryParams);
			if (!response.code || response.code != 'SUCCESS') {
				message.error('获取城市列表数据失败!');
				return;
			}

			yield put({
				type: 'saveList',
				payload: response.data,
			});
		},

		*delete({payload, callback}, {call, put}) {
			const rs0 = yield call(deleteCity, payload.updateParams);
			if (!rs0.code || rs0.code != 'SUCCESS') {
				message.error('删除城市失败!');
				return;
			} else {
				message.success('删除城市成功!');
			}

			const response = yield call(getCityList, payload.queryParams);
			if (!response.code || response.code != 'SUCCESS') {
				message.error('获取城市列表数据失败!');
				return;
			}

			yield put({
				type: 'saveList',
				payload: response.data,
			});
		},
	},

	reducers: {
		saveList(state, action) {
			let payload = action.payload;
			return {
				...state,
				data: payload.cities,
				total: payload.total,
			};
		},

		saveCity(state, action) {
			let payload = action.payload;
			return {
				...state,
				data: payload.cities,
				total: payload.total,
			};
		},
	}
};
