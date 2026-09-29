import questions from './src/questions.json';
import './styles.css';

const PASS_MARK = 36;
const STORAGE_KEY = 'mysqlquiz-session-v1';
const state = { screen: 'start', name: '', index: 0, answers: {}, submitted: false };

const $ = (id) => document.getElementById(id);
const els = {
  startScreen: $('startScreen'), quizScreen: $('quizScreen'), resultScreen: $('resultScreen'), startForm: $('startForm'), studentName: $('studentName'), questionCount: $('questionCount'), headerStatus: $('headerStatus'), quizChapter: $('quizChapter'), quizTitle: $('quizTitle'), answeredCount: $('answeredCount'), totalCount: $('totalCount'), progressBar: $('progressBar'), questionNumber: $('questionNumber'), questionType: $('questionType'), questionText: $('questionText'), answerArea: $('answerArea'), previousButton: $('previousButton'), nextButton: $('nextButton'), finishButton: $('finishButton'), jumpInput: $('jumpInput'), jumpButton: $('jumpButton'), questionNavigator: $('questionNavigator'), scoreValue: $('scoreValue'), correctValue: $('correctValue'), incorrectValue: $('incorrectValue'), unansweredValue: $('unansweredValue'), passBadge: $('passBadge'), resultMessage: $('resultMessage'), reviewButton: $('reviewButton'), newAttemptButton: $('newAttemptButton'), reviewPanel: $('reviewPanel'), reviewSummary: $('reviewSummary'), reviewList: $('reviewList')
};

const chapterNames = { CH1: 'FOUNDATIONS', CH2: 'SQL BASICS', CH3: 'QUERYING', CH4: 'JOINS & SETS', CH5: 'SUBQUERIES', CH6: 'FUNCTIONS', CH6B: 'GROUPING & INDEXES', CH7: 'TRANSACTIONS', CH8: 'REPLICATION', CH9: 'PARTITIONING', CH10: 'OPTIMIZATION', 'CH11,12': 'STORAGE & MEMORY' };
const typeLabels = { tf: 'TRUE / FALSE', mc: 'MULTIPLE CHOICE', short: 'DIRECT QUESTION' };

function saveSession() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: state.name, index: state.index, answers: state.answers, submitted: state.submitted }));
}

function restoreSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || !saved.name || saved.submitted) return;
    state.name = saved.name; state.index = Number.isInteger(saved.index) ? Math.min(saved.index, questions.length - 1) : 0; state.answers = saved.answers || {};
    els.studentName.value = state.name;
    els.headerStatus.textContent = 'Previous attempt found';
    const resume = document.createElement('button');
    resume.type = 'button'; resume.className = 'secondary-button'; resume.textContent = 'Resume previous attempt'; resume.style.width = '100%'; resume.style.marginTop = '10px';
    resume.addEventListener('click', () => { state.screen = 'quiz'; showScreen('quiz'); renderQuiz(); });
    els.startForm.querySelector('.tiny-note').before(resume);
  } catch { localStorage.removeItem(STORAGE_KEY); }
}

