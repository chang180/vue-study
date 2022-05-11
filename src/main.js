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
  actions: {
    async fetchLocations({ commit }) {
      const json = await fetch(
        'https://raw.githubusercontent.com/kurotanshi/mask-map/master/raw/area-location.json'
      ).then((res) => res.json())
      commit('setAreaLocation', json)
    },
    async fetchPharmacies({ commit }) {
    //   const json = await fetch('https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json')
    //   .then((res) => res.json())
    //   console.log(json)
    // return
      // url是檔案地址
      const csv = await fetch(
        'https://data.nhi.gov.tw/Datasets/Download.ashx?rid=A21030000I-D03001-001&l=https://data.nhi.gov.tw/resource/Nhi_Fst/Fstdata.csv'
      )
        .then((res) => res.text())
        let lines = csv.split('\n')
        let result = []
        let headers = ['id', 'name', 'address', 'logitude', 'latitude', 'phone', 'brand', 'stock', 'time', 'note']
        let json = {}
        let town_match = /.+?(鄉|鎮|區|鎮|村|公市|竹北市|蘭市|栗市|份市|化市|林市|投市|六市|子市|東市|蓮市)/g;
        let city_match = /.+?(市|縣)/g;
        for(let i = 1; i < lines.length-1; i++){
            let obj = {
                'type': {},
                'geometry': {
                    'coordinates': [],
                },
                'properties': {},
            }
            let currentline = lines[i].split(',')
            for(let j = 0; j < headers.length; j++){
                if(j<3||j>4){
                    obj['properties'][headers[j]] = currentline[j]
                }else{
                    obj['properties'][headers[j]] = Number(currentline[j])
                }
            }
            console.log(obj)
            let town = obj['properties']['address'].match(town_match).toString()
            let city = town.match(city_match).toString()||''
            town = town.replace(city,'')||''

            obj['properties']['county'] = city
            obj['properties']['town'] = town
            obj['type'] = 'Feature'
            obj['geometry']['type'] = 'Point'
            obj['geometry']['coordinates'][0] = obj['properties']['latitude']
            obj['geometry']['coordinates'][1] = obj['properties']['logitude']

            result.push(obj)
        }
        json=result
      commit('setStores', json)
      const data = json.map((d) => ({
        ...d.properties,
        latitude: d.geometry.coordinates[0],
        logitude: d.geometry.coordinates[1],
      }))
      commit('setStores', data)
    },
  },
  getters: {
    cityList(state) {
      return state.locations.map((d) => d.name)
    },
    districtList(state) {
      return (
        state.locations.find((d) => d.name === state.currCity)?.districts || []
      )
    },
    filteredStores(state) {
      const { stores } = state
      // return stores.filter((d)=>d.county===state.currCity && d.town===state.currDistrict)
      return state.keywords
        ? stores.filter((d) => d.name.includes(state.keywords))
        : stores.filter(
            (d) => d.county === state.currCity && d.town === state.currDistrict
          )
    },
    currDistrictInfo(state, getters) {
      return (
        getters.districtList.find((d) => d.name === state.currDistrict) || {}
      )
    },
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
    },
  },
})

createApp(App).use(store).mount('#app')
