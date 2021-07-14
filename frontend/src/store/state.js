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
const userDefaults = {
    name : "",
    email: "",
    role: "",
    googleEmail: "",
    token: null
}

// /////////////////////////////////////////////
// State
// /////////////////////////////////////////////

const state = {
    layout : 'simple-layout',
    AppActiveUser           : userDefaults,
    setInitialDone: false,




    sampleVariable          : "test",

    dragging: 0,
    W: screen.width,
    H: screen.height,
    filter: 0,
    filter2: 0,
    deletedEmail: null,
    openedDeleted: null,
    lastDragged: null,
    trayEmails: [],
    trayEmailsFlag: [],
    trayptr: 1,
    contactOpened: 0,
    mailOpened: 0,
    albumOpened: 0,
    loadingPhotos: 1,
    MARGIN: 0,
    buttonwidth: 0,
    savez: 0,
    USERNAME: "Eleanor",
    USERPIC: "contacts/Martha.jpg",
    destination: null,

    isPerson: 0,
    people: [
        new Array("Adam Smith","Anna Johnson","Becky Jones"), //AB
        new Array("Cathy Richards"), //CD
        new Array(""), //EF
        new Array("Gregg Vanderheiden","Heather Anderson"), //GH
        new Array("Jimmy"),  //IJ
        new Array("Lee"),  //KL
        new Array("Martha Brown","Mridu Sinha"), //MN
        new Array(""),  //OP
        new Array(""),   //QR
        new Array("Smita Ravi","Tracy"), //ST
        new Array(""),
        new Array(""),
        new Array("")
    ],
    viewportwidth: null,
    viewportheight: null,
    z: 1,
    curr_index: null,
    trash_x: null,
    trash_y: null,

    moimg: null,
    mcimg: null,

    unreadMails: [],

    // Can be used to get current window with
    // Note: Above breakpoint state is for internal use of sidebar & navbar component
    windowWidth: null,

    //
    polaroid_class : {
        top: 0,
        left: 0
    }
}

export default state
