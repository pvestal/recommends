import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import SubmissionsView from '@/views/SubmissionsView.vue'
import EditSubmission from '@/views/EditSubmission.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/submissions',
      name: 'submissions',
      component: SubmissionsView
    },
    {
      path: '/editSubmission/:id',
      name: 'EditSubmission',
      component: EditSubmission,
      props: true // This allows you to pass the route param as a prop to the component
    }
  ]
})

export default router
