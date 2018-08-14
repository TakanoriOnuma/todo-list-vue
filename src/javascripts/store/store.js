import Vue from 'vue';
import Vuex from 'vuex';

import todoList from './todoList/module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    todoList
  }
});
