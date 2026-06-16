/* =========================================
   OUR LOVE STORY — Visual Novel Script
   ========================================= */

// =============================================
//  ★  CONFIGURATION — edit these to personalise ★
// =============================================
const CONFIG = {
  // ── Lock screen date (DD/MM/YYYY) ──────────
  anniversaryDate: "09/06/2025",

  // ── Names shown in game & certificate ──────
  playerName:   "mi amor",        // ← name shown in dialogue
  partner1Name: "Anas",      // ← edit for certificate
  partner2Name: "Pranita",       // ← edit for certificate

  // ── Level 2 ── When did we meet? ───────────
  meetQuestion: "When did we first meet? 💕",
  meetCorrect:  "June 9, 2025",
  meetWrong:    ["March 14, 2024", "October 14, 2025", "January 1, 2025"],
  meetReward:   "A bouquet just for you! 🌹",

  // ── Level 3 ── When did we start dating? ───
  datingQuestion: "When did we start dating? 💖",
  datingCorrect:  "October 14, 2025",
  datingWrong:    ["June 9, 2025", "December 25, 2025", "February 14, 2026"],
  datingReward:   "My heart belongs to you! 💗",

  // ── Level 4 ── When did we get married? ────
  weddingQuestion: "When did we get married? 💍",
  weddingCorrect:  "May 24, 2026",
  weddingWrong:    ["June 9, 2025", "October 14, 2025", "December 31, 2025"],
  weddingReward:   "Our forever begins here! 💍",

  // ── Ending message ─────────────────────────
  endingMessage: "everyday with you means everything to me puppy, ur such a sweet little angel and im grateful to have you all to myself 🌸",

  // ── Love letter (edit freely!) ─────────────
  loveLetter: `My sweet puppy,

i love you so much, you mean the absolute world to me.
you have become a core part of my life, more important
than water, food and oxygen to me.

i never believed in fate until i met you. i couldn't
imagine my life without you, in every universe and
every timeline it would always be you.

waking up to you every day feels like such a great gift,
you make me smile so effortlessly and make me really happy.
you make boring days feel like magic, you make hard days
feel manageable, you make everything 1000x better
just by being a part of it.

i love you so much baby and im so glad were going to be
living together and building a future with each other.
you are my sweet little baby, my favourite everything
and i love you so much.

forever and always yours,
your love 💕`,
};
// =============================================

/* ---- DOM ---- */
const lockScreen     = document.getElementById('lock-screen');
const gameScreen     = document.getElementById('game-screen');
const endingScreen   = document.getElementById('ending-screen');
const dateInput      = document.getElementById('date-input');
const unlockBtn      = document.getElementById('unlock-btn');
const lockError      = document.getElementById('lock-error');
const lockSprite     = document.getElementById('lock-sprite');
const gameSprite     = document.getElementById('game-sprite');
const dialogueText   = document.getElementById('dialogue-text');
const nextBtn        = document.getElementById('next-btn');
const choicesDiv     = document.getElementById('choices');
const rewardArea     = document.getElementById('reward-area');
const rewardImg      = document.getElementById('reward-img');
const rewardText     = document.getElementById('reward-text');
const celebration    = document.getElementById('celebration');
const endingMsg      = document.getElementById('ending-message');
const endingSparkles = document.getElementById('ending-sparkles');
const lockContainer  = document.querySelector('.lock-container');
const letterOverlay  = document.getElementById('letter-overlay');
const letterClose    = document.getElementById('letter-close');
const letterText     = document.getElementById('letter-text');
const openLetterBtn  = document.getElementById('open-letter-btn');
const endingButtons  = document.getElementById('ending-buttons');
const weddingPhoto   = document.getElementById('wedding-photo');

/* ---- SPRITES — 3 frames each, all 300×400 ---- */
const SPRITES = {
  neutral: ['assets/neutral1.png', 'assets/neutral2.png', 'assets/neutral3.png', 'assets/neutral4.png'],
  happy:   ['assets/happy1.png',   'assets/happy2.png',   'assets/happy3.png',   'assets/happy4.png'],
  angry:   ['assets/angry1.png',   'assets/angry2.png',   'assets/angry3.png',   'assets/angry4.png'],
};

/* ---- STATE ---- */
let currentMood    = 'neutral';
let spriteInterval = null;
let spriteFrame    = 0;
let typeTimer      = null;

/* ================================================
   SPRITES  — slower, smoother cycling
   ================================================ */
function setMood(mood) {
  if (currentMood === mood) return;
  currentMood = mood;
  spriteFrame = 0;
  clearInterval(spriteInterval);

  [gameSprite, lockSprite].forEach(s => s.classList.remove('happy', 'angry'));
  if (mood === 'happy') [gameSprite, lockSprite].forEach(s => s.classList.add('happy'));
  if (mood === 'angry') [gameSprite, lockSprite].forEach(s => s.classList.add('angry'));

  // Slower speeds: neutral=2.4s, happy=900ms, angry=600ms
  const speed = mood === 'neutral' ? 2400 : mood === 'happy' ? 900 : 600;
  swapFrame();
  spriteInterval = setInterval(swapFrame, speed);
}

function swapFrame() {
  const frames = SPRITES[currentMood];
  const src    = frames[spriteFrame % frames.length];
  spriteFrame++;
  [gameSprite, lockSprite].forEach(s => {
    s.style.opacity = '0';
    setTimeout(() => { s.src = src; s.style.opacity = '1'; }, 120);
  });
}

/* ================================================
   SCREEN TRANSITIONS
   ================================================ */
function showScreen(target) {
  [lockScreen, gameScreen, endingScreen].forEach(s => {
    const isTarget = s === target;
    s.style.opacity       = isTarget ? '1' : '0';
    s.style.pointerEvents = isTarget ? 'all' : 'none';
    s.style.zIndex        = s === endingScreen ? (isTarget ? '100' : '5')
                          : s === lockScreen   ? (isTarget ? '50'  : '1')
                          :                      (isTarget ? '10'  : '1');
  });
}

/* ================================================
   TYPEWRITER
   ================================================ */
