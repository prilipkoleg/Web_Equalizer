(function (document) {

    "use strict";

    var app = document.querySelector('#app');

    app.route = 'home';
    app.navigate = function (e) {
        console.log(e.target);
        app.route = e.target.getAttribute('data-route');
    }

})(document);


