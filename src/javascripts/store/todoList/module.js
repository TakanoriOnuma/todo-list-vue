import * as ACTIONS from './actions';
import * as MUTATIONS from './mutations';

import request from 'superagent';
const API_ROOT =
  'https://script.google.com/a/team-lab.com/macros/s/AKfycbweY12xo6EZnMzdmd2JOhPNHnFFTWmxmtWfy9fQOBtYhHDACtJU/exec';

export default {
  state: {
    todoList: []
  },
  mutations: {
    // todoリストの更新
    [MUTATIONS.MUTATION_UPDATE_TODO_LIST](state, todoList) {
      state.todoList = todoList;
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
          commit(MUTATIONS.MUTATION_UPDATE_TODO_LIST, todoList);
        });
    }
  }
};
