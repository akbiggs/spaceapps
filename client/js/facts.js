var trivia = new Array();
trivia.push("Its length and width are about the size of a football field.");
trivia.push("It is powered by 8 solar arrays. That's around 84 kilowatts!");
trivia.push("There are approximately 2.3 million lines of code behind the ISS.");
trivia.push("The 55-foot robot arm assembly can lift the weight of a space shuttle orbiter!");
trivia.push("The ISS weighs more than 233 hippopotamus!");

var randomTrivia = function() {
    var next = Math.random();
    
    var randomIndex = Math.floor(Math.random() * trivia.length);
    return trivia.splice(randomIndex, 1);
};

var startTimeWasting = function() {
    $("#facts").append("<p class='fact' style='display: none;'>While you wait, here are some fun facts about the ISS.</p>");
    $('.fact').fadeIn();
    $.get("http://192.168.0.113:8000/space/lastday", function(data) {
        $("#facts").append("<p class='fact' style='display: none;'>In the past 24 hours, " + data.toString() + " have seen the satellite.</p>");
        $(".fact").fadeIn();
    });
};

var wasteTime = function() {
    var nextFact = randomTrivia();
    $("#facts").append("<p class='fact' style='display: none;'>" + nextFact + "</p>");
    $('.fact').fadeIn();
};

var concludeTimeWasting = function() {
    $("#facts").fadeOut(400, function(){

        $.get("http://192.168.0.113:8000/space/mostfriendly", function(data) {
            $("#done").append("<p>And the most ISS-friendly region in the world is...<b>" + data + "!</b></p>");
            setTimeout(function() {
                $("#done").fadeOut(400, function() {
                    $('#map').show();
                });
            }, 4000);
        });
    });
}
