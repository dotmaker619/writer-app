var _ = require('lodash'),
    express = require('express'),
    router = express.Router();

router.get('/buy', function(req, res, next) {
    var errorMessage = "Unexpected Error";

    //Load my profile from API server
    Global.apiRequest.get({ uri: 'user/me',
            'auth': {
            'bearer': req.user.access_token
        }},
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var user = body.user;
                user.editor = _.contains(user.roles,'editor');
                user.writer = _.contains(user.roles,'writer');
                res.render('app/kudos_buy.pug',{user: user});
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
            res.render('app/kudos_buy.pug',{message: errorMessage});
        });
});

router.post('/buy', function(req, res, next) {
    var amount = 0;
    if(req.body.level == "basic"){
        amount = 5;
    }
    if(req.body.level == "value"){
        amount = 15;
    }
    if(req.body.level == "premium"){
        amount = 30;
    }

    if(req.body.type == "paypal"){
        //TODO - kick off paypal purchase flow
        var errorMessage = "Unexpected Error";
        var data = '{ "amount" : "' + amount + '"}';
        console.log(data);
        Global.apiRequest.post({
                uri: 'payment',
                headers: {'content-type': 'application/json',
                    'Authorization': 'Bearer: ' + req.user.access_token
                },
                form: JSON.parse(data)
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var user = body.user;
                    user.editor = _.contains(user.roles,'editor');
                    user.writer = _.contains(user.roles,'writer');
                    res.render('app/kudos_buy.pug',{user: user});
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
                res.render('app/kudos_buy.pug',{message: errorMessage});
            }
        );
    }

    res.render('app/kudos_buy.pug');
});

module.exports = router;
