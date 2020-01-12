import fetch from 'dva/fetch';
import { notification,message } from 'antd';
import router from 'umi/router';
import hash from 'hash.js';
import { isAntdPro } from './utils';
import cookies from './cookies';
import { getDomain} from "./utils";
import {config} from '../config';

// const codeMessage = {
//   200: '服务器成功返回请求的数据。',
//   201: '新建或修改数据成功。',
//   202: '一个请求已经进入后台排队（异步任务）。',
//   204: '删除数据成功。',
//   400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
//   401: '用户没有权限（令牌、用户名、密码错误）。',
//   403: '用户得到授权，但是访问是被禁止的。',
//   404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
//   406: '请求的格式不可得。',
//   410: '请求的资源被永久删除，且不会再得到的。',
//   422: '当创建一个对象时，发生一个验证错误。',
//   500: '服务器发生错误，请检查服务器。',
//   502: '网关错误。',
//   503: '服务不可用，服务器暂时过载或维护。',
//   504: '网关超时。',
// };

const errorMessage = {
  // old
  ':<(': '服务器错误',
  '-1': '服务器错误',
  GENERAL: '服务器错误',
  INTERNAL_ERROR: '服务器错误',
  BAUTH_TOKEN_MISSING: '登录信息已过期',
  NO_ITEMS_SELECTED: '请选择内容',
  USER_NOT_AUTHORIZED: '无权访问',
  DATA_ENTITY_NOT_EXIST: '该数据不存在',
  INVALID_BAUTH_USER: '账号不存在',
  ORGANIZATION_NOT_EXIST: '该机构不存在',
  THE_DATASETS_NAME_HAS_BEEN_TAKEN: '该名称已被占用，请重新填写',
  THE_DATA_ENTITY_NAME_HAS_BEEN_TAKEN: '该名称已被占用，请重新填写',
  THE_ORGANIZATION_NAME_HAS_BEEN_TAKEN: '该名称已被占用，请重新填写',
  DATASETS_NOT_EXIST: '该数据集不存在',
  THE_MEMBER_DOSE_NOT_BELONG_TO_THE_ORGANIZATION: '该成员不属于此机构',
  DATASETS_IS_NOT_SHARED: '无法分享',
  DATASETS_IS_NOT_SHARED_WITH_THE_ORGANIZATION: '无法分享',
  USERNAME_NOT_EXIST: '用户不存在',

  ALREADY_IN_THIS_ORGANIZATION: '该成员已加入此机构',
  MEMBER_OR_DATASETS_NOT_EXIST: '该用户或数据集不存在',
  THE_TEAM_NAME_HAS_BEEN_TAKEN: '该名称已被占用，请重新填写',
  PART_OF_THE_TEAM_DOSE_NOT_BELONG_TO_THE_ORGANIZATION: '该团队不属于此机构',
  TEAMS_HAS_BEEN_USED: '团队已被使用',
  UNEXPECTED_ERROR: '网络错误',
  HDFS_ERROR: '存储失败',
  DATASETS_IS_COMPLETE: '数据集已完成，无法修改',
  TEAM_NOT_EXIST: '该团队不存在',
  THE_DATA_ENTITY_DOSE_NOT_BELONG_TO_THE_DATASETS: '该数据不属于此数据集',
  USER_NOT_EXIST: '用户不存在',
  INVALID_OLD_PASSWORD: '旧密码不正确',
  THE_PASSWORD_IS_INCONSISTENT: '两次输入的密码不一致',
  INVALID_CREDENTIAL: '用户名密码错误',
  INVALID_CAPTCHA: '验证码不正确',
  CAPTCHA_EXPIRED: '验证码已过期',
  THE_DESTINATION_FOLDER_DOES_NOT_EXIST: '目标文件夹不存在',
  THE_ENTITY_CAN_NOT_BE_MOVED_ACROSS_DATASETS: '数据不能跨数据集移动',
  RULE_TEMPLATE_NOT_EXIST: '数据清洗模板不存在',
  THE_RULE_TEMPLATE_NAME_HAS_BEEN_TAKEN: '该模板名称已被占用，请重新填写',
  THE_FLOW_TEMPLATE_NAME_HAS_BEEN_TAKEN: '该模板名称已被占用，请重新填写',
  SAMPLE_NOT_EXIST: '抽样数据不存在',
  XTABLE_COLUMN_EXIST: '列名存在重复项，请修改后进行预处理',
  INVALID_DATA_NOT_EXIST: '错误数据不存在',
  INVALID_DATA_IS_TOO_LARGE: '错误数据量过大',

  THE_APP_HAS_BEEN_INSTALLED: '该应用已经安装过了',
  APP_NOT_EXIST: '该应用不存在',
  THE_APP_VERSION_NUMBER_HAS_BEEN_TAKEN: '该版本号已经存在',
  APP_STATUS_EXCEPTION: '应用状态有误',
  REASON_IS_REQUIRED: '请补充理由',
  UNKNOWN_STATUS: '未知状态',
  APP_STATUS_IS_NOT_NEW: '该应用不是新建的',
  PACKAGE_HDFS_PATH_EXCEPTION: '程序包访问出错',
  THE_APP_NAME_HAS_BEEN_TAKEN: '名称已被其它应用使用',

  THE_RULE_HAS_BEEN_TAKEN: '该规则已经设置过了',

  // new
  ORGANIZATION_NOT_FOUND: '该机构不存在',
  ENTITY_NOT_FOUND: '该数据不存在',
  USER_NOT_FOUND: '该用户不存在',
  DATASETS_NOT_FOUND: '该数据集不存在',
  INVALID_ENTITY: '该数据无效',
  THE_ENTITY_IS_NOT_FOLDER: '该数据不是目录',
  // THE_ORGANIZATION_NAME_HAS_BEEN_TAKEN: '该名称已被占用，请重新填写',
  // NO_ITEMS_SELECTED: '请选择内容',
  // THE_DATASETS_NAME_HAS_BEEN_TAKEN: '该名称已被占用，请重新填写',
  HEADERS_XFS_AUTH_REQUIRED: 'http header缺少xfs auth信息',
  // THE_DATA_ENTITY_NAME_HAS_BEEN_TAKEN: '该名称已被占用，请重新填写',
  UNKNOWN_DATASETS_TYPE: '未知的数据集类型',
  INVALID_ACCOUNT: '该账户无效',
  // INVALID_CREDENTIAL: '密码错误',
  THE_USER_DOSE_NOT_JOIN_ANY_ORGANIZATION: '用户未加入机构',
  INVALID_API_KEY: 'API KEY无效',
  HEADERS_AUTHORIZATION_REQUIRED: 'http header缺少授权信息',
  INVALID_BAUTH_TOKEN: '账号不存在',
  INVALID_NOTIFICATION_ID: '该通知无效',
  ENTITY_TYPE_REQUIRED: '缺少实体类型',
  // INVALID_OLD_PASSWORD: '旧密码不正确',
  // THE_PASSWORD_IS_INCONSISTENT: '两次输入的密码不一致',
  UNKNOWN_TYPE_CODE: '未知类型',
  UNKNOWN_VISIBILITY_CODE: '未知的公开性属性',
  INVALID_XFS_OBJECT_ID: '文件ID无效',
  NO_FILES_TO_ADD: '未上传文件',
  THE_FILE_HAS_BEEN_ADDED: '该文件已上传',
  UNKNOWN_FILE_TYPE: '未知的文件系统类型',
  INVALID_DATASETS: '该数据集无效',
  // THE_MEMBER_DOSE_NOT_BELONG_TO_THE_ORGANIZATION: '该成员不属于此机构',
  DATASET_AUTHORIZE_HAS_BEEN_REQUEST: '该数据集已发出授权申请',
  INVALID_AUTHORIZE_ID: '该授权申请无效',
  NOT_AUTHORIZED: '无权访问',
  NO_SUCH_DIRECTORY: '该目录不存在',
  AVATAR_NOT_FOUND: '头像未找到',
  INVALID_UUID: '该头像ID无效',
  AVATAR_SIZE_SHOULD_NOT_BE_GREATER_THAN_61440_BYTES: '上传的头像大小不能超过60K',
  INVALID_DATASET_ACCESS_TOKEN: '该数据集访问token无效',
  DATASET_ACCESS_TOKEN_NOT_FOUND: '该数据集访问token不存在',
  UNKNOWN_ENTITY_TYPE: '未知的通知实体类型',
  DATASETS_HAS_BEEN_PUBLISHED: '数据集已发布，无法修改',

  DIRECTORY_EXISTS: '文件夹已存在',
  FOLD_NAME_FORMAT_ERROR: '目录名称格式错误:特殊符号仅允许"_"、"-"',
  INVALID_FILE_ID: '文件数据异常',
};

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  response.json().then((responseObj) => {
    if (responseObj.errorCode === 'BAUTH_TOKEN_MISSING') {
      window.g_app._store.dispatch({
        type: 'login/logout',
      });
      return responseObj;
    }
    let errortext = errorMessage[responseObj.errorCode] || responseObj.errorMessage;

    message.error(errortext);
    return responseObj;
  });
  // const errortext = codeMessage[response.status] || response.statusText;
  // notification.error({
  //   message: `请求错误 ${response.status}: ${response.url}`,
  //   description: errortext,
  // });
  // const error = new Error(errortext);
  // error.name = response.status;
  // error.response = response;
  // throw error;
};

