var map = {
    showMap: function(pos) {
        $("#map").html("<p>Map of surrounding results for " 
                + this.locString(pos) + " goes here.</p>");
    },

    locString: function(pos) {
        return "(" + pos.lat + ", " + pos.long + ")"
    },
};
