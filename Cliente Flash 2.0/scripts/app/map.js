(function (global) {
    var map,
        geocoder,
        markerPosition,
        LocationViewModel,
        app = global.app = global.app || {};

    LocationViewModel = kendo.data.ObservableObject.extend({
        _lastMarker: null,
        _isLoading: false,

        address: "",
        isGoogleMapsInitialized: false,
        hideSearch: false,

        onNavigateHome: function () {
            var that = this, position;

            that._isLoading = true;
            that.toggleLoading();

            navigator.geolocation.getCurrentPosition(
                function (position) {
                    position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    map.panTo(position);
                    that._putMarker(position);
                    that._putDir(position);
                    that._isLoading = false;
                    that.toggleLoading();
                },
                function (error) {
                    var errorText = "No ha sido posible determinar la ubicacio&acute;n actual.\n";
                    if (error.POSITION_UNAVAILABLE) {
                        navigator.notification.alert(errorText + " ERROR MESSAGE : " + error.message,
                            function () { }, "POSITION_UNAVAILABLE " + error.code, 'OK');
                    }
                    else if (error.PERMISSION_DENIED) {
                        navigator.notification.alert(errorText, function () { }, "PERMISSION_DENIED", 'OK');
                    }
                    else if (error.TIMEOUT) {
                        navigator.notification.alert(errorText, function () { }, "TIMEOUT", 'OK');
                    }

                    //default map coordinates
                    position = new google.maps.LatLng(43.459336, -80.462494);
                    map.panTo(position);

                    that._isLoading = false;
                    that.toggleLoading();
                },
                {
                    maximumAge: 0,
                    timeout: 10000,
                    enableHighAccuracy: true
                }
            );
        },

        onSearchAddress: function () {
            var that = this;

            geocoder.geocode(
                {
                    'address': that.get("address")
                },
                function (results, status) {
                    if (status !== google.maps.GeocoderStatus.OK) {
                        navigator.notification.alert("La direccio&acute;n no se ha podido localizar.",
                            function () { }, "Bu&acute;squeda fallida", 'OK');
                        return;
                    }

                    map.panTo(results[0].geometry.location);
                    that._putMarker(results[0].geometry.location);
                });
        },

        toggleLoading: function () {
            if (this._isLoading) {
                kendo.mobile.application.showLoading();
            } else {
                kendo.mobile.application.hideLoading();
            }
        },

        _putMarker: function (position) {
            var that = this;

            if (that._lastMarker !== null && that._lastMarker !== undefined) {
                that._lastMarker.setMap(null);
            }

            that._lastMarker = new google.maps.Marker({
                map: map,
                position: position,
                draggable: true
            });
            markerPosition = position;
            google.maps.event.addListener(that._lastMarker, 'drag', function (event) {
                markerPosition = event.latLng;
                geocoder.geocode({ 'latLng': event.latLng }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        $("#map-address").val(results[0].formatted_address);
                    }
                });
            });
        },
        
        _putDir: function(position) {
            var that = this;

            geocoder.geocode({ 'latLng': position }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    $("#map-address").val(results[0].formatted_address);
                } else {
                    $("#map-address").val("google no ha podido identificar la direccio&acute;n");
                }
            });
        },
        
        solicitar: function () {
            window.localStorage["latSolicitud"] = markerPosition.k;
            window.localStorage["lngSolicitud"] = markerPosition.D;
            app.mobileApp.navigate('views/propuestaView.html');
        },   
        
    });

    app.locationService = {
        initLocation: function () {
            var mapOptions,
            	streetView;

            if (typeof google === "undefined") {
                return;
            }

            app.locationService.viewModel.set("isGoogleMapsInitialized", true);

            mapOptions = {
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_CENTER
                },

                mapTypeControl: false,
                streetViewControl: false
            };

            map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
            geocoder = new google.maps.Geocoder();
            app.locationService.viewModel.onNavigateHome.apply(app.locationService.viewModel, []);
            
            

            streetView = map.getStreetView();

			google.maps.event.addListener(streetView, 'visible_changed', function() {

			    if (streetView.getVisible()) {                  
					app.locationService.viewModel.set("hideSearch", true);
			    } else {
					app.locationService.viewModel.set("hideSearch", false);
  			  }
 
			});
        },

        show: function () {
            if (!app.locationService.viewModel.get("isGoogleMapsInitialized")) {
                return;
            }

            //resize the map in case the orientation has been changed while showing other tab
            google.maps.event.trigger(map, "resize");
        },

        hide: function () {
            //hide loading mask if user changed the tab as it is only relevant to location tab
            kendo.mobile.application.hideLoading();
        },
        
        viewModel: new LocationViewModel()
    };
}
)(window);