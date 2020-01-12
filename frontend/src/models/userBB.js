import { getUserList, editUser, deleteUser } from '@/services/userOps';
import { message } from 'antd';
import { buildOptionsByTags } from '../utils/utils';

export default {
	namespace: 'userBB',

	state: {
		data: [],
		total: 0,
		roleOptions: [],
		orgOptions: [],
		departmentOptions: [],
	},

	effects: {
		*init({payload, callback}, {call, put}) {
			const response = yield call(getUserList, payload);
			if (!response.code || response.code != 'SUCCESS') {
				message.error('获取机构列表数据失败!');
				return;
			}

			yield put({
				type: 'saveList',
				payload: response.data,
			});
		},

		*fetch({payload, callback}, {call, put}) {
			const response = yield call(getUserList, payload);
			if (!response.code || response.code != 'SUCCESS') {
				message.error('获取机构列表数据失败!');
				return;
			}

			yield put({
				type: 'saveList',
				payload: response.data,
			});
		},

		*edit({payload, callback}, {call, put}) {
			const rs0 = yield call(editUser, payload.updateParams);
			if (!rs0.code || rs0.code != 'SUCCESS') {
				message.error('修改机构失败!');
				return;
			} else {
				message.success('修改机构成功!');
			}

			const response = yield call(getUserList, payload.queryParams);
			if (!response.code || response.code != 'SUCCESS') {
				message.error('获取机构列表数据失败!');
				return;
			}

			yield put({
				type: 'saveList',
				payload: response.data,
			});
		},

		*delete({payload, callback}, {call, put}) {
			const rs0 = yield call(deleteUser, payload.updateParams);
			if (!rs0.code || rs0.code != 'SUCCESS') {
				message.error('删除机构失败!');
				return;
			} else {
				message.success('删除机构成功!');
			}

			const response = yield call(getUserList, payload.queryParams);
			if (!response.code || response.code != 'SUCCESS') {
				message.error('获取机构列表数据失败!');
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
				data: payload.users,
				total: payload.total,
			};
		},
	}
};
