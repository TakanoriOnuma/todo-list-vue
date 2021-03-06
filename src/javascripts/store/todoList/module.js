import * as ACTIONS from './actions';
import * as MUTATIONS from './mutations';
import uuid from 'uuid';

import { API_ROOT, GET, POST, API_STATUS_EMPTY, API_STATUS_SUCCESS } from '../../constants/API';
import { createAPIAction } from '../../utils/API';

const USER_ID = localStorage.getItem('userId') || uuid();
localStorage.setItem('userId', USER_ID);

export default {
  state: {
    // ユーザID
    userId: USER_ID,
    // todoリスト
    todoList: {
      isInitialLoaded: false,
      status: API_STATUS_EMPTY,
      meta: {},
      payload: []
    },
    // todo登録のステータス
    addTodoStatus: API_STATUS_EMPTY,
    // todo更新ステータス
    updateTodoStatus: {},
    // todo削除ステータス
    deleteTodoStatus: {}
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
    },
    // todoの登録結果の更新
    [MUTATIONS.MUTATION_UPDATE_ADD_TODO_STATUS](state, { status = null }) {
      state.addTodoStatus = status;
    },
    // todo情報の変更リクエストのステータスの更新
    [MUTATIONS.MUTATION_UPDATE_UPDATE_TODO_STATUS](state, { status, actionParams }) {
      state.updateTodoStatus = {
        ...state.updateTodoStatus,
        [actionParams.todoId]: status
      };
    },
    // todo削除リクエストのステータスの更新
    [MUTATIONS.MUTATION_UPDATE_DELETE_TODO_STATUS](state, { status, actionParams }) {
      state.deleteTodoStatus = {
        ...state.deleteTodoStatus,
        [actionParams.todoId]: status
      };
    }
  },
  actions: {
    // todoリストの取得
    [ACTIONS.ACTION_FETCH_TODO_LIST]({ commit }) {
      return createAPIAction({
        method: GET,
        endpoint: API_ROOT,
        query: {
          userId: USER_ID
        },
        updateMutationName: MUTATIONS.MUTATION_UPDATE_TODO_LIST
      })(commit);
    },
    // todoの追加
    [ACTIONS.ACTION_REQUEST_ADD_TODO]({ commit }, payload) {
      return createAPIAction({
        method: POST,
        endpoint: API_ROOT,
        query: {
          method: 'addTodo',
          userId: USER_ID,
          // JSONで送れないため、stringifyする
          params: JSON.stringify({
            text: payload.text,
            deadline: payload.deadline.toString()
          })
        },
        updateMutationName: MUTATIONS.MUTATION_UPDATE_ADD_TODO_STATUS
      })(commit);
    },
    // todoの更新
    [ACTIONS.ACTION_REQUEST_UPDATE_TODO]({ commit }, payload) {
      const todoId = payload.todoId;
      return createAPIAction({
        method: POST,
        endpoint: API_ROOT,
        query: {
          method: 'updateTodo',
          todoId,
          params: JSON.stringify(payload.params)
        },
        actionParams: {
          todoId
        },
        updateMutationName: MUTATIONS.MUTATION_UPDATE_UPDATE_TODO_STATUS
      })(commit);
    },
    // todoの削除
    [ACTIONS.ACTION_REQUEST_DELETE_TODO]({ commit }, todoId) {
      return createAPIAction({
        method: POST,
        endpoint: API_ROOT,
        query: {
          method: 'deleteTodo',
          todoId
        },
        actionParams: {
          todoId
        },
        updateMutationName: MUTATIONS.MUTATION_UPDATE_DELETE_TODO_STATUS
      })(commit);
    }
  }
};
