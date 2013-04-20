var handlers = {
    sawIt: function() {
        this.hideUI();
        mapping.getLocation(mapping.showMap, true);
    },

    missedIt: function() {
        this.hideUI();
        mapping.getLocation(mapping.showMap, false);
    },

    hideUI: function() {
        $(".header").fadeOut("slow", 0);
        $(".content-before-map").fadeOut("slow", 0);
    }
};
