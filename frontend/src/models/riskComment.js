import { getRiskCommentList, editRiskComment, deleteRiskComment } from '@/services/riskCommentOps';
import { message } from 'antd';
import { buildOptionsByTags } from '../utils/utils';

export default {
	namespace: 'riskComment',

	state: {
		data: [],
		total: 0,
	},

	effects: {
		*fetch({payload, callback}, {call, put}) {
			const response = yield call(getRiskCommentList, payload);
			if (!response.code || response.code != 'SUCCESS') {
				message.error('获取风险评价列表数据失败!');
				return;
			}

			yield put({
				type: 'saveList',
				payload: response.data,
			});
		},

		*edit({payload, callback}, {call, put}) {
			const rs0 = yield call(editRiskComment, payload.updateParams);
			if (!rs0.code || rs0.code != 'SUCCESS') {
				message.error('修改风险评价失败!');
				return;
			} else {
				message.success('修改风险评价成功!');
			}

			const response = yield call(getRiskCommentList, payload.queryParams);
			if (!response.code || response.code != 'SUCCESS') {
				message.error('获取风险评价列表数据失败!');
				return;
			}

			yield put({
				type: 'saveList',
				payload: response.data,
			});
		},

		*delete({payload, callback}, {call, put}) {
			const rs0 = yield call(deleteRiskComment, payload.updateParams);
			if (!rs0.code || rs0.code != 'SUCCESS') {
				message.error('删除风险评价失败!');
				return;
			} else {
				message.success('删除风险评价成功!');
			}

			const response = yield call(getRiskCommentList, payload.queryParams);
			if (!response.code || response.code != 'SUCCESS') {
				message.error('获取风险评价列表数据失败!');
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
				data: payload.comments,
				total: payload.total,
			};
		},
	}
};
