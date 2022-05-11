import { createApp } from 'vue'
import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
  state : {
    currCity: '臺北市',
    currDistrict: '南港區',
    locations:[],
    stores:[],
  },
  mutations: {
    setcurrCity(state,payload){
        state.currCity = payload
    },
    setcurrDistrict(state,payload){
        state.currDistrict = payload
    },
    setAreaLocation(state,payload){
        state.locations = payload
    },
    setStores(state,payload){
        state.stores = payload
    }
  }
})

const app = createApp({ /* your root component */ })

// Install the store instance as a plugin
app.use(store)