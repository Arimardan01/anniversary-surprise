// =========================================================
// ANNIVERSARY WEBSITE — script.js
// =========================================================
// EASY TO EDIT:
//   QUESTIONS     → quiz questions & answers
//   MESSAGE_LINES → final love letter lines
//   PHOTOS        → gallery images + captions
//   STICKERS      → sticker images used as decorations
// =========================================================

// =========================================================
// 1. QUIZ QUESTIONS — edit here
// =========================================================
const QUESTIONS = [
  { question: "What do I call you when I am in love?",              answer: "babu"   },
  { question: "What colour can your bubu not see?",                 answer: "green"  },
  { question: "What is the colour of Shivang?",                     answer: "black"  },
  { question: "The most emotionally intelligent girl in the world is:", answer: "ragini" },
  { question: "Who is always wrong in a fight?",                    answer: "ragini" }
];

// =========================================================
// 2. FINAL MESSAGE — edit lines here
// =========================================================
const MESSAGE_LINES = [
  "Basically, I don't even remember what I do the whole day, but one thing that never lets me think about all the chaos around me is talking to you — even if it means ladna with you. 😄",
  "We've talked so many times by now, but every single moment still feels just as fresh in my heart.",
  "Still, I never really complimented you on your USP. It's your emotional and caring nature that makes everyone feel at ease around you. Your smartness, cuteness, and the way you live life just melt my heart every single time.",
  "You've supported and motivated me throughout this entire journey, and honestly, I can't imagine having come this far without your support.",
  "If today I've learned how to think about myself, take care of my own happiness, and understand the importance of family — it's because of you.",
  "I love you, and I hope you'll keep supporting me just the way you always have, throughout everything that life has in store for us. ❤️"
];

// =========================================================
// 3. PHOTOS — paths & captions (place in /photos/)
// =========================================================
const PHOTOS = [
  { src: "photos/1.jpeg", caption: "Us 💕"       },
  { src: "photos/2.jpeg", caption: "Always 🌸"   },
  { src: "photos/3.jpeg", caption: "Together ✨"  },
  { src: "photos/4.jpeg", caption: "Forever 💖"  }
];
const PHOTO_TILTS = [-2.5, 2, -1.5, 3]; // polaroid tilt degrees

// =========================================================
// 4. STICKERS — all images from /stickers/ used in site
//    Add more filenames here and they'll auto-appear
// =========================================================
const STICKERS = [
  // ── Your custom stickers (auto-detected) ──
  { src: "stickers/s1_scooter.webp",  alt: "Bubu & Dudu scooter ride" },
  { src: "stickers/s2_caring.webp",   alt: "Dudu caring for Bubu"     },
  { src: "stickers/s3_eating.webp",   alt: "Bubu & Dudu eating"       },
  { src: "stickers/s4_sleeping.webp", alt: "Bubu & Dudu sleeping"     },
  { src: "stickers/s5_hugging.webp",  alt: "Bubu & Dudu hugging"      },
  // ── Bonus stickers ──
  { src: "stickers/hearts.png",       alt: "Hearts"                   },
  { src: "stickers/flowers.png",      alt: "Flowers"                  },
  { src: "stickers/love_letter.png",  alt: "Love letter"              }
];

// =========================================================
// 5. FLOATING HEARTS CONFIG
// =========================================================
const HEART_CONFIG = {
  // Fewer hearts on small screens = better performance
  count:       window.innerWidth < 500 ? 10 : 18,
  emojis:      ["💕","❤️","🌸","💗","💖","✨","💓"],
  minSize:     0.7,
  maxSize:     1.5,
  minDuration: 9,
  maxDuration: 18
};

// =========================================================
// STATE
// =========================================================
let currentQ      = 0;
let currentScreen = "splash"; // splash → quiz → final

// =========================================================
// DOM REFS
// =========================================================
let splashScreen, quizScreen, finalScreen;
let progressDots;
let questionNumber, questionText, letterInputs, feedbackEl, questionCard;
let bubuSticker, duduSticker;
let heartsBg, heartBurstContainer, lightbox, lightboxImg, lightboxClose;
let envelopeWrap;

