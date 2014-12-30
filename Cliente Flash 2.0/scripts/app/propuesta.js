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
                    Latitud: window.localStorage["latSolicitud"], Longitud: window.localStorage["lngSolicitud"], Comentario: "qwerty"
                };
            app.serviceClient.postToService("SolicitudMovil", request, function (res) {
                        app.showAlert("La solicitud se ha creado correctamente.");
                        app.mobileApp.navigate('views/mapView.html', 'slide');
            }, function (ex) { app.showError(ex); });
        },
        
        cancela: function () {
            window.localStorage["latSolicitud"] = null;
            window.localStorage["lngSolicitud"] = null;
            app.mobileApp.navigate('views/mapView.html', 'slide');
        }
    });

    app.propuestaService = {
        init: function() {
            var request = { IdUsuario: 1 };
            app.serviceClient.postToService("TiempoDespacho", request, function (res) {
                var minSpan = $("#minutos-despacho");
                minSpan.val(res.Tiempo);
            }, function (ex) { app.showError(ex); });
        },

        viewModel: new aceptarCarreraViewModel()
    };
})(window);
