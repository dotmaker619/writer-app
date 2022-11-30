var _ = require('lodash'),
    express = require('express'),
    router = express.Router();

router.get('/', function(req, res, next) {
    res.render('app/account.pug');
});

module.exports = router;