// =========================================================
// INIT
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
  splashScreen   = document.getElementById("splash-screen");
  quizScreen     = document.getElementById("quiz-screen");
  finalScreen    = document.getElementById("final-screen");
  progressDots   = document.querySelectorAll(".dot");
  questionNumber = document.getElementById("question-number");
  questionText   = document.getElementById("question-text");
  letterInputs   = document.getElementById("letter-inputs");
  feedbackEl     = document.getElementById("feedback");
  questionCard   = document.getElementById("question-card");
  bubuSticker    = document.getElementById("bubu-sticker");
  duduSticker    = document.getElementById("dudu-sticker");
  heartsBg            = document.getElementById("hearts-bg");
  heartBurstContainer = document.getElementById("heart-burst-container");
  lightbox       = document.getElementById("lightbox");
  lightboxImg    = document.getElementById("lightbox-img");
  lightboxClose  = document.getElementById("lightbox-close");
  envelopeWrap   = document.getElementById("envelope-wrap");

  initFloatingHearts();
  placeSplashStickers();

  // Start button
  document.getElementById("start-btn").addEventListener("click", startQuiz);

  // Envelope toggle — both click (desktop) and touchend (mobile)
  if (envelopeWrap) {
    let _touched = false;
    envelopeWrap.addEventListener("touchend", e => {
      e.preventDefault(); // prevent ghost click
      _touched = true;
      toggleEnvelope();
      setTimeout(() => { _touched = false; }, 300);
    }, { passive: false });
    envelopeWrap.addEventListener("click", () => {
      if (!_touched) toggleEnvelope(); // only fires on desktop
    });
    envelopeWrap.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleEnvelope(); }
    });
  }

  // Lightbox
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });
});

// =========================================================
// FLOATING HEARTS
// =========================================================
function initFloatingHearts() {
  for (let i = 0; i < HEART_CONFIG.count; i++) {
    const el  = document.createElement("span");
    el.className   = "bg-heart";
    el.textContent = HEART_CONFIG.emojis[Math.floor(Math.random() * HEART_CONFIG.emojis.length)];
    const size     = rand(HEART_CONFIG.minSize, HEART_CONFIG.maxSize);
    const duration = rand(HEART_CONFIG.minDuration, HEART_CONFIG.maxDuration);
    el.style.cssText = `font-size:${size}rem;left:${rand(2,98)}%;animation-duration:${duration}s;animation-delay:-${rand(0,duration)}s;`;
    heartsBg.appendChild(el);
  }
}

// =========================================================
// SPLASH SCREEN — scatter stickers decoratively
// =========================================================
function placeSplashStickers() {
  const container = document.getElementById("splash-stickers");
  if (!container) return;

  // Positions: [left%, top%, rotate-deg, scale]
  const positions = [
    [4,   8,  -15, 0.7],
    [78,  5,   18, 0.65],
    [88, 42,  -10, 0.72],
    [2,  60,   12, 0.68],
    [70, 75,  -20, 0.62],
    [10, 80,   8,  0.66]
  ];

  STICKERS.forEach((sticker, i) => {
    const pos = positions[i % positions.length];
    const img = document.createElement("img");
    img.src   = sticker.src;
    img.alt   = sticker.alt;
    img.className = "splash-sticker";
    img.style.cssText = `left:${pos[0]}%;top:${pos[1]}%;transform:rotate(${pos[2]}deg) scale(${pos[3]});animation-delay:${i * 0.3}s;`;
    container.appendChild(img);
  });
}

// =========================================================
// SCREEN TRANSITIONS
// =========================================================
function startQuiz() {
  splashScreen.classList.remove("active");
  quizScreen.classList.add("active");
  currentScreen = "quiz";
  renderQuestion(0);
}

function showFinalScreen() {
  quizScreen.classList.remove("active");
  finalScreen.classList.add("active");
  currentScreen = "final";
  buildFinalScreen();
  revealMessageLines();
}

