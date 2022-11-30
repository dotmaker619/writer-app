var _ = require('lodash'),
    express = require('express'),
    router = express.Router(),
    passport = require('passport');

router.get('/', function(req, res, next) {
    res.render('app/app.pug');
});

module.exports = router;
