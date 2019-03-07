<template>
  <input
    class="input--text"
    v-model="text"
    :placeholder="placeholder"
    @input="callback"
  />
</template>

<script>
export default {
  props: {
    placeholder: String,
    cached: String,
    callback: Function
  },

  data() {
    return {
      text: this.cached
    };
  }
};
</script>

<style lang="scss" scoped>
.input--text {
  background: #3d3d3d;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 120px;

  font-size: 16px;
  letter-spacing: 0.15em;
  color: #c8c8c8;

  border: 0;
  height: 48px;
  width: 100%;

  padding-left: 18px;

  &:focus {
    outline: none;
  }
}
</style>
