<template lang="pug">
#app
  TodoInputter(
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
import uuid from 'uuid';
import { findIndex } from 'lodash';
import TodoInputter from './components/TodoInputter';
import TodoList from './components/TodoList';
import * as TODO_LIST_ACTIONS from './store/todoList/actions';

export default {
  components: {
    TodoInputter,
    TodoList
  },
  data() {
    const todoList = [
      {
        id: uuid(),
        isDone: true,
        text: 'todo',
        deadline: new Date()
      },
      {
        id: uuid(),
        isDone: false,
        text: 'todo2',
        deadline: new Date()
      }
    ];
    return {
      todoList
    };
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
      this.todoList = this.todoList.concat({
        ...todo,
        id: uuid(),
        isDone: false
      });
    },
    /**
     * todoStatusの切り替え
     * @param {string} todoId - todoId
     */
    onTodoStatusChange(todoId) {
      console.log(todoId);
      const index = findIndex(this.todoList, { id: todoId });
      this.$set(this.todoList, index, {
        ...this.todoList[index],
        isDone: !this.todoList[index].isDone
      });
    },
    /**
     * todoの削除
     * @param {string} todoId - todoId
     */
    onTodoDelete(todoId) {
      this.todoList = this.todoList.filter((todo) => todo.id !== todoId);
    }
  }
};
</script>

<style scoped lang="scss">
#app {
  margin: 10px;
}
</style>
