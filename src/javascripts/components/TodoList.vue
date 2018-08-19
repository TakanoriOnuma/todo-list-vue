<template lang="pug">
.todo-list
  h1.title todolist
  p.user-id userId: {{ userId }}
  template(v-if="!todoList.isInitialLoaded")
    p loading...
  template(v-else)
    transition-group(tag="ul", name="flip-list", class="list")
      template(v-for="todo in todoList.payload")
        li.item(:key="todo.id")
          .todo(:class="{ 'todo--done': todo.isDone }")
            .todo__line
              button.todo__status(
                type="button",
                @click="$emit('statusChange', todo.id)"
              )
                | {{ todo.isDone ? 'DONE' : 'PROGRESS' }}
              .todo__deadline 締切：{{ todo.deadline | formatDate }}
              .todo__delete(
                @click="$emit('delete', todo.id)"
              )
            .todo__text {{ todo.text }}
</template>

<script>
export default {
  filters: {
    /**
     * 日付を整形する
     * @param {Date} date - 日付
     */
    formatDate(date) {
      const year = date.getFullYear();
      const month = ('00' + (date.getMonth() + 1)).slice(-2);
      const day = ('00' + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    }
  },
  props: {
    userId: {
      type: String,
      default: ''
    },
    todoList: {
      type: Object,
      default: function() {
        return {
          status: '',
          meta: {},
          payload: []
        };
      }
    }
  },
  methods: {
  }
};
</script>

<style lang="scss" scoped>
.flip-list-move {
  transition: transform 0.5s;
}
.flip-list-leave-active {
  position: absolute;
}

.todo-list {
  margin-top: 15px;
  padding: 10px;
  border-radius: 5px;
  border: solid 1px #ccc;
}

.title {
  text-align: center;
  font-size: 20px;
}

.user-id {
  text-align: center;
}

.list {
  margin-top: 20px;
}

.item {
  & + & {
    margin-top: 10px;
  }
}

.todo {
  $root: &;
  border: solid 1px #ccc;
  padding: 10px;
  background-color: #fff;

  &__line {
    display: flex;
    line-height: 25px;
    justify-content: space-between;
  }

  &__status {
    padding: 5px;
    line-height: 1;
    border-radius: 5px;
    background-color: #ccf;
    border: solid 1px #aaf;
    flex: 0 0 auto;

    #{$root}--done & {
      background-color: #eee;
      border-color: #ccc;
    }
  }

  &__deadline {
    flex: 1 1 auto;
    padding-right: 10px;
    text-align: right;
  }

  &__delete {
    position: relative;
    width: 25px;
    flex: 0 0 auto;
    &::before, &::after {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 70%;
      height: 2px;
      background-color: #ccc;
      content: ''
    }
    &::before {
      transform: translate3d(-50%, -50%, 0) rotate(45deg);
    }
    &::after {
      transform: translate3d(-50%, -50%, 0) rotate(135deg);
    }
  }

  &__text {
    margin-top: 5px;
  }
}
</style>
