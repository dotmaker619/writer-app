
var
    config = require('./config'),
    _ = require('lodash'),
    express = require('express'),
    cookieParser = require('cookie-parser'),
    csrf = require('csurf'),
    bodyParser = require('body-parser'),
    request = require('request'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    crypto = require('crypto'),
    app = express();

/*
var pug = require('pug');
var babel = require('pug-babel');
pug.filters.babel = babel({});
*/

Global = {};

//Set-up a global for REST API calls
Global.apiRequest = request.defaults({
    baseUrl : config.api.url,
    json: true
});

//SECURITY - Prevent exposure of server type
app.disable('x-powered-by');

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

//SECURITY - prevent csrf (or angular equiv)
app.use(cookieParser());
app.use(csrf({ cookie: true }));
app.use(function(req, res,next){
    res.locals._csrf = req.csrfToken();
    next();
});

app.use(express.static(__dirname + 'public'));

//Setup any requires that need to be available within jade templates
app.locals._ = require("lodash");
app.locals.moment = require("moment");

app.set('views', __dirname + 'views');
app.set('view engine', 'pug');
//Ensure template inheritance works
app.set('view options', {
    layout: false
});

//SECURITY - Use non-default session cookie key (or angular equiv)
var session = require("express-session");
app.use(session({
    secret: "s3Cur3",
    key: "sessionId",
    saveUninitialized: false,
    resave: true
}));

//Authorisation
app.use(passport.initialize());
app.use(passport.session());
app.use(function ensureAuthenticated(req, res, next) {

    if(req.path.indexOf('/app') != -1) {
        if (req.isAuthenticated()) {
            return next();
        }
        else {
            req.session.error = 'Please sign in!';
            res.redirect('/login');
        }
    }else{
        return next();
    }
});

app.use(function setContext(req, res, next){
    res.locals.context = {user: req.user,
                          path: req.path};
    return next();
});

//TODO - use full OAuth2 strategy when available in API
passport.use(new LocalStrategy(
    function(username, password, done) {

        var json = {grant_type: "password",
            username: username,
            password: password};

        var errorMessage;

        //Call REST API to do login
        Global.apiRequest.post({ uri: '/auth/token',body: json},
            function (error, response, tokenBody) {
                if (!error && response.statusCode == 200) {
                    //Logged in! - Get user details to store on session
                    Global.apiRequest.get({ uri: 'user/me', 'auth': {'bearer': tokenBody.access_token}},
                        function (error, response, body) {
                            if (!error && response.statusCode == 200) {

                                //Setup the session user object, with only the
                                //relevant data we need through-out the site

                                user = {username: body.user.username,
                                        roles: body.user.roles,
                                        kudos: body.user.kudos_available ? body.user.kudos_available : 0,
                                        avatar: body.user.avatar,
                                        access_token: tokenBody.access_token,
                                        isEditor: function(){
                                            return _(roles).contains('editor');
                                        },
                                        isWriter: function(){
                                            return _(roles).contains('writer');
                                        },
                                        isAdministrator: function(){
                                            return _(roles).contains('admin');
                                        }};

                                return done(null, user);
                            } else {

                                if (body && _.has(body, 'error')) {
                                    errorMessage = body.error.message;
                                } else if (_.has(response, 'statusMessage'))
                                    errorMessage = response.statusMessage;
                                else {
                                    errorMessage = error;
                                }
                                return done(null, false, {message: errorMessage});
                            }
                        });
                }else{
                    if(tokenBody && _.has(tokenBody,'error')){
                        errorMessage = tokenBody.error.message;
                    }else if(_.has(response,'statusMessage'))
                        errorMessage = response.statusMessage;
                    else{
                        errorMessage = error;
                    }
                    //return done(errorMessage);
                    return done(null, false, { message: errorMessage });
                }
            });
    }
));
//Need to declare 2 passport functions to handle serializing of user info to session
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

//Routes
app.use('/login',require('./routes/login'));
app.use('/password/reset',require('./routes/password'));
app.use('/password',require('./routes/password'));
app.use('/join/verify',require('./routes/join'));
app.use('/join',require('./routes/join'));
app.use('/app/logout',require('./routes/app/logout'));
app.use('/app/profile',require('./routes/app/profile'));
app.use('/app/password',require('./routes/app/password'));
app.use('/app/tasks',require('./routes/app/tasks'));
app.use('/app/tools',require('./routes/app/tools'));
app.use('/app/kudos',require('./routes/app/kudos'));
app.use('/app',require('./routes/app/app'));
app.use('/', require('./routes/index'))


// error handler
/*
app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);

    // handle CSRF token errors here
    res.status(403);
    res.send('form tampered with');
})
*/

/*
// Declare app level module which depends on views, and components
angular.module('biblatio', [
    'ngRoute',
    'biblatio.app.login',
    'biblatio.join',
    'biblatio.view1',
    'biblatio.view2',
    'biblatio.view3',
    'biblatio.version'
]).
config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/app/login', {
        templateUrl: 'app/login/login.html',
        controller: 'LoginCtrl'
      }).otherwise({redirectTo: '/view1'});
}]);
*/


app.listen(config.server.port);