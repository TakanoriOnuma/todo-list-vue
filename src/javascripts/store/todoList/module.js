import * as ACTIONS from './actions';
import * as MUTATIONS from './mutations';

import { API_ROOT, GET, API_STATUS_EMPTY, API_STATUS_SUCCESS } from '../../constants/API';
import { createAPIAction } from '../../utils/API';

export default {
  state: {
    // todoリスト
    todoList: {
      isInitialLoaded: false,
      status: API_STATUS_EMPTY,
      meta: {},
      payload: []
    }
  },
  mutations: {
    // todoリストの更新
    [MUTATIONS.MUTATION_UPDATE_TODO_LIST](state, { status = null, meta = null, response }) {
      const newTodoList = { ...state.todoList };
      if (status) newTodoList.status = status;
      if (meta) newTodoList.meta = meta;
      if (status === API_STATUS_SUCCESS) {
        const todoList = JSON.parse(response.text).map((data) => ({
          ...data,
          created: new Date(data.created),
          deadline: new Date(data.deadline)
        }));
        newTodoList.isInitialLoaded = true;
        newTodoList.payload = todoList;
      }
      state.todoList = newTodoList;
    }
  },
  actions: {
    // todoリストの取得
    [ACTIONS.ACTION_FETCH_TODO_LIST]({ commit }) {
      return createAPIAction({
        method: GET,
        endpoint: API_ROOT,
        query: {
          userId: 'hoge'
        },
        updateMutationName: MUTATIONS.MUTATION_UPDATE_TODO_LIST
      })(commit);
    }
  }
};
