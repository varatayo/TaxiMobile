(function (global) {
    var aceptarCarreraViewModel,
        app = global.app = global.app || {};

    aceptarCarreraViewModel = kendo.data.ObservableObject.extend({

        acepta: function () {
            var fechaHora = app.formattedDate;
            app.showAlert(fechaHora);
            $.post("http://rtflash.azurewebsites.net/movil/solicitud",
                { IdUsuario: window.localStorage["username"], FechaHora: fechaHora, Latitud: -33.437818, Longitud: -70.634398, Comentario: "" },
                function (res) {
                    app.showAlert(res);
                    //app.showAlert("El usuario o password ingresados no son correctas.");
                },
                "json");

        },
        
        cancela: function () {
            app.mobileApp.navigate('views/mapView.html', 'slide');
        }
    });

    app.propuestaService = {
        viewModel: new aceptarCarreraViewModel()
    };
})(window);