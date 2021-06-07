import Vue from 'vue'
import Router from 'vue-router'
//import Hello from '@/components/HelloWorld'
import Login from '@/components/Login'
import GoogleCallback from '@/components/GoogleCallback'
import NewUser from '@/components/NewUser'
//import Foo from "@/components/Foo"
//import Home from "@/components/Home"
import HomeCustom from "@/components/HomeCustom"
import HomeWorking from "@/components/HomeWorking"
import HomeWorking2 from "@/components/HomeWorking2"
import CallComponent from "@/components/CallComponent"

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Login',
            component: Login
        },
        {
            path: '/googlecallback',
            name: 'GoogleCallback',
            component: GoogleCallback
        },
        {
            path: '/new-user/:id',
            name: 'NewUser',
            component: NewUser
        },
        {
            path: '/home-custom',
            name: 'HomeCustom',
            component: HomeCustom
        },
        {
            path: '/home-working',
            name: 'HomeWorking',
            component: HomeWorking
        },
        {
            path: '/home-working-2',
            name: 'HomeWorking2',
            component: HomeWorking2
        },
        {
            path: '/webrtc',
            name: 'CallComponent',
            component: CallComponent
        }
    ]
})