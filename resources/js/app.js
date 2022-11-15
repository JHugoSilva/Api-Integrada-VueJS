require('./bootstrap');

window.Vue = require('vue').default;
import Vue from 'vue';
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

Vue.filter('formataDataTempoGlobal', function(d) {

    if (!d) return ''

    d = d.split('T')

    let data = d[0]
    let tempo = d[1]

    data = data.split('-')
    //Formatar Data
    data = data[2] +'/'+ data[1] +'/'+ data[0]
    //Formatar Tempo
    tempo = tempo.split('.')
    tempo = tempo[0]

    return data + ' ' + tempo
})

const store = new Vuex.Store({
    state: {
        item: {},
        transacao: { status: '', mensagem: '', dados: '' }
    }
})

const app = new Vue({
    el: '#app',
    store
});
