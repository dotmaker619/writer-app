window.Bib = {};
Bib.Global = {};
Bib.Function = {};

Bib.Function.alert = function (message, title) {
    $("<div></div>").dialog({
        buttons: { "Ok": function () { $(this).dialog("close"); } },
        close: function (event, ui) { $(this).remove(); },
        resizable: false,
        title: title,
        modal: true
    }).text(message);
};

String.prototype.format = function() {
    var str = this;
    for (var i = 0; i < arguments.length; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        str = str.replace(reg, arguments[i]);
    }
    return str;
};

$(document).ready(function () {

}); //$(document).ready

//Require.js configuration
/*
requirejs.config({
    baseUrl: 'js'
});
    */