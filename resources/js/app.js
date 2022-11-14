require('./bootstrap');

window.Vue = require('vue').default;
import Vuex from 'vuex'

Vue.component('login-component', require('./components/LoginComponent.vue').default);
Vue.component('home-component', require('./components/HomeComponent.vue').default);
Vue.component('marcas-component', require('./components/MarcasComponent.vue').default);
Vue.component('input-container-component', require('./components/InputContainerComponent.vue').default);
Vue.component('table-component', require('./components/TableComponent.vue').default);
Vue.component('card-component', require('./components/CardComponent.vue').default);
Vue.component('modal-component', require('./components/ModalComponent.vue').default);
Vue.component('alert-component', require('./components/AlertComponent.vue').default);
Vue.component('paginate-component', require('./components/PaginateComponent.vue').default);

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        teste: 'Teste Vuex 123'
    }
})

const app = new Vue({
    el: '#app',
    store
});
