<template>
  <div class="progress-wrapper">
    <div class="title pl-2 mb-2">{{ title }}</div>
    <div class="progress-bar-wrapper">
      <div
        class="progress-bar"
        :style="`transform: translateX(-${100 - progress}%)`"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    progress: Number
  }
};
</script>

<style lang="scss" scoped>
.progress-wrapper {
  width: 100%;

  .title {
    font-size: 12px;
    letter-spacing: 0.15em;
    text-transform: uppercase;

    color: #c8c8c8;
    text-align: left;
  }

  .progress-bar-wrapper {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 20px;
    background: #222326;

    height: 18px;
    border: 6px solid #3d3d3d;

    overflow: hidden;

    .progress-bar {
      height: 6px;
      width: 100%;
      background: #1db954;
      border-radius: 120px;
    }
  }
}
</style>
