<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <!--Inicio card de busca-->
                <card-component titulo="Busca de marcas">
                    <template v-slot:conteudo>
                        <div class="row">
                            <div class="mb-3 col">
                                <input-container-component titulo="ID" id="inputId" id-help="idHelp"
                                    texto-ajuda="Opcional. Informe o ID da Marca.">
                                    <input type="number" class="form-control" id="inputId" aria-describedby="idHelp"
                                        placeholder="ID" v-model="busca.id" />
                                </input-container-component>
                            </div>
                            <div class="mb-3 col">
                                <input-container-component titulo="Nome" id="inputNome" id-help="nomeHelp"
                                    texto-ajuda="Opcional. Informe o Nome da Marca.">
                                    <input type="text" class="form-control" id="inputNome" aria-describedby="nomeHelp"
                                        placeholder="Informe o nome da marca" v-model="busca.nome" />
                                </input-container-component>
                            </div>
                        </div>
                    </template>
                    <template slot="rodape">
                        <button type="submit" class="btn btn-primary btn-sm" @click="pesquisar()">
                            Pesquisar
                        </button>
                    </template>
                </card-component>
                <!--Fim card de busca-->

                <!--Inicio card de relação de Marcas-->
                <card-component titulo="Relação de Marcas">
                    <template v-slot:conteudo>
                        <table-component :dados="marcas.data"
                            :visualizar="{ visivel: true, dataToggle: 'modal', dataTarget: '#modalMarcaVisualizar' }"
                            :atualizar="{ visivel: true, dataToggle: 'modal', dataTarget: '#modalMarcaAtualizar' }"
                            :remover="{
                                visivel:true,
                                dataToggle: 'modal',
                                dataTarget: '#modalMarcaRemover'
                            }"
                            :titulos="{
                                id: { titulo: 'ID', tipo: 'texto' },
                                nome: { titulo: 'Nome', tipo: 'texto' },
                                imagem: { titulo: 'Imagem', tipo: 'imagem' },
                                created_at: { titulo: 'Data de criação', tipo: 'data' }
                            }"></table-component>
                    </template>
                    <template v-slot:rodape>
                        <div class="row">
                            <div class="col-10">
                                <paginate-component>
                                    <ul class="pagination pagination-sm">
                                        <li v-for="l, key in marcas.links" :key="key"
                                            :class="l.active ? 'page-item active' : 'page-item'" @click="paginacao(l)">
                                            <a class="page-link" v-html="l.label"></a>
                                        </li>
                                    </ul>
                                </paginate-component>
                            </div>
                            <div class="col">
                                <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal"
                                    data-bs-target="#modalMarca">
                                    Adicionar
                                </button>
                            </div>
                        </div>
                    </template>
                </card-component>
                <!--Fim card de Relação de Marcas-->
            </div>
        </div>
        <!--Modal inclusão de marcas-->
        <modal-component id="modalMarca" titulo="Adicionar marca">
            <template v-slot:alertas>
                <alert-component tipo="success" :detalhes="transacaoDetalhes" titulo="Cadastro realizado com sucesso"
                    v-if="transacaoStatus == 'adicionado'"></alert-component>
                <alert-component tipo="danger" :detalhes="transacaoDetalhes" titulo="Erro ao tentar cadastrar a marca"
                    v-if="transacaoStatus == 'erro'"></alert-component>
            </template>
            <template v-slot:conteudo>
                <div class="form-group">
                    <input-container-component titulo="Nome da Marca" id="novoNome" id-help="novoNomeHelp"
                        texto-ajuda="Informe o nome da marca.">
                        <input type="text" class="form-control" id="novoNome" aria-describedby="novoNomeHelp"
                            placeholder="Nome da marca" v-model="nomeMarca" />
                    </input-container-component>
                </div>

                <div class="form-group">
                    <input-container-component titulo="Imagem" id="novoImagem" id-help="novaImagemHelp"
                        texto-ajuda="Selecione uma imagem PNG, JPEG, JPG">
                        <input type="file" class="form-control" id="novoImagem" aria-describedby="novaImagemHelp"
                            @change="carregarImagem($event)" />
                    </input-container-component>
                </div>
            </template>
            <template v-slot:rodape>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-primary" @click="salvar()">Salvar</button>
            </template>
        </modal-component>
        <!--Fim modal inclusão de marcas-->

        <!--Modal visualizar marca-->
        <modal-component id="modalMarcaVisualizar" titulo="Visualizar marca">
            <template v-slot:alertas></template>
            <template v-slot:conteudo>
                <input-container-component titulo="Id da marca">
                    <input type="text" class="form-control" :value="$store.state.item.id" disabled>
                </input-container-component>
                <input-container-component titulo="Nome da marca">
                    <input type="text" class="form-control" :value="$store.state.item.nome" disabled>
                </input-container-component>
                <input-container-component titulo="Imagem">
                    <img :src="'storage/'+$store.state.item.imagem" width="30" height="30" alt="Logo da Marca" v-if="$store.state.item.imagem">
                </input-container-component>
                <input-container-component titulo="Data de criação">
                    <input type="text" class="form-control" :value="$store.state.item.created_at" disabled>
                </input-container-component>
            </template>
            <template v-slot:rodape>
                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Fechar</button>
            </template>
        </modal-component>
        <!--Fim do modal visualizar marca-->

        <!--Modal remover marca-->
         <modal-component id="modalMarcaRemover" titulo="Remover marca">
            <template v-slot:alertas>
                <alert-component tipo="success" titulo="Transação realizada com sucesso" :detalhes="$store.state.transacao" v-if="$store.state.transacao.status == 'sucesso'"></alert-component>
                <alert-component tipo="danger" titulo="Erro na transação" :detalhes="$store.state.transacao" v-if="$store.state.transacao.status == 'erro'"></alert-component>
            </template>
            <template v-slot:conteudo v-if="$store.state.transacao.status != 'sucesso'">
                <input-container-component titulo="Id da marca">
                    <input type="text" class="form-control" :value="$store.state.item.id" disabled>
                </input-container-component>
                <input-container-component titulo="Nome da marca">
                    <input type="text" class="form-control" :value="$store.state.item.nome" disabled>
                </input-container-component>
            </template>
            <template v-slot:rodape>
                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-secondary btn-sm" @click="remover()" v-if="$store.state.transacao.status !== 'sucesso'">Remover</button>
            </template>
        </modal-component>
        <!--Fim do modal remover marca-->

        <!--Modal atualizar marca-->
        <modal-component id="modalMarcaAtualizar" titulo="Atualizar marca">
            <template v-slot:alertas>
                <alert-component tipo="success" titulo="Transação realizada com sucesso" :detalhes="$store.state.transacao" v-if="$store.state.transacao.status == 'sucesso'"></alert-component>
                <alert-component tipo="danger" titulo="Erro na transação" :detalhes="$store.state.transacao" v-if="$store.state.transacao.status == 'erro'"></alert-component>
            </template>
            <template v-slot:conteudo>
                <div class="form-group">
                    <input-container-component titulo="Nome da Marca" id="atualizarNome" id-help="atualizarNomeHelp"
                        texto-ajuda="Nome da marca.">
                        <input type="text" class="form-control" id="atualizarNome" aria-describedby="atualizarNomeHelp"
                            placeholder="Nome da marca" v-model="$store.state.item.nome" />
                    </input-container-component>
                </div>
                <div class="form-group">
                    <input-container-component titulo="Imagem" id="atualizarImagem" id-help="atualizarImagemHelp"
                        texto-ajuda="Selecione uma imagem PNG, JPEG, JPG">
                        <input type="file" class="form-control" id="atualizarImagem" aria-describedby="atualizarImagemHelp"
                            @change="carregarImagem($event)" />
                    </input-container-component>
                </div>
            </template>
            <template v-slot:rodape>
                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-secondary btn-sm" @click="atualizar()">Atualizar</button>
            </template>
        </modal-component>
        <!--Fim do modal atualizar marca-->
    </div>