function typeWrite(text, onDone) {
  clearTimeout(typeTimer);
  dialogueText.textContent = '';
  nextBtn.classList.add('hidden');
  let i = 0;
  function tick() {
    if (i < text.length) {
      dialogueText.textContent += text[i++];
      if (typeof SFX !== 'undefined' && i % 2 === 0) try{SFX.tick()}catch(e){}
      typeTimer = setTimeout(tick, 34);
    } else {
      if (onDone) onDone();
    }
  }
  tick();
}

/* ================================================
   SHAKE  (gentle, not violent)
   ================================================ */
function shakeElement(el) {
  el.classList.remove('shake-target');
  void el.offsetWidth;
  el.classList.add('shake-target');
  el.addEventListener('animationend', () => el.classList.remove('shake-target'), { once: true });
}

/* ================================================
   LOCK SCREEN
   ================================================ */
dateInput.addEventListener('input', () => {
  let v = dateInput.value.replace(/\D/g, '');
  if (v.length > 2) v = v.slice(0,2) + '/' + v.slice(2);
  if (v.length > 5) v = v.slice(0,5) + '/' + v.slice(5);
  if (v.length > 10) v = v.slice(0,10);
  dateInput.value = v;
  lockError.classList.remove('show');
});

dateInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') unlockBtn.click();
});

unlockBtn.addEventListener('click', () => {
  const entered = dateInput.value.trim();
  if (entered === CONFIG.anniversaryDate) {
    try{SFX.unlock()}catch(e){}
    lockError.classList.remove('show');
    setMood('happy');
    // ── VN PROLOGUE before the quiz ──
    setTimeout(() => {
      if (window._VN_playChapter) {
        window._VN_playChapter(0, () => {
          showScreen(gameScreen);
          initParticles();
          startLevel(1);
        });
      } else {
        showScreen(gameScreen);
        initParticles();
        startLevel(1);
      }
    }, 900);
  } else {
    try{SFX.angry()}catch(e){}
    lockError.classList.add('show');
    currentMood = 'neutral';
    setMood('angry');
    shakeElement(lockContainer);
    setTimeout(() => { currentMood = 'angry'; setMood('neutral'); }, 2200);
  }
});

/* ---- Ambient hearts ---- */
function initAmbientHearts() {
  const c = document.getElementById('ambient-hearts');
  const syms = ['♥','💕','✦','✧','♡'];
  for (let i = 0; i < 12; i++) {  // fewer hearts = calmer
    const el = document.createElement('div');
    el.className   = 'ambient-heart';
    el.textContent = syms[Math.floor(Math.random() * syms.length)];
    el.style.left              = Math.random() * 100 + 'vw';
    el.style.fontSize          = (10 + Math.random() * 12) + 'px';
    el.style.animationDuration = (8 + Math.random() * 10) + 's';
    el.style.animationDelay    = (Math.random() * 10) + 's';
    el.style.color = ['#FFD6E8','#FF9EC4','#C8A0D8','#FFD700'][Math.floor(Math.random()*4)];
    c.appendChild(el);
  }
}

initAmbientHearts();
setMood('neutral');
// Show VN title screen first, then lock screen
if (window._VN_showTitle) {
  window._VN_showTitle(() => showScreen(lockScreen));
} else {
  showScreen(lockScreen);
}

/* ================================================
   PARTICLES  (subtle)
   ================================================ */
function initParticles() {
  const c = document.getElementById('particles');
  c.innerHTML = '';
  const syms = ['✦','✧','♡','·'];
  for (let i = 0; i < 12; i++) {  // reduced count
    const el = document.createElement('div');
    el.className   = 'particle';
    el.textContent = syms[Math.floor(Math.random() * syms.length)];
    el.style.left              = Math.random() * 100 + 'vw';
    el.style.fontSize          = (7 + Math.random() * 10) + 'px';
    el.style.animationDuration = (10 + Math.random() * 14) + 's';
    el.style.animationDelay    = (Math.random() * 12) + 's';
    el.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
    el.style.color = ['#FFD6E8','#FF9EC4','rgba(255,255,255,0.4)'][Math.floor(Math.random()*3)];
    c.appendChild(el);
  }
}

/* ================================================
   CELEBRATION  (toned down)
   ================================================ */
function triggerCelebration() {
  celebration.classList.remove('hidden');
  celebration.innerHTML = '';
  const syms = ['💕','✦','💖','✨','🌸'];
  for (let i = 0; i < 12; i++) {  // was 24, now 12
    const el = document.createElement('div');
    el.className   = 'sparkle';
    el.textContent = syms[Math.floor(Math.random() * syms.length)];
    el.style.left  = (15 + Math.random() * 70) + 'vw';
    el.style.top   = (25 + Math.random() * 40) + 'vh';
    el.style.setProperty('--tx', (Math.random() * 140 - 70) + 'px');
    el.style.setProperty('--ty', (Math.random() * 140 - 70) + 'px');
    el.style.animationDelay = (Math.random() * 0.3) + 's';
    el.style.fontSize = (14 + Math.random() * 14) + 'px';
    celebration.appendChild(el);
  }
  try{SFX.celebrate()}catch(e){}
  setTimeout(() => { celebration.classList.add('hidden'); celebration.innerHTML = ''; }, 1500);
}

/* ================================================
   REWARD
   ================================================ */
function showReward(src, text) {
  rewardImg.src          = src;
  rewardText.textContent = text;
  rewardArea.classList.remove('hidden');
  try{SFX.reward()}catch(e){}
}

/* ================================================
   HELPERS
   ================================================ */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function clearChoices() { choicesDiv.innerHTML = ''; }
function hideNext()      { nextBtn.classList.add('hidden'); }
function showNext(fn) {
  nextBtn.classList.remove('hidden');
  nextBtn.onclick = () => { try{SFX.click()}catch(e){} nextBtn.onclick = null; fn(); };
}

function showChoices(correct, wrong, onCorrect, onWrong) {
  choicesDiv.innerHTML = '';
  shuffle([correct, ...wrong]).forEach(opt => {
    const btn = document.createElement('button');
    btn.className   = 'choice-btn';
    btn.textContent = opt;
    btn.addEventListener('mouseenter', () => { try{SFX.hover()}catch(e){} });
    btn.addEventListener('click', () => {
      try{SFX.click()}catch(e){}
      choicesDiv.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
      opt === correct ? onCorrect() : onWrong();
    });
    choicesDiv.appendChild(btn);
  });
}

