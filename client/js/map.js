var mapping = { 
    map: Kartograph.map("#map", $(window).width() * 0.75, $(window).width() * (0.33)),
    mapURL: "../svg/usa.svg",

    loadMap: function(callback) {
        mapping.map.loadMap(mapping.mapURL, function() {
            mapping.map.addLayer("usa", {

		        styles: {
		            fill: '#ee9900'
		        },

		        title: function(d) {
		            return "MERICA";
		        }
            });
            callback(mapping.map);
        });
    },

    showMap: function(pos) {
        mapping.loadMap();
    },

    locString: function(pos) {
        return "(" + pos.lat + ", " + pos.long + ")"

    },

    getLocation: function(callback, yesVote) {
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
