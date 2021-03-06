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
    SET_ROUTE(state, route) {
        state.route = route
    },

    // /////////////////////////////////////////////
    // User/Account
    // /////////////////////////////////////////////

    INITIALISE_STORE(state) {
        //let arr = state.route.split("/")
        //console.log("fer", arr)
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
        else if(state.AppActiveUser.role == "assistant")
        {
            //state.layout = "assistant-layout"
            //console.log(state.route.params.id)
            //if(state.route.fullPath)
            if(state.route.params && state.route.params.id)
            {
                state.layout = "simple-layout"
                /*let path_split = state.route.fullPath.split("/")
                if(path_split[path_split.length-1] == "impersonate")
                {
                    state.layout = "simple-layout"
                }
                else
                {
                    state.layout = "assistant-layout"
                }*/
            }
            else
            {
                state.layout = "assistant-layout"
            }

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

    //home
    /** save folders to state **/
    STORE_HOME_FOLDERS(state, payload)
    {
        state.home.folders = payload
    },

    /** store image signed url from aws s3 **/
    STORE_HOME_FOLDER_PHOTO_URL(state, payload)
    {
        //console.log("imageData in store", payload)
        for (let i = 0; i < state.home.folders.length; i++)
        {
            if (state.home.folders[i].id == payload.folder_id)
            {
                for (let j = 0; j < state.home.folders[i].photos.length; j++)
                {
                    if (state.home.folders[i].photos[j]._id == payload.photo_id)
                    {
                        //console.log("imageData in store matched", state.home.folders[j].photos[j])
                        state.home.folders[i].photos[j].imageData = payload.imageData
                        break
                    }
                }
            }
        }
    },

    /** store folder photos array **/
    STORE_HOME_FOLDER_PHOTOS_ARRAY(state, payload)
    {
     for (let i = 0; i < state.home.folders.length; i++) {
         if(state.home.folders[i].id == payload.folder_id)
         {
             state.home.folders[i].photosUrls = payload.urls
             break
         }
     }
    },

    /** store easyweb data **/
    STORE_HOME_EASYWEB_DATA(state, payload)
    {
        state.home.easyweb = payload
    },

    /** update easyweb fav flag **/
    CHANGE_EASYWEB_FAV(state, payload)
    {
        for (let i = 0; i < state.home.easyweb.length; i++) {
            if(state.home.easyweb[i].id == payload.item_id)
            {
                if(payload.type == "fav")
                {
                    state.home.easyweb[i].fav = false
                }
                else if (payload.type == "add")
                {
                    state.home.easyweb[i].fav = true
                }
            }
        }
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