function wrongAnswer(retryLevel) {
  try{SFX.wrong()}catch(e){}
  currentMood = 'neutral';
  setMood('angry');
  shakeElement(document.querySelector('.character-area'));
  typeWrite('wrong dummy think harder or ill touch you 😤', () => {
    setTimeout(() => {
      clearChoices();
      currentMood = 'angry';
      setMood('neutral');
      startLevel(retryLevel);
    }, 1400);
  });
}

/* ================================================
   LEVELS
   ================================================ */
function startLevel(level) {
  hideNext();
  clearChoices();
  // Hide previous reward so it doesn't bleed into the next level
  rewardArea.classList.add('hidden');
  rewardImg.src = '';
  rewardText.textContent = '';

  switch(level) {
    case 1:
      setMood('neutral');
      typeWrite(
        `Hello my sweet baby i got you some gifts for our anniversary, but you gotta answer some questions to receive ur prize, are you ready!`,
        () => showNext(() => startLevel(2))
      );
      break;

    case 2:
      setMood('neutral');
      typeWrite(CONFIG.meetQuestion, () => {
        showChoices(CONFIG.meetCorrect, CONFIG.meetWrong,
          () => {
            try{SFX.correct()}catch(e){} setMood('happy'); triggerCelebration();
            showReward('assets/flowers.png', CONFIG.meetReward);
            typeWrite('thats a good puppy u remembered ♡ here are some flowers for u princess',
              () => showNext(() => {
                if (window._VN_playChapter) {
                  window._VN_playChapter(1, () => {
                    showScreen(gameScreen);
                    startLevel(3);
                  });
                } else { startLevel(3); }
              }));
          },
          () => wrongAnswer(2)
        );
      });
      break;

    case 3:
      setMood('neutral');
      typeWrite(CONFIG.datingQuestion, () => {
        showChoices(CONFIG.datingCorrect, CONFIG.datingWrong,
          () => {
            try{SFX.correct()}catch(e){} setMood('happy'); triggerCelebration();
            showReward('assets/heart.gif', CONFIG.datingReward);
            typeWrite('my heart belongs to u fully puppy i love you dearly 💗',
              () => showNext(() => {
                if (window._VN_playChapter) {
                  window._VN_playChapter(2, () => {
                    showScreen(gameScreen);
                    startLevel(4);
                  });
                } else { startLevel(4); }
              }));
          },
          () => wrongAnswer(3)
        );
      });
      break;

    case 4:
      setMood('neutral');
      typeWrite(CONFIG.weddingQuestion, () => {
        showChoices(CONFIG.weddingCorrect, CONFIG.weddingWrong,
          () => {
            try{SFX.correct()}catch(e){} setMood('happy'); triggerCelebration();
            showReward('assets/ring.png', CONFIG.weddingReward);
            typeWrite('that day i was the happiest i have ever been in my life, im so happy ur all mine 💍',
              () => showNext(() => {
                if (window._VN_playChapter) {
                  window._VN_playChapter(3, () => {
                    showScreen(gameScreen);
                    startLevel(5);
                  });
                } else { startLevel(5); }
              }));
          },
          () => wrongAnswer(4)
        );
      });
      break;

    case 5:
      setMood('neutral');
      clearChoices();
      typeWrite('one final question, my love... 💕', () => {
        setTimeout(() => {
          typeWrite('who do you belong to forever? 💖', () => {
            ['💕 You', '💕 You'].forEach(label => {
              const btn = document.createElement('button');
              btn.className   = 'choice-btn';
              btn.textContent = label;
              btn.addEventListener('click', () => {
                clearChoices();
                setMood('happy');
                triggerCelebration();
                showReward('assets/reward_kitty.gif', 'mine forever 💕');
                typeWrite('you belong to me and only me and i belong to you and only u always forever 💗', () => {
                  setTimeout(triggerEnding, 1800);
                });
              });
              choicesDiv.appendChild(btn);
            });
          });
        }, 500);
      });
      break;
  }
}

/* ================================================
   ENDING
   ================================================ */
function triggerEnding() {
  try{SFX.fanfare()}catch(e){}
  setTimeout(() => {
    showScreen(endingScreen);
    endingMsg.textContent      = CONFIG.endingMessage;
    endingSparkles.textContent = '💕 ✨ 💗 ✨ 💕';
    spawnFloatingHearts();
    setTimeout(() => {
      weddingPhoto.classList.remove('hidden');
      document.getElementById('ending-buttons').classList.remove('hidden');
      setTimeout(() => { if (window._initScratch) window._initScratch(); }, 400);
    }, 1200);
  }, 1500);
}

function spawnFloatingHearts() {
  const c = document.getElementById('float-hearts');
  c.innerHTML = '';
  const syms = ['💕','💗','💖','♥','💓','💝','✨','🌸'];
  for (let i = 0; i < 20; i++) {  // was 30, now 20
    const el = document.createElement('div');
    el.className = 'float-heart';
    el.textContent = syms[Math.floor(Math.random() * syms.length)];
    el.style.left              = Math.random() * 100 + 'vw';
    el.style.animationDuration = (6 + Math.random() * 9) + 's';
    el.style.animationDelay    = (Math.random() * 8) + 's';
    el.style.fontSize          = (12 + Math.random() * 18) + 'px';
    c.appendChild(el);
  }
}

/* ================================================
   LOVE LETTER
   ================================================ */
openLetterBtn.addEventListener('click', () => {
  try{SFX.letterOpen()}catch(e){}
  letterText.textContent = CONFIG.loveLetter;
  letterOverlay.classList.remove('hidden');
});
letterClose.addEventListener('click', closeLetter);
letterOverlay.addEventListener('click', e => { if (e.target === letterOverlay) closeLetter(); });
function closeLetter() { letterOverlay.classList.add('hidden'); }

/* ================================================
   MARRIAGE CERTIFICATE  (Canvas → PNG download)
   ================================================ */

/* Helper: load an image and return a Promise<HTMLImageElement> */

/* Draw an image fitted into a box, centred/cropped */



/* ================================================
   AUDIO ENGINE — Web Audio API
   Master volume default 25% — subtle and romantic
   ================================================ */