function setBauthToken(response){
  let token = response.headers.get('x-bb-set-bauthtoken');
  if (token) {
    let domain = getDomain();
    cookies.setItem(config.csrfTokenName, token, '', '/', domain);
  }
  return response;
}

function addBauthToken(dic, tokenName) {
  let token = cookies.getItem(tokenName);
  if (token) {
    dic[config.bauthTokenName] = `Bearer ${token}`;
  }
}

const cachedSave = (response, hashcode) => {
  /**
   * Clone a response data and store it in sessionStorage
   * Does not support data other than json, Cache only json
   */
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.match(/application\/json/i)) {
    // All data is saved as text
    response
      .clone()
      .text()
      .then(content => {
        sessionStorage.setItem(hashcode, content);
        sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
      });
  }
  return response;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(
  url,
  options = {
    expirys: isAntdPro(),
  }
) {
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
  const hashcode = hash
    .sha256()
    .update(fingerprint)
    .digest('hex');

  const defaultOptions = {
    // credentials: 'include',
    credentials: 'omit',
    headers:{
      'Access-Control-Allow-Credentials': true,
      // 'Access-Control-Allow-Headers': 'cache-control,content-type,hash-referer,x-requested-with',
      'Access-Control-Allow-Origin': '*',
    },
  };
  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        ...newOptions.headers,
      };
    }
  }

  const expirys = options.expirys || 60;
  // options.expirys !== false, return the cache,
  if (options.expirys !== false) {
    const cached = sessionStorage.getItem(hashcode);
    const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
    if (cached !== null && whenCached !== null) {
      const age = (Date.now() - whenCached) / 1000;
      if (age < expirys) {
        const response = new Response(new Blob([cached]));
        return response.json();
      }
      sessionStorage.removeItem(hashcode);
      sessionStorage.removeItem(`${hashcode}:timestamp`);
    }
  }
  addBauthToken(newOptions.headers, config.csrfTokenName);
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(setBauthToken)
    .then(response => cachedSave(response, hashcode))
    .then(response => {
      // DELETE and 204 do not return data by default
      // using .json will report an error.
      // if (newOptions.method === 'DELETE' || response.status === 204) {
      if (response.status === 204) {
          return response.text();
      }
      return response.json();
    })
    .catch(e => {
      const status = e.name;
      if (status === 401) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        window.g_app._store.dispatch({
          type: 'login/logout',
        });
        return;
      }
      // environment should not be used
      if (status === 403) {
        router.push('/exception/403');
        return;
      }
      if (status <= 504 && status >= 500) {
        router.push('/exception/500');
        return;
      }
      if (status >= 404 && status < 422) {
        router.push('/exception/404');
      }
    });
}
