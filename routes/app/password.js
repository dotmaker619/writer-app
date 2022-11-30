var _ = require('lodash'),
    express = require('express'),
    router = express.Router();

router.get('/', function(req, res, next) {
    res.render('app/password.pug')
});

router.post('/', function(req, res, next) {
    var errorMessage = "Not implemented yet!";
    res.render('app/password.pug',{message: errorMessage});
});

module.exports = router;
