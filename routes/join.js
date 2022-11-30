var _ = require('lodash'),
    express = require('express'),
    router = express.Router();

router.get('/', function(req, res, next) {
    var context = {};
    if(req.query.editor == 'true'){
        context.editor = true;
    }
    if(req.query.writer == 'true'){
        context.writer = true;
    }
    res.render('join/join.pug',context);
});

router.get('/welcome', function(req, res, next) {
    res.render('join/welcome.pug',{message: "Welcome to Biblatio! Next step - get the app."});
});

router.get('/verify', function(req, res, next) {
    var message= "Unexpected Error";

    //Call REST API to do login

    Global.apiRequest({ uri: 'user/verify',
            method: 'post',
            qs: {token: req.query.token}},
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                message = "Thank you. Your Email address has been verified.";
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
            res.render('join/verify.pug',{message: message});
        });


});

router.post('/', function(req, res, next) {
    var user = {email: req.body.email,
                   username: req.body.username,
                   password: req.body.password,
                   firstname: req.body.firstname,
                   lastname: req.body.lastname,
                   editor: req.body.editor == "on",
                   writer: req.body.writer == "on"};

    //Client side validation
    var valid = true;
    if(!user.editor && !user.writer){
        valid = false;
        user.message = "You must select Editor or Writer (or both)."
    }
    if(user.password.length > 0  && user.password != req.body.password_confirm){
        valid = false;
        user.message = "Confirm Password does not match Password."
    }

    if(!valid){
        res.render('join/join.pug',user);
        return;
    }

    //Call REST API to do login

    Global.apiRequest.post({ uri: 'user/register',body: user},
        function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //Logged in! - redirect
            res.redirect('/join/welcome');
        }else{
            if(_.has(body,'error')){
                user.message = body.error.message;
            }
            else if(_.has(body,'errors')){
                var errMessage = body.errors[0].message;
                if(typeof errMessage == "string"){
                    user.message = errMessage;
                };
                if(typeof errMessage == "object"){
                    user.message = errMessage.message;
                };
            }else if(_.has(response,'statusMessage'))
                user.message = response.statusMessage;
            else{
                user.message = "Unexpected Error";
            }

        }
        res.render('join/join.pug',user);
    });


});

module.exports = router;