const AUDIO = (() => {
  let ctx = null;
  let masterVol = 0.25; // 25% default

  function ac() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, type, dur, vol, delay = 0) {
    try {
      const c = ac();
      const osc  = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, c.currentTime + delay);
      const v = (vol ?? 0.15) * masterVol;
      gain.gain.setValueAtTime(0, c.currentTime + delay);
      gain.gain.linearRampToValueAtTime(v, c.currentTime + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + delay + dur);
      osc.start(c.currentTime + delay);
      osc.stop(c.currentTime + delay + dur + 0.01);
    } catch(e) {}
  }

  function setVolume(v) { masterVol = Math.max(0, Math.min(1, v)); }
  function getVolume()  { return masterVol; }

  return {
    setVolume, getVolume,

    // Typewriter tick — very soft, slight pitch variation
    tick() {
      tone(900 + Math.random() * 300, 'sine', 0.04, 0.06);
    },

    // UI click
    click() { tone(660, 'sine', 0.07, 0.10); },

    // Button hover
    hover() { tone(880, 'sine', 0.04, 0.05); },

    // Correct answer — rising chime
    correct() {
      tone(523, 'sine', 0.12, 0.12);
      tone(659, 'sine', 0.14, 0.13, 0.10);
      tone(784, 'sine', 0.18, 0.14, 0.20);
      tone(1047,'sine', 0.28, 0.16, 0.32);
    },

    // Wrong answer — sad descend
    wrong() {
      tone(300, 'sawtooth', 0.08, 0.12);
      tone(220, 'sawtooth', 0.12, 0.12, 0.11);
      tone(165, 'sawtooth', 0.18, 0.10, 0.24);
    },

    // Reward sparkle — ascending arpeggio
    reward() {
      [1047,1175,1319,1568,1760].forEach((f,i) =>
        tone(f, 'sine', 0.16, 0.12, i * 0.055)
      );
    },

    // Celebration burst
    celebrate() {
      [523,587,659,698,784,880,988,1047].forEach((f,i) =>
        tone(f, 'sine', 0.18, 0.10, i * 0.045)
      );
    },

    // Ending fanfare
    fanfare() {
      const mel = [523,659,784,1047,784,880,1047,1319];
      mel.forEach((f,i) => tone(f, 'sine', 0.26, 0.14, i * 0.09));
    },

    // Unlock / level transition
    unlock() {
      tone(523, 'sine', 0.2, 0.12);
      tone(659, 'sine', 0.2, 0.13, 0.12);
      tone(784, 'sine', 0.2, 0.14, 0.24);
      tone(1047,'sine', 0.35, 0.16, 0.36);
    },

    // Angry / shake
    angry() {
      tone(80,  'sawtooth', 0.07, 0.18);
      tone(60,  'sawtooth', 0.10, 0.16, 0.09);
      tone(100, 'sawtooth', 0.07, 0.14, 0.20);
    },

    // Letter open
    letterOpen() {
      tone(440, 'sine', 0.10, 0.10);
      tone(554, 'sine', 0.13, 0.11, 0.10);
      tone(659, 'sine', 0.18, 0.13, 0.20);
    },

    // ── NEW SOUNDS ────────────────────────────────

    // Heart collected — soft magical chime
    heartCollect() {
      tone(1174, 'sine', 0.22, 0.18);
      tone(1568, 'sine', 0.20, 0.16, 0.08);
      tone(2093, 'sine', 0.28, 0.14, 0.18);
      // tiny sparkle tail
      tone(2637, 'sine', 0.18, 0.10, 0.30);
    },

    // Secret heart beating — deep, slow, cinematic
    // Call twice per beat (thump-thump)
    secretHeartbeat() {
      tone(55, 'sine', 0.18, 0.35);          // thump
      tone(48, 'sine', 0.14, 0.28, 0.22);    // thump
    },

    // Star placed / wish submitted — soft shimmer rising
    wishStar() {
      tone(880,  'sine', 0.20, 0.14);
      tone(1108, 'sine', 0.22, 0.13, 0.10);
      tone(1320, 'sine', 0.24, 0.12, 0.20);
      tone(1760, 'sine', 0.30, 0.12, 0.32);
      tone(2217, 'sine', 0.20, 0.10, 0.46);
    },

    // Constellation line draw — each segment
    constellationLine() {
      tone(440, 'sine', 0.12, 0.10);
      tone(660, 'sine', 0.14, 0.09, 0.10);
    },

    // Constellation heart complete — magical crystalline fanfare
    constellationComplete() {
      // Base swell
      [261,329,392,523].forEach((f,i) =>
        tone(f, 'sine', 0.5, 0.14, i * 0.06)
      );
      // Sparkling top layer
      [1047,1319,1568,2093,1760,2093,2637].forEach((f,i) =>
        tone(f, 'sine', 0.25, 0.12, 0.25 + i * 0.07)
      );
    },

    // Heartbeat for ending screen (soft)
    heartbeat() {
      tone(100, 'sine', 0.07, 0.28);
      tone(80,  'sine', 0.09, 0.22, 0.14);
    }
  };
})();

// Global SFX alias so all existing try{SFX.x()} calls work
const SFX = AUDIO;

function playSFX(name) {
  try { AUDIO[name](); } catch(e) {}
}





// Heartbeat: only plays on secret ending screen, not here




/* ================================================
   SCRATCH CARD — CSS tile grid
   ================================================ */
