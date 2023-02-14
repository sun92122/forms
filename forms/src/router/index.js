import { createRouter, createWebHistory } from "vue-router";
import SonG from "../views/SonG.vue";

const routes = [
  {
    path: "/",
    name: "SonG",
    component: SonG,
  },
  {
    path: "/SonG",
    name: "SonG",
    component: SonG,
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

export default router;
