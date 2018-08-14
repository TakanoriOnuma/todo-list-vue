import '../css/style.scss';

import Vue from 'vue';
import App from './App.vue';
import store from './store/store';

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<app/>'
});

console.log('hello world!');
