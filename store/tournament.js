const levels = ["pro", "rookie", "amateur"];

export const state = () => ({
    list: [],
    listSuspects: [],
    levelList: levels,
    filterString: "",
    filterLevel: "",
    // pagination
    isLoading: false,
    page: 1,
    perPage: 10,
    totalRows: 0
})

export const getters = {
    listPlayers: (stage) => stage.list,
    listSuspectsPlayers: (stage) => stage.listSuspects,
    listLevels: (stage) => stage.levelList,
    filterString: (stage) => stage.filterString,
    filterLevel: (stage) => stage.filterLevel,
    //
    isLoading: (stage) => stage.isLoading,
    currentPage: (stage) => stage.page,
    perPage: (stage) => stage.perPage,
    totalRows: (stage) => stage.totalRows,
}

export const actions = {
    loadSuspectsPlayers({ commit, state }) {
        if (!state.listSuspects.length) {
            return this.$axios.get(`/players/suspects`)
                .then(({ data: ids }) => commit('setSuspectsPlayers', ids))
        }

        return Promise.resolve()
    },
    pagginateFilteredList({ getters, dispatch, commit }, page = 1) {
        commit('setLoadingProcess', true)
        commit('setPagginationData', { page: +page })
        let payload = { page, perPage: getters.perPage };
        if (getters.filterLevel) payload.level = getters.filterLevel;
        if (getters.filterString) payload.search = getters.filterString;
        return dispatch('_loadPlayers', payload)
            .then(_ => commit('setLoadingProcess', false))
    },
    loadFilteredListPage({ getters, dispatch, commit }, {
        page = 1,
        perPage = getters.perPage,
        filterLevel = null,
        search = null
    } = {}) {
        commit('setLoadingProcess', true)
        let payload = { page, perPage };
        if (filterLevel !== null) payload.level = filterLevel
        if (search !== null) payload.search = search
        return dispatch('_loadPlayers', payload)
            .then(_ => commit('setLoadingProcess', false))
    },
    _loadPlayers({ getters, commit }, {
        page = 1,
        perPage = 10,
        level = null,
        search = null
    }) {
        let start = (page - 1) * perPage || 0,
            n = perPage,
            params = { start, n }

        if (search) params.search = search
        if (level) params.level = level

        return this.$axios.get(`/players?${serializeParams(params)}`)
            .then(({ data = {}, headers: { 'x-total': totalRows = 0 } }) => {
                data.forEach(player => {
                    player._rowVariant = null

                    if (getters.listSuspectsPlayers.indexOf(player.id) !== -1) {
                        player._rowVariant = 'warning'
                    }
                })
                commit('setList', data)
                commit('setPagginationData', { page, perPage, totalRows: +totalRows })
            })
    }
}

export const mutations = {
    setList(state, list) {
        state.list = list
    },
    setSuspectsPlayers(state, list) {
        if (list && list.length) {
            state.listSuspects = list
        }
    },
    setPagginationData(state, { page = 1, perPage = null, totalRows = null }) {
        if (page !== null) state.page = page
        if (perPage !== null) state.perPage = perPage
        if (totalRows !== null) state.totalRows = totalRows
    },
    setLoadingProcess(state, isOn = null) {
        if (isOn !== null) {
            state.isLoading = !!isOn
        }
    },
    updateFilterString(state, value) {
        state.filterString = value
    },
    updateFilterLevel(state, value) {
        if (levels.indexOf(value) === -1) {
            throw new Error('Unknown level')
        }
        state.filterLevel = value
    }
}

function serializeParams(params = {}) {
    return Object.entries(params).map(([key, val]) => key + '=' + val).join('&')
}