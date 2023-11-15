window.addEventListener("load", function () {
  var progressStore = new ProgressStore();
  var progress = progressStore.getProgress();
  if (progress) {
    $("#resume-button").css("display", "unset");
    $("#start-anew-text").css("display", "unset");
  }
});
