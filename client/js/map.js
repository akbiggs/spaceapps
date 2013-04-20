var mapping = {
    map: $K.map("#map", 800, 400),
    mapURL: "../svg/usa.svg",

    loadMap: function() {
        mapping.map.loadMap(mapping.mapURL, function() {
            // do something
             mapping.map.addLayer('countries', {
		        styles: {
		            fill: '#ee9900'
		        },
		        title: function(d) {
		            return d.countryName;
		        }
		    });
        });
    },

    showMap: function(pos) {
        mapping.loadMap();
        $("#map").html("<p>Map of surrounding results for " 
                + mapping.locString(pos) + " goes here.</p>");
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


