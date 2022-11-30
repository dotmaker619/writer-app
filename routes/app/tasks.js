var _ = require('lodash'),
    express = require('express'),
    router = express.Router();

router.get('/', function(req, res, next) {

    Global.apiRequest.get({
            uri: 'tasks',
            qs: {page: req.query.p},
            auth: {
                'bearer': req.user.access_token
            }},
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                return res.render('app/tasks.pug',{tasks:body.tasks, pagination: body.pagination});
            }else{
                var message;

                //TODO - generalize API error response handling
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
                }else if(_.has(response,'statusMessage'))
                    message = response.statusMessage;
                else{
                    message = "Unexpected Error";
                }
                return res.render('app/tasks.pug',{message: message});
            }
        });
});

router.post('/', function(req, res, next) {
    var new_task = req.body;
    new_task.content_type = 'text/plain';

    Global.apiRequest.post({
            uri: 'task',
            auth: {
                'bearer': req.user.access_token
            },
            body: new_task},
        function (error, response, body) {
            if (!error && response.statusCode == 200) {

                Global.apiRequest.get({
                        uri: 'tasks',
                        auth: {
                            'bearer': req.user.access_token
                        }},
                    function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            return res.render('app/tasks.pug',{tasks:body.tasks, pagination: body.meta.pagination, message: "New Task Posted!"});
                        }else{
                            var message;

                            //TODO - generalize API error response handling
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
                            }else if(_.has(response,'statusMessage'))
                                message = response.statusMessage;
                            else{
                                message = "Unexpected Error";
                            }
                            return res.render('app/tasks.pug',{message: message});
                        }
                    });
            }else{
                var message;

                //TODO - generalize API error response handling
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
                }else if(_.has(response,'statusMessage'))
                    message = response.statusMessage;
                else{
                    message = "Unexpected Error";
                }
                res.render('app/tasks.pug',{message: message});
            }
        });
});

module.exports = router;
