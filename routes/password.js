var _ = require('lodash'),
    express = require('express'),
    router = express.Router();

router.get('/', function(req, res, next) {
    res.render('password/password.pug');
});

router.post('/', function(req, res, next) {
    //Send a link to the email address
    var message= "Unexpected Error";

    //Call REST API to do login
    Global.apiRequest.put({ uri: 'user/password/reset',
            qs: {email: req.body.email}},
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                message = "Password reset link sent - please check your email";
            }else{
                if(_.has(body,'error')){
                    message = body.error.message;
                }
                else if(_.has(body,'errors')){
                    var errMessage = body.errors[0].message;
                    if(typeof errMessage == "string"){
                        message = errMessage;
                    };
                    if(typeof errMessage == "object"){
                        message = errMessage.message;
                    };
                }else if(_.has(response,'statusMessage')){
                    message = response.statusMessage;
                }
            }
            res.render('password/done.pug',{message: message});
        });
});

router.get('/reset', function(req, res, next) {
    res.render('password/reset.pug',{token:req.query.token});
});

router.post('/reset', function(req, res, next) {
    var json = {token: req.body.token,
                password: req.body.password},
        message,
        valid = true;

    //Validate & Compare passwords
    if(!json.token){
        valid = false;
        message = "Invalid request"
    }
    if(json.password.length > 0  && json.password != req.body.password_confirm){
        valid = false;
        message = "Confirm Password does not match Password."
    }

    if(!valid){
        res.render('password/reset.pug',{token: json.token, message: message});
        return;
    }

    Global.apiRequest.post({ uri: 'user/password/reset',body: json},
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                message = "Password changed successfully";
            }else{
                if(_.has(body,'error')){
                    message = body.error.message;
                }
                else if(_.has(body,'errors')){
                    var errMessage = body.errors[0].message;
                    if(typeof errMessage == "string"){
                        message = errMessage;
                    };
                    if(typeof errMessage == "object"){
                        message = errMessage.message;
                    };
                }else if(_.has(response,'statusMessage')){
                    message = response.statusMessage;
                }
            }
            res.render('password/done.pug',{message: message});
        });
});

module.exports = router;
