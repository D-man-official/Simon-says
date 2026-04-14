let gamePattern = [];
let userClickedPattern = [];
let buttonColours = ["red", "blue", "green", "yellow"];

let Level = 0;


let blue = new Audio("sounds/blue.mp3");
let red = new Audio("sounds/red.mp3");
let green = new Audio("sounds/green.mp3");
let yellow = new Audio("sounds/yellow.mp3");


let started = false;

$("body").keydown(function () {
    if (!started) {
        nextSequence();
        started = true;
    }
});

$("#Start").click(nextSequence);

$("#Reset").click(function () {
    Level = 0;
    gamePattern = [];
    userClickedPattern = [];
    $("#level-title").text("Press A Key to Start");
});

function nextSequence() {

    let randomNumber = Math.floor(Math.random() * 4);
    let randomChosenColour = buttonColours[randomNumber];

    gamePattern.push(randomChosenColour);
    console.log(gamePattern);

    Level++;
    $("#level-title").text("Level " + Level);

   for (let i = 0; i < gamePattern.length; i++) {
    setTimeout(function () {
        animatePress(gamePattern[i]);
        soundColor(gamePattern[i]);
    }, i * 600);
}

}


$(".btn").click(function () {

    if (Level > 0) {

        let userChosenColour = $(this).attr("id");

        userClickedPattern.push(userChosenColour);
        console.log(userClickedPattern);

        animatePress(userChosenColour);
        soundColor(userChosenColour);



        checkAnswer(userClickedPattern.length - 1);
    }
});


function animatePress(currentColour) {

    $("." + currentColour).addClass("pressed");

    setTimeout(function () {
        $("." + currentColour).removeClass("pressed");
    }, 150);
}



function soundColor(userChosenColour) {

    switch (userChosenColour) {

        case "blue":
            blue.currentTime = 0;
            blue.play();
            break;

        case "red":
            red.currentTime = 0;
            red.play();
            break;

        case "green":
            green.currentTime = 0;
            green.play();
            break;

        case "yellow":
            yellow.currentTime = 0;
            yellow.play();
            break;
    }
}


function checkAnswer(currentLevel) {

    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        console.log("success");
        if (userClickedPattern.length === gamePattern.length) {
            
            partyPopper();

            setTimeout(function () {
                nextSequence();
                userClickedPattern = [];
            }, 1000);
        }

    } else {
    console.log("wrong");

    let wrong = new Audio("sounds/wrong.mp3");
    wrong.play();

    $("body").addClass("game-over");

    setTimeout(function () {
        $("body").removeClass("game-over");
    }, 200);

    $("#level-title").html("<font color='red'>Game Over</font>, Press Any Key to Restart");

    Level = 0;
    gamePattern = [];
    userClickedPattern = [];
    }
}   



function partyPopper() {
    let duration = 200;
    let end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            spread: 700,
            origin: { y: 0.6 }
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}

