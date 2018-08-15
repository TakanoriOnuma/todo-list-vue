import * as ACTIONS from './actions';
import * as MUTATIONS from './mutations';

import request from 'superagent';
const API_ROOT =
  'https://script.google.com/a/team-lab.com/macros/s/AKfycbweY12xo6EZnMzdmd2JOhPNHnFFTWmxmtWfy9fQOBtYhHDACtJU/exec';

export const API_STATUS_EMPTY = 'API_STATUS_EMPTY';
export const API_STATUS_REQUESTING = 'API_STATUS_REQUESTING';
export const API_STATUS_SUCCESS = 'API_STATUS_SUCCESS';
export const API_STATUS_ERROR = 'API_STATUS_ERROR';

export default {
  state: {
    // todoリスト
    todoList: {
      status: '',
      meta: {},
      payload: []
    }
  },
  mutations: {
    // todoリストの更新
    [MUTATIONS.MUTATION_UPDATE_TODO_LIST](state, { status = null, meta = null, payload = null }) {
      const newTodoList = { ...state.todoList };
      if (status) newTodoList.status = status;
      if (meta) newTodoList.meta = meta;
      if (payload) newTodoList.payload = payload;
      state.todoList = newTodoList;
    }
  },
  actions: {
    // todoリストの取得
    [ACTIONS.ACTION_FETCH_TODO_LIST]({ commit }) {
      request
        .get(API_ROOT)
        .query({
          userId: 'hoge'
        })
        .end((err, res) => {
          if (err) {
            console.error(err);
            return;
          }
          const todoList = JSON.parse(res.text).map((data) => ({
            ...data,
            created: new Date(data.created),
            deadline: new Date(data.deadline)
          }));
          console.log(todoList);
          commit(MUTATIONS.MUTATION_UPDATE_TODO_LIST, {
            status: '',
            meta: {},
            payload: todoList
          });
        });
    }
  }
};
