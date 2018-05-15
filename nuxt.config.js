const webpack = require('webpack')

module.exports = {
    // debug: true,
    head: {
        title: 'PLAYER TOURNAMENT 2018',
        meta: [
            { charset: 'utf-8' },
            { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
            { name: 'viewport', content: 'width=device-width, minimum-scale=1.0, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes' },
            { name: 'og:locale', content: 'pt_BR' },
            { name: 'googlebot', content: 'index,follow' },
            { name: 'robots', content: 'index,follow,noodp' },
            { name: 'description', content: 'Interview task' },
            { name: 'country', content: 'Brazil' },
            { name: 'revisit-after', content: '7 days' },
            { name: 'mobile-web-app-capable', content: 'yes' }
        ],
        link: [
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }
        ]
    },
    modules: [
        ['bootstrap-vue/nuxt', { css: false }],
        '@nuxtjs/axios',
    ],
    router: {
        extendRoutes(routes, resolve) {
            routes.push({ path: '/', redirect: '/welcome' })
        }
    },
    build: {
        analyze: false,
        progress: false,
    },
    axios: {
        baseURL: 'https://player-tournament-api.zorro.pp.ua/api'
    }
};