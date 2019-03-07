import Vue from "vue";
import Router from "vue-router";

import Ripper from "./views/Ripper.vue";
import Music from "./views/Music.vue";
import Download from "./views/Download.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "ripper",
      component: Ripper
    },
    {
      path: "/music",
      name: "music",
      component: Music
    },
    {
      path: "/download",
      name: "download",
      component: Download
    }
  ]
});
