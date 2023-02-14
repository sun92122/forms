import { createRouter, createWebHistory } from "vue-router";
import SonG from "../views/SonG.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/HomePage.vue"),
    meta: { title: "A web form made by magical" },
  },
  {
    path: "/SonG",
    name: "SonG",
    component: SonG,
    meta: { title: "雅歌G小組成員資料" },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () =>
    //   import(/* webpackChunkName: "about" */ "../views/SonG.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title;
  next();
});

export default router;
