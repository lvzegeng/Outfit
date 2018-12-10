import request from '@utils/request';

export function getClassifications() {
  return request('https://xcx.nanyibang.com/collocation/classifications');
}

export function getClassificationsList(body) {
  return request('https://xcx.nanyibang.com/collocation/lists', {
    body: JSON.stringify(body),
  });
}

export function getClassificationsItem(body) {
  return request('https://xcx.nanyibang.com/collocation/items', {
    body: JSON.stringify(body),
  });
}
