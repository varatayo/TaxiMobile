(function (global) {
    var aceptarCarreraViewModel,
        app = global.app = global.app || {};

    aceptarCarreraViewModel = kendo.data.ObservableObject.extend({

        acepta: function () {
            var date = new Date();
            var fechaHora = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay() + "T" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

            var request =
                {
                    IdUsuario: window.localStorage["username"], FechaHora: fechaHora,
                    Latitud: -33.437818, Longitud: -70.634398, Comentario: ""
                };
            app.serviceClient.postToService("SolicitudMovil", request, function (res) {
                        app.showAlert("La solicitud se ha creado correctamente.");
                        app.mobileApp.navigate('views/mapView.html', 'slide');
                    
            }, function (ex) { app.showError(ex); });
        },
        
        cancela: function () {
            app.mobileApp.navigate('views/mapView.html', 'slide');
        }
    });

    app.propuestaService = {
        viewModel: new aceptarCarreraViewModel()
    };
})(window);
