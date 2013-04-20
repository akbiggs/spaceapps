var map = {
    map: $K.map("#map", 800, 400),
    mapURL: "../svg/world_onelayer.svg",

    loadMap: function() {
        this.map.loadMap(this.mapURL, function() {
            // do something
             map.addLayer('countries', {
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

        map.loadMap();
        $("#map").html("<p>Map of surrounding results for " 
                + map.locString(pos) + " goes here.</p>");

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


