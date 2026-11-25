// ============================================
// ANIWIN Character Matching Test
// Visual Novel Flow + Four-choice Score Logic
// ============================================

const TRANSITION_MS = 520;
const QUESTION_ANIM_MS = 320;
const TYPE_SPEED = 28;

let favoriteCharacter = "";
let favoriteReason = "";

const qs=[
['크리스마스 마을에 도착한 나!\n가장 먼저 하고 싶은 일은?', ['주변을 둘러보며 마을의 모습을 살핀다','새로운 모험을 향해 신나게 출발한다','이곳에서 어떤 일이 벌어질지 상상한다','오늘 해야 할 일을 끝까지 해낼 마음을 다진다']],
['선물 배달 지도가 사라졌어요!\n어떻게 할까요?', ['지도가 있었던 곳부터 차근차근 살펴본다','마을을 돌아다니며 직접 찾아본다','지도 대신 사용할 방법을 떠올려 본다','찾을 때까지 포기하지 않고 계속 살펴본다']],
['선물이 상자에 안 들어가요!\n어떻게 할까요?', ['선물과 상자의 크기를 먼저 살펴본다','일단 여러 방향으로 넣어 본다','색다른 포장 방법을 생각해 본다','방법을 바꿔 가며 들어갈 때까지 시도한다']],
['친구들과 새로운\n작전을 세운다면?', ['필요한 일과 순서를 정리해 준다','첫 번째 임무에 먼저 나선다','모두가 놀랄 만한 아이디어를 낸다','맡은 일을 끝까지 책임진다']],
['마을에 눈이 많이 내려\n가야 할 길이 잘 보이지 않아요.', ['주변의 표지판과 발자국을 살핀다','용기를 내어 한 발 먼저 나아간다','눈 속에서도 길을 찾을 방법을 생각한다','조금 느리더라도 꾸준히 앞으로 간다']],
['오르골을 만드는\n나만의 스타일은?', ['어떤 모습으로 만들지 먼저 구상한다','마음에 드는 재료부터 바로 골라 본다','나만의 독특한 장식을 만들어 본다','마음에 들 때까지 세심하게 완성한다']],
['친구가 미션을 어려워해요!\n어떻게 도와줄까요?', ['어디서 막혔는지 함께 살펴본다','괜찮아, 같이 해보자며 손을 내민다','새로운 방법을 함께 떠올려 본다','끝까지 곁에서 함께 도전한다']],
['크리스마스 작전을 마친 뒤\n가장 듣고 싶은 말은?', ['네 덕분에 우리가 방향을 찾았어!','네 용기 덕분에 시작할 수 있었어!','네 아이디어가 정말 멋졌어!','끝까지 함께해 줘서 고마워!']]
];
const questions = qs.map(([text, options], q) => ({text, options: Array.from({length:4}, (_, j) => {const i = (j + q) % 4; return {text: options[i], character: ['AIN','WAY','IVO','NEO'][i]};})}));

const characters = {
  AIN: {
    name: "AIN",
    description: "단서를 살피고\n방향을 찾는 힘을 가진 친구.",
    extra: "당신은 빠르게 달리기보다\n나에게 맞는 방향을 차분히 찾아가는 타입이에요.\n작은 고민도 성장의 실마리로 바꾸는 힘을 가지고 있어요.",
    initial: "A",
    image: "assets/ain(2).png"
  },
  WAY: {
    name: "WAY",
    description: "용기 있게\n행동하는 힘을 가진 친구.",
    extra: "당신은 목표가 생기면\n쉽게 포기하지 않고 다시 시도하는 타입이에요.\n망설임보다 한 걸음 더 나아가는 용기가 빛나요.",
    initial: "W",
    image: "assets/way(2).png"
  },
  IVO: {
    name: "IVO",
    description: "새로운 방법을\n떠올리는 힘을 가진 친구.",
    extra: "당신은 정해진 답보다\n나만의 방식과 새로운 이야기를 만드는 데 강한 타입이에요.\n창작하는 순간의 반짝임을 누구보다 잘 알아요.",
    initial: "I",
    image: "assets/ivo(2).png"
  },
  NEO: {
    name: "NEO",
    description: "끝까지 도전하는\n힘을 가진 친구.",
    extra: "당신은 지금보다 더 잘하고 싶다는 마음이 큰 타입이에요.\n오늘의 작은 한 걸음이 내일의 큰 변화를 만든다고 믿어요.",
    initial: "N",
    image: "assets/neo(2).png"
  }
};

const startScreen = document.getElementById("start-screen");
const introScreen = document.getElementById("intro-screen");
const quizScreen = document.getElementById("quiz-screen");
const preludeScreen = document.getElementById("prelude-screen");
const resultScreen = document.getElementById("result-screen");
const screens = [startScreen, introScreen, quizScreen, preludeScreen, resultScreen];

const startBtn = document.getElementById("start-btn");
const retryBtn = document.getElementById("retry-btn");
const introBox = document.getElementById("intro-box");
const introDialogue = document.getElementById("intro-dialogue");
const introInputWrap = document.getElementById("intro-input-wrap");
const introInput = document.getElementById("intro-input");
const introNextBtn = document.getElementById("intro-next-btn");
const preludeBox = document.getElementById("prelude-box");
const preludeDialogue = document.getElementById("prelude-dialogue");
const preludeNextBtn = document.getElementById("prelude-next-btn");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const questionCard = document.getElementById("question-card");
const questionText = document.getElementById("question-text");
const answerButtons = document.querySelectorAll("[data-choice]");
const previousQuestionBtn = document.getElementById("previous-question-btn");
const resultCard = document.getElementById("result-card");
const resultName = document.getElementById("result-name");
const resultDescription = document.getElementById("result-description");
const resultExtra = document.getElementById("result-extra");
const resultCharacter = document.getElementById("result-character");
const resultCharacterImage = document.getElementById("result-character-image");
const resultCharacterFallback = document.getElementById("result-character-fallback");

let introStep = 0;
let preludeStep = 0;
let currentQuestionIndex = 0;
let selectedAnswers = [];
let scores = { AIN: 0, WAY: 0, IVO: 0, NEO: 0 };
let isTransitioning = false;
let typingTimer = null;
let finishTyping = null;

const noelPortraits = document.querySelectorAll(".noel-portrait");
const noelExpressions = {
  default: "assets/noel-default.png",
  surprised: "assets/noel-surprised.png",
  smile: "assets/noel-smile.png"
};
// Preload expressions so switching faces does not flash an empty image.
Object.values(noelExpressions).forEach(src => { const image = new Image(); image.src = src; });
function setNoelExpression(expression = "default") {
  const src = noelExpressions[expression] || noelExpressions.default;
  noelPortraits.forEach(portrait => {
    if (portrait.getAttribute("src") !== src) portrait.setAttribute("src", src);
  });
}

