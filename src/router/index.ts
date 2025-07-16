import { createRouter, createWebHistory } from "vue-router";

const Home = () => import("@/pages/Home.vue");
const Draw = () => import('@/pages/Draw.vue');

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/draw", name: "Draw", component: Draw },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