// =========================================================
// QUIZ
// =========================================================
function renderQuestion(i) {
  const q = QUESTIONS[i];
  questionNumber.textContent = `Question ${i + 1} of ${QUESTIONS.length}`;
  questionText.textContent   = q.question;
  feedbackEl.textContent     = "";

  // Progress dots
  progressDots.forEach((dot, idx) => {
    dot.classList.remove("active", "done");
    if (idx < i)  dot.classList.add("done");
    if (idx === i) dot.classList.add("active");
  });

  // Letter boxes
  letterInputs.innerHTML = "";
  const letters = q.answer.toLowerCase().replace(/[^a-z]/g, "");
  letters.split("").forEach((_, idx) => {
    const input = document.createElement("input");
    input.type           = "text";
    input.maxLength      = 1;
    input.className      = "letter-box";
    input.inputMode      = "text";        // shows full keyboard (not number pad)
    input.pattern        = "[a-zA-Z]*";  // hints to mobile: letters only
    input.autocomplete   = "off";
    input.autocorrect    = "off";
    input.autocapitalize = "none";       // stops iOS capitalising first letter
    input.spellcheck     = false;
    input.setAttribute("data-form-type", "other"); // stops autofill overlays
    input.dataset.idx    = idx;
    input.setAttribute("aria-label", `Letter ${idx + 1}`);
    input.addEventListener("input",   onLetterInput);
    input.addEventListener("keydown", onLetterKeydown);
    // On mobile, select all text on focus so typing replaces any existing char
    input.addEventListener("focus",   e => { setTimeout(() => e.target.select(), 0); });
    // touchstart keeps keyboard visible between boxes
    input.addEventListener("touchstart", e => e.stopPropagation(), { passive: true });
    letterInputs.appendChild(input);
  });

  setTimeout(() => {
    const boxes = letterInputs.querySelectorAll(".letter-box");
    if (boxes.length) boxes[0].focus();
  }, 120);
}

function onLetterInput(e) {
  const input = e.target;
  const idx   = parseInt(input.dataset.idx);
  const boxes = Array.from(letterInputs.querySelectorAll(".letter-box"));
  let val = input.value.replace(/[^a-zA-Z]/g, "").slice(-1);
  input.value = val.toUpperCase();
  if (val) {
    input.classList.add("filled");
    if (idx < boxes.length - 1) {
      boxes[idx + 1].focus();
    } else {
      input.blur();
      checkAnswer();
    }
  } else {
    input.classList.remove("filled");
  }
}

function onLetterKeydown(e) {
  const input = e.target;
  const idx   = parseInt(input.dataset.idx);
  const boxes = Array.from(letterInputs.querySelectorAll(".letter-box"));
  if (e.key === "Backspace") {
    if (input.value === "" && idx > 0) {
      const prev = boxes[idx - 1];
      prev.value = "";
      prev.classList.remove("filled");
      prev.focus();
    } else {
      input.value = "";
      input.classList.remove("filled");
    }
    e.preventDefault();
  }
  if (e.key === "Enter") checkAnswer();
}

function checkAnswer() {
  const boxes   = Array.from(letterInputs.querySelectorAll(".letter-box"));
  const typed   = boxes.map(b => b.value.toLowerCase()).join("").trim();
  const correct = QUESTIONS[currentQ].answer.toLowerCase().trim();
  typed === correct ? onCorrectAnswer() : onWrongAnswer();
}

function onCorrectAnswer() {
  feedbackEl.textContent = "";
  triggerHeartBurst();
  triggerStickerCheer();
  setTimeout(() => {
    currentQ++;
    if (currentQ < QUESTIONS.length) renderQuestion(currentQ);
    else showFinalScreen();
  }, 950);
}

function onWrongAnswer() {
  feedbackEl.textContent = "Hmm, try again 😜";
  questionCard.classList.remove("shake");
  void questionCard.offsetWidth;
  questionCard.classList.add("shake");
  questionCard.addEventListener("animationend", () => questionCard.classList.remove("shake"), { once: true });
  const boxes = Array.from(letterInputs.querySelectorAll(".letter-box"));
  boxes.forEach(b => { b.value = ""; b.classList.remove("filled"); });
  setTimeout(() => boxes[0] && boxes[0].focus(), 100);
}

