import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VeeValidate from 'vee-validate'
import VueCookie from 'vue-cookie'

Vue.use(VeeValidate)
/* eslint-disable no-new */
Vue.use(VueRouter)
Vue.use(VueCookie)
Vue.use(VueResource)
Vue.http.options.emulateJSON = true
const routes = [
  { path: '/login', component: require('./modules/Login') },
  { path: '/index', component: require('./modules/Index')},
  { path: '/my_note', component: require('./modules/MyNote')},
  { path: '/new_note', component: require('./modules/NewNote')},
  { path: '/note_panel', name: 'note_panel', component: require('./modules/NotePanel')},
  { path: '/note_wall', component: require('./modules/NoteWall')},
  { path: '/personal_note', name: 'personal_note', component: require('./modules/PersonalNote')},
  { path: '/note_edit', name: 'note_edit', component: require('./modules/NoteEdit')},
  { path: '/my_comment', component: require('./modules/MyComment')},
  { path: '/my_collect', component: require('./modules/MyCollect')}
]
const router = new VueRouter({
  mode: 'history',
  routes: routes
})
new Vue({
  el: '#app',
  data: {
    eventHub: new Vue()
  },
  // template: '<App/>',
  components: { App },
  router: router
})
