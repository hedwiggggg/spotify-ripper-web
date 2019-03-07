<template>
  <div id="app">
    <div class="container">
      <div class="row mt-5 mb-5">
        <div class="col-12 col-md-6 col-lg-8">
          <div class="logo">
            <img alt="Vue logo" src="@/assets/images/logo.svg" />
          </div>
        </div>

        <div class="col-6 col-md-3 col-lg-2 d-flex align-items-center">
          <Button
            class="small"
            :class="getActiveClass('ripper')"
            :callback="() => navigate('ripper')"
          >
            RIPPER
          </Button>
        </div>

        <div class="col-6 col-md-3 col-lg-2 d-flex align-items-center">
          <Button
            class="small"
            :class="getActiveClass('music')"
            :callback="() => navigate('music')"
          >
            MUSIC
          </Button>
        </div>
      </div>

      <hr class="divider-hr" />
    </div>

    <div class="screen-container">
      <transition name="fade">
        <router-view class="screen" />
      </transition>
    </div>
  </div>
</template>

<script>
import Button from "@/components/Button.vue";

export default {
  components: {
    Button
  },

  computed: {
    currentRoute() {
      return this.$store.state.currentRoute;
    }
  },

  methods: {
    navigate(routeName) {
      this.$router.push({ name: routeName });
    },

    getActiveClass(routeName) {
      return routeName === this.currentRoute
        ? "route-active"
        : "route-inactive";
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/bootstrap/bootstrap.scss";

body,
html {
  padding: 0;
  margin: 0;

  font-family: "Roboto Mono", monospace;

  background-color: #222326;
  color: #c8c8c8;
}

.divider-hr {
  height: 0;
  border: 1px solid #c8c8c8;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;

  .logo {
    display: flex;
    align-items: center;
    justify-content: left;

    margin-right: 25px;

    @include media-breakpoint-down(sm) {
      justify-content: center;
      margin-bottom: 1rem;
      margin-right: 0;
    }

    img {
      width: 100%;
      max-width: 330px;
    }
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #fff;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }

  .screen-container {
    position: relative;

    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;

    .screen {
      position: absolute;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(-50px);
}
</style>
