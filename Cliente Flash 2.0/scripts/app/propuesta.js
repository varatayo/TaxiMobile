(function (global) {
    var aceptarCarreraViewModel,
        app = global.app = global.app || {};

    aceptarCarreraViewModel = kendo.data.ObservableObject.extend({

        acepta: function () {
            var date = new Date();
            var fechaHora = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay() + "T" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            
            $.post("http://rtflash.azurewebsites.net/movil/solicitud",
                { IdUsuario: 1, FechaHora: fechaHora, Latitud: -33.437818, Longitud: -70.634398, Comentario: "" },
                function (res) {
                    if (res.IdSolicitud != 0)
                    {
                        app.showAlert("La solicitud se ha creado correctamente.");
                        app.mobileApp.navigate('views/mapView.html', 'slide');
                    }
                    else
                    {
                        app.showError(res.IdSolicitud);
                    }
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
