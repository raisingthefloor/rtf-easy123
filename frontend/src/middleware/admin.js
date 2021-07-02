import store from '../store/store'
import router from '../router/index'

//export default function admin({ next, to }) {
export default function admin({ next }) {
    store.commit('INITIALISE_STORE')
    if(store.state.AppActiveUser.role == "admin")
    {
        return next();
    }
    else if (store.state.AppActiveUser.role == "subscribed")
    {
        store.commit('SET_LAYOUT', 'simple-layout')
        router.push('/home-working')
    }
    else {
        store.commit('SET_LAYOUT', 'simple-layout')
        router.push('/')
    }

    //console.log("from middleware", store.state.AppActiveUser)

    return next();
}