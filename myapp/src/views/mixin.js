
 export default{
   data(){
     return{
        user: {
          "email" : '',
          "password" : ''
        },
        sorting:true,
        collecting:true,
        idForOrder:1,
        order: {
          "id" : "",
          "client" : {
            "name" : "",
            "latitude" : "",
            "longitude" : ""
          },
          "red" : "",
          "green" : "",
          "yellow" : "",
          "status" : ""
        },
        orders:[],
     }
   },
   methods:{
    removeOrder(index){
      this.orders.splice(index, 1)
    }
  }
 }
