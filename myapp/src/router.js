import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/Login'
import Home from '@/views/Home'
import Signup from '@/views/Signup'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
       
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home,
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup,
    },
    
  ],
   mode:'history'
});
