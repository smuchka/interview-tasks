<template>
    <section>
        <div class="container">
            <h3 class="text-center">{{title}}</h3>
            <p class="lead">
              <small class="text-muted">found </small>
              <u>{{totalRows}}</u>
              <small class="text-muted">players</small>
              <small v-if="filterString.length" class="text-black-50">when searching for: </small>
              <u>{{filterString}}</u>
            </p>
        </div>
        <div class="container">
            <b-row id="table-tp" class="my-2">
                <b-col md="6" class="my-2">
                    <b-input-group>
                        <b-form-input 
                            v-model="filterInputString" 
                            placeholder="Type to filter records" 
                            @keyup.enter="applyEnterRefresh"
                            @input="inputSearchString"/>
                        <b-input-group-append>
                            <b-btn
                                :disabled="!filterInputString" 
                                @click="clearFilterString"
                                :variant="filterInputString?'primary': ''">X</b-btn>
                        </b-input-group-append>
                    </b-input-group>
                </b-col>
                <b-col md="6" class="my-2 text-right">
                  <b-button-group>
                    <b-button 
                      v-for="(el, index) in listLevels"
                      :key="index"
                      :class="{'btn-outline-secondary': filterLevel !== el, 'text-light btn-primary': filterLevel === el}"
                      :to="{ name: 'tournament-level', params: { level: (filterLevel !== el ? el : null) }}">{{el}}</b-button>
                  </b-button-group>
                </b-col>
            </b-row>

            <b-table
                :items="listPlayers"
                :busy.sync="inProcess"
                :fields="tableFields"
                :striped="true"
                :fixed="true"
                :small="true">
                <template slot="level" slot-scope="data">
                  <nuxt-link 
                    v-if="data.value && (filterLevel !== data.value)"
                    :to="{ name: 'tournament-level', params: { level: data.value }}">{{data.value}}</nuxt-link>
                  <span v-else>{{data.value}}</span>
                </template>
            </b-table>

            <b-pagination
                size="sm"
                variant="info"
                v-if="totalRows"
                :total-rows="totalRows" 
                :per-page="perPage" 
                :disabled="inProcess"
                v-model="formCurrentPage"
                @change="changePage"
                class="my-0 justify-content-end"/>
        </div>
    </section>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import debounce from "lodash/debounce";

export default {
  head() {
    return {
      titleTemplate: `${this.title} %s`
    };
  },
  asyncData({ store, query: { page = 1, search = "" } }) {
    return {
      formCurrentPage: page ? +page : null,
      filterInputString: search ? search : ""
    };
  },
  fetch({ store, params: { level = "" }, query: { page = 1, search = "" } }) {
    store.commit("tournament/updateFilterString", search ? search : "");
    store.commit("tournament/updateFilterLevel", level ? level : "");
    return Promise.all([
      store.dispatch("tournament/loadSuspectsPlayers"),
      store.dispatch("tournament/loadFilteredListPage", {
        page: +page,
        search,
        filterLevel: level
      })
    ]);
  },
  computed: {
    ...mapGetters({
      suspectsPlayers: "tournament/listSuspectsPlayers",
      listPlayers: "tournament/listPlayers",
      listLevels: "tournament/listLevels",
      filterString: "tournament/filterString",
      filterLevel: "tournament/filterLevel",
      //
      currentPage: "tournament/currentPage",
      totalRows: "tournament/totalRows",
      perPage: "tournament/perPage",
      inProcess: "tournament/isLoading"
    })
  },
  watch: {
    currentPage: function(val) {
      this.formCurrentPage = val;
    }
  },
  methods: {
    ...mapActions({
      changePage: "tournament/pagginateFilteredList"
    }),
    ...mapMutations({
      setLoading: "tournament/setLoadingProcess",
      updateFilterString: "tournament/updateFilterString",
      updateFilterLevel: "tournament/updateFilterLevel"
    }),
    pipeCapsText: value => value.toString().toUpperCase(),
    applyEnterRefresh(e) {
      this.inputSearchString(this.filterInputString);
    },
    inputSearchString: debounce(async function(value) {
      this.updateFilterString(value);
      await this.loadTournamentTable(1);
    }, 600),
    async clearFilterString() {
      this.updateFilterString((this.filterInputString = ""));
      await this.loadTournamentTable(1);
    },
    async loadTournamentTable(page) {
      await this.$store.dispatch("tournament/loadFilteredListPage", {
        page: +page,
        search: this.filterString,
        filterLevel: this.filterLevel
      });
    }
  },
  data() {
    return {
      title: "Tournament 101 - Final Results",
      tableFields: [
        {
          key: "id",
          sortable: false,
          class: "text-black-50"
        },
        {
          key: "name",
          label: "Player name",
          sortable: false,
          formatter: "pipeCapsText"
        },
        { key: "level", sortable: false },
        { key: "score", sortable: false }
      ]
    };
  }
};
</script>

<style>
thead > tr th:first-child {
  width: 110px;
}
</style>
