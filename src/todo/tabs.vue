<template>
  <div class="helper">
    <span class="left">{{uncompletedItems}} items left</span>
    <span class="tabs">
      <span
        v-for="state of states"
        :key="state"
        :class="[filter===state?'active':'']"
        @click="toggleFilter(state)"
      >{{state}}</span>
    </span>
    <span class="clear" @click="clearAllCompleted">clear Completed</span>
  </div>
</template>

<script>
export default {
  props: {
    filter: {
      type: String,
      required: true
    },
    todos: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      states: ["all", "active", "complete"]
    };
  },
  computed: {
    uncompletedItems() {
      return this.todos.filter(item => !item.completed).length;
    }
  },
  methods: {
    toggleFilter(state) {
      this.$emit("click", state);
    },
    clearAllCompleted() {
      this.$emit("clearCompleted");
    }
  }
};
</script>

<style lang="less" scoped>
.helper {
  font-weight: 100;
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  line-height: 23px;
  background-color: #ffffff;
  font-size: 14px;
  font-smoothing: antialiased;
}
.left,
.clear,
.tabs {
  padding: 0 10px;
  box-sizing: border-box;
}
.left,
.clear {
  width: 150px;
}
.left {
  text-align: left;
}
.clear {
  text-align: right;
  cursor: pointer;
}
.tabs {
  width: 200px;
  display: flex;
  justify-content: space-around;
  * {
    display: inline-block;
    padding: 0 5px;
    cursor: pointer;
    border: 1px solid rgba(175, 47, 47, 0);
    &.active {
      border-color: rgba(100, 100, 100, 0.3);
      border-radius: 7px;
    }
  }
}
</style>
