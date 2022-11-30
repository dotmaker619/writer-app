var _ = require('lodash'),
    express = require('express'),
    router = express.Router(),
    passport = require('passport');

router.get('/', function(req, res, next) {
    res.render('login/login.pug');
});

router.post('/', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.render('login/login.pug',{username: req.body.username, message: info.message}); }
        //Adds passport user as req.user to session for subsequent middleware requests
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/app/');
        });
    })(req, res, next);
});

module.exports = router;
