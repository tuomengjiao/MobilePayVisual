import * as urls from '../utils/urls';
import request from '@/utils/request';

export async function getWeatherList(params) {
	let url = urls.getWeatherListUrl(params);
	return request(url);
}

export async function getPmList(params) {
	let url = urls.getPmListUrl(params);
	return request(url);
}
