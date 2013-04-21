var max, density;

$.get("http://192.168.0.113:8000/space/max", function(data){
    max = parseInt(data);
}, "text");

var pick_colour = function(num){
    if (num === undefined){
        return '#FFFFFF';
    } else if( num < max/4) {
        return '#EDF9FC';
    } else if(num < max/2){
        return '#B2E2E2';
    } else if(num < 3*max/4){
        return '#66C2A4';
    } else {
        return '#238B45';
    }
}

var mapping = { 
    map: Kartograph.map("#map" ,$(window).width()),
    mapURL: "../svg/world.svg",

    loadMap: function(densities, callback) {
        mapping.map.loadMap(mapping.mapURL, function() {
            mapping.map.addLayer("provinces", {
		        
                styles: {
		            fill: '#FFFFFF'
		        },

                chunks: 75,

		        title: function(d) {
		            return d.id;
		        },

                key: function(d) {
                    return d.id;
                },

                done: function() {
                    concludeTimeWasting();
                    $("#map").css("display", "block");
                }
            });
            startTimeWasting();
            setInterval(wasteTime, 4000);
            
        });
    },

    showMap: function(densityData, pos) {
        mapping.loadMap(densityData, function(map) {
            $.mobile.changePage("#results");
            $(".ui-page").css("background-image", "none");
        });
    },

    locString: function(pos) {
        return "(" + pos.lat + ", " + pos.long + ")"

    },

    getLocation: function(callback, yesVote) {
        navigator.geolocation = undefined;
        if (navigator.geolocation) {
            $("#location-form").html("<p>Finding location...</p>");

            var location = null;
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    
                    // check if already have the location
                    // fixes bug in FF where invoked more than once due to
                    // cached result
                    if (location) {
                        return;
                    }

                    location = {
                        "lat": position.coords.latitude,
                        "long": position.coords.longitude
                    };
                    
                    $("#location-form").html("<p>Retrieving map of other users...</p>");
                    var params = {
                        "lat": location.lat,
                        "lon": location.long,
                        "value": yesVote
                    };

                    $.post("http://192.168.0.113:8000/space/add", params, function(densityData) {
                        $("#location-form").html("<p>Rendering map...</p>");
                        callback(JSON.parse(densityData), location);
                    });
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
