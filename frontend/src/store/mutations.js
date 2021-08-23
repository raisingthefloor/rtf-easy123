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
const mutations = {
    // /////////////////////////////////////////////
    // User/Account
    // /////////////////////////////////////////////

    INITIALISE_STORE(state) {
        if(state.setInitialDone == false)
        {
            state.setInitialDone = true
            if (localStorage.getItem('userInfo')) {
                state.AppActiveUser = JSON.parse(localStorage.getItem('userInfo'));
            }
        }
    },
    SET_INITIAL_LAYOUT(state) {
        if(state.AppActiveUser.role == "admin")
        {
            state.layout = "admin-layout"
        }
        else
        {
            state.layout = "simple-layout"
        }
    },
    UPDATE_USER(state, payload) {
        state.AppActiveUser = payload
        if (localStorage.getItem('userInfo')) {
            //localStorage.removeItem('userInfo')
            localStorage.setItem("userInfo", JSON.stringify(payload))
        }
        else {
            localStorage.setItem("userInfo", JSON.stringify(payload))
        }

        state.AppActiveUser = JSON.parse(localStorage.getItem('userInfo'))
    },
    SET_GOOGLE_EMAIL(state, payload) {
        state.AppActiveUser.googleEmail = payload
        localStorage.setItem("userInfo", JSON.stringify(state.AppActiveUser))
    },
    LOGOUT_USER(state, payload) {
        if (localStorage.getItem('userInfo')) {
            localStorage.removeItem('userInfo')
            state.layout = "simple-layout"
            state.AppActiveUser = {
                name : "",
                email: "",
                role: "",
                googleEmail: "",
                token: null
            }
            payload.push('/').catch(() => {})
        }
    },

    //other
    SET_LAYOUT (state, payload) {
        state.layout = payload
    },














    SET_VIEWPORT_HEIGHT(state, value) {
        state.viewportheight = value
        state.trash_y = state.viewportheight - 128 -5
    },
    SET_VIEWPORT_WIDTH(state, value) {
        state.viewportwidth = value
        state.trash_x = state.viewportwidth - 128 -5
    },

    SET_TRASH_X(state, value) {
        state.trash_x = value
    },
    SET_TRASH_Y(state, value) {
        state.trash_y = value
    },

    SET_MAIL_OPENED(state, value) {
        state.mailOpened = value
    },
    SET_POLAROID_CLASS(state, value) {
        state.polaroid_class = value
    },
    SET_POLAROID(state, value) {
        state.polaroids = value
    },




    // Updates user info in state and localstorage
    UPDATE_USER_INFO(state, payload) {
        //console.log(payload);
        // Get Data localStorage
        let userInfo = JSON.parse(localStorage.getItem("userInfo")) || state.AppActiveUser

        for (const property of Object.keys(payload)) {

            if (payload[property] != null) {
                // If some of user property is null - user default property defined in state.AppActiveUser
                state.AppActiveUser[property] = payload[property]

                // Update key in localStorage
                userInfo[property] = payload[property]
            }


        }
        // Store data in localStorage
        localStorage.setItem("userInfo", JSON.stringify(userInfo))
    },

    updateMailUserName(state, userName){
        state.mailTo.name = userName;
    },

    updateMailUserAddress(state, emailAddress){
        state.mailTo.email = emailAddress;
    }

}

export default mutations

