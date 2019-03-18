import Vue from 'vue'
import Router from 'vue-router'
import routes from './backRouter'
Vue.use(Router)

const router =new Router({
    routes,
    mode:'history'
})
router.beforeEach((to,from,next)=>{
    if(sessionStorage.getItem('uid')){
        next()
    }else{
        if(to.meta.secret){
            next('/login')
        }else{
            next()
        }
    }
})
export default router