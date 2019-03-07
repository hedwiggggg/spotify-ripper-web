import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import VueNativeSock from "vue-native-websocket";
import Vuex from "vuex";

import axios from "axios";
import VueAxios from "vue-axios";

Vue.use(VueAxios, axios);
Vue.use(VueNativeSock, `ws://${window.location.hostname}:81`);
Vue.use(Vuex);

Vue.config.productionTip = false;

const store = new Vuex.Store({
  state: {
    currentRoute: "",

    container: {
      state: "STOPPED",
      downloadFolder: undefined,
      downloadFolderSelected: undefined
    },

    inputs: {
      username: "",
      password: "",
      uris: ""
    },

    progresses: {
      track: {
        percent: 0,
        timeLeft: 0
      },

      total: {
        percent: 0,
        timeLeft: 0
      }
    },

    terminal: {
      lines: [">>> fill in your data & press on `START` <<<"],
      suffixLines: []
    }
  },

  mutations: {
    changeRoute(state, route) {
      state.currentRoute = route;
    },

    changeContainer(state, payload) {
      state.container[payload.key] = payload.value;
    },

    changeInputs(state, payload) {
      state.inputs[payload.key] = payload.value;
    },

    changeProgress(state, payload) {
      state.progresses[payload.type][payload.key] = payload.value;
    },

    addTerminalLines(state, lines) {
      state.terminal.lines.push(...lines);
    },

    sliceTerminalLines(state, payload) {
      state.terminal.lines = state.terminal.lines.slice(
        payload.begin,
        payload.end
      );
    },

    changeTerminalSuffixLine(state, payload) {
      state.terminal.suffixLines[payload.index] = payload.value;
    }
  }
});

router.beforeEach((to, from, next) => {
  if (from.name === null && to.name !== "ripper") {
    return next({ name: "ripper" });
  }

  return next();
});

router.afterEach(to => {
  store.commit("changeRoute", to.name);
});

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
