var _ = require('lodash'),
    express = require('express'),
    router = express.Router();

router.get('/', function(req, res, next) {

    Global.apiRequest.post({ uri: '/authentication/revoke', auth: {'bearer': req.user.access_token},
        qs : {token: req.user.access_token}},
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                req.logout();
                res.render('app/logout.pug',{message: "You have been Signed-out."});
            } else {
                var errorMessage;
                if (body && _.has(body, 'error')) {
                    errorMessage = body.error.message;
                } else if (_.has(response, 'statusMessage'))
                    errorMessage = response.statusMessage;
                else {
                    errorMessage = error;
                }
                res.render('app/logout.pug',{message: errorMessage});
            }
        });


});

module.exports = router;

