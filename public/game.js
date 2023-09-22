var randomizedArray = [];
var currentQuestion = "";
var nextQuestion = "";
var questionsAnswered;
var questionsTotal = "";
var questionsRight = 0;

var progressStore = new ProgressStore();

/**
 * @callback getQuestionSetCb
 * @param {(null|Questions)} result - An array of questions. `null` if failed
 * @param {(null|Error)} error - Error if any. Indicates failure if not `null`
 */

/**
 * Get question set asynchronously.
 * @param {getQuestionSetCb} cb The callback
 */
function getQuestionSet(cb) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onload = () => {
    if (httpRequest.status == 200) {
      var questions = JSON.parse(httpRequest.responseText);
      cb(questions.questions, null);
    } else if (httpRequest.status == 404) {
      cb(null, new Error("Not found."));
    }
  };
  httpRequest.onerror = function () {
    cb(null, new Error("Request failed."));
  };
  httpRequest.open("GET", "questions.json", true);
  httpRequest.send();
}

function shouldResume() {
  return window.location.pathname === "/resume";
}

/**
 * Randomize given questions and return a new one
 * @param {Questions} questionSet
 * @returns {Questions} A new Array containing randomized questions from `questionSet`
 */
function shuffleSet(questionSet) {
  var randomized = [];

  var length = questionSet.length;
  questionsTotal = length;

  // Create a randomized array of all the questions

  while (length > 0) {
    var randomNumber = Math.floor(Math.random() * length);
    randomized.push(questionSet[randomNumber]);
    questionSet.splice(randomNumber, 1);
    length--;
  }
  return randomized;
}

/**
 * Initiate test.
 * @param {Questions} questions - Complete set of questions to test the user
 * @param {Progress} progress - Current progress
 */
function initTest(questions, progress) {
  console.log(arguments);
  if (progress === undefined) {
    progress = { current: 1, total: questions.length };
  }

  questionsAnswered = progress.current - 1;
  questionsTotal = progress.total;

  randomizedArray = questions.slice(progress.current - 1);

  checkAnswer();

  nextSequence();
}

window.addEventListener("load", function () {
  if (shouldResume()) {
    var progress = progressStore.getProgress();
    if (!progress) {
      alert("No progress saved. Click okay to go back to start page.");
      this.window.location = "/";
      return;
    }
    initTest(progressStore.getQuestions(), progress);
  } else {
    getQuestionSet(function (questions, error) {
      if (error) {
        console.log(error.message);
      } else {
        var shuffled = shuffleSet(questions);
        progressStore.startProgress(shuffled);
        initTest(shuffled);
      }
    });
  }
});

function populateCount() {
  $("#answered").html(questionsAnswered);
  $("#remaining").html(questionsTotal);
}

function nextSequence() {
  progressStore.saveProgress(questionsAnswered + 1);
  if (randomizedArray.length == 0) {
    gameFinished();
    return;
  }

  var nextQuestion = randomizedArray.pop();
  currentQuestion = nextQuestion;
  questionsAnswered++;

  $("#questionImage").attr("src", nextQuestion.image);
  $("#one").html(nextQuestion.one);
  $("#two").html(nextQuestion.two);
  $("#three").html(nextQuestion.three);
  $("#four").html(nextQuestion.four);
  $("#question-p").html(nextQuestion.question);

  populateCount();

  // Colapse image area if there is no image
  if (nextQuestion.image == "") {
    $("#questionImage").css("height", "3rem");
  } else {
    $("#questionImage").css("height", "15rem");
  }

  $(".answer input:checked").prop("checked", false);
  $("#question").css("opacity", "1");
}

function checkAnswer() {
  $(".answer input").click(function () {
    if ($(".answer input:checked").val() == currentQuestion.answer) {
      // Display a check if right
      setTimeout(function () {
        $("#check").css("display", "block");
      }, 300);

      // Hide check
      setTimeout(function () {
        $("#check").css("display", "none");
      }, 1500);

      // Add one to the number of questions right
      questionsRight++;

      // Fade out the current question
      setTimeout(function () {
        $("#question").css("opacity", "0");
      }, 500);

      // Go to the next question
      setTimeout(function () {
        if (randomizedArray.length > 0) {
          nextSequence();
        }
      }, 1500);

      // Reset correct answer color
      setTimeout(function () {
        let selectedAnswer = $(".answer input:checked").parent();
        selectedAnswer.find(".check").css({ "background-color": "#defcf8" });
      }, 1700);
    } else {
      // Display an X if wrong
      setTimeout(function () {
        $("#ex").css("display", "block");
      }, 300);

      // Show correct answer
      $("#" + currentQuestion.answer).css("color", "#cf142b");
      $("#" + currentQuestion.answer).css("font-weight", "900");

      // Hide X
      setTimeout(function () {
        $("#ex").css("display", "none");
      }, 1500);

      // Fade out current question
      setTimeout(function () {
        $("#question").css("opacity", "0");
      }, 500);

      // Go to next question
      setTimeout(function () {
        if (randomizedArray.length > 0) {
          nextSequence();
        }
      }, 1500);

      // Reset correct answer color
      setTimeout(function () {
        $("#" + currentQuestion.answer).css("color", "#e8eded");
        $("#" + currentQuestion.answer).css("font-weight", "400");
        let selectedAnswer = $(".answer input:checked").parent();
        selectedAnswer.find(".check").css({ "background-color": "#defcf8" });
      }, 500);

      // Reset selected answer colour
    }
  });
}

// Give a final score at the end with an option to restart the game
function gameFinished() {
  progressStore.clear();
  $(".answer input").click(function () {
    setTimeout(function () {
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
