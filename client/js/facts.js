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
};

var wasteTime = function() {
    var nextFact = randomTrivia();
    $("#facts").append("<p class='fact' style='display: none;'>" + nextFact + "</p>");
    $('.fact').fadeIn();
};

var concludeTimeWasting = function() {
    $("#facts").fadeOut();
}
