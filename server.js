var express = require('express')
var app = express()
var passport = require('passport')
var path = require('path')
var session = require('express-session')
var bodyParser = require('body-parser')
var env = require('dotenv').load()
var exphbs = require('express-handlebars')
var favicon = require('serve-favicon')

const port = process.env.PORT || 5000;

app.use(express.static('public'))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

//For BodyParser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// For Passport
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


//For Handlebars
app.set('views', './app/views')
app.engine('hbs', exphbs({
    extname: '.hbs',
    partialsDir: __dirname + '/app/views/partials/'
}));
app.set('view engine', '.hbs');



app.get('/', function(req, res) {
    res.render('home', {
      home: false,
      signin: true,
      signup: true
    });
});

//Models
var models = require("./app/models");

//Routes
var authRoute = require('./app/routes/auth.js')(app,passport);

//load passport strategies
require('./app/config/passport/passport.js')(passport, models.user);

//Sync Database
models.sequelize.sync().then(function() {
    console.log('Nice! Database looks fine')
}).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!")
});


app.listen(port, function(err) {
    if (!err)
        console.log("Site is live");
    else console.log(err)
});
