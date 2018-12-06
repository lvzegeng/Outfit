import request from '@utils/request';

export function getClassifications() {
  return request('/collocation/classifications');
}

export function getClassificationsList(body) {
  return request('/collocation/lists',{
    body: JSON.stringify(body)
  });
}

export function getClassificationsItem(body) {
  return request('/collocation/items',{
    body: JSON.stringify(body)
  });
}
