const CHOICES = ["one", "two", "three", "four"];

const makechoiceHTML = (label, value, correctAnswer, wrongAnswer) => {
  const color =
    value === wrongAnswer
      ? "#cf142b"
      : value === correctAnswer
        ? "#32cf32"
        : "unset";
  return `
    <div class="answer review">
      <input class="default-check" type="radio" name="answers" value="${value}" disabled>
      <span class="check" style="background-color: ${color}"></span>
      <label id="${value}" for="${value}">${label}</label>
    </div>
`;
};
const makeQuestionHTML = (question, wrongAnswer) => `
<section class="question">

  ${question.image ? `<img id="questionImage" src="${question.image}">` : ""}
<p id="question-p">${question.question}</p>

  ${CHOICES.map((choice) =>
  makechoiceHTML(question[choice], choice, question.answer, wrongAnswer)
).join("")}

  </section>
`;

window.addEventListener("load", function() {
  const store = new AnswersStore();
  const allWronglyAnswered = store.getWronglyAnswered();

  $("#wrongly-answered").html(
    allWronglyAnswered
      .map((answered) => {
        return makeQuestionHTML(answered.question, answered.answer);
      })
      .join("")
  );
});
