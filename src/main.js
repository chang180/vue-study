import { createApp } from 'vue'
import App from './App.vue'
import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
    state: {
        currCity: '臺北市',
        currDistrict: '南港區',
        locations: [],
        stores: [],
        keywords: '',
        showModal: false,
        infoBoxSid: null,
    },
    actions:{
        async fetchLocations({ commit }) {
            const json = await fetch('https://raw.githubusercontent.com/kurotanshi/mask-map/master/raw/area-location.json')
            .then((res) => res.json())
            commit('setAreaLocation',json)
        },
        async fetchPharmacies({ commit }) {
            const json = await fetch('https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json')
            // const json = await fetch('/phar')
            .then((res) => res.json())
            commit('setStores',json)
            // return
            const data = json.features.map((d) => ({
                ...d.properties,
                latitude: d.geometry.coordinates[0],
                logitude: d.geometry.coordinates[1],
            }))
            commit('setStores',data)
        }
    },
    getters:{
        cityList(state){
            return state.locations.map((d) => d.name)
        },
        districtList(state){
            return state.locations.find((d) => d.name === state.currCity)?.districts || []
        },
        filteredStores(state){
            const {stores} = state
            // return stores.filter((d)=>d.county===state.currCity && d.town===state.currDistrict)
            return state.keywords
            ?stores.filter((d)=>d.name.includes(state.keywords))
            :stores.filter((d)=>d.county===state.currCity && d.town===state.currDistrict)
        },
        currDistrictInfo(state,getters){
            return getters.districtList.find((d)=>d.name===state.currDistrict)||{}
        }
    },
    mutations: {
        setcurrCity(state, payload) {
            state.currCity = payload
        },
        setcurrDistrict(state, payload) {
            state.currDistrict = payload
        },
        setAreaLocation(state, payload) {
            state.locations = payload
        },
        setStores(state, payload) {
            state.stores = payload
        },
        setKeywords(state, payload) {
            state.keywords = payload
        },
        setShowModal(state, payload) {
            state.showModal = payload
        },
        setInfoBoxSid(state, payload) {
            state.infoBoxSid = payload
        }
    },
})

createApp(App).use(store).mount('#app')
