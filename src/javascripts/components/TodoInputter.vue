<template lang="pug">
form(@submit="onSubmit")
  p.title create todo
  .input-item
    input(type="text", v-model="todoText", placeholder="todo")
  .input-item
    label(for="date") 締切：
    input(type="date", v-model="deadline", id="date")
  .input-item
    button(type="submit", :disabled="!canSubmittion") 登録
</template>

<script>
export default {
  data() {
    return {
      todoText: '',
      deadline: ''
    };
  },
  computed: {
    canSubmittion() {
      return this.todoText !== '' && this.deadline !== '';
    }
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      console.log(this.todoText, this.deadline);
      this.$emit('submitTodo', {
        text: this.todoText,
        deadline: new Date(this.deadline)
      });
      // データのリセット
      this.todoText = '';
      this.deadline = '';
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
