// eslint-disable-next-line no-unused-vars
import state from "./state";

const getters = {

    layout: state => {
        return state.layout
    },

    getUserData: state => {
        return state.AppActiveUser
    },

    getViewportHeight: state => {
        return state.viewportheight
    },
    getViewportWidth: state => {
        return state.viewportwidth
    },

    getTrashX: state => {
        return state.trash_x
    },
    getTrashY: state => {
        return state.trash_y
    },
    getMailOpened: state => {
        return state.mailOpened
    },
    getMargin: state => {
        return state.MARGIN
    },
    getPolaroidClass: state => {
        return state.polaroid_class
    },
    getPolaroids: state => {
        return state.polaroids
    },
    getButtonwidth: state => {
        return state.buttonwidth
    }

}

export default getters