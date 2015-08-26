var express = require("express");
var app = express();
var path = require("path");
var env = require("./env");
var session = require("express-session");
var bodyParser = require("body-parser");
var methodOverride = require('method-override');
var db = require("./db/connection");

// var User = require("./db/connection").models.User;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use("/", express.static(path.join(__dirname + "/public")));
app.set("view engine", "hbs");

var passport = require("passport")
var SpotifyStrategy = require("passport-spotify").Strategy;
passport.use(new SpotifyStrategy({
    clientID: env.consumerKey,
    clientSecret: env.consumerSecret,
    callbackURL: env.callbackUrl
  },
   function(accessToken, refreshToken, profile, done) {
      token = accessToken
      tokenSecret = refreshToken
      profile = profile
      done(null, profile)
//     // db.User.find({
//     // where: Sequelize.or({ spotifyId: profile.id })
//     //     }).success(function (user) {
//     //     if (!user) {
//     //         db.User.create({ spotifyId: profile.id});
//     //     }
//     // });
    db.models.User.findOrCreate({where: {
        
          spotifyId: profile.id
      }})
      .spread(function(user, created) {
        // console.log(user.get({
        //   plain: true
        // }))
        console.log(created)
    });
 }
));


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.use(passport.initialize())
app.use(passport.session())


var usersController = require("./controllers/users");
var playlistsController = require("./controllers/playlists");

app.get("/", function(req, res){
  res.render("index", {})
});

app.use("/", usersController);
app.use("/", playlistsController);


app.get('/auth/spotify',
  passport.authenticate('spotify'),
  function(req, res){
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  });

app.get('/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  function(req, res) {
    //   req.session.token = token
    //   req.session.tokenSecret = tokenSecret
      //req.session.profile = profile
    // Successful authentication, redirect home.
      res.redirect('/');
  });







app.listen(3000, function(){
  console.log("Listening on port 3000");
});
