var _ = require('lodash'),
    express = require('express'),
    router = express.Router();

router.get('/', function(req, res, next) {
    res.render('app/tools.pug');
});

module.exports = router;
