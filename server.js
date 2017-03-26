var LocalStrategy = require('passport-local').Strategy;
var express = require('express');
var app = express();
var passport = require('passport');
var bodyParser = require('body-parser');
var expressSession = require('express-session');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressSession({ secret: 'thisIsASecret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(function(username, password, done) {
    if ((username === "John") && (password === "password")) {
        return done(null, { username: username, id: 1 });
    } else {
        return done(null, false);
    }
}));

app.get('/success', function(req, res) {
    if (req.isAuthenticated()) {
        res.send('Hey, ' + req.user + ', hello from the server!');
    } else {
        res.redirect('/login');
    }
});


app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/public/login.html');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/success',
    failureRedirect: '/login'
}));

app.listen(8000, function() {
    console.log("Ready for some authentication action");
})