const introSteps = [
  {type:"dialogue",expression:"surprised",dialogue:"앗, 드디어 도와줄 친구가 왔구나!\n\n나는 산타 공방의 견습 요정, 노엘이야.\n지금 선물 준비로 정신이 하나도 없어!",buttonLabel:"나도 도와줄게!"},
  {type:"input",expression:"surprised",dialogue:"정말? 고마워!\n그럼 도우미 명단에 이름부터…\n\n어라, 내 이름을 적을 뻔했네.\n네 이름은 뭐야?",field:"favoriteCharacter",placeholder:"이름을 입력해 주세요",buttonLabel:"이름 적기"},
  {type:"input",expression:"default",dialogue:()=>`좋아, ${escapeHtml(getFavoriteDisplayName())}! 등록 완료!\n\n그런데 다른 친구들의 선물을 준비하기 전에…\n너는 이번 크리스마스에 바라는 게 뭐야?`,field:"favoriteReason",placeholder:"나의 크리스마스 소망을 적어 주세요",buttonLabel:"소망 이야기하기"},
  {type:"dialogue",expression:"smile",dialogue:()=>`“${escapeHtml(favoriteReason)}”\n\n네 소망도 꼭 이루어졌으면 좋겠다!\n\n나? 나는 오늘 실수 없이 일 끝내기!\n…아까 이름 잘못 적을 뻔한 건 비밀이야.`,buttonLabel:"알겠어, 비밀로 할게!"},
  {type:"dialogue",expression:"default",dialogue:"참, 너와 함께 온 네 친구도\n산타를 도울 준비를 하고 있어!\n\n혼자보다 둘이 함께하면 더 든든하겠지?\n네 친구 중 누구와 짝을 이뤄 볼까?\n\n몇 가지 물어볼 테니까,\n네가 하고 싶은 행동을 골라 줘!",buttonLabel:"나의 파트너 찾기"}
];
const preludeSteps = [
  {expression:"smile",dialogue:"찾았다!\n\n너와 잘 맞는 친구가 누구인지 알 것 같아!",buttonLabel:"다음"},
  {expression:"default",dialogue:()=>`${escapeHtml(getFavoriteDisplayName())}, 준비됐어?\n\n이번 크리스마스에\n너와 함께할 작전 파트너는…`,buttonLabel:"나의 파트너 확인하기",flashToResult:true}
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getFavoriteDisplayName() {
  return favoriteCharacter.trim() || "친구";
}

function showScreen(target) {
  const current = screens.find((screen) => screen.classList.contains("active"));
  if (current && current !== target) {
    current.classList.add("screen--leaving");
    current.classList.remove("active");
    setTimeout(() => current.classList.remove("screen--leaving"), TRANSITION_MS);
  }
  screens.forEach((screen) => {
    if (screen !== target) screen.classList.remove("active");
  });
  target.classList.add("active");
  requestAnimationFrame(positionHelperFairies);
}

function animateBox(box) {
  box.classList.remove("vn-animate");
  void box.offsetWidth;
  box.classList.add("vn-animate");
}

function typeHtml(element, html, onComplete) {
  clearTimeout(typingTimer);
  element.innerHTML = "";

  finishTyping = () => {
    clearTimeout(typingTimer);
    element.innerHTML = html;
    finishTyping = null;
    if (onComplete) onComplete();
  };
  const tokens = html.split(/(<[^>]+>)/g).filter(Boolean);
  let tokenIndex = 0;
  let charIndex = 0;
  let output = "";

  function tick() {
    if (tokenIndex >= tokens.length) {
      finishTyping = null;
      if (onComplete) onComplete();
      return;
    }

    const token = tokens[tokenIndex];
    if (token.startsWith("<") && token.endsWith(">")) {
      output += token;
      tokenIndex++;
      typingTimer = setTimeout(tick, 0);
      return;
    }

    output += token.charAt(charIndex);
    element.innerHTML = output;
    charIndex++;

    if (charIndex >= token.length) {
      tokenIndex++;
      charIndex = 0;
    }

    typingTimer = setTimeout(tick, TYPE_SPEED);
  }

  tick();
}

function setButtonEnabled(button, enabled) {
  button.disabled = !enabled;
  button.classList.toggle("is-disabled", !enabled);
}

function updateIntroButtonState() {
  const step = introSteps[introStep];
  if (!step || step.type !== "input") {
    setButtonEnabled(introNextBtn, true);
    return;
  }
  setButtonEnabled(introNextBtn, introInput.value.trim().length > 0);
}

function resetApp() {
  favoriteCharacter = "";
  favoriteReason = "";
  introStep = 0;
  preludeStep = 0;
  currentQuestionIndex = 0;
  selectedAnswers = [];
  scores = { AIN: 0, WAY: 0, IVO: 0, NEO: 0 };
  isTransitioning = false;
  introInput.value = "";
  setAnswerButtonsEnabled(true);
  setButtonEnabled(introNextBtn, true);
}

function goToIntro() {
  resetApp();
  showScreen(introScreen);
  setTimeout(renderIntroStep, TRANSITION_MS);
}

function getDialogue(step) {
  return typeof step.dialogue === "function" ? step.dialogue() : escapeHtml(step.dialogue);
}

function renderIntroStep() {
  const step = introSteps[introStep];
  setNoelExpression(step.expression);
  introNextBtn.textContent = step.buttonLabel;
  introInputWrap.classList.toggle("hidden", step.type !== "input");
  setButtonEnabled(introNextBtn, step.type !== "input" ? true : false);

  if (step.type === "input") {
    introInput.value = step.field === "favoriteCharacter" ? favoriteCharacter : favoriteReason;
    introInput.placeholder = step.placeholder;
    introInput.maxLength = step.field === "favoriteCharacter" ? 20 : 80;
    introInput.setAttribute("aria-label", step.field === "favoriteCharacter" ? "나의 이름" : "나의 크리스마스 소망");
    setTimeout(() => introInput.focus(), 280);
  }

  animateBox(introBox);
  typeHtml(introDialogue, getDialogue(step), () => {
    if (step.type === "input") updateIntroButtonState();
  });
}

function handleIntroNext() {
  if (finishTyping) { finishTyping(); return; }
  const step = introSteps[introStep];
  if (step.type === "input") {
    const value = introInput.value.trim();
    if (!value) return;
    if (step.field === "favoriteCharacter") favoriteCharacter = value;
    if (step.field === "favoriteReason") favoriteReason = value;
  }

  introStep++;
  if (introStep < introSteps.length) renderIntroStep();
  else startQuiz();
}

function setAnswerButtonsEnabled(enabled) {
  answerButtons.forEach((button) => { button.disabled = !enabled; });
}

function startQuiz() {
  currentQuestionIndex = 0;
  selectedAnswers = [];
  scores = { AIN: 0, WAY: 0, IVO: 0, NEO: 0 };
  isTransitioning = false;
  showScreen(quizScreen);
  showQuestion(false);
  setTimeout(animateQuestionCard, TRANSITION_MS);
}

function animateQuestionCard() {
  questionCard.classList.remove("is-entering", "is-exiting");
  void questionCard.offsetWidth;
  questionCard.classList.add("is-entering");
}

function showQuestion(animate = true) {
  const question = questions[currentQuestionIndex];
  const number = currentQuestionIndex + 1;
  progressText.textContent = `${String(number).padStart(2, "0")} / ${String(questions.length).padStart(2, "0")}`;
  progressFill.style.width = `${(number / questions.length) * 100}%`;
  questionText.textContent = question.text;

  answerButtons.forEach((button, index) => {
    const option = question.options[index];
    button.textContent = option ? option.text : "";
    button.setAttribute("aria-label", option ? option.text : "");
    const selected = selectedAnswers[currentQuestionIndex] === index;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  previousQuestionBtn.hidden = currentQuestionIndex === 0;
  previousQuestionBtn.disabled = false;
  if (animate) animateQuestionCard();
}

function handleAnswer(choiceIndex) {
  if (isTransitioning || !questions[currentQuestionIndex]?.options[choiceIndex]) return;
  isTransitioning = true;
  setAnswerButtonsEnabled(false);
  previousQuestionBtn.disabled = true;

  const question = questions[currentQuestionIndex];
  const option = question.options[choiceIndex];

  selectedAnswers[currentQuestionIndex] = choiceIndex;
  scores = { AIN: 0, WAY: 0, IVO: 0, NEO: 0 };
  selectedAnswers.forEach((choice, index) => {
    if (choice !== undefined) scores[questions[index].options[choice].character] += 1;
  });

  currentQuestionIndex++;
  questionCard.classList.remove("is-entering");
  questionCard.classList.add("is-exiting");

  setTimeout(() => {
    if (currentQuestionIndex < questions.length) {
      showQuestion(true);
      questionCard.classList.remove("is-exiting");
      isTransitioning = false;
      setAnswerButtonsEnabled(true);
    } else {
      goToPrelude();
    }
  }, QUESTION_ANIM_MS);
}

function previousQuestion() {
  if (isTransitioning || currentQuestionIndex <= 0) return;
  currentQuestionIndex--;
  questionCard.classList.remove("is-exiting");
  setAnswerButtonsEnabled(true);
  showQuestion(true);
}
previousQuestionBtn.addEventListener("click", previousQuestion);

function goToPrelude() {
  preludeStep = 0;
  isTransitioning = false;
  preludeScreen.classList.remove("flash-out");
  showScreen(preludeScreen);
  setTimeout(renderPreludeStep, TRANSITION_MS);
}

function renderPreludeStep() {
  const step = preludeSteps[preludeStep];
  setNoelExpression(step.expression);
  preludeNextBtn.textContent = step.buttonLabel;
  setButtonEnabled(preludeNextBtn, false);
  animateBox(preludeBox);
  typeHtml(preludeDialogue, getDialogue(step), () => setButtonEnabled(preludeNextBtn, true));
}

function handlePreludeNext() {
  if (finishTyping) { finishTyping(); return; }
  if (preludeNextBtn.disabled) return;

  const step = preludeSteps[preludeStep];

  // 마지막 대사 "내 이름은..." 이후에는 이름을 여기서 보여주지 않고,
  // 전체 화면이 하얗게 빛난 뒤 결과 화면에서만 캐릭터 이름을 공개한다.
  if (step && step.flashToResult) {
    setButtonEnabled(preludeNextBtn, false);
    preludeScreen.classList.add("flash-out");

    setTimeout(() => {
      showResult();
      preludeScreen.classList.remove("flash-out");
    }, 920);
    return;
  }

  preludeStep++;
  if (preludeStep < preludeSteps.length) renderPreludeStep();
  else showResult();
}

function getTopCharacter() {
  const max = Math.max(...Object.values(scores));
  const tied = Object.keys(scores).filter((key) => scores[key] === max);
  return tied[Math.floor(Math.random() * tied.length)];
}

function showResult() {
  const top = getTopCharacter();
  const result = characters[top];
  resultName.textContent = result.name;
  resultDescription.textContent = result.description;
  resultExtra.textContent = result.extra;

  // 결과 캐릭터 이미지: images/ain.png, way.png, ivo.png, neo.png
  // 이미지가 아직 없거나 불러오기에 실패하면 기존 이니셜 폴백을 표시한다.
  resultCharacterFallback.textContent = result.initial;
  resultCharacterFallback.hidden = false;
  resultCharacterImage.hidden = true;
  resultCharacterImage.alt = `${result.name} 캐릭터`;
  resultCharacterImage.onload = () => {
    resultCharacterImage.hidden = false;
    resultCharacterFallback.hidden = true;
    resultCharacter.classList.remove("is-revealed");
    void resultCharacter.offsetWidth;
    resultCharacter.classList.add("is-revealed");
  };
  resultCharacterImage.onerror = () => {
    resultCharacterImage.hidden = true;
    resultCharacterFallback.hidden = false;
    resultCharacter.classList.remove("is-revealed");
    void resultCharacter.offsetWidth;
    resultCharacter.classList.add("is-revealed");
  };
  resultCharacterImage.src = `${result.image}?v=${Date.now()}`;

  resultCard.classList.remove("is-replay");
  void resultCard.offsetWidth;
  resultCard.classList.add("is-replay");
  showScreen(resultScreen);
}

function goToStart() {
  clearTimeout(typingTimer);
  resetApp();
  showScreen(startScreen);
}

startBtn.addEventListener("click", goToIntro);
retryBtn.addEventListener("click", goToStart);
introNextBtn.addEventListener("click", handleIntroNext);
preludeNextBtn.addEventListener("click", handlePreludeNext);
introInput.addEventListener("input", updateIntroButtonState);
introInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !introNextBtn.disabled) handleIntroNext();
});
answerButtons.forEach((button) => button.addEventListener("click", () => handleAnswer(Number(button.dataset.choice))));

