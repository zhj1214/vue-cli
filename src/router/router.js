import Vue from 'vue'
import Router from 'vue-router'
import routers from './backRouter'
Vue.use(Router)

const router =new Router({
    routers,
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