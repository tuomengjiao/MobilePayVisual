import * as urls from '../utils/urls';
import request from '@/utils/request';

export async function getRiskCommentList(params) {
	let url = urls.getRiskCommentListUrl(params);
	return request(url);
}

export async function editRiskComment(record) {
	if (record.id == 0 || record.id == '0') {
		let url = urls.getRiskCommentListUrl({});
		return request(url, {
			method: 'POST',
			body: {
				data: record,
				method: 'post',
			},
		});
	} else {
		let url = urls.getRiskCommentOneUrl(record.id);
		return request(url, {
			method: 'PUT',
			body: {
				data: record,
				method: 'put',
			},
		});
	}
}

export async function deleteRiskComment(record) {
	let url = urls.getRiskCommentOneUrl(record.id);
	return request(url, {
		method: 'DELETE',
		body: {
			method: 'delete',
		},
	});
}