introDialogue.addEventListener("click", () => { if (finishTyping) finishTyping(); });
preludeDialogue.addEventListener("click", () => { if (finishTyping) finishTyping(); });

// Align the right helper with Noel, regardless of the screen size.
function positionHelperFairies() {
  const portrait = document.querySelector(".screen-vn.active .noel-portrait");
  const helper = document.querySelector(".fairy-bottom-right");
  if (!helper) return;
  const size = helper.offsetWidth;
  let centerY = window.innerHeight * .56;
  if (portrait && portrait.complete && portrait.naturalHeight) {
    const rect = portrait.getBoundingClientRect();
    centerY = rect.top + rect.height * .55;
  }
  const top = Math.max(70, Math.min(centerY - size / 2, window.innerHeight - size - 35));
  document.documentElement.style.setProperty("--fairy-right-top", `${Math.round(top)}px`);
}
if (typeof ResizeObserver !== "undefined") {
  const fairyLayoutObserver = new ResizeObserver(positionHelperFairies);
  [introBox, preludeBox, ...noelPortraits].forEach(element => fairyLayoutObserver.observe(element));
}
noelPortraits.forEach(portrait => portrait.addEventListener("load", positionHelperFairies));
window.addEventListener("resize", positionHelperFairies, {passive:true});
