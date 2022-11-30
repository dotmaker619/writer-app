
//System JS loader config
SystemJS.config({
        transpiler:'plugin-babel',
        map: {
            'plugin-babel': '/js/plugin-babel.js',
            'systemjs-babel-build': '/js/systemjs-babel-browser.js'
        },
    meta: {
        '/jsx/*.jsx': {
            babelOptions: { react: true }
        }
    }
})

//Create the socket.io connection for notifications
var socket = io('http://localhost:3002/',
    {
        query: {
            token: Bib.Global.AccessToken
        },
    transports: ['websocket']
});

socket.on('reconnect_attempt', () => {
        socket.io.opts.query = {
        token: Bib.Global.AccessToken
    },
    //Add polling transport on reconnect attempt, in case websockets can't used (routers, proxies, etc.)
    socket.io.opts.transports = ['polling', 'websocket'];
});

socket.on('api', (data) => {
    console.log(data);
});

Bib.Function.textStats = function( val ){
    return {
        //charactersNoSpaces : val.replace(/\s+/g, '').length,
        characters         : val.length,
        //words              : val.match(/\S+/g).length,
        words              : val.match(/\w+/g).length,
        //lines              : val.split(/\r*\n/).length
    };
};

$(document).ready(function () {

    $('.user').on({
        mouseenter: function () {
            $('.user').addClass('over');
            $('.user_sub_menu').show();
        },
        mouseleave: function () {
            $('.user').removeClass('over');
            $('.user_sub_menu').hide();
        }
    });

    $('#content').on({
        keyup: function () {
            updateTextCount($('#content'), $('#text_stats'));
        }
    });

    $('#new_task').on({
        click: function () {
            $('.task_list').hide();
            $('.task_detail').show();
        }
    });

    function updateTextCount(text, stats){

        var textStats = Bib.Function.textStats(text.val());
        if(textStats.characters > 300) {
            text.css('background-color', '#ff0000');
        }else{
            text.css('background-color', '#ffffff');
        }

        stats.text('{0}/300 [{1}]'.format(textStats.characters, textStats.words));
    }

    /*
    setTimeout( function(){
        //newTasksAlert();

        //HTML 5 notfs - chrome only
        //http://www.paulund.co.uk/html5-notifications

        var Notification = window.Notification || window.mozNotification || window.webkitNotification;

        Notification.requestPermission(function (permission) {
            // console.log(permission);
        });


                var instance = new Notification(
                    "New Task", {
                        body: "I wondered lonely as a cloud ...",
                        icon: "http://localhost:8000/android-chrome-192x192.png",
                        data: 'TASK_OID_HERE'
                    }
                );

                instance.onclick = function () {
                    instance.close.bind(instance);
                    //alert('Notf clicked!');
                    //Convince minimized browser to restore
                    //window.focus();
                    //self.focus();
                };
                instance.onerror = function () {
                    // Something to do
                };
                instance.onshow = function () {
                    // Something to do
                };
                instance.onclose = function () {
                    // Something to do
                };

    }, 5000 );

    newTasksAlert = (function () {
        var oldTitle = document.title;
        var msg = "New!";
        var timeoutId;
        var blink = function() { document.title = document.title == msg ? ' ' : msg; };
        var clear = function() {
            clearInterval(timeoutId);
            document.title = oldTitle;
            window.onmousemove = null;
            timeoutId = null;
        };
        return function () {
            if (!timeoutId) {
                timeoutId = setInterval(blink, 1000);
                window.onmousemove = clear;
            }
        };
    }());
*/

});