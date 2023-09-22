var PROGRESS_KEY = "progress";
/**
 * Creates a new Store that stores a JSON-serializable value as string in a key of the localstorage.
 * @class
 * @param {String} key Name of this store. Has to be unique. Stores with the same `key` overwrites one another.
 * @param {String} defaultValue Default value of the store. `null` if not given.
 */
function Store(key, defaultValue = null) {
  this.key = key;
  this.defaultValue = defaultValue;
  try {
    var stored = localStorage.getItem(this.key);
    if (!stored) throw new Error(this.key + " does not exist in localstorage");
    else this.stored = JSON.parse(stored);
  } catch (e) {
    this.clear();
  }
  this.loadOnChange();
}

/**
 * Register event listener to database change and load the new value
 */
Store.prototype.loadOnChange = function loadOnChange() {
  window.addEventListener("storage", (e) => {
    if (e.key === this.key) {
      this.load();
    }
  });
};

/**
 * Clear the value in the store. Resets its value to default
 */
Store.prototype.clear = function clear() {
  this.set(this.defaultValue);
};

/**
 * Load and deserialized stored value form storage
 */
Store.prototype.load = function load() {
  this.stored = JSON.parse(localStorage.getItem(this.key));
};

/**
 * Get the stored value of the store.
 * @returns {*}
 */
Store.prototype.get = function get() {
  this.load();
  return this.stored;
};

/**
 * Set value of the store. Overwrites the currently stored value.
 * @param {*} value
 */
Store.prototype.set = function set(value) {
  var serialized = JSON.stringify(value);
  if (serialized === "undefined") {
    // value is unserializable. Throw error
    throw new TypeError("Value is unserializable.");
  }
  this.stored = value;
  localStorage.setItem(this.key, JSON.stringify(value));
};

/**
 * @typedef {Object} Question
 * @property {String} one - First choice
 * @property {String} two - Second choice
 * @property {String} three - Third choice
 * @property {String} four - Fourth choice
 * @property {String} question - The question
 * @property {("one"|"two"|"three"|"four")} answer - Answer to the question as stored as the key of the correct choice
 * @property {String} image - url of the question's image. An empty string if the question has no image
 */

/**
 * @typedef {Question[]} Questions
 */

/**
 * @typedef {(Object|null)} ProgressStoreObject
 * @property {Questions} questions - Questions in same order as the test of the progress to be saved
 * @property {Number} current - Index of the current question (0-based)
 */

/**
 * A store that stores progress of a single test
 * @class
 * @extends Store
 */
function ProgressStore() {
  Store.call(this, PROGRESS_KEY, null);
}

ProgressStore.prototype = Object.create(Store.prototype, {
  constructor: {
    value: ProgressStore,
    enumerable: false,
    writable: true,
    configurable: true,
  },
});

/**
 * Tells whether the store has progress saved
 * @returns {boolean}
 */
ProgressStore.prototype.hasProgress = function hasProgress() {
  return !!this.getProgress();
};

/**
 * Returns questions in same order as the test of the progress saved
 * @returns {Question[]}
 */
ProgressStore.prototype.getQuestions = function getQuestions() {
  return this.stored.questions;
};

/**
 * @typedef {Object} Progress
 * @property {Number} total - Total number of questions
 * @property {Number} current - Current question (1-based)
 */

/**
 * Get current progress. Returns `null` if there is no progress
 * @returns {(null|Progress)}
 */
ProgressStore.prototype.getProgress = function getProgress() {
  return this.stored
    ? {
        current: this.stored?.currentQuestion + 1,
        total: this.stored?.questions.length,
      }
    : null;
};

/**
 * Save current progress
 * @param {Number} current Expects 1-based index of the current question
 */
ProgressStore.prototype.saveProgress = function saveProgress(current) {
  if (!this.stored) {
    throw new Error("Progress not started yet. Could not save progress.");
  }
  this.set({
    ...this.stored,
    currentQuestion: current - 1,
  });
};

/**
 * Start a new progress.
 * @param {Questions} questions Array of questions in current order
 * @throws {Error} when
 */
ProgressStore.prototype.startProgress = function start(questions) {
  this.set({
    questions,
    current: 1,
  });
};
