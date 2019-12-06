import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Notas from '../views/Notas.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/notas',
    name: 'notas',
    component: Notas
  }
]

const router = new VueRouter({
  routes
})

export default router
