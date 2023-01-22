import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        title: '预约临时通道通行'
      }
    },
    {
      path: "/rslt",
      name: "rslt",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/RsltView.vue"),
      meta: {
        title: '预约结果'
      }
    },
    {
      path: "/us-backend",
      name: "us",
      component: () => import("../views/SettingView.vue"),
    },
  ],
});

export default router;
