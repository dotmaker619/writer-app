var _ = require('lodash'),
    express = require('express'),
    router = express.Router();

router.get('/', function(req, res, next) {
    var errorMessage = "Unexpected Error";

    //Load my profile from API server
    Global.apiRequest.get({ uri: 'user/me',
            'auth': {
            'bearer': req.user.access_token
        }},
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var user = body.user;
                user.editor = _.includes(user.roles,'editor');
                user.writer = _.includes(user.roles,'writer');
                res.render('app/profile.pug',{user: user});
                return;
            }else{
                if(_.has(body,'error')){
                    errorMessage = body.error.message;
                }
                else if(_.has(body,'errors')){
                    var errMessage = body.errors[0].message;
                    if(typeof errMessage == "string"){
                        errorMessage = errMessage;
                    };
                    if(typeof errMessage == "object"){
                        errorMessage = errMessage.message;
                    };
                }else if(_.has(response,'statusMessage')) {
                    errorMessage = response.statusMessage;
                }

            }
            res.render('app/profile.pug',{message: errorMessage});
        });
});

router.post('/', function(req, res, next) {
    var errorMessage = "Dude, haven't done this yet!";
    var user = req.body;
    //TODO - when updated, update the auth req.user fields too.
    res.render('app/profile.pug',{message: errorMessage, user: user});
});

module.exports = router;