</template>

<script>

export default {
    data() {
        return {
            urlBase: 'http://localhost:8000/api/v1/marca',
            nomeMarca: '',
            urlPaginacao: '',
            urlFiltro: '',
            arquivoImagem: [],
            transacaoStatus: '',
            transacaoDetalhes: {},
            marcas: { data: [] },
            busca: { id: '', nome: '' }
        }
    },
    mounted() {
        this.carregarLista()
    },
    methods: {
        atualizar() {

            let formData = new FormData()
            formData.append('_method', 'patch')
            formData.append('nome', this.$store.state.item.nome)

            if (this.arquivoImagem[0]) {
                formData.append('imagem', this.arquivoImagem[0])
            }

            let url = this.urlBase + '/' + this.$store.state.item.id

            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }

            axios.post(url, formData, config)
                .then(response => {
                    this.$store.state.transacao.status = 'sucesso'
                    this.$store.state.transacao.mensagem = 'Registro de marca atualizado com sucesso'
                    this.carregarLista()
                    atualizarImagem.value = ''
                })
                .catch(errors => {
                    console.log(errors)
                    this.$store.state.transacao.status = 'erro'
                    this.$store.state.transacao.mensagem = errors.response.data.message
                    this.$store.state.transacao.dados = errors.response.data.errors
                })
        },
        remover() {

            let confirmacao = confirm('Tem certeza que deseja remover esse registro?')

            if (!confirmacao) {
                return false
            }

            let url = this.urlBase + '/' + this.$store.state.item.id

            let formData = new FormData()
            formData.append('_method', 'delete')

            axios.post(url, formData)
                .then(response => {
                    this.$store.state.transacao.status = 'sucesso'
                    this.$store.state.transacao.mensagem = response.data.msg
                    this.carregarLista()
                })
                .catch(errors => {
                    this.$store.state.transacao.status = 'erro'
                    this.$store.state.transacao.mensagem = errors.response.data.msg
                })
        },
        pesquisar() {

            let filtro = ''

            for (let chave in this.busca) {
                if (this.busca[chave]) {
                    if (filtro !== '') {
                        filtro += ';'
                    }
                    filtro += chave + ':LIKE:' + this.busca[chave]
                }
            }
            if (filtro !== '') {
                this.urlPaginacao = 'page=1'
                this.urlFiltro = '&filtro=' + filtro
            } else {
                this.urlFiltro = ''
            }
            this.carregarLista()
        },
        paginacao(l) {
            if (l.url) {
                this.urlPaginacao = l.url.split('?')[1]
                this.carregarLista()
            }
        },
        carregarLista() {

            let url = this.urlBase + '?' + this.urlPaginacao + this.urlFiltro
            axios.get(url).
                then(response => {
                    this.marcas = response.data
                })
                .catch(errors => {
                    console.log(errors)
                })
        },
        carregarImagem(e) {
            this.arquivoImagem = e.target.files
        },
        salvar() {

            let formData = new FormData();
            formData.append('nome', this.nomeMarca);
            formData.append('imagem', this.arquivoImagem[0]);

            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            axios.post(this.urlBase, formData, config)
                .then(response => {
                    this.transacaoStatus = 'adicionado'
                    this.transacaoDetalhes = {
                        mensagem: 'ID do registro: ' + response.data.id
                    }
                    this.carregarLista()
                    this.urlBase + '?' + this.urlPaginacao
                })
                .catch(errors => {
                    this.transacaoStatus = 'erro'
                    this.transacaoDetalhes = {
                        mensagem: errors.response.data.message,
                        dados: errors.response.data.errors
                    }
                })
        }
    }
}
</script>
