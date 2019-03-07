<template>
  <div class="terminal mb-3" ref="terminal">
    <div
      class="line"
      v-for="(line, index) in linesAnsiFormatted"
      :key="`line-${index}`"
      v-html="line"
    ></div>
  </div>
</template>

<script>
import Anser from "anser";
import Vue from "vue";

export default {
  props: {
    lines: Array
  },

  mounted() {
    const terminal = this.$refs.terminal;

    Vue.nextTick(() => {
      terminal.scrollTop = terminal.scrollHeight;
    });
  },

  computed: {
    linesAnsiFormatted() {
      return this.lines.map(line => {
        return Anser.ansiToHtml(line);
      });
    }
  },

  watch: {
    lines() {
      const terminal = this.$refs.terminal;

      Vue.nextTick(() => {
        terminal.scrollTop = terminal.scrollHeight;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/bootstrap/bootstrap.scss";

.terminal {
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  background: #0a0a0a;

  font-size: 16px;
  letter-spacing: 0.15em;
  text-transform: uppercase;

  color: #c8c8c8;

  margin-bottom: 0;
  padding: 10px;

  border: 0;

  width: 100%;
  height: 400px;

  overflow: hidden;
  white-space: nowrap;

  @include media-breakpoint-down(sm) {
    overflow: auto;
  }

  &:focus {
    outline: 0;
  }

  .line {
    text-align: left;
    font-family: Roboto Mono;
    font-style: normal;
    font-weight: normal;
    line-height: normal;
    font-size: 16px;
    height: 20px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }
}
</style>
