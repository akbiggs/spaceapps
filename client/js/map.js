/*$.getJSON("http://192.168.0.113:8000/space/list", function(data){
    density = JSON.parse(data);
})*/

var pick_colour = function(num, max) {
    if (num === undefined || num < max/4) {
        return '#EDF8FB';
    } else if(num < max/2){
        return '#B2E2E2';
    } else if(num < 3*max/4){
        return '#66C2A4';
    } else {
        return '#238B45';
    }
}

var mapping = { 
    map: Kartograph.map("#map", $(window).width() * 0.75, $(window).width() * (0.33)),
    mapURL: "../svg/world.svg",

    loadMap: function(densities, callback) {
        mapping.map.loadMap(mapping.mapURL, function() {
            mapping.map.addLayer("provinces", {

		        styles: {
		            fill: '#FFFFFF'
		        },

		        title: function(d) {
		            return d.id;
		        },

                key: function(d) {
                    return d.id;
                },
            });
            callback(mapping.map);
            
            $("a").each(function() {
                var shape = $(this);
                var title = shape.attr("title");
                $.each(shape.children(), function(index, child) {
                    child.setAttribute("fill", pick_colour(densities[title]));
                });
            });
            
            /*
            $.each(Object.keys(density), function(index, value) {
                
                $('a[key="' + value + '"]').children()[0].attr('fill', pick_colour(density.value));
            });*/
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
                    
                    $("#location-form").html("");
                    var params = {
                        "lat": location.lat,
                        "lon": location.long,
                        "value": yesVote
                    };

                    $.post("http://192.168.0.113:8000/space/add", params, function(densityData) {
                        callback(densityData, location);
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
