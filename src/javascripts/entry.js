import '../css/style.scss';

import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  components: { App },
  template: '<app/>'
});

console.log('hello world!');