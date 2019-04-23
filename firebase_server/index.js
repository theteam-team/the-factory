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
var key='Users/';
var key_new='new/';


app.post("/api/login/", (req, res, next) => {
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


app.get('/api/logout/', function(req, res){
    req.logout();
    console.log("logged out")
    return res.send();
});

app.post('/api/order/', function(req, res){
    console.log("Order Starting")
    console.log(req.body)
    var messageListRef = db.ref(key_new);
    var newMessageRef = messageListRef.push();

    newMessageRef.set({
        name: req.body.name,
        location1: req.body.location1,
        location2: req.body.location2,
        red: req.body.red,
        green: req.body.green,
        yellow: req.body.yellow
    });

    console.log("Order Added to the data base")
    return res.send();
});


const authMiddleware = (req, res, next) => {

    if (!req.isAuthenticated()) {
        res.status(401).send('You are not authenticated')
    } else {
        return next()
    }
}


app.get("/api/user/", authMiddleware, (req, res) => {

    db.ref(key).on('value', function(users){

        let user = null

        users.forEach(function(u) {
            u = u.val()
            
            if(u.name === req.session.passport.user)
                user = u
        });
        
        res.send({user: user})
    });
    

})


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, 
  (username, password, done) => {

    db.ref(key).on('value', function(users){

        let user = null

        users.forEach(function(u) {
            u = u.val()
            if(u.email === username && u.password === password)
                user = u
        });

        if (user)
            done(null, user)
        else
            done(null, false, {message: 'Incorrect username or password'})
        

    });
    
   
  }
))

passport.serializeUser((user, done) => {
  done(null, user.name)
})

passport.deserializeUser((name, done) => {

    db.ref(key).on('value', function(users){

        let user = null

        users.forEach(function(u) {

            u = u.val()
            if(u.name === name)
                user = u
        });

        done(null, user)

    });
    
  
})


app.listen(3000, () => {
  console.log("Example app listening on port 3000")
})








