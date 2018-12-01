import fetch from 'dva/fetch';
import { message } from 'antd';

function deal(url, options = {}) {
  // get 方法可以跟 post 一样通过 body 传入参数
  const { method, body } = options;
  if ((!method || method.toLowerCase() === 'get') && body && typeof body === 'string') {
    const params = JSON.parse(body);
    const paramsArray = Object.keys(params).map(key => key + '=' + params[key]);
    if (url.includes('?')) {
      url += '&' + paramsArray.join('&');
    } else {
      url += '?' + paramsArray.join('&');
    }
    delete options.body;
  }
  // 访问 ../bigdata 添加 token
  if (url.startsWith('../bigdata')) {
    if (url.includes('?')) {
      url += '&token=isDev@2018';
    } else {
      url += '?token=isDev@2018';
    }
  }
  return [url, options];
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  message.error('网络异常');
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function parseJSON(response) {
  return response.json();
}

// 统一错误处理
function parseErrorMessage(data) {
  if ('success' in data && !data.success) {
    message.error('请求出现错误');
  }
  return data;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  return fetch(...deal(url, options))
    .then(checkStatus)
    .then(parseJSON)
    .then(parseErrorMessage)
    .then(data => ({ data }))
    .catch(err => ({ err }));
}
