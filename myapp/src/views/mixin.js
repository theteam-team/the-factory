
 export default{
   data(){
     return{
       name:'',
       username:'',
        id:'',
        sorting:true,
        collecting:true,
        status:'',
        Done:'',
        location1:'',
        location2:'',
        red:'',
        green:'',
        yellow:'',
        orange:'',
        idForOrder:1,
        order:'',
        orders:[],
        /*
        orders:[
          {
            'name':'menna essam',
            'id':1
          },
          {
            'name':'ahmed',
            'id':2
          }
        ],
        */
     }
   },
   methods:{
     create(){
       db.ref(key).on('value', function(snap){

        orders = snap.val();

        Object.keys(orders).forEach((name) => {

          this.orders.push({
            id:this.idForOrder,
            name: orders[name].name,
            location1: orders[name].location1,
            location2: orders[name].location2,
            red: orders[name].red,
            green: orders[name].green,
            yellow: orders[name].yellow,
            orange: orders[name].orange
          });
           this.idForOrder ++

      });
    });
     },
    removeOrder(index){
      this.orders.splice(index, 1)
    }

  }
 }
