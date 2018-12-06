import * as services from '../services/collocation'

export default {
  namespace: 'collocation',
  state: {
    classifications:[],
    classificationsList: {},
    classificationsItem: [],
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *getClassifications({ payload }, { call, put, select }) {
      const {data} = yield call(services.getClassifications);
      if(data&&data.state){
        yield put({type:'save', payload:{
            classifications: data.data
          }})
      }
    },
    *getClassificationsList({ payload }, { call, put, select }) {
      const {data} = yield call(services.getClassificationsList, payload);
      if(data&&data.state){
        const {classificationsList} = yield select(state=>state.collocation);

        yield put({type:'save', payload:{
            classificationsList: {
              ...payload,
              ...data.data,
              data: payload.page===1? data.data.data: [...classificationsList.data, ...data.data.data]
            }
          }})
      }
    },
    *getClassificationsItem({ payload }, { call, put, select }) {
      const {data} = yield call(services.getClassificationsItem, payload);
      if(data&&data.state){
        yield put({type:'save', payload:{
            classificationsItem: data.data
          }})
      }
    },
  },
};
