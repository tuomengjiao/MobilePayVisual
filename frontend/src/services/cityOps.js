import * as urls from '../utils/urls';
import request from '@/utils/request';

export async function getCityList(params) {
	let url = urls.getCityListUrl(params);
	return request(url);
}

export async function editCity(record) {
	if (record.id == 0 || record.id == '0') {
		let url = urls.getCityListUrl({});
		return request(url, {
			method: 'POST',
			body: {
				data: record,
				method: 'post',
			},
		});
	} else {
		let url = urls.getCityOneUrl(record.id);
		return request(url, {
			method: 'PUT',
			body: {
				data: record,
				method: 'put',
			},
		});
	}
}

export async function deleteCity(record) {
	let url = urls.getCityOneUrl(record.id);
	return request(url, {
		method: 'DELETE',
		body: {
			method: 'delete',
		},
	});
}