function showScreen(screen) {
  state.screen = screen;
  els.startScreen.classList.toggle('hidden', screen !== 'start');
  els.quizScreen.classList.toggle('hidden', screen !== 'quiz');
  els.resultScreen.classList.toggle('hidden', screen !== 'result');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function answerKey(index) { return String(index); }
function currentQuestion() { return questions[state.index]; }
function hasAnswer(index) { const value = state.answers[answerKey(index)]; return value !== undefined && value !== null && String(value).trim() !== ''; }
function answeredTotal() { return questions.reduce((count, _, index) => count + (hasAnswer(index) ? 1 : 0), 0); }

function renderNavigator() {
  els.questionNavigator.replaceChildren();
  const fragment = document.createDocumentFragment();
  questions.forEach((question, index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = String(index + 1); button.title = `${typeLabels[question.type]} · Question ${index + 1}`; button.classList.toggle('current', index === state.index); button.classList.toggle('answered', hasAnswer(index));
    button.addEventListener('click', () => { state.index = index; saveSession(); renderQuiz(); });
    fragment.append(button);
  });
  els.questionNavigator.append(fragment);
}

function renderAnswerArea(question) {
  els.answerArea.replaceChildren();
  if (question.type === 'tf') {
    const row = document.createElement('div'); row.className = 'boolean-row';
    ['True', 'False'].forEach((value) => row.append(createChoiceButton(value, value)));
    els.answerArea.append(row);
  } else if (question.type === 'mc') {
    const list = document.createElement('div'); list.className = 'choice-list';
    question.options.forEach((value, optionIndex) => list.append(createChoiceButton(value, String(optionIndex))));
    els.answerArea.append(list);
  } else {
    const label = document.createElement('label'); label.className = 'sr-only'; label.htmlFor = 'shortAnswer'; label.textContent = 'Your answer';
    const textarea = document.createElement('textarea'); textarea.id = 'shortAnswer'; textarea.className = 'short-answer'; textarea.placeholder = 'Type your answer in English...'; textarea.value = state.answers[answerKey(state.index)] || '';
    textarea.addEventListener('input', () => { state.answers[answerKey(state.index)] = textarea.value; saveSession(); updateProgress(); renderNavigator(); });
    els.answerArea.append(label, textarea);
  }
}

function createChoiceButton(label, value) {
  const button = document.createElement('button'); button.type = 'button'; button.className = 'choice-button';
  const key = document.createElement('span'); key.className = 'choice-key'; key.textContent = currentQuestion().type === 'tf' ? (value === 'True' ? 'T' : 'F') : String(Number(value) + 1);
  const text = document.createElement('span'); text.textContent = label; button.append(key, text);
  const selected = String(state.answers[answerKey(state.index)]) === String(value); button.classList.toggle('selected', selected);
  button.addEventListener('click', () => { state.answers[answerKey(state.index)] = value; saveSession(); renderQuiz(); });
  return button;
}

function renderQuiz() {
  const question = currentQuestion();
  els.quizChapter.textContent = `${question.chapter} · ${chapterNames[question.chapter] || 'MYSQL'}`;
  els.quizTitle.textContent = `Question ${state.index + 1} of ${questions.length}`;
  els.questionNumber.textContent = `Question ${state.index + 1}`;
  els.questionType.textContent = typeLabels[question.type];
  els.questionText.textContent = question.question;
  renderAnswerArea(question);
  els.previousButton.disabled = state.index === 0;
  els.previousButton.style.opacity = state.index === 0 ? '.45' : '1';
  els.nextButton.textContent = state.index === questions.length - 1 ? 'Review result →' : 'Next →';
  els.jumpInput.value = state.index + 1;
  updateProgress(); renderNavigator();
  els.headerStatus.textContent = `${state.name} · In progress`;
}

function updateProgress() {
  const answered = answeredTotal();
  els.answeredCount.textContent = answered; els.totalCount.textContent = questions.length;
  els.questionCount.textContent = questions.length;
  els.progressBar.style.width = `${(answered / questions.length) * 100}%`;
}

function normalize(value) { return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
function significantWords(value) { const stop = new Set('the a an is are was were to of in on for and or with from by as at this that it can what which how do does used use'.split(' ')); return [...new Set(normalize(value).split(' ').filter((word) => word.length > 2 && !stop.has(word)))]; }
function gradeShort(userValue, expected) {
  const user = normalize(userValue); if (!user) return false;
  const expectedNorm = normalize(expected); if (user === expectedNorm || user.includes(expectedNorm) || expectedNorm.includes(user)) return true;
  const words = significantWords(expected); const hits = words.filter((word) => user.includes(word)).length;
  return hits >= Math.max(1, Math.ceil(words.length * .35));
}
function isCorrect(question, value) {
  if (!hasAnswerValue(value)) return false;
  if (question.type === 'tf') return String(value).toLowerCase() === String(question.answer).toLowerCase();
  if (question.type === 'mc') return Number(value) === Number(question.answer);
  return gradeShort(value, question.answer);
}
function hasAnswerValue(value) { return value !== undefined && value !== null && String(value).trim() !== ''; }

function calculateResults() {
  let correct = 0; let unanswered = 0;
  questions.forEach((question, index) => { const value = state.answers[answerKey(index)]; if (!hasAnswerValue(value)) unanswered += 1; else if (isCorrect(question, value)) correct += 1; });
  const incorrect = questions.length - correct - unanswered;
  return { correct, incorrect, unanswered, score: (correct / questions.length) * 60, percent: (correct / questions.length) * 100 };
}

function displayAnswer(question, value) {
  if (!hasAnswerValue(value)) return 'No answer submitted';
  if (question.type === 'tf') return String(value);
  if (question.type === 'mc') return question.options[Number(value)] || 'Unknown option';
  return String(value);
}

function correctAnswer(question) {
  if (question.type === 'tf') return question.answer ? 'True' : 'False';
  if (question.type === 'mc') return question.options[Number(question.answer)] || 'Unknown option';
  return String(question.answer);
}

function renderReview() {
  const reviewItems = [];
  questions.forEach((question, index) => {
    const value = state.answers[answerKey(index)];
    if (!isCorrect(question, value)) reviewItems.push({ question, index, value, unanswered: !hasAnswerValue(value) });
  });
  els.reviewList.replaceChildren();
  els.reviewSummary.textContent = reviewItems.length ? `${reviewItems.length} question${reviewItems.length === 1 ? '' : 's'} need review. Your answer is shown beside the correct answer.` : 'Excellent — every submitted answer was correct.';
  if (!reviewItems.length) {
    const success = document.createElement('div'); success.className = 'review-empty'; success.textContent = 'No corrections needed for this attempt.'; els.reviewList.append(success); return;
  }
  const fragment = document.createDocumentFragment();
  reviewItems.forEach(({ question, index, value, unanswered }) => {
    const item = document.createElement('article'); item.className = 'review-item';
    const head = document.createElement('div'); head.className = 'review-item-head';
    const number = document.createElement('span'); number.className = 'review-number'; number.textContent = `Q${index + 1} · ${question.chapter}`;
    const status = document.createElement('span'); status.className = `review-status ${unanswered ? 'unanswered' : 'incorrect'}`; status.textContent = unanswered ? 'UNANSWERED' : 'INCORRECT'; head.append(number, status);
    const text = document.createElement('p'); text.className = 'review-question'; text.textContent = question.question;
    const answers = document.createElement('div'); answers.className = 'review-answers';
    const your = document.createElement('div'); your.className = 'answer-box your-answer'; your.innerHTML = '<span>Your answer</span><strong></strong>'; your.querySelector('strong').textContent = displayAnswer(question, value);
    const correct = document.createElement('div'); correct.className = 'answer-box correct-answer'; correct.innerHTML = '<span>Correct answer</span><strong></strong>'; correct.querySelector('strong').textContent = correctAnswer(question);
    answers.append(your, correct); item.append(head, text, answers); fragment.append(item);
  });
  els.reviewList.append(fragment);
}

function finishQuiz() {
  const unanswered = questions.length - answeredTotal();
  const message = unanswered ? `You are about to submit with ${unanswered} unanswered question${unanswered === 1 ? '' : 's'}. You can still finish now.` : 'You have answered every question. Submit this attempt?';
  if (!window.confirm(message)) return;
  state.submitted = true; saveSession(); renderResults(); showScreen('result'); localStorage.removeItem(STORAGE_KEY);
}

function renderResults() {
  const result = calculateResults();
  els.scoreValue.textContent = '0';
  els.correctValue.textContent = result.correct; els.incorrectValue.textContent = result.incorrect; els.unansweredValue.textContent = result.unanswered;
  const passed = result.score >= PASS_MARK; els.passBadge.textContent = passed ? 'PASS · Keep going' : 'REVIEW · Try again'; els.passBadge.style.color = passed ? 'var(--cyan)' : 'var(--amber)';
  els.resultMessage.textContent = `Well done, ${state.name}. You answered ${result.correct} out of ${questions.length} questions correctly (${result.percent.toFixed(1)}%).`;
  els.headerStatus.textContent = `${state.name} · Result`;
  renderReview();
  const target = result.score; const started = performance.now();
  const animateScore = (now) => { const progress = Math.min(1, (now - started) / 700); els.scoreValue.textContent = (target * (1 - Math.pow(1 - progress, 3))).toFixed(2).replace(/\.00$/, ''); if (progress < 1) requestAnimationFrame(animateScore); };
  requestAnimationFrame(animateScore);
}

els.startForm.addEventListener('submit', (event) => { event.preventDefault(); const name = els.studentName.value.trim(); if (!name) return; state.name = name; state.index = 0; state.answers = {}; state.submitted = false; saveSession(); showScreen('quiz'); renderQuiz(); });
els.previousButton.addEventListener('click', () => { if (state.index > 0) { state.index -= 1; saveSession(); renderQuiz(); } });
els.nextButton.addEventListener('click', () => { if (state.index < questions.length - 1) { state.index += 1; saveSession(); renderQuiz(); } else finishQuiz(); });
els.finishButton.addEventListener('click', finishQuiz);
els.jumpButton.addEventListener('click', () => { const target = Number(els.jumpInput.value); if (Number.isInteger(target) && target >= 1 && target <= questions.length) { state.index = target - 1; saveSession(); renderQuiz(); } else { els.jumpInput.focus(); } });
els.jumpInput.addEventListener('keydown', (event) => { if (event.key === 'Enter') els.jumpButton.click(); });
els.reviewButton.addEventListener('click', () => { state.index = 0; showScreen('quiz'); renderQuiz(); });
els.newAttemptButton.addEventListener('click', () => { state.name = ''; state.index = 0; state.answers = {}; state.submitted = false; els.studentName.value = ''; showScreen('start'); els.headerStatus.textContent = 'Ready when you are'; });

els.questionCount.textContent = questions.length; els.totalCount.textContent = questions.length; restoreSession();
