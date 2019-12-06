<template>
  <div class="home">
    <div id="login-holder">
      <h1>UDF notaEz</h1>
      <h4 id="alert" style="margin: 0">Dados incorretos</h4>
      <input type="text" class="ipt" id="rgm" placeholder="Seu RGM" v-model="rgm">
      <input type="password" class="ipt" id="password" placeholder="Sua senha" v-model="pwd">
      <button class="btn" @click="login()">Ver minhas notas</button>
    </div>
    <div id="loading-div">
      <img src="@/assets/loading.svg" alt="loading">
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'home',
  data () {
    return {
      rgm: null,
      pwd: null
    }
  },
  methods: {
    login () {
      document.getElementById('login-holder').style.visibility = 'hidden'
      document.getElementById('loading-div').style.visibility = 'visible'
      let body = {
        username: this.rgm,
        password: this.pwd,
        blackBoard: false,
        terminal: 'false'
      }
      axios.post('https://gateway.cruzeirodosul.edu.br/zuul/acd-portal-acesso/login', body)
        .then(x => {
          // console.log(x.data.dadosAcesso.token)
          localStorage.setItem('token', JSON.stringify(x.data.dadosAcesso.token))
          localStorage.setItem('codAluno', JSON.stringify(x.data.dadosAcesso.alunoCursoDadosAcessoList[0].codAluno))
          localStorage.setItem('creds', JSON.stringify({
            'rgm': this.rgm,
            'pwd': this.pwd
          }))
          let codCurso = x.data.dadosAcesso.alunoCursoDadosAcessoList[0].codCurs
            localStorage.setItem('codCurso', codCurso)
            axios.get('https://gateway.cruzeirodosul.edu.br/zuul/acd-nota/consulta/nota/tradicional/combo/6/14/' + this.rgm + '/' + codCurso, {
              headers: {
                Authorization: "Bearer "+JSON.parse(localStorage.getItem('token'))
              }
            })
              .then(x => {
                let codSem = x.data[0].codigo
                localStorage.setItem('codSem', codSem)
                this.$router.push('notas')
              })
              .catch(err => {
                console.log(err)
              })
        })
        .catch(err => {
          console.log('erro >> ',err)
          document.getElementById('login-holder').style.visibility = 'visible'
          document.getElementById('loading-div').style.visibility = 'hidden'
          document.getElementById('alert').style.visibility = 'visible'
        })
    },

    prevLogin () {
      if (localStorage.getItem('creds')) {
        document.getElementById('login-holder').style.visibility = 'hidden'
        document.getElementById('loading-div').style.visibility = 'visible'
        let creds = JSON.parse(localStorage.getItem('creds'))
        let body = {
          username: creds.rgm,
          password: creds.pwd,
          blackBoard: false,
          terminal: 'false'
        }
        axios.post('https://gateway.cruzeirodosul.edu.br/zuul/acd-portal-acesso/login', body)
          .then(x => {
            localStorage.setItem('token', JSON.stringify(x.data.dadosAcesso.token))
            let codCurso = x.data.dadosAcesso.alunoCursoDadosAcessoList[0].codCurs
            localStorage.setItem('codCurso', codCurso)
            axios.get('https://gateway.cruzeirodosul.edu.br/zuul/acd-nota/consulta/nota/tradicional/combo/6/14/' + creds.rgm + '/' + codCurso, {
              headers: {
                Authorization: "Bearer "+JSON.parse(localStorage.getItem('token'))
              }
            })
              .then(x => {
                let codSem = x.data[0].codigo
                localStorage.setItem('codSem', codSem)
                this.$router.push('notas')
              })
              .catch(err => {
                console.log(err)
              })
          })
          .catch(err => {
            console.log('erro >>', err)
            document.getElementById('login-holder').style.visibility = 'visible'
            document.getElementById('loading-div').style.visibility = 'hidden'
            document.getElementById('alert').style.visibility = 'visible'
          })
      }
    }
  },
  mounted () {
    this.prevLogin()
  }
}
</script>

<style>
  #alert {
    visibility: hidden;
  }

  .home {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  #login-holder {
    height: fit-content;
    width: 85vw;
    border-radius: 5px;
    background-color: rgba(199,199,199);
    display: flex;
    flex-direction: column;
    padding: 20px;
  }

  #loading-div {
    visibility: hidden;
    position: absolute;
  }

  .ipt {
    margin-top: 5px;
    margin-bottom: 5px;
    border-style: solid;
    border-width: 2px;
    border-color: rgba(128, 128, 128, .4);
    border-radius: 5px;
    padding: 10px;
  }

  .btn {
    margin-top: 5px;
    padding: 15px;
    border-radius: 5px;
    border-style: none;
    background-color:rgba(25, 25, 25, 1);
    color: white;
  }
</style>
