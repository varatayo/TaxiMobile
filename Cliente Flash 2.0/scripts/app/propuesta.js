(function (global) {
    var aceptarCarreraViewModel,
        app = global.app = global.app || {};

    aceptarCarreraViewModel = kendo.data.ObservableObject.extend({
        

        acepta: function () {

            app.showAlert("acepta el tiempo");
            

        },

        cancela: function () {
            app.showAlert("acepta el tiempo");

        }
    });

    app.propuestaService = {
        viewModel: new aceptarCarreraViewModel()
    };
})(window);