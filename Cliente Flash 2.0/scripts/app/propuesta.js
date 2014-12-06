(function (global) {
    var aceptarCarreraViewModel,
        app = global.app = global.app || {};

    aceptarCarreraViewModel = kendo.data.ObservableObject.extend({
        

        acepta: function () {
            
                navigator.notification.alert("Both fields are required!",
                    function () { }, "Login failed", 'OK');

            

        },

        cancela: function () {
            navigator.notification.alert("Both fields are required!",
                    function () { }, "Login failed", 'OK');

        }
    });

    app.propuestaService = {
        viewModel: new aceptarCarreraViewModel()
    };
})(window);