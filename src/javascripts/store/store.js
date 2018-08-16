import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

import todoList from './todoList/module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    todoList
  },
  plugins: process.env.NODE_ENV !== 'production' ? [
    createLogger({
      collapsed: false
    })
  ] : []
});
