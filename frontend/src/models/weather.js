import { getCityList } from '@/services/cityOps';
import { getWeatherList } from '@/services/weatherOps';
import { message } from 'antd';
import { buildOptionsByTags } from '../utils/utils';

export default {
	namespace: 'weather',

	state: {
		data: [],
		total: 0,

		cities: [],
	},

	effects: {
		*init({payload, callback}, {call, put}) {
			const response = yield call(getCityList, {page:1, pageSize: 1000});
			if (!response.code || response.code != 'SUCCESS') {
				message.error('获取城市列表数据失败!');
				return;
			}

			yield put({
				type: 'saveCity',
				payload: response.data,
			});

			const response0 = yield call(getWeatherList, payload);
			if (!response0.code || response0.code != 'SUCCESS') {
				message.error('获取天气列表数据失败!');
				return;
			}

			yield put({
				type: 'saveList',
				payload: response0.data,
			});
		},

		*fetch({payload, callback}, {call, put}) {
			const response = yield call(getWeatherList, payload);
			if (!response.code || response.code != 'SUCCESS') {
				message.error('获取天气列表数据失败!');
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
				data: payload.weather_info,
				total: payload.total
			};
		},

		saveCity(state, action) {
			let payload = action.payload;
			return {
				...state,
				cities: buildOptionsByTags(payload.cities, 'name_zh', 'city_code'),
			};
		},
	}
};