function initScratchTiles() {
  const grid = document.getElementById('tile-grid');
  if (!grid || grid.dataset.ready) return;
  grid.dataset.ready = '1';

  let down = false;
  let removed = 0;
  let revealed = false;

  function kill(e) {
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
  }

  function removeTile(el) {
    if (!el || revealed) return;
    if (!el.classList.contains('scratch-tile')) return;
    if (el.classList.contains('gone')) return;
    el.classList.add('gone');
    removed++;
    try { if (Math.random() < 0.3) SFX.tick(); } catch(e2) {}
    if (removed >= 18) revealAll();
  }

  function fromPoint(x, y) {
    return document.elementFromPoint(x, y);
  }

  function revealAll() {
    if (revealed) return;
    revealed = true;
    grid.querySelectorAll('.scratch-tile:not(.gone)')
      .forEach((t, i) => setTimeout(() => t.classList.add('gone'), i * 25));
    setTimeout(() => {
      grid.style.display = 'none';
      try { SFX.correct(); } catch(e2) {}
      triggerCelebration();
    }, 800);
  }

  // --- MOUSE ---
  grid.addEventListener('mousedown', function(e) {
    kill(e);
    down = true;
    removeTile(e.target);
  });
  // Use grid-level mousemove, NOT document (avoids scroll container stealing)
  grid.addEventListener('mousemove', function(e) {
    if (!down) return;
    kill(e);
    removeTile(fromPoint(e.clientX, e.clientY));
  });
  document.addEventListener('mouseup', function() { down = false; });

  // --- TOUCH ---
  // passive:false on the GRID stops the scroll container from intercepting
  grid.addEventListener('touchstart', function(e) {
    kill(e);
    down = true;
    const t = e.touches[0];
    removeTile(fromPoint(t.clientX, t.clientY));
  }, { passive: false });

  grid.addEventListener('touchmove', function(e) {
    kill(e);
    if (!down) return;
    const t = e.touches[0];
    removeTile(fromPoint(t.clientX, t.clientY));
  }, { passive: false });

  grid.addEventListener('touchend', function(e) {
    kill(e);
    down = false;
  }, { passive: false });
}

window._initScratch = initScratchTiles;

/* ================================================
   HIDDEN HEARTS QUEST
   ================================================ */
// Clear all progress on every page load — fresh experience each time
localStorage.removeItem('lsHearts');
localStorage.removeItem('lsWishes');
localStorage.removeItem('lsConstellation');

const HEARTS_STATE = {
  found: [],
  total: 5
};

function saveHearts() {
  // no-op: we don't persist hearts across sessions
}

function updateHeartsHUD() {
  const hud = document.getElementById('hearts-hud');
  const cnt = document.getElementById('hearts-count');
  if (!hud || !cnt) return;
  cnt.textContent = HEARTS_STATE.found.length;
  // Only show HUD after at least 1 heart collected
  if (HEARTS_STATE.found.length > 0) hud.classList.remove('hidden');
  if (HEARTS_STATE.found.length >= HEARTS_STATE.total) {
    setTimeout(showHeartsPopup, 600);
  }
}

function showHeartToast(n) {
  // Remove any existing toast
  document.querySelectorAll('.heart-toast').forEach(t => t.remove());

  const total = HEARTS_STATE.found.length;
  const msgs = [
    'you found a hidden heart! 💗',
    'another heart discovered! 💗',
    'you\'re so observant~ 💗',
    'getting closer... 💗',
    'all hearts found! 💗✨'
  ];

  const toast = document.createElement('div');
  toast.className = 'heart-toast';
  toast.innerHTML = `♡ Hearts Found: ${total}/5<br><span style="font-size:0.85em;color:var(--lavender)">${msgs[total - 1] || '💗'}</span>`;
  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  // Animate out after 2.5s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

function collectHeart(n) {
  if (HEARTS_STATE.found.includes(n)) return;
  HEARTS_STATE.found.push(n);
  saveHearts();
  try { SFX.heartCollect(); } catch(e) {}
  updateHeartsHUD();

  // Hide the heart element
  const heart = document.querySelector(`.hidden-heart[data-heart="${n}"]`);
  if (heart) {
    const r = heart.getBoundingClientRect();
    const burst = document.createElement('div');
    burst.textContent = '💗';
    burst.style.cssText = `position:fixed;font-size:28px;pointer-events:none;z-index:9999;
      left:${r.left + r.width/2 - 14}px;top:${r.top + r.height/2 - 14}px;
      transition:all 0.7s ease;opacity:1;filter:drop-shadow(0 0 8px rgba(255,100,180,0.9));`;
    document.body.appendChild(burst);
    requestAnimationFrame(() => {
      burst.style.transform = 'translateY(-50px) scale(2)';
      burst.style.opacity = '0';
    });
    setTimeout(() => burst.remove(), 800);
    for (let i = 0; i < 3; i++) {
      const mini = document.createElement('div');
      mini.textContent = ['💕','✨','🌸'][i];
      const angle = (i / 3) * Math.PI * 2;
      mini.style.cssText = `position:fixed;font-size:16px;pointer-events:none;z-index:9999;
        left:${r.left + r.width/2}px;top:${r.top + r.height/2}px;
        transition:all 0.8s ease ${i*0.1}s;opacity:1;`;
      document.body.appendChild(mini);
      requestAnimationFrame(() => {
        mini.style.transform = `translate(${Math.cos(angle)*50}px,${Math.sin(angle)*50 - 30}px) scale(1.3)`;
        mini.style.opacity = '0';
      });
      setTimeout(() => mini.remove(), 900 + i*100);
    }
    heart.style.display = 'none';
  }

  // Show toast then trigger VN flashback
  showHeartToast(n);
  setTimeout(() => {
    if (window._VN_heartFlashback) {
      // Capture which screen is active RIGHT NOW, before the flashback hides everything
      const activeScreen =
        endingScreen.style.opacity === '1' ? endingScreen :
        gameScreen.style.opacity   === '1' ? gameScreen   :
        lockScreen;
      window._VN_heartFlashback(n, () => {
        activeScreen.style.opacity = '1';
        activeScreen.style.pointerEvents = 'all';
      });
    }
  }, 1200);
}

function showHeartsPopup() {
  const pop = document.getElementById('hearts-popup');
  if (!pop || pop.dataset.shown) return;
  pop.dataset.shown = '1';
  pop.classList.remove('hidden');
  // Spawn sparkles inside popup
  const sp = document.getElementById('hp-sparkles');
  const syms = ['💕','✨','⭐','🌸','✦'];
  for (let i = 0; i < 16; i++) {
    const el = document.createElement('div');
    el.textContent = syms[Math.floor(Math.random() * syms.length)];
    el.style.cssText = `position:absolute;font-size:${12+Math.random()*14}px;left:${Math.random()*100}%;top:${Math.random()*100}%;opacity:0;animation:sparkleFly ${0.8+Math.random()*0.8}s ease-out ${Math.random()*0.4}s forwards;--tx:${Math.random()*80-40}px;--ty:${Math.random()*80-40}px;`;
    sp.appendChild(el);
  }
  document.getElementById('hearts-popup-close').onclick = () => {
    pop.classList.add('hidden');
    // Wish tree unlocks only after Done → secret heart → click
    // Just close the popup here, nothing else
  };
}

// Attach heart collectors to all hidden hearts
document.querySelectorAll('.hidden-heart').forEach(el => {
  const n = parseInt(el.dataset.heart);
  // If already collected, hide immediately
  if (HEARTS_STATE.found.includes(n)) {
    el.style.display = 'none';
  }
  el.addEventListener('click', e => {
    e.stopPropagation();
    collectHeart(n);
  });
});

// Show HUD once game starts
const _origShowScreen = showScreen;
window.showScreen = function(target) {
  _origShowScreen(target);
  if (target === gameScreen || target === endingScreen) {
    document.getElementById('hearts-hud').classList.remove('hidden');
  }
};

/* ================================================
   DONE BUTTON → SECRET ENDING
   ================================================ */
const doneBtn = document.getElementById('done-btn');
if (doneBtn) {
  doneBtn.addEventListener('click', () => {
    const allFound = HEARTS_STATE.found.length >= HEARTS_STATE.total;
    if (!allFound) {
      // Not all hearts found — just a sweet goodbye message
      const toast = document.createElement('div');
      toast.className = 'heart-toast';
      toast.style.top = '50%';
      toast.style.transform = 'translate(-50%,-50%)';
      toast.innerHTML = '(ᵕ◡ᵕ)♡<br><span style="font-size:0.8em;color:var(--lavender)">find all 5 hidden hearts<br>for a secret surprise~</span>';
      document.body.appendChild(toast);
      requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
      setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3000);
      return;
    }
    // All 5 found — fade to secret ending
    const overlay = document.getElementById('secret-overlay');
    overlay.classList.remove('hidden');
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 1.5s ease';
    requestAnimationFrame(() => { overlay.style.opacity = '1'; });
    setTimeout(() => {
      const sh = document.getElementById('secret-heart');
      sh.style.opacity = '1';
      sh.addEventListener('click', startSecretEnding, { once: true });
      // Heartbeat sound synced to CSS pulse animation (1.4s cycle)
      const _hbInterval = setInterval(() => {
        if (!sh.isConnected || sh.style.opacity === '0') { clearInterval(_hbInterval); return; }
        try { SFX.secretHeartbeat(); } catch(e) {}
      }, 1400);
    }, 2000);
  });
}

// Show done button when letter is closed
const origLetterClose = document.getElementById('letter-close');
if (origLetterClose) {
  origLetterClose.addEventListener('click', () => {
    setTimeout(() => {
      if (doneBtn) doneBtn.classList.remove('hidden');
    }, 400);
  });
}

function startSecretEnding() {
  const overlay = document.getElementById('secret-overlay');
  overlay.style.opacity = '0';
  setTimeout(() => {
    overlay.classList.add('hidden');

    // Play cosmos VN epilogue first, then reveal wish tree
    if (window._VN_cosmosEnding) {
      window._VN_cosmosEnding(() => {
        showScreen(endingScreen);
        showWishTree();
        startPetals();
        spawnFireflies();
        setTimeout(() => {
          const toast = document.createElement('div');
          toast.className = 'heart-toast';
          toast.style.top = '50%';
          toast.style.transform = 'translate(-50%, -50%)';
          toast.style.textAlign = 'center';
          toast.style.lineHeight = '2';
          toast.style.padding = '16px 24px';
          toast.innerHTML = '🌸 petals are falling...<br><span style="font-size:0.85em;color:var(--lavender)">click them to unlock memories ♡</span>';
          document.body.appendChild(toast);
          requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
          setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 500); }, 4000);
        }, 1200);
      });
    } else {
      showWishTree();
      startPetals();
      spawnFireflies();
    }
  }, 1500);
}

/* ================================================
   WISH TREE
   ================================================ */
