var randomizedArray = [];
var currentQuestion = "";
var nextQuestion = "";
var questionsAnswered = "";
var questionsTotal = "";
var questionsRight = 0;

window.addEventListener( "load", function(){

  var httpRequest = new XMLHttpRequest();

  httpRequest.open("GET", "questions.json", true);

  httpRequest.onload = () => {
    if(httpRequest.status == 200) {

      var questions = JSON.parse(httpRequest.responseText);

      var array = questions.questions;

      var length = array.length;
      questionsTotal = length;

      while (length > 0) {
        var randomNumber = Math.floor(Math.random() * length);
        randomizedArray.push(array[randomNumber]);
        array.splice(randomNumber, 1);
        length--;
      }

      var firstQuestion = randomizedArray.pop();
      currentQuestion = firstQuestion;
      questionsAnswered = 1;


      $("#questionImage").attr("src", firstQuestion.image);
      $("#one").html(firstQuestion.one);
      $("#two").html(firstQuestion.two);
      $("#three").html(firstQuestion.three);
      $("#four").html(firstQuestion.four);
      $("#question-p").html(firstQuestion.question);

      populateCount();

      // Colapse image area if there is no image
     if ( firstQuestion.image == "" ) {
       $("#questionImage").css("height", "3rem");
     } else {
       $("#questionImage").css("height", "15rem");
     }

      checkAnswer();

    } else if (httpRequest.status == 404) {
      console.log("Not found.");
    };
  };

  httpRequest.onerror = () => {
    console.log("Request failed.");
  }

  httpRequest.send();

});

function populateCount() {
  $("#answered").html(questionsAnswered);
  $("#remaining").html(questionsTotal);
}

function nextSequence(checkAnswer) {
  var nextQuestion = randomizedArray.pop();
  currentQuestion = nextQuestion;
  questionsAnswered++


  $("#questionImage").attr("src", nextQuestion.image);
  $("#one").html(nextQuestion.one);
  $("#two").html(nextQuestion.two);
  $("#three").html(nextQuestion.three);
  $("#four").html(nextQuestion.four);
  $("#question-p").html(nextQuestion.question);


  populateCount();

    // Colapse image area if there is no image
   if ( nextQuestion.image == "" ) {
     $("#questionImage").css("height", "3rem");
   } else {
     $("#questionImage").css("height", "15rem");
   }

  $(".answer input:checked").prop("checked", false);
  $("#question").css("opacity", "1");

  if (randomizedArray.length == 0) {
    gameFinished();
  }

}

function checkAnswer() {
  $(".answer input").click(function() {
    if($(".answer input:checked").val() == currentQuestion.answer){

      // Display a check if right
        setTimeout(function() {
        $("#check").css("display", "block");
      }, 300);

        // Hide check
        setTimeout(function() {
          $("#check").css("display", "none");
        }, 2500);

        // Add one to the number of questions right
        questionsRight++;

        // Fade out the current question
        setTimeout(function() {
          $("#question").css("opacity", "0");

        }, 1500);

        // Go to the next question
      setTimeout(function() {
        if (randomizedArray.length > 0) {
          nextSequence();
        }
      }, 3000);

      // Reset correct answer color
      setTimeout(function() {
      let selectedAnswer = $(".answer input:checked").parent();
      selectedAnswer.find(".check").css({"background-color": "#F3F6B4"});
      }, 2900);

    } else {

      // Display an X if wrong
      setTimeout(function() {
      $("#ex").css("display", "block");
      }, 300);

      // Show correct answer
      $("#" + currentQuestion.answer).css("color", "#EE7064");

      // Hide X
      setTimeout(function() {
        $("#ex").css("display", "none");
      }, 2500);

      // Fade out current question
      setTimeout(function() {
        $("#question").css("opacity", "0");
      }, 1500);

      // Go to next question
      setTimeout(function() {
        if (randomizedArray.length > 0) {
          nextSequence();
        }
      }, 3000);

      // Reset correct answer color
      setTimeout(function() {
      $("#" + currentQuestion.answer).css("color", "#F3F6B4");
      let selectedAnswer = $(".answer input:checked").parent();
      selectedAnswer.find(".check").css({"background-color": "#F3F6B4"});
      }, 2900);

    }

  });
}

  // Give a final score at the end with an option to restart the game
function gameFinished() {
  $(".answer input").click(function() {
      setTimeout(function() {
        var totalScore = Math.round((questionsRight / questionsTotal) * 100);
        $("#question").css("display", "none");
        $("#results").css("display", "block");
        $("#percentage").html(totalScore + "%");
        $("#correct").html(questionsRight);
        $("#total").html(questionsTotal);
        $("#question-count").css("display", "none");
      }, 3000);
  });
}
