const WRONGLY_ANSWERED_KEY = "wronglyAnswered";
function AnswersStore() {
  // load wrongly answered
  try {
    const stored = localStorage.getItem(WRONGLY_ANSWERED_KEY);
    if (!stored) throw new Error(WRONGLY_ANSWERED_KEY + " does not exist");
    else this.wronglyAnswered = JSON.parse(stored);
  } catch (e) {
    // JSON parse failed / null, load an empty array
    this.clear();
  }
}

AnswersStore.prototype.clear = function clear() {
  this.wronglyAnswered = [];
  localStorage.removeItem(WRONGLY_ANSWERED_KEY);
};

AnswersStore.prototype.findAlreadyWrong = function findAlreadyWrong(question) {
  return (
    this.wronglyAnswered.filter(
      (answered) => answered.question.question === question.question
    ).length > 0
  );
};

AnswersStore.prototype.saveWrongAnswer = function saveWrongAnswer(
  question,
  answer
) {
  if (this.findAlreadyWrong(question)) return;
  this.wronglyAnswered.push({ question, answer });
  localStorage.setItem(
    WRONGLY_ANSWERED_KEY,
    JSON.stringify(this.wronglyAnswered)
  );
};

AnswersStore.prototype.getWronglyAnswered = function getWronglyAnswered() {
  return this.wronglyAnswered;
};