const WISHES = [];
let wishCount = 0;
let constellationTriggered = false;
function showWishTree() {
  const section = document.getElementById('wish-tree-section');
  if (!section || !section.classList.contains('hidden')) return;
  section.classList.remove('hidden');
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Heart constellation points (% of wish-sky container)
const HEART_POINTS = [
  {x:50, y:35},   // 1  bottom-centre point
  {x:35, y:25},   // 2
  {x:20, y:35},   // 3
  {x:20, y:55},   // 4
  {x:27, y:62},   // 5
  {x:50, y:80},   // 6  top centre peak (right side)
  {x:57, y:75},   // 7
  {x:80, y:55},   // 8
  {x:80, y:35},   // 9
  {x:65, y:25}    // 10
];

let constellationStars = []; // DOM nodes for placed stars
let constellationLines = []; // SVG line nodes

function getConstellationContainer() {
  return document.getElementById('wish-sky');
}

function getSVG() {
  return document.getElementById('wish-constellation-svg');
}

// Called each time a wish is submitted — places the NEXT star + draws line from previous
function placeNextStar(wishText) {
  const idx = constellationStars.length;
  if (idx >= HEART_POINTS.length) return; // all points placed

  const sky = getConstellationContainer();
  const svgEl = getSVG();
  if (!sky || !svgEl) return;

  const W = sky.offsetWidth  || 400;
  const H = sky.offsetHeight || 300;
  const pt = HEART_POINTS[idx];
  const px = (pt.x / 100) * W;
  const py = (pt.y / 100) * H;

  // Size SVG to match container
  svgEl.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svgEl.style.width  = W + 'px';
  svgEl.style.height = H + 'px';

  // Create star dot
  const star = document.createElement('div');
  star.className = 'wish-star';
  star.style.left    = px + 'px';
  star.style.top     = py + 'px';
  star.style.animation = 'starAppear 0.5s cubic-bezier(0.175,0.885,0.32,1.275) forwards';
  setTimeout(() => {
    star.classList.add('placed');
    star.style.setProperty('--shimmer-delay', (constellationStars.length * 0.3) + 's');
  }, 520);

  // Tooltip with wish text
  const tip = document.createElement('div');
  tip.className = 'wish-star-tooltip';
  tip.textContent = wishText;
  star.appendChild(tip);
  sky.appendChild(star);
  constellationStars.push(star);

  // Draw line from previous star to this one
  if (idx > 0) {
    const prev = HEART_POINTS[idx - 1];
    const prevX = (prev.x / 100) * W;
    const prevY = (prev.y / 100) * H;

    // Glow line
    const glow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    glow.setAttribute('x1', prevX); glow.setAttribute('y1', prevY);
    glow.setAttribute('x2', px);    glow.setAttribute('y2', py);
    glow.setAttribute('stroke', 'rgba(0,200,160,0.3)');
    glow.setAttribute('stroke-width', '8');
    glow.setAttribute('stroke-linecap', 'round');
    svgEl.appendChild(glow);

    // Core bright line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', prevX); line.setAttribute('y1', prevY);
    line.setAttribute('x2', px);    line.setAttribute('y2', py);
    line.setAttribute('stroke', 'rgba(120,255,220,0.95)');
    line.setAttribute('stroke-width', '1.5');
    line.setAttribute('stroke-linecap', 'round');
    line.style.animation = 'lineGrow 0.5s ease forwards';
    try { SFX.constellationLine(); } catch(e) {}
    const len = Math.hypot(px - prevX, py - prevY);
    line.setAttribute('stroke-dasharray', len);
    line.setAttribute('stroke-dashoffset', len);
    svgEl.appendChild(line);
    constellationLines.push(line);
  }

  // If last point, close the heart (connect back to point 0)
  if (idx === HEART_POINTS.length - 1) {
    setTimeout(() => {
      const first = HEART_POINTS[0];
      const fx = (first.x / 100) * W;
      const fy = (first.y / 100) * H;

      const closeGlow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      closeGlow.setAttribute('x1', px); closeGlow.setAttribute('y1', py);
      closeGlow.setAttribute('x2', fx); closeGlow.setAttribute('y2', fy);
      closeGlow.setAttribute('stroke', 'rgba(0,200,160,0.3)');
      closeGlow.setAttribute('stroke-width', '8');
      closeGlow.setAttribute('stroke-linecap', 'round');
      svgEl.appendChild(closeGlow);

      const closeLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      closeLine.setAttribute('x1', px); closeLine.setAttribute('y1', py);
      closeLine.setAttribute('x2', fx); closeLine.setAttribute('y2', fy);
      closeLine.setAttribute('stroke', 'rgba(120,255,220,0.95)');
      closeLine.setAttribute('stroke-width', '1.5');
      closeLine.setAttribute('stroke-linecap', 'round');
      const len2 = Math.hypot(fx - px, fy - py);
      closeLine.setAttribute('stroke-dasharray', len2);
      closeLine.setAttribute('stroke-dashoffset', len2);
      closeLine.style.animation = 'lineGrow 0.5s ease forwards';
      svgEl.appendChild(closeLine);

      setTimeout(showConstellationComplete, 700);
    }, 600);
  }
}

function showConstellationComplete() {
  const sky = getConstellationContainer();
  if (!sky) return;

  // Pulse all stars brighter with shimmer
  constellationStars.forEach((s, i) => {
    s.style.animation = `constellationPulse 1.8s ease-in-out infinite ${i * 0.15}s`;
    s.style.setProperty('--shimmer-delay', (i * 0.15) + 's');
  });

  const msg = document.createElement('div');
  msg.className = 'constellation-msg';
  msg.style.color = 'var(--gold)';
  msg.style.textShadow = '0 0 20px rgba(255,215,0,0.8)';
  msg.innerHTML = '♡ Our wishes became a heart ♡';
  sky.parentElement.appendChild(msg);

  try { SFX.constellationComplete(); } catch(e) {}
  triggerCelebration();

  // Reveal QR scratch card after the message lands
  setTimeout(() => {
    const qrWrap = document.getElementById('qr-unlock-wrap');
    if (qrWrap && qrWrap.classList.contains('hidden')) {
      qrWrap.classList.remove('hidden');
      // Re-init scratch tiles
      const grid = document.getElementById('tile-grid');
      if (grid) delete grid.dataset.ready;
      setTimeout(() => { if (window._initScratch) window._initScratch(); }, 500);
      // Reveal label
      const reveal = document.createElement('div');
      reveal.className = 'constellation-msg';
      reveal.style.cssText = 'color:var(--pink-light);font-size:clamp(7px,1.5vw,9px);margin-top:8px;';
      reveal.innerHTML = '✨ one last surprise for you... ✨';
      qrWrap.parentElement.insertBefore(reveal, qrWrap);
      qrWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 2200);
}

// Legacy — not used for random placement anymore
function addStarToTree(text, animate) { placeNextStar(text); }
function triggerConstellation(animate) { /* handled progressively now */ }


function saveWishes() {
}

const wishBtn = document.getElementById('wish-btn');
const wishInput = document.getElementById('wish-input');
const wishMsg = document.getElementById('wish-msg');

if (wishBtn && wishInput) {
  wishBtn.addEventListener('click', submitWish);
  wishInput.addEventListener('keydown', e => { if (e.key === 'Enter') submitWish(); });
}

function submitWish() {
  const txt = wishInput.value.trim();
  if (!txt) return;
  if (WISHES.length >= HEART_POINTS.length) {
    // All 10 points placed — just show message
    wishMsg.textContent = 'The heart is complete ♡';
    wishMsg.classList.remove('hidden');
    setTimeout(() => wishMsg.classList.add('hidden'), 3000);
    return;
  }
  WISHES.push(txt);
  wishCount++;
  placeNextStar(txt);
  wishInput.value = '';
  wishMsg.textContent = 'Your wish has been placed among the stars ♡';
  wishMsg.classList.remove('hidden');
  setTimeout(() => wishMsg.classList.add('hidden'), 3000);
  try { SFX.reward(); } catch(e) {}
}



/* ================================================
   FIREFLIES
   ================================================ */
function spawnFireflies() {
  const layer = document.getElementById('firefly-layer');
  if (!layer) return;
  for (let i = 0; i < 14; i++) {
    const f = document.createElement('div');
    f.className = 'firefly';
    f.style.left = (10 + Math.random() * 80) + '%';
    f.style.top  = (10 + Math.random() * 80) + '%';
    f.style.setProperty('--fx', (Math.random() * 60 - 30) + 'px');
    f.style.setProperty('--fy', (Math.random() * 60 - 30) + 'px');
    f.style.animationDuration = (4 + Math.random() * 6) + 's';
    f.style.animationDelay   = (Math.random() * 4) + 's';
    layer.appendChild(f);
  }
}

/* ================================================
   FALLING PETALS WITH MEMORIES
   ================================================ */
const MEMORIES = [
  "we first met and you thought i was a girl",
  "we first told each other i love you",
  "we first called in ur backyard",
  "i encouraged you to go out on walks and you did",
  "u cried watching cyberpunk",
  "i showed you my first horribly made edit",
  "i named a hundred things i love about you",
  "we exchanged valentine letters",
  "we got married",
  "we first kissed",
  "we used to send each other hundreds of tiktoks everyday",
  "we 1v1 in mm2 in that gamemode",
  "all the times u gave me ur cute lucky charm",
  "all the talks we had about our future plans",
  "all the times we stayed up for each other",
  "we cut our ring finger so it would leave a ring shaped scar forever",
  "how we bought each others initials to wear on our necks",
  "the time u tried prawns and almost puked",
  "all those obbys we played",
  "all those times we laughed at instagram reels together",
  "when u made a playlist for me of ur songs",
  "when we listened together to music",
  "when i kept trying to hide from my teachers and talk to u",
  "all the naughty fun we had",
  "all the dreams we shared together"
];

let petalLayer = null;
let petalInterval = null;

function startPetals() {
  if (petalLayer) return;
  petalLayer = document.createElement('div');
  petalLayer.className = 'petal-layer';
  document.body.appendChild(petalLayer);

  // Shuffle memories for this session
  const shuffled = [...MEMORIES].sort(() => Math.random() - 0.5);
  let memIdx = 0;

  function spawnBatch() {
    // Spawn 3 petals, staggered, each with a different memory
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const mem = shuffled[memIdx % shuffled.length];
        memIdx++;
        spawnMemoryPetal(mem);
      }, i * 1200);
    }
    // Next batch after reading time (12 seconds gap between batches)
    petalInterval = setTimeout(spawnBatch, 12000);
  }
  spawnBatch();
}

