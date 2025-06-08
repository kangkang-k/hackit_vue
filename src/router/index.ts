import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from "@/views/LoginView.vue";
import UserProfile from "@/views/UserProfile.vue";
import PublishRewardView from "@/views/PublishRewardView.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Home',
        component: HomeView
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView,
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterView,
    },
    {
        path: '/profile/:username',
        name: 'Profile',
        component: UserProfile,
    },
    {
        path: '/publish',
        name: 'Publish',
        component: PublishRewardView,
    },
]

const router = new VueRouter({
    routes
})

export default router
