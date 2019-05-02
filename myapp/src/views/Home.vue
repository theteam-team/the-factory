<template>
  <v-container fluid grid-list-md>

    <v-layout row warp>
      <v-flex  d-flex xs12 sm4 md6 >
        <v-card>
         <v-container fluid>
           <v-layout row>
             <v-flex xs12>
               <v-flex xs8 offset-xs2>
                 <v-card  class="grey darken-1">
                   <v-container>
                     <v-layout  wrap justify-space-around align-center>

                         <div style="font-size:25px">
                           <v-avatar  color="yellow" >
                             <v-icon x-large dark>account_circle</v-icon>
                           </v-avatar>
                           {{ user.email }}
                         </div>

                    </v-layout>
                  </v-container>
                 </v-card>
               </v-flex>
               <v-layout row warp>
                   <v-flex xs12 sm4 md8  >
                    <img src="./qrcode.png" style="margin:30px; padding-left:150px">
                  </v-flex>
               </v-layout>
               <v-flex xs12  >
                 <br>
                 <div style="font-size:25px;" >-ID: {{ order.id }} </div>
                 <div style="font-size:25px;" >-Name: {{ order.client.name }} </div>
                 <div style="font-size:25px;" >-Location1: {{ order.client.latitude }}</div>
                 <div style="font-size:25px;" >-Location2: {{ order.client.longitude }}</div>
                 <br>
                 <p style="font-size:25px;" >Product information:</p>
                 <div style="font-size:25px;">-Red balls: {{ order.red }}</div>
                 <div style="font-size:25px;" >-Green balls: {{ order.green }}</div>
                 <div style="font-size:25px;" >-Yellow balls: {{ order.yellow }}</div>
                 <br>
                  <v-flex xs12 offset-xs7 >
                 <v-btn   v-on:click="OrderToNode">Send Order</v-btn>
                 </v-flex>
              </v-flex>
             </v-flex>
           </v-layout>

         </v-container>
       </v-card>
      </v-flex>



      <v-flex d-flex xs6>
            <v-layout row wrap>



                  <v-flex d-flex xs12 offset-xs0>
                    <v-card>
                      <v-flex d-flex xs12 offset-xs3>
                            <div style="font-size:25px">
                              <v-avatar x-large >
                               <img src="./gear.svg">
                              </v-avatar> factory modules
                            </div>
                      </v-flex>
                    </v-card>
                  </v-flex>


                  <v-flex d-flex xs12>
                    <v-card>
                      <v-container>
                        <v-layout>
                          <v-flex xs12>
                            <v-flex xs6  >
                              <v-card  class="grey darken-1">
                                <v-container>
                                  <v-layout  >
                                      <h1>Sorting machine</h1>
                                 </v-layout>
                               </v-container>
                              </v-card>
                            </v-flex>
                           <img src="./robot-arm.png" style="padding:20px; margin-left:180px">
                           <h2 style="margin-left:200px" v-if="sorting"> Loading... </h2>
                           <h2 style="margin-left:200px" v-else-if="sorting">sorting is finished </h2>
                           <v-progress-linear
                             color="warning"
                             height="15"
                             :value="progress"
                            ></v-progress-linear>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-card>
                  </v-flex>


             <v-flex d-flex xs12>
               <v-card>
                 <v-container>
                   <v-layout>
                     <v-flex xs12>
                       <v-flex xs6  >
                         <v-card  class="grey darken-1">
                           <v-container>
                             <v-layout  >
                                 <h1>Collecting order</h1>
                            </v-layout>
                          </v-container>
                         </v-card>
                       </v-flex>
                      <img src="./production.png" style="padding:20px; margin-left:180px">
                      <h2 style="margin-left:200px" v-if="collecting">loading...</h2>
                      <h2 style="margin-left:200px" v-else-if="collecting">order is finished </h2>
                      <v-progress-linear
                        color="warning"
                        height="15"
                        :value="progress"
                       ></v-progress-linear>
                     </v-flex>
                   </v-layout>
                 </v-container>
               </v-card>
             </v-flex>


          </v-layout>


      </v-flex>


    </v-layout>
  </v-container>
</template>

<script>

import axios from 'axios'
import router from '../router'

import mixin from './mixin'

import { serverBus } from '../main';

export default {

  mixins:[mixin],
  name: 'Login',
  data () {
    return {
      valueDeterminate: 50
    }
  },
  methods: {

    getOrdersData: function () {
      let self = this
      axios.get('/api/user/')
        .then((response) => {
          console.log(response)

          //self.$set(this, 'location1', response.data.user.latitude)
          //self.$set(this, 'location2', response.data.user.longitude)

          self.$set(this, 'user', response.data.user)

          for (var order in  response.data.orders)
              this.orders.push(response.data.orders[order])

          serverBus.$emit('ordersReceived', this.orders);
          serverBus.$emit('user', this.user);

        })
        .catch((errors) => {
          console.log(errors)
          router.push('/')
        })
    },
    
    OrderToNode() {

        let data = {
          id: this.order.id,
          red: this.order.red,
          green: this.order.green,
          yellow: this.order.yellow
        }
        axios.post('/api/node/', data)
          .then((response) => {
            console.log('Order Made')
          })
          .catch((errors) => {
            console.log('Order Failed')
          })

    },

  },
  created() {
  // Using the server bus
  serverBus.$on('orderSelected', (order) => {
    this.order = order
  });

  
 },
  mounted () {
    this.getOrdersData()

    var HOST = "ws://localhost:3000";

    var ws = new WebSocket(HOST);
    ws.onopen = function(){
        ws.send(JSON.stringify({
            type: "client_connected",
            data: "hello !"
        }));
    }

    ws.onmessage = function(event)
    {

      if(event.type == "order")
      {
        /*
        var check = true
        
        for (var order in  this.orders)
        {
          if(order.id == event.order.id)
          {
            check = false
            break
          }
        }
        
        if(check)
        {
          this.orders.push(event.order)
          serverBus.$emit('ordersReceived', this.orders);
        }

        */

      this.orders = []
       for (var order in  event.order)
              this.orders.push(event.order[order])
      
      serverBus.$emit('ordersReceived', this.orders);
        
      }

      else if (event.type == "progress")
      {
        this.progress = event.progress
      }
    };

  }
}
</script>