function spawnMemoryPetal(memory) {
  if (!petalLayer) return;
  const petal = document.createElement('img');
  petal.className = 'petal';
  petal.src = PETAL_SVGS[Math.floor(Math.random() * PETAL_SVGS.length)];
  petal.style.left = (10 + Math.random() * 80) + 'vw';
  const dur = 9 + Math.random() * 5;
  const size = 20 + Math.floor(Math.random() * 14);
  petal.style.width = size + 'px';
  petal.style.height = 'auto';
  petal.style.animationDuration = dur + 's';
  petal.style.setProperty('--pr', (Math.random() * 360 - 180) + 'deg');
  petal.style.setProperty('--px', (Math.random() * 80 - 40) + 'px');
  petal.style.setProperty('--ps', (0.85 + Math.random() * 0.4) + '');
  petalLayer.appendChild(petal);
  petal.addEventListener('click', () => {
    showPetalPopup(memory);
    petal.remove();
  });
  setTimeout(() => { if (petal.parentNode) petal.remove(); }, dur * 1000 + 200);
}

const PETAL_SVGS = [
  'assets/petal_blossom.svg',
  'assets/petal_heart.svg',
  'assets/petal_petal.svg',
  'assets/petal_star.svg',
  'assets/petal_blossom2.svg',
];

function showPetalPopup(memory) {
  const pop  = document.getElementById('petal-popup');
  const text = document.getElementById('petal-popup-text');
  if (!pop || !text) return;
  text.textContent = memory;
  pop.classList.remove('hidden');
  document.getElementById('petal-popup-close').onclick = () => pop.classList.add('hidden');
}

/* ================================================
   RESTORE STATE ON LOAD
   ================================================ */
// Progress resets on every page load — fresh experience

/* ================================================
   VOLUME SLIDER
   ================================================ */
(function() {
  const slider  = document.getElementById('vol-slider');
  const icon    = document.getElementById('vol-icon');
  if (!slider || !icon) return;

  let muted = false;
  let lastVol = 25;

  function updateSliderFill(val) {
    slider.style.setProperty('--val', val + '%');
  }

  slider.addEventListener('input', () => {
    const v = parseInt(slider.value);
    AUDIO.setVolume(v / 100);
    updateSliderFill(v);
    muted = v === 0;
    icon.textContent = v === 0 ? '🔇' : v < 40 ? '🔉' : '🔊';
    lastVol = v > 0 ? v : lastVol;
    try { SFX.tick(); } catch(e) {}
  });

  // Click icon to mute/unmute
  icon.addEventListener('click', () => {
    if (muted) {
      slider.value = lastVol;
      AUDIO.setVolume(lastVol / 100);
      updateSliderFill(lastVol);
      muted = false;
      icon.textContent = lastVol < 40 ? '🔉' : '🔊';
    } else {
      lastVol = parseInt(slider.value);
      slider.value = 0;
      AUDIO.setVolume(0);
      updateSliderFill(0);
      muted = true;
      icon.textContent = '🔇';
    }
  });

  // Init fill
  updateSliderFill(25);
})();

/* ================================================
   BACKGROUND MUSIC
   Starts on first user interaction (browser policy)
   Volume tied to the master slider
   ================================================ */
(function() {
  const bgm = document.getElementById('bgm');
  if (!bgm) return;

  bgm.volume = 0.22; // default ~22% — subtle
  let started = false;

  function startBGM() {
    if (started) return;
    bgm.play().then(() => {
      started = true;
    }).catch(() => {});
  }

  // Start on first click or keydown anywhere
  ['click','keydown','touchstart'].forEach(ev => {
    document.addEventListener(ev, startBGM, { once: false, passive: true });
  });

  // Keep BGM volume in sync with the volume slider
  // Override the slider handler to also adjust BGM
  const slider = document.getElementById('vol-slider');
  const icon   = document.getElementById('vol-icon');
  if (slider) {
    slider.addEventListener('input', () => {
      const v = parseInt(slider.value) / 100;
      bgm.volume = Math.min(v * 0.9, 0.95); // BGM slightly quieter than SFX ceiling
    });
    // Mute icon click also mutes BGM
    if (icon) {
      icon.addEventListener('click', () => {
        bgm.muted = !bgm.muted;
      });
    }
  }
})();
