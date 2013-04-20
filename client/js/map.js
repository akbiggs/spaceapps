var mapping = {
    map: Kartograph.map("#mymap"),
    mapURL: "../svg/usa.svg",

    loadMap: function() {
        mapping.map.loadMap(mapping.mapURL, function() {
            // do something
            console.log(mapping.map);
            mapping.map.addLayer("usa");
            /*mapping.map.addLayer({
                id: "countries",

		        styles: {
		            fill: '#ee9900'
		        },

		        title: function(d) {
		            return d.countryName;
		        }
            });*/
        });
    },

    showMap: function(pos) {
        mapping.loadMap();
    },

    locString: function(pos) {
        return "(" + pos.lat + ", " + pos.long + ")"

    },

    getLocation: function(callback) {
        if (navigator.geolocation) {
            $("#location-form").html("<p>Finding location...</p>");

            var locationMarker = null;
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    // check if already have the location
                    // fixes bug in FF where invoked more than once due to
                    // cached result
                    if (locationMarker) {
                        return;
                    }

                    locationMarker = {
                        "lat": position.coords.latitude,
                        "long": position.coords.longitude
                    };
                    
                    $("#location-form").html("");
                    callback(locationMarker);
                }
            );
            
        } else {
            var form = "";
            form += "<label for='location'>Enter your location: </label>";
            form += "<input type='text' id='location' />";
            form += "<button onClick='handlers.submitLocation()'></button>";
            $("#location-form").html(form);
        }
    },
};


