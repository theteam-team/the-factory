<template>
  <v-app dark>
  <v-navigation-drawer temporary v-model="sideNav"  clipped  fixed>

<!-- 
v-scroll:#scroll-target="onScroll"
-->
          <v-layout   column  align-center    style="height: 1000px">
            <v-flex xs12  >
              <v-toolbar color="orange" dark>
                 <v-icon x-large  > supervisor_account</v-icon>
                  <v-toolbar-title>All Customers</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon>
                    <v-icon>search</v-icon>
                  </v-btn>

                </v-toolbar>
                <v-list three-line>
                  <template >
                      <div v-for="(order, index) in orders" v-bind:key="order.id">
                          <v-list-tile @click="showDetails(index)">
                            <v-list-tile-avatar>
                              <v-icon x-large dark>account_circle</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                              <div class="item" style="margin-left:180px;" @click="removeOrder(index)"> &times;</div>
                              <div  style="display:inline-block;font-size:20px; "> {{ orders[index].client.name }} </div>

                              <div  style="font-size:20px;margin-left:0px; "> Order ID: {{ orders[index].client.email }} </div>
                            </v-list-tile-content>
                          </v-list-tile>
                            <v-divider></v-divider>
                          </div>
                        </template>
                </v-list>
            </v-flex>
          </v-layout>

    </v-navigation-drawer>

    <v-toolbar clipped-left>
      <v-toolbar-side-icon  @click.native.stop="sideNav = !sideNav"></v-toolbar-side-icon>
      <v-toolbar-title>
       Orders
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-toolbar-items >

        <v-btn :key="menuItems[0].title"
        router
        :to="menuItems[0].link">
          <v-icon left>{{ menuItems[0].icon }}</v-icon>
          {{ menuItems[0].title}}
        </v-btn>

        <v-btn v-on:click="logout" >
          <v-icon left>{{ menuItems[1].icon }}</v-icon>
          {{ menuItems[1].title}}
        </v-btn>

        <v-btn :key="menuItems[2].title"
        router
        :to="menuItems[2].link">
          <v-icon left>{{ menuItems[2].icon }}</v-icon>
          {{ menuItems[2].title}}
        </v-btn>
<!--
        <v-btn flat v-for="item in menuItems"
        :key="item.title"
        router
        :to="item.link">
          <v-icon left>{{ item.icon}}</v-icon>
        {{ item.title}}

        </v-btn>
-->
      </v-toolbar-items>
    </v-toolbar>


    <main>
      <router-view></router-view>
    </main>
  </v-app>
</template>

<script>

import router from './router'
import axios from 'axios'

import mixin from './views/mixin';

import { serverBus } from './main';

export default {

  mixins:[mixin],
  data () {
    return {

      sideNav:false,
      menuItems:[
        { icon:'home', title:'Home',link:'/home'},
        { icon:'lock_open', title:'logout', link:'/'},
        { icon:'face', title:'Signup',link:'/signup'},

      ],

    }
  },

  name: 'App',
  methods: {
    logout: function (e) {
      axios.get('/api/logout')
        .then(() => {
          router.push('/')
        })
    },
    showDetails(index){
      this.order = this.orders[index]
      serverBus.$emit('orderSelected', this.orders[index]);
    }
  },
  created() {
    // Using the server bus
    serverBus.$on('ordersReceived', (orders) => {
      this.orders = orders
    });

    serverBus.$on('user', (user) => {
      this.user = user
    });
 }

}

</script>
<style>
  .item{
    cursor:pointer;
    display:inline-block;
    margin-left:50px;
  }
</style>
