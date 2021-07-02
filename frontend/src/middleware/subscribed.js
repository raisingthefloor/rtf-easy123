import store from "../store/store";
import router from "../router/index";

export default function subscribed({ next, to }) {
//export default function subscribed({ next }) {
    store.commit('INITIALISE_STORE')
    if(store.state.AppActiveUser.role == "subscribed")
    {
        return next();
    }
    else if (store.state.AppActiveUser.role == "admin")
    {
        store.commit('SET_LAYOUT', 'admin-layout')
        router.push('/admin')
    }
    else
    {
        console.log("here", to, store.state.AppActiveUser)
        router.push('/')
    }

}