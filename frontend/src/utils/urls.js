import { stringify } from 'qs';

const { OpApi, DemoApi } = global;
const operationBase = 'operation';
import { buildUrlWithTs } from './utils';

export function getDataSourceListUrl(params) {
	let baseUrl = `${OpApi}/${operationBase}/data-source`;
	return buildUrlWithTs(baseUrl, params);
}

export function getDataSourceOneUrl(id) {
	let baseUrl = `${OpApi}/${operationBase}/data-source/${id}`;
	return buildUrlWithTs(baseUrl, {});
}

export function getUserUrl(params) {
	let baseUrl = `${OpApi}/${operationBase}/user`;
	return buildUrlWithTs(baseUrl, params);
}

export function getUserOneUrl(id) {
	let baseUrl = `${OpApi}/${operationBase}/user/${id}`;
	return buildUrlWithTs(baseUrl, {});
}

export function getCurrentUserUrl() {
	let baseUrl = `${OpApi}/${operationBase}/currentUser`;
	return buildUrlWithTs(baseUrl, {});
}

export function signInUrl() {
	let baseUrl = `${OpApi}/${operationBase}/login`;
	return buildUrlWithTs(baseUrl, {});
}

// notification api
export function getNotificationListUrl(params) {
	let baseUrl = `${OpApi}/${operationBase}/notification`;
	return buildUrlWithTs(baseUrl, params);
}

export function getNotificationOneUrl(id) {
	let baseUrl = `${OpApi}/${operationBase}/notification/${id}`;
	return buildUrlWithTs(baseUrl, {});
}

// risk comment apis
export function getRiskCommentListUrl(params) {
	let baseUrl = `${OpApi}/${operationBase}/risk_comment`;
	return buildUrlWithTs(baseUrl, params);
}

export function getRiskCommentOneUrl(id) {
	let baseUrl = `${OpApi}/${operationBase}/risk_comment/${id}`;
	return buildUrlWithTs(baseUrl, {});
}

export function getWeatherListUrl(params) {
	let baseUrl = `${OpApi}/${operationBase}/weather`;
	return buildUrlWithTs(baseUrl, params);
}

export function getPmListUrl(params) {
	let baseUrl = `${OpApi}/${operationBase}/pm`;
	return buildUrlWithTs(baseUrl, params);
}

export function getCityListUrl(params) {
	let baseUrl = `${OpApi}/${operationBase}/city`;
	return buildUrlWithTs(baseUrl, params);
}

/*
export function getCityListUrl(params) {
	let baseUrl = `${OpApi}/${operationBase}/city/${cityCode}`;
	return buildUrlWithTs(baseUrl, params);
}
*/
export function getCityOneUrl(id) {
	let baseUrl = `${OpApi}/${operationBase}/city/${id}`;
	return buildUrlWithTs(baseUrl, {});
}

