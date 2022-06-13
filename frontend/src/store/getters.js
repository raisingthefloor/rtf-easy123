/**
 Copyright 2020 Raising the Floor - International

 Licensed under the New BSD license. You may not use this file except in
 compliance with this License.

 You may obtain a copy of the License at
 https://github.com/GPII/universal/blob/master/LICENSE.txt

 The R&D leading to these results received funding from the:
 * Rehabilitation Services Administration, US Dept. of Education under
 grant H421A150006 (APCP)
 * National Institute on Disability, Independent Living, and
 Rehabilitation Research (NIDILRR)
 * Administration for Independent Living & Dept. of Education under grants
 H133E080022 (RERC-IT) and H133E130028/90RE5003-01-00 (UIITA-RERC)
 * European Union's Seventh Framework Programme (FP7/2007-2013) grant
 agreement nos. 289016 (Cloud4all) and 610510 (Prosperity4All)
 * William and Flora Hewlett Foundation
 * Ontario Ministry of Research and Innovation
 * Canadian Foundation for Innovation
 * Adobe Foundation
 * Consumer Electronics Association Foundation
 **/
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