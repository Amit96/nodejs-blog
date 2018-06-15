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
app.use(express.static(path.join(__dirname, 'bower_components')));

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
  if(req.isAuthenticated()) {
    res.render('dashboard', {
      logout_button: true,
      c:0
    });
  }
  else {

    var entry_string = '';
    models.stories.findAll({

    }).then(function(stories) {

      entry_string = '';
      for(var i = 0; i < stories.length; i++) {
        entry_string += '<div class = "entry" onclick = "window.location = \'\/story?id='+stories[i].dataValues.story_id +'\'"><div class = "entry_short_details">';
        entry_string = entry_string + '<p>' + stories[i].dataValues.email + '</p>';
        entry_string = entry_string + '<p>' + stories[i].dataValues.story + '</p>';
        entry_string = entry_string + '<p>' + stories[i].dataValues.createdAt +
        '&nbsp&nbsp' + stories[i].dataValues.likes + '&nbsp&nbsp' + stories[i].dataValues.dislikes + '</p>';
        entry_string = entry_string + '</div></div>';
      }
      res.render('home', {
        c:0,
        entries: entry_string
      });

    }).catch(function(error) {
      console.log(error);
    });

  }
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
