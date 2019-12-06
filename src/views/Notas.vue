<template>
  <div class="holder">
    <div id="notas" v-if='notas' class='notas'>
      <div v-for='nota in notas' :key='nota.codigoDisciplina' class="nota">
        <p><b>Matéria:</b> {{ nota.descricao }}</p>
        <p><b>Média:</b> {{ nota.mediaFinal }}</p>
        <p><b>Resultado:</b> {{ nota.resultado }}</p>
      </div>
    </div>
    <div id='loading-div'>
      <img src='@/assets/loading.svg' alt='loading' />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Notas',
  data () {
    return {
      notas: null
    }
  },
  methods: {
    getNotas () {
      document.getElementById('loading-div').style.visibility = 'visible'
      let creds = JSON.parse(localStorage.getItem('creds'))
      let cod = JSON.parse(localStorage.getItem('codAluno'))
      let codCurso = JSON.parse(localStorage.getItem('codCurso'))
      let codSem = JSON.parse(localStorage.getItem('codSem'))
      console.log(creds, cod)

      let token = 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      axios
        .get(
          'https://gateway.cruzeirodosul.edu.br/zuul/acd-nota/consulta/nota/tradicional/disciplina/resultado/6/14/' + cod + '/' + codSem + '/' + creds.rgm,
          {
            headers: {
              Authorization: token
            }
          }
        )
        .then(x => {
          this.notas = x.data
          document.getElementById('loading-div').style.visibility = 'hidden'
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
    if (localStorage.getItem('creds')) {
      this.getNotas()
    } else {
      this.$router.push('/')
    }
  }
}
</script>

<style>
#loading-div {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}

p {
  margin: 5px;
}

.holder {
  height: 100%;
  width: 100%;
}

.nota {
  background-color: #1B9AAA;
  padding: 20px;
  margin: 30px;
  border-radius: 5px;
  color: azure;
}
</style>