// =========================================================
// HEART BURST
// =========================================================
function triggerHeartBurst() {
  const rect   = questionCard.getBoundingClientRect();
  const cx     = rect.left + rect.width  / 2;
  const cy     = rect.top  + rect.height / 2;
  const hearts = ["💕","❤️","💖","💗","🌸","✨","💓"];
  for (let i = 0; i < 14; i++) {
    const el    = document.createElement("span");
    el.className     = "burst-heart";
    el.textContent   = hearts[i % hearts.length];
    const angle = (360 / 14) * i + rand(-15, 15);
    const dist  = rand(60, 150);
    const rad   = (angle * Math.PI) / 180;
    el.style.cssText = `left:${cx}px;top:${cy}px;--dx:${Math.cos(rad)*dist}px;--dy:${Math.sin(rad)*dist}px;--dr:${rand(-40,40)}deg;animation-delay:${rand(0,0.12)}s;`;
    heartBurstContainer.appendChild(el);
    el.addEventListener("animationend", () => el.remove(), { once: true });
  }
}

// =========================================================
// STICKER CHEER (bounce the quiz stickers)
// =========================================================
function triggerStickerCheer() {
  [bubuSticker, duduSticker].forEach((el, i) => {
    if (!el) return;
    setTimeout(() => {
      el.classList.add("cheering");
      el.addEventListener("animationend", () => el.classList.remove("cheering"), { once: true });
    }, i * 120);
  });
}

// =========================================================
// FINAL SCREEN BUILD
// =========================================================
function buildFinalScreen() {
  // Message lines
  const msgCard = document.getElementById("message-card");
  if (msgCard.children.length === 0) {
    MESSAGE_LINES.forEach(line => {
      const p = document.createElement("p");
      p.className   = "message-line";
      p.textContent = line;
      msgCard.appendChild(p);
    });
  }

  // Photo gallery
  const gallery = document.getElementById("photo-gallery");
  if (gallery.children.length === 0) {
    PHOTOS.forEach((photo, idx) => {
      const wrapper = document.createElement("div");
      wrapper.className = "photo-wrapper";
      wrapper.style.setProperty("--tilt", (PHOTO_TILTS[idx] || 0) + "deg");
      wrapper.setAttribute("role", "button");
      wrapper.setAttribute("tabindex", "0");
      wrapper.setAttribute("aria-label", `Open photo ${idx + 1}`);

      const polaroid = document.createElement("div");
      polaroid.className = "polaroid";

      const img         = document.createElement("img");
      img.src           = photo.src;
      img.alt           = photo.caption;
      img.loading       = "lazy";

      const caption     = document.createElement("div");
      caption.className   = "photo-caption";
      caption.textContent = photo.caption;

      polaroid.appendChild(img);
      polaroid.appendChild(caption);
      wrapper.appendChild(polaroid);
      wrapper.addEventListener("click",   () => openLightbox(photo.src));
      wrapper.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") openLightbox(photo.src); });
      gallery.appendChild(wrapper);
    });
  }

  // Scatter stickers on final page
  placeFinalStickers();
}

function placeFinalStickers() {
  const container = document.getElementById("final-stickers");
  if (!container || container.children.length > 0) return;

  // Show all stickers in a cute strip
  STICKERS.forEach((sticker, i) => {
    const img = document.createElement("img");
    img.src       = sticker.src;
    img.alt       = sticker.alt;
    img.className = "final-sticker";
    img.style.animationDelay = `${i * 0.2}s`;
    container.appendChild(img);
  });
}

function revealMessageLines() {
  const lines = document.querySelectorAll(".message-line");
  lines.forEach((line, i) => {
    setTimeout(() => line.classList.add("revealed"), 400 + i * 700);
  });
  const photoDelay = 400 + lines.length * 700 + 400;
  document.querySelectorAll(".photo-wrapper").forEach((p, i) => {
    setTimeout(() => p.classList.add("revealed"), photoDelay + i * 350);
  });
}

// =========================================================
// ENVELOPE TOGGLE
// =========================================================
function toggleEnvelope() {
  if (!envelopeWrap) return;
  const isOpen = envelopeWrap.classList.toggle("open");
  const hint   = document.getElementById("envelope-hint");
  if (hint) hint.style.opacity = isOpen ? "0" : "";
  envelopeWrap.setAttribute("aria-expanded", isOpen);
}

// =========================================================
// LIGHTBOX
// =========================================================
function openLightbox(src) {
  lightboxImg.src = src;
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
  lightboxImg.src = "";
}

// =========================================================
// UTILITY
// =========================================================
function rand(min, max) { return Math.random() * (max - min) + min; }
