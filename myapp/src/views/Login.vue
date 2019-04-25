<template>
 <v-container>
   <v-layout row>
     <v-flex xs12 sm6 offset-sm3>
       <v-card>
         <v-card-text>
           <v-container>
             
             <form v-on:submit="login">
               <v-layout row>
                 <v-flex xs12 >
                   <v-text-field
                   name="email"
                   label="Mail"
                   id="email"
                   
                   type="email"
                   required>
                   </v-text-field>
                 </v-flex>
               </v-layout>

               <v-layout row>
                 <v-flex xs12 >
                   <v-text-field
                   name="password"
                   label="Password"
                   id="password"
                   
                   type="password"
                   required>
                   </v-text-field>
                 </v-flex>
               </v-layout>


               <v-layout row>
                 <v-flex xs12 >

                  <v-btn type="submit">Login</v-btn>
                 </v-flex>
               </v-layout>

             </form>
           </v-container>
        </v-card-text>
       </v-card>
     </v-flex>
   </v-layout>

 </v-container>
</template>


<script>
import router from '../router'
import axios from 'axios'
export default {
  name: 'Login',
  methods: {
    login: (e) => {
      e.preventDefault()
      let email = e.target.elements.email.value
      let password = e.target.elements.password.value
      let login = () => {
        let data = {
          email: email,
          password: password
        }
        axios.post('/api/login/', data)
          .then((response) => {
            console.log('Logged in')
            router.push('/home')
          })
          .catch((errors) => {
            console.log('Cannot log in')
            console.log(errors.response.data)
          })
      }
      login()
    }
  }
}
</script>