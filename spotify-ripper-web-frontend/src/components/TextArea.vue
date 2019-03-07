<template>
  <textarea
    ref="textArea"
    class="input--textarea"
    v-model="text"
    :style="`height: ${height}px`"
    @input="onInput"
    @click="onClick"
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
      text: this.cached || this.placeholder,
      height: this.getAreaHeight(this.cached || this.placeholder)
    };
  },

  methods: {
    onInput(event) {
      this.height = this.getAreaHeight(this.text);
      this.callback(event);
    },

    onClick() {
      if (this.text === this.placeholder) {
        this.text = "";
        this.height = this.getAreaHeight(this.text);
      }
    },

    getAreaHeight(text) {
      return text.split(/\r*\n/).length * 24 + 30;
    }
  }
};
</script>

<style lang="scss" scoped>
.input--textarea {
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  background: #3d3d3d;

  font-size: 16px;
  letter-spacing: 0.15em;

  color: #c8c8c8;

  margin-bottom: 0;
  padding: 15px;

  border: 0;
  width: 100%;

  overflow-y: hidden;
  overflow-x: auto;

  white-space: nowrap;

  &:focus {
    outline: 0;
  }
}
</style>
