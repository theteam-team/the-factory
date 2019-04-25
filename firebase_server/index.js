//server side
var admin = require('firebase-admin');
var serviceAccount = require('./realtime-23d22-firebase-adminsdk-i7h3m-838e286cca.json');

const express = require('express')

// creating an express instance
const app = express()

const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')
const passport = require('passport')

// getting the local authentication type
const LocalStrategy = require('passport-local').Strategy

const publicRoot = '../client/dist'
//app.use(express.static(publicRoot))


app.use(bodyParser.json())
app.use(cookieSession({
    name: 'mysession',
    keys: ['vueauthrandomkey'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours 
  }))

app.use(passport.initialize());
app.use(passport.session());

// Used for testing
let users = [
    {
        id: 1,
        name: "Jude",
        email: "user@email.com",
        password: "password"
    },
    {
        id: 2,
        name: "Emma",
        email: "emma@email.com",
        password: "password2"
    },
]

//initalize admin_SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://realtime-23d22.firebaseio.com'
});


//database refrence
var db = admin.database();

var key_admins='admins/';
var key_orders='orders/';
var key_node='node/';


app.post("/api/login/", (req, res, next) => {

    console.log("Logging in")
    console.log(req.body)

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        
        if (!user) {
            
            return res.status(400).send([user, "Cannot log in", info])
        }

        req.login(user, (err) => {
            res.send("Logged in")
        })
    })(req, res, next)
})

app.post('/api/signup/', function(req, res){

    console.log("Signing Up")
    
    console.log(req.body)

    var messageListRef = db.ref(key_admins);

    messageListRef.once('value', function(users){

        let check = true

        users.forEach(function(u) {

            u = u.val()

            if(u.email === req.body.email)
            {
                check = false
                console.log("This Email is already signed up")
                return res.status(400).send('This Email is already signed up')
                
            }
        });

        if(check)
        {
            var newMessageRef = messageListRef.push();
    
            newMessageRef.set({
                email: req.body.email,
                password: req.body.password
            });
    
            console.log("Admin Added")
            return res.send();

        }

    });

    
});



app.get('/api/logout/', function(req, res){
    req.logout();
    console.log("logged out")
    return res.send();
});

app.post('/api/node/', function(req, res){

    console.log("Sending Order to Node")
    console.log(req.body)

    var messageListRef = db.ref(key_node);

    messageListRef.once('value', function(order){

        let check = true

        users.forEach(function(u) {

            u = u.val()

            if(u.id === req.body.id)
            {
                check = false
                console.log("This order is already added")
                return res.status(400).send('This order is already added')
                
            }
        });

        if(check)
        {
            var newMessageRef = messageListRef.push();
    
            newMessageRef.set({
                id: req.body.id
            });
    
            console.log("Order Added to the data base")
            return res.send();

        }

    });
});


const authMiddleware = (req, res, next) => {

    if (!req.isAuthenticated()) {
        res.status(401).send('You are not authenticated')
    } else {
        return next()
    }
}


app.get("/api/user/", authMiddleware, (req, res) => {

    db.ref(key_admins).once('value', function(users){

        let user = null
        //console.log(req.session.passport)
        
        users.forEach(function(ad) {
            u = ad.val()
            if(u.email === req.session.passport.user)
                user = u
        });

        db.ref(key_orders).once('value', function(orders){

            orders = orders.val()

            let data = {
                user: user,
                orders: orders
            }
            res.send(data)
        });
        
    });
    

})


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, 
  (email, password, done) => {

    db.ref(key_admins).once('value', function(admins){

        let user = null

        admins.forEach(function(ad) {
            u = ad.val()

            console.log(u, email, password)
            if(u.email === email && u.password === password)
                user = u
        });

        if (user)
            done(null, user)
        else
            done(null, false, {message: 'Incorrect email or password'})
        

    });
    
   
  }
))

passport.serializeUser((user, done) => {
  done(null, user.email)
})

passport.deserializeUser((email, done) => {

    db.ref(key_admins).once('value', function(admins){

        let user = null

        admins.forEach(function(u) {

            u = u.val()
            if(u.email === email)
                user = u
        });

        done(null, user)

    });
    
  
})


app.listen(3000, () => {
  console.log("Example app listening on port 3000")
})








