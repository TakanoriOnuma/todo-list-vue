<template lang="pug">
form(@submit="onSubmit")
  p.title create todo
  .input-item
    input(type="text", v-model="todoText", placeholder="todo")
  .input-item
    label(for="date") 締切：
    input(type="date", v-model="deadline", id="date")
  .input-item
    button(type="submit", :disabled="!canSubmittion") {{ buttonText }}
  p {{ apiStatus }}
</template>

<script>
import { API_STATUS_REQUESTING, API_STATUS_SUCCESS } from '../constants/API';

export default {
  props: {
    apiStatus: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      todoText: '',
      deadline: ''
    };
  },
  computed: {
    canSubmittion() {
      return this.apiStatus !== API_STATUS_REQUESTING && this.todoText !== '' && this.deadline !== '';
    },
    buttonText() {
      return this.apiStatus === API_STATUS_REQUESTING ? '登録中' : '登録';
    }
  },
  watch: {
    apiStatus(newData) {
      // APIに成功したらデータをリセットする
      if (newData === API_STATUS_SUCCESS) {
        this.todoText = '';
        this.deadline = '';
      }
    }
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      console.log(this.todoText, this.deadline);
      this.$emit('submitTodo', {
        text: this.todoText,
        deadline: new Date(`${this.deadline} 0:00:00`)
      });
    }
  }
};
</script>

<style lang="scss" scoped>
form {
  padding: 10px;
  border-radius: 5px;
  border: solid 1px #ccc;
}
.input-item {
  & + & {
    margin-top: 10px;
  }
}
</style>
