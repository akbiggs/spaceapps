var max,
    panzoom,
    w = $(window).width();


$.get("http://192.168.0.113:8000/space/max", function(data){
    max = parseFloat(data);
    }, "text");


var pick_colour = function(num){
    if (num === undefined || num.density == 0){
        return '#FFFFFF';
    } else if( num.density < max/4) {
        return '#EDF9FC';
    } else if(num.density < max/2){
        return '#B2E2E2';
    } else if(num.density < 3*max/4){
        return '#66C2A4';
    } else {
        return '#238B45';
    }
};

var get_pos = function(pos, axis){
    if(axis == "x"){
        var coord = $('#results.ui-page').width() * (180.0 + pos.long)/360;
        return (coord - $(window).width()/2);
    } else if(axis == "y"){
        var coord = $('#results.ui-page').height() * (90 - pos.lat)/360
        return (coord - $(window).height()/2);
    }
}

var initPanZoom = function(pos){
    console.log(pos)
    var panZoom = mapping.map.paper.panzoom({ 
        initialZoom : 5,
        initialPosition : {
            x : get_pos(pos, "x"),
            y : get_pos(pos, "y"), 
        }
    });
    console.log(panZoom);
    panZoom.enable()

    setInterval(function() {
        $('h1').html(panZoom.currZoom +' x:'+panZoom.currPos.x.toFixed(0)+' y:'+panZoom.currPos.y.toFixed(0));
        }, 50);
    var css = '<style type="text/css">.grabbing { cursor: url(data:image/x-icon;base64,AAACAAEAICACAAcABQAwAQAAFgAAACgAAAAgAAAAQAAAAAEAAQAAAAAAAAEAAAAAAAAAAAAAAgAAAAAAAAAAAAAA////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8AAAA/AAAAfwAAAP+AAAH/gAAB/8AAAH/AAAB/wAAA/0AAANsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////////////////////////////////////////////////gH///4B///8Af//+AD///AA///wAH//+AB///wAf//4AH//+AD///yT/////////////////////////////8=), pointer !important; } .map-controls div { cursor:pointer; font-size: 20px; color: #777; font-weight:bold; font-family: Helvetica; line-height: 28px; text-align:center;border: 1px solid #bbb; } .map-controls div:hover { border: 1px solid #999; color: #000; }</style>';
    $('body').append(css);

    // init pan zoom controls
    var ctrls = $('<div />'), 
        up = $('<div>+</div>'), 
        down = $('<div>-</div>');

    ctrls
        .addClass('map-controls')
        .css({ position: 'absolute', top: 20, right: 20, 'z-index': 1000 })
        .append(up).append(down);
        up.css({
            'border-radius': '14px 14px 0 0', 
            width: 28, 
            height: 28, 
            position: 'absolute',
            top: 0, 
            right: 0, 
            background: '#fff' 
        });
        down.css({ 
            'border-radius': '0 0 14px 14px', 
            width: 28, 
            height: 28, 
            position: 'absolute',
            top: 29, 
            right: 0, 
            background: '#fff' 
        });
        $('#map').parent().append(ctrls);
            
        up.click(function (e) {
            panZoom.zoomIn(1);
            e.preventDefault();
        });
        down.click(function (e) {
            panZoom.zoomOut(1);
            e.preventDefault();
        });
}

var mapping = { 
    map: Kartograph.map("#map" , w),
    mapURL: "../svg/world.svg",

    loadMap: function(densities, pos, callback) {
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

                tooltips: function(d) {
                    if(densities[d.id] != undefined){
                        return [densities[d.id].name, 'sightings: ' + densities[d.id].sightings];
                    }else{
                        return ["",""];
                    }
                    
                },  

                done: function() {
                    concludeTimeWasting();
                    $("a").each(function() {
                        var shape = $(this);
                        var title = shape.attr("title");
                        $.each(shape.children(), function(index, child) {
                            child.setAttribute("fill", pick_colour(densities[title]));
                        });
                    });
                }
            });
            startTimeWasting();
            setInterval(wasteTime, 4000);
            callback(mapping.map);
            
            initPanZoom(pos);
        });
    },

    showMap: function(densityData, pos) {
        mapping.loadMap(densityData, pos, function(map) {
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

                        densityData = JSON.parse(densityData);
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
