<template>
  <button class="input--button" type="text" @click="callback">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    callback: Function
  }
};
</script>

<style lang="scss" scoped>
.input--button {
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 120px;

  font-size: 16px;
  color: #ffffff;

  border: 0;
  height: 48px;
  width: 100%;

  cursor: pointer;

  &:focus {
    outline: 0;
  }

  &.small {
    height: 28px;
  }

  &.route-active {
    background: #4a4a4a;
    box-shadow: 0px 1px 0px #525252;
    transform: translateY(3px);
  }

  &.route-inactive {
    background: #868686;
    box-shadow: 0px 4px 0px #525252;
  }

  &.green {
    background: #1db954;

    &:hover {
      background: #2bde6a;
    }
  }

  &.red {
    background: #b91d1d;

    &:hover {
      background: #de2b2b;
    }
  }

  &.grey {
    background: #494949;

    &:hover {
      background: #303030;
    }
  }
}
</style>
