import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CircularView from "@/views/CircularView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/circle",
      name: "Circular Spectrogram",
      component: CircularView,
    },
  ],
});

export default router;
