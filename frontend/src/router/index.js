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
import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Register from '@/components/Register'
import GoogleCallback from '@/components/GoogleCallback'
import VerifyEmail from '@/components/VerifyEmail'
import HomeWorking from "@/components/HomeWorking"

//admin components
import AdminUser from "@/components/admin/user/List"
import AssistantUser from "@/components/assistant/user/List"
import AssistantCreateUser from "@/components/assistant/user/Create"

import admin from "../middleware/admin"
import assistant from "../middleware/assistant"
import subscribed from "../middleware/subscribed"

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Login',
            component: Login
        },
        {
            path: '/register',
            name: 'Register',
            component: Register
        },
        {
            path: '/confirmation/:email/:token',
            name: 'VerifyEmail',
            component: VerifyEmail
        },

        {
            path: '/googlecallback',
            name: 'GoogleCallback',
            component: GoogleCallback
        },
        {
            path: '/home-working',
            name: 'HomeWorking',
            component: HomeWorking,
            meta: {
                middleware: subscribed
            }
        },

        //Admin Routes
        {
            path: '/admin',
            name: 'Admin',
            component: AdminUser,
            meta: {
                middleware: admin
            }
        },

        //Assistant Routes
        {
            path: '/assistant',
            name: 'Assistant',
            component: AssistantUser,
            meta: {
                middleware: assistant
            }
        },
        {
            path: '/assistant/create-user',
            name: 'AssistantCreateUser',
            component: AssistantCreateUser,
            meta: {
                middleware: assistant
            }
        }
    ]
})

function nextFactory(context, middleware, index) {
    const subsequentMiddleware = middleware[index];
    // If no subsequent Middleware exists,
    // the default `next()` callback is returned.
    if (!subsequentMiddleware) return context.next;

    return (...parameters) => {
        // Run the default Vue Router `next()` callback first.
        context.next(...parameters);
        // Then run the subsequent Middleware with a new
        // `nextMiddleware()` callback.
        const nextMiddleware = nextFactory(context, middleware, index + 1);
        subsequentMiddleware({ ...context, next: nextMiddleware });
    }
}

router.beforeEach((to, from, next) => {
    if (to.meta.middleware) {
        const middleware = Array.isArray(to.meta.middleware) ? to.meta.middleware : [to.meta.middleware]

        const context = {
            from,
            next,
            router,
            to,
        }

        const nextMiddleware = nextFactory(context, middleware, 1)
        return middleware[0]({ ...context, next: nextMiddleware })
    }

    return next()
})

export default router;