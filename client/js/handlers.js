var handlers = {
    sawIt: function() {
        this.hideUI();
        map.getLocation(map.showMap);
    },

    missedIt: function() {
        this.hideUI();
        map.getLocation(map.showMap);
    },

    hideUI: function() {
        $(".content-before-map").fadeOut("slow", 0);
    }
};
