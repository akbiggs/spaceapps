var handlers = {
    sawIt: function() {
        this.hideUI();
        mapping.getLocation(mapping.showMap);
    },

    missedIt: function() {
        this.hideUI();
        mapping.getLocation(mapping.showMap);
    },

    hideUI: function() {
        $(".header").fadeOut("slow", 0);
        $(".content-before-map").fadeOut("slow", 0);
    }
};
