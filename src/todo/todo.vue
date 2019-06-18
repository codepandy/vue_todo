<template>
  <section class="real-app">
    <input
      type="text"
      class="add-input"
      autofocus="autofocus"
      placeholder="请输入接下来要做的事情"
      @keyup.enter="addTodo"
    >
    <item :todo="todo" v-for="todo of filteredTodos" :key="todo.id" @onDeleteItem="deleteItem"/>
    <Tabs :filter="filter" @click="clickTab" :todos="todos" @clearCompleted="clearCompleted"/>
  </section>
</template>


<script>
import Item from "./item.vue";
import Tabs from "./tabs.vue";
let id = 0;
export default {
  data() {
    return {
      todos: [],
      filter: "all"
    };
  },
  computed: {
    filteredTodos() {
      if (this.filter === "all") {
        return this.todos;
      }
      const isCompleted = this.filter === "complete";
      return this.todos.filter(item => item.completed === isCompleted);
    }
  },
  components: {
    Item,
    Tabs
  },
  methods: {
    addTodo(e) {
      this.todos.unshift({
        id: id++,
        content: e.target.value.trim(),
        completed: false
      });
      e.target.value = "";
    },
    clickTab(state) {
      this.filter = state;
    },
    deleteItem(id) {
      this.todos.splice(this.todos.findIndex(item => item.id === id), 1);
    },
    clearCompleted() {
      this.todos = this.todos.filter(item => !item.completed);
    }
  }
};
</script>

<style lang="less" scoped>
.real-app {
  width: 600px;
  margin: 0 auto;
  box-shadow: 0 0 5px #666;
}
.add-input {
  position: relative;
  margin: 0;
  width: 100%;
  font-size: 20px;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.4em;
  outline: none;
  color: inherit;
  box-sizing: border-box;
  font-smoothing: antialiased;
  padding: 16px 16px 16px 36px;
  border: none;
  box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
}
</style>
