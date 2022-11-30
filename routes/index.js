var _ = require('lodash'),
    express = require('express'),
    version = require('../package.json').version,
    router = express.Router();

router.get('/', function(req, res, next) {
    res.render('home.pug',{
        loggedin: req.isAuthenticated(),
        version: version
    })
});

module.exports = router;
