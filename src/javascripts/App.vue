<template lang="pug">
#app
  TodoInputter(
    :apiStatus="$store.state.todoList.addTodoStatus"
    @submitTodo="onSubmitTodo"
  )
  TodoList(
    :userId="$store.state.todoList.userId"
    :todoList="$store.state.todoList.todoList"
    @statusChange="onTodoStatusChange"
    @delete="onTodoDelete"
  )
</template>

<script>
import { find } from 'lodash';
import TodoInputter from './components/TodoInputter';
import TodoList from './components/TodoList';
import * as TODO_LIST_ACTIONS from './store/todoList/actions';

export default {
  components: {
    TodoInputter,
    TodoList
  },
  beforeCreate() {
    console.log('init');
    const promise = this.$store.dispatch(TODO_LIST_ACTIONS.ACTION_FETCH_TODO_LIST);
    promise
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
    window.setTimeout(() => {
      promise.cancel();
    }, 3000);
  },
  mounted() {
    console.log(this.$store.state);
  },
  methods: {
    /**
     * todoInputterからのコールバック
     * @param {{ text: string, deadline: Date}} todo - todo情報
     */
    onSubmitTodo(todo) {
      this.$store.dispatch(TODO_LIST_ACTIONS.ACTION_REQUEST_ADD_TODO, todo)
        .then(() => {
          this.$store.dispatch(TODO_LIST_ACTIONS.ACTION_FETCH_TODO_LIST);
        });
    },
    /**
     * todoStatusの切り替え
     * @param {string} todoId - todoId
     */
    onTodoStatusChange(todoId) {
      const todo = find(this.$store.state.todoList.todoList.payload, { id: todoId });
      console.log(todo);
      if (todo) {
        this.$store.dispatch(TODO_LIST_ACTIONS.ACTION_REQUEST_UPDATE_TODO, {
          todoId,
          params: {
            isDone: !todo.isDone
          }
        })
          .then(() => {
            this.$store.dispatch(TODO_LIST_ACTIONS.ACTION_FETCH_TODO_LIST);
          });
      }
    },
    /**
     * todoの削除
     * @param {string} todoId - todoId
     */
    onTodoDelete(todoId) {
      const todo = find(this.$store.state.todoList.todoList.payload, { id: todoId });
      if (todo) {
        this.$store.dispatch(TODO_LIST_ACTIONS.ACTION_REQUEST_DELETE_TODO, todoId)
          .then(() => {
            this.$store.dispatch(TODO_LIST_ACTIONS.ACTION_FETCH_TODO_LIST);
          });
      }
    }
  }
};
</script>

<style scoped lang="scss">
#app {
  margin: 10px;
}
</style>
