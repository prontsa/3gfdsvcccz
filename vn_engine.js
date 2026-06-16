/* ============================================================
   VISUAL NOVEL ENGINE  —  vn_engine.js
   Features:
     • Title screen
     • Scene location labels
     • Two-character dialogue (him + her)
     • Fake-choice moment
     • Hidden heart → flashback popup
   ============================================================ */

/* ── SCENE BACKGROUNDS ── */
const VN_BG = {
  default:  'assets/background.gif',
  kitchen:  'assets/scene_kitchen.png',
  bedroom:  'assets/scene_bedroom.png',
  roblox:   'assets/scene_roblox.png',
  snap:     'assets/scene_snap.png',
  wedding1: 'assets/scene_wedding2.png',
  wedding2: 'assets/scene_wedding3.png',
  final:    'assets/final.jpg',
  cosmos:   null, // rendered by canvas, not an image
};

/* ── SPEAKERS ── */
const VN_SPEAKERS = {
  him: {
    label:       '♡ Anas',
    tag_bg:      '#9B2C6B',
    sprite_slot: 'left',
    sprites: { neutral: 'assets/snap_him.png', happy: 'assets/snap_him.png', angry: 'assets/neutral1.png' }
  },
  her: {
    label:       '🌸 Pranita',
    tag_bg:      '#5a1a7a',
    sprite_slot: 'right',
    sprites: { neutral: 'assets/snap_her.png', happy: 'assets/snap_her.png' }
  },
  narrator: {
    label:       '✦ — — —',
    tag_bg:      'transparent',
    sprite_slot: null,
  }
};

/* ── LOCATION LABELS ── */
const VN_LOCATIONS = {
  roblox:   '🎮  Roblox  ·  2025',
  default:  '🌙  Late Night Call',
  snap:     '📱  Snapchat / DMs',
  kitchen:  '🍳  Home Together',
  bedroom:  '🌙  Sweet Dreams',
  wedding1: '💍  The Wedding Day',
  wedding2: '💍  The Wedding Day',
  cosmos:   '✨  Somewhere Among The Stars',
};

/* ── HEART FLASHBACK SCENES ── */
const HEART_FLASHBACKS = {
  1: {
    bg: 'default', overlay: 'night', petals: true,
    scenes: [
      { speaker: 'narrator', text: '💌 You found a hidden memory...' },
      { speaker: 'narrator', text: 'The night they first said "I love you" — a message sent, a held breath, a heart beating too fast.' },
      { speaker: 'him', mood: 'happy', text: 'i love you 💕' },
      { speaker: 'her', mood: 'happy', text: 'i love you too 💗' },
    ]
  },
  2: {
    bg: 'roblox', overlay: 'bright', petals: false,
    scenes: [
      { speaker: 'narrator', text: '💌 A hidden memory unlocked...' },
      { speaker: 'narrator', text: 'The 1v1 in MM2 that got way too competitive.' },
      { speaker: 'him', mood: 'happy', text: 'i let u win btw 😌' },
      { speaker: 'her', mood: 'happy', text: 'u did NOT let me win 😭' },
    ]
  },
  3: {
    bg: 'snap', overlay: 'bright', petals: true,
    scenes: [
      { speaker: 'narrator', text: '💌 Another memory surfaces...' },
      { speaker: 'narrator', text: 'Valentine\'s Day. They wrote each other letters neither expected to keep forever.' },
      { speaker: 'him', mood: 'happy', text: 'i still have yours saved ♡' },
      { speaker: 'her', mood: 'happy', text: 'me too... always 🌸' },
    ]
  },
  4: {
    bg: 'snap', overlay: 'night', petals: false,
    scenes: [
      { speaker: 'narrator', text: '💌 A hidden memory unlocked...' },
      { speaker: 'narrator', text: 'The TikTok games. He won. Again. And again. And again.' },
      { speaker: 'her', mood: 'happy', text: 'THAT DOESNT COUNT U CHEATED' },
      { speaker: 'him', mood: 'happy', text: "i didn't cheat i'm just better 😌" },
      { speaker: 'her', mood: 'happy', text: 'HSHSHSJSHJDHS' },
      { speaker: 'him', mood: 'happy', text: "that's the 7th time in a row puppy 😭" },
      { speaker: 'her', mood: 'happy', text: 'gdgdgsgshjdhs UR SO ANNOYING' },
      { speaker: 'him', mood: 'happy', text: '😂 ♡' },
      { speaker: 'him', mood: 'happy', text: 'i will beat u every single time and i will never stop talking about it ♡' },
    ]
  },
  5: {
    bg: 'final', overlay: 'bright', petals: true,
    scenes: [
      { speaker: 'narrator', text: '💌 The last hidden memory — the most precious one.' },
      { speaker: 'narrator', text: 'Their ring fingers. A tiny scar. A permanent mark of each other, carried everywhere.' },
      { speaker: 'him', mood: 'happy', text: 'wherever u go, a part of me goes with u ♡' },
      { speaker: 'her', mood: 'happy', text: 'always and forever 💍' },
    ]
  }
};

/* ── CHAPTER SCRIPT ── */
const VN_CHAPTERS = [
  // ════════════════════════════════
  //  PROLOGUE — How We Met
  // ════════════════════════════════
  {
    chapter: 1, title: 'How We Met', kaomoji: '(ᵕ◡ᵕ)♡',
    scenes: [
      { bg: 'roblox',  overlay: 'bright', speaker: 'narrator', text: 'Somewhere online, two worlds collided by accident...' },
      { bg: 'roblox',  overlay: 'bright', speaker: 'narrator', text: 'She thought he was a girl. He thought that was hilarious.' },
      { bg: 'roblox',  overlay: 'bright', speaker: 'him',  mood: 'happy',   text: 'wait... you thought I was a girl?? 😂' },
      { bg: 'roblox',  overlay: 'bright', speaker: 'her',  mood: 'happy',   text: 'YOU COULD HAVE CORRECTED ME SOONER 😭' },
      { bg: 'roblox',  overlay: 'bright', speaker: 'him',  mood: 'happy',   text: 'and miss that reaction? never 😌' },
      { bg: 'roblox',  overlay: 'bright', speaker: 'narrator', text: 'Mistakes were made. Hearts were not.' },
      { bg: 'default', overlay: 'night',  speaker: 'narrator', text: 'They called in her backyard until the stars came out. Sent tiktoks until their phones died.' },
      { bg: 'default', overlay: 'night',  speaker: 'him',  mood: 'happy',   text: 'i named a hundred things i love about you that night ♡', petals: true },
      { bg: 'default', overlay: 'night',  speaker: 'her',  mood: 'happy',   text: '...a hundred?', petals: true },
      { bg: 'default', overlay: 'night',  speaker: 'him',  mood: 'happy',   text: 'i had to stop myself from going higher 💕', petals: true },

      // ── FAKE CHOICE MOMENT ──
      { bg: 'default', overlay: 'night', speaker: 'narrator', text: 'And then, one quiet night, he had something to say...', petals: true },
      {
        bg: 'default', overlay: 'night', speaker: 'him', mood: 'happy',
        text: 'i think i... i love you 💗',
        petals: true,
        choice: {
          prompt: 'How does she respond?',
          options: [
            { label: '💕  i love you too', result: 'her_iloveyou' },
            { label: '🌸  i love you more', result: 'her_iloveyoumore' },
          ]
        }
      },
      // These two lines are conditionally shown by the choice handler
      { bg: 'default', overlay: 'night', speaker: 'her', mood: 'happy', text: '...i love you too. so much. 💗', petals: true, id: 'her_iloveyou', skip: true },
      { bg: 'default', overlay: 'night', speaker: 'her', mood: 'happy', text: 'i love you more, actually. 🌸', petals: true, id: 'her_iloveyoumore', skip: true },
      { bg: 'default', overlay: 'night', speaker: 'narrator', text: 'And nothing was ever the same after that. ♡', petals: true },
    ]
  },

  // ════════════════════════════════
  //  CHAPTER 2 — Falling Deeper
  // ════════════════════════════════
  {
    chapter: 2, title: 'Falling Deeper', kaomoji: '💕 (˘ ³˘) 💕',
    scenes: [
      { bg: 'bedroom', overlay: 'night',  speaker: 'narrator', text: 'Months passed. The messages never stopped.', petals: true },
      { bg: 'bedroom', overlay: 'night',  speaker: 'narrator', text: 'They played obbys, laughed at reels at 3am, stayed up just to hear each other breathe.' },
      { bg: 'snap',    overlay: 'bright', speaker: 'her',  mood: 'happy', text: 'i made u a playlist 🎵 it has all my songs in it' },
      { bg: 'snap',    overlay: 'bright', speaker: 'him',  mood: 'happy', text: 'i listened to it on loop 😭 ♡' },
      { bg: 'snap',    overlay: 'bright', speaker: 'narrator', text: 'She gave him her lucky charm before every exam. He passed every single one.' },
      { bg: 'snap',    overlay: 'bright', speaker: 'him',  mood: 'happy', text: 'ur lucky charm helped me pass every exam 🍀 ♡' },
      { bg: 'snap',    overlay: 'bright', speaker: 'her',  mood: 'happy', text: 'it was always going to work, i believed in u 🌸' },
      { bg: 'snap',    overlay: 'bright', speaker: 'narrator', text: 'They bought each other\'s initials to wear on their necks — a quiet, secret promise.' },
      { bg: 'kitchen', overlay: 'bright', speaker: 'him',  mood: 'happy', text: 'remember when u tried prawns and almost puked 😭' },
      { bg: 'kitchen', overlay: 'bright', speaker: 'her',  mood: 'happy', text: 'i trusted you. u BETRAYED me. 😤' },
      { bg: 'kitchen', overlay: 'bright', speaker: 'him',  mood: 'happy', text: 'i will always remind u of this 😂 ♡' },
      { bg: 'snap',    overlay: 'bright', speaker: 'narrator', text: 'Every boring day became magic. Every hard day became manageable.', petals: true },
      { bg: 'snap',    overlay: 'bright', speaker: 'him',  mood: 'happy', text: 'are you ready to be mine officially? 💗' },
      { bg: 'snap',    overlay: 'bright', speaker: 'her',  mood: 'happy', text: 'i already was 💕', petals: true },
    ]
  },

  // ════════════════════════════════
  //  CHAPTER 3 — A Promise Forever
  // ════════════════════════════════
  {
    chapter: 3, title: 'A Promise Forever', kaomoji: '💍 (づ ᴗ _ᴗ)づ ♡',
    scenes: [
      { bg: 'wedding1', overlay: 'bright', speaker: 'narrator', text: 'And then came the day everything changed.', petals: true },
      { bg: 'wedding1', overlay: 'bright', speaker: 'narrator', text: '1 year. 365 days. 8,760 hours of choosing each other.', petals: true },
      { bg: 'wedding2', overlay: 'bright', speaker: 'him',  mood: 'happy', text: 'that day i was the happiest i\'ve ever been in my entire life 💍', petals: true },
      { bg: 'wedding2', overlay: 'bright', speaker: 'her',  mood: 'happy', text: 'me too. i didn\'t want it to ever end 🌸', petals: true },
      { bg: 'wedding2', overlay: 'bright', speaker: 'narrator', text: 'The kiss. The vows. The forever that started that day.', petals: true },
      { bg: 'final',    overlay: 'bright', speaker: 'narrator', text: 'They even marked their ring fingers — a scar shaped like a ring. A permanent piece of each other.', petals: true },
      { bg: 'final',    overlay: 'bright', speaker: 'him',  mood: 'happy', text: 'wherever u go, that mark goes with u ♡', petals: true },
      { bg: 'final',    overlay: 'bright', speaker: 'her',  mood: 'happy', text: 'and yours goes with me 💍', petals: true },
      { bg: 'final',    overlay: 'bright', speaker: 'him',  mood: 'happy', text: 'in every universe... it would always be you 💗', petals: true },
    ]
  },

  // ════════════════════════════════
  //  CHAPTER 4 — Every Day With You
  //  (future dreams, not yet reality)
  // ════════════════════════════════
  {
    chapter: 4, title: 'Every Day With You', kaomoji: '˚₊‧꩜ someday soon ꩜‧₊˚',
    scenes: [
      { bg: 'default',  overlay: 'night',  speaker: 'narrator', text: 'Distance is just a number. What matters is what comes next.', petals: true },
      { bg: 'kitchen',  overlay: 'bright', speaker: 'narrator', text: 'Someday soon — cooking together, sleeping beside each other, building a life side by side.', petals: true },
      { bg: 'kitchen',  overlay: 'bright', speaker: 'him',  mood: 'happy', text: "i can't wait to cook with u 😭" },
      { bg: 'kitchen',  overlay: 'bright', speaker: 'her',  mood: 'happy', text: 'i will eat anything u make, i trust u with my life 🌸' },
      { bg: 'kitchen',  overlay: 'bright', speaker: 'him',  mood: 'happy', text: "even if it's something weird?" },
      { bg: 'kitchen',  overlay: 'bright', speaker: 'her',  mood: 'happy', text: '...okay maybe not WEIRD weird but yes 😭' },
      { bg: 'bedroom',  overlay: 'night',  speaker: 'narrator', text: 'Waking up next to each other every day — soon that dream becomes real.', petals: true },
      { bg: 'bedroom',  overlay: 'night',  speaker: 'him',  mood: 'happy', text: 'i think about that every single morning ♡', petals: true },
      { bg: 'roblox',   overlay: 'bright', speaker: 'narrator', text: 'But for now — they still play games, still send silly things, still stay up too late.' },
      { bg: 'roblox',   overlay: 'bright', speaker: 'her',  mood: 'happy', text: 'ur still not better than me at this btw' },
      { bg: 'roblox',   overlay: 'bright', speaker: 'him',  mood: 'happy', text: 'i let u win 😌' },
      { bg: 'default',  overlay: 'night',  speaker: 'him',  mood: 'happy', text: 'you are my favourite everything 💕', petals: true },
      { bg: 'default',  overlay: 'night',  speaker: 'her',  mood: 'happy', text: 'and you are mine. always ♡', petals: true },
      { bg: 'cosmos',   overlay: 'night',  speaker: 'narrator', text: 'And somewhere above them, every shared dream floated up and became a star. ✨', petals: true },
    ]
  }
];

/* ── SECRET ENDING: COSMOS EPILOGUE ── */
const VN_COSMOS_CHAPTER = {
  chapter: '✦', title: 'Written In The Stars', kaomoji: '✨ (ˊ˘ˋ*)♡ ✨',
  scenes: [
    { bg: 'cosmos', overlay: 'night', speaker: 'narrator', text: 'Beyond the quiz. Beyond the petals. Beyond everything...', petals: true },
    { bg: 'cosmos', overlay: 'night', speaker: 'narrator', text: 'There is a sky full of stars — and every single one belongs to the two of them.', petals: true },
    { bg: 'cosmos', overlay: 'night', speaker: 'him',  mood: 'happy', text: 'u found the secret ending 🌌', petals: true },
    { bg: 'cosmos', overlay: 'night', speaker: 'her',  mood: 'happy', text: 'of course i did. i find everything 🌸', petals: true },
    { bg: 'cosmos', overlay: 'night', speaker: 'him',  mood: 'happy', text: 'this one is just for us. no one else gets to see this 💕', petals: true },
    { bg: 'cosmos', overlay: 'night', speaker: 'narrator', text: 'Every late night talk became a star. Every "I love you" became a constellation.', petals: true },
    { bg: 'cosmos', overlay: 'night', speaker: 'narrator', text: 'Every exam she helped him pass. Every playlist. Every prawn he will never let her forget.', petals: true },    { bg: 'cosmos', overlay: 'night', speaker: 'him',  mood: 'happy', text: 'the distance is just a number. the stars see all of it.', petals: true },
    { bg: 'cosmos', overlay: 'night', speaker: 'her',  mood: 'happy', text: 'and someday soon... no more distance at all ♡', petals: true },
    { bg: 'cosmos', overlay: 'night', speaker: 'him',  mood: 'happy', text: 'i love you so much it fills up the whole sky 🌌💗', petals: true },
    { bg: 'cosmos', overlay: 'night', speaker: 'her',  mood: 'happy', text: 'i love you more than every star up there. count them. 🌸', petals: true },
    { bg: 'cosmos', overlay: 'night', speaker: 'narrator', text: 'In every universe, in every timeline, across every distance — it would always, always be them. ♡', petals: true },
  ]
};

/* ═══════════════════════════════════════════════
   VN ENGINE
   ═══════════════════════════════════════════════ */
const VNEngine = (() => {
  let currentChapter  = 0;
  let currentScene    = 0;
  let isTyping        = false;
  let typeTimer       = null;
  let onChapterDone   = null;
  let petalInterval   = null;
  let clickLocked     = false;
  let awaitingChoice  = false;
  let pendingChoiceResult = null;
  let inFlashback     = false;
  let flashbackSceneIdx = 0;
  let flashbackData   = null;
  let flashbackDone   = null;

  let elScreen, elBgImg, elBgOverlay, elChapterCard, elChapterNum, elChapterTitle,
      elChapterKaomoji, elSpriteLeft, elSpriteRight, elNameTag, elText, elNextHint,
      elSkipBtn, elPetals, elLocLabel, elChoiceBox, elTitleScreen;

  function init() {
    elScreen         = document.getElementById('vn-screen');
    elBgImg          = document.getElementById('vn-bg-img');
    elBgOverlay      = document.getElementById('vn-bg-overlay');
    elChapterCard    = document.getElementById('vn-chapter-card');
    elChapterNum     = document.getElementById('vn-chapter-num');
    elChapterTitle   = document.getElementById('vn-chapter-title');
    elChapterKaomoji = document.getElementById('vn-chapter-kaomoji');
    elSpriteLeft     = document.getElementById('vn-sprite-left');
    elSpriteRight    = document.getElementById('vn-sprite-right');
    elNameTag        = document.getElementById('vn-name-tag');
    elText           = document.getElementById('vn-text');
    elNextHint       = document.getElementById('vn-next-hint');
    elSkipBtn        = document.getElementById('vn-skip-btn');
    elPetals         = document.getElementById('vn-petals');
    elLocLabel       = document.getElementById('vn-location-label');
    elChoiceBox      = document.getElementById('vn-choice-box');
    elTitleScreen    = document.getElementById('vn-title-screen');

    elScreen.addEventListener('click', (e) => {
      if (e.target === elSkipBtn) return;
      if (awaitingChoice) return;
      advance();
    });

    elSkipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (inFlashback) { endFlashback(); return; }
      skipChapter();
    });
  }

  /* ─── TITLE SCREEN ─── */
  function showTitleScreen(onStart) {
    if (!elTitleScreen) { onStart(); return; }
    showVNScreen();
    elTitleScreen.classList.remove('hidden');
    // Auto-fade after 4s OR on click
    const go = () => {
      elTitleScreen.style.opacity = '0';
      setTimeout(() => {
        elTitleScreen.classList.add('hidden');
        elTitleScreen.style.opacity = '';
        onStart();
      }, 800);
    };
    const timer = setTimeout(go, 4200);
    elTitleScreen.addEventListener('click', () => { clearTimeout(timer); go(); }, { once: true });
  }

  /* ─── CHAPTER FLOW ─── */
  function playChapter(chapterIndex, done) {
    currentChapter = chapterIndex;
    currentScene   = 0;
    onChapterDone  = done;
    const ch = VN_CHAPTERS[chapterIndex];
    if (!ch) { done && done(); return; }

    showVNScreen();
    showChapterCard(ch, () => { playScene(); });
  }

  function showVNScreen() {
    ['lock-screen','game-screen','ending-screen'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.style.opacity = '0'; el.style.pointerEvents = 'none'; }
    });
    elScreen.style.opacity = '1';
    elScreen.style.pointerEvents = 'all';
    elScreen.style.zIndex = '35';
  }

  function hideVNScreen() {
    elScreen.style.opacity = '0';
    elScreen.style.pointerEvents = 'none';
    elScreen.style.zIndex = '30';
    stopPetals();
  }

  function showChapterCard(ch, cb) {
    elChapterCard.classList.remove('hidden');
    elChapterNum.textContent     = `Chapter ${ch.chapter}`;
    elChapterTitle.textContent   = ch.title;
    elChapterKaomoji.textContent = ch.kaomoji;
    document.getElementById('vn-textbox').style.opacity = '0';
    setTimeout(() => {
      elChapterCard.classList.add('hidden');
      document.getElementById('vn-textbox').style.opacity = '1';
      cb();
    }, 2200);
  }

  function playScene() {
    const ch = VN_CHAPTERS[currentChapter];
    if (!ch) { finishChapter(); return; }
    const scenes = ch.scenes;

    // Skip scenes with `skip: true` unless they match our pending choice
    while (currentScene < scenes.length && scenes[currentScene].skip) {
      if (scenes[currentScene].id && scenes[currentScene].id === pendingChoiceResult) {
        pendingChoiceResult = null;
        break; // play this one
      }
      currentScene++;
    }

    if (currentScene >= scenes.length) { finishChapter(); return; }
    applyScene(scenes[currentScene]);
  }

  function applyScene(scene) {
    // Background
    const bgKey = scene.bg || 'default';
    if (bgKey === 'cosmos') {
      elBgImg.style.opacity = '0';
      startCosmosCanvas();
    } else {
      stopCosmosCanvas();
      const bgSrc = VN_BG[bgKey] || VN_BG.default;
      if (elBgImg.dataset.current !== bgSrc) {
        elBgImg.style.opacity = '0';
        setTimeout(() => {
          elBgImg.src = bgSrc;
          elBgImg.dataset.current = bgSrc;
          elBgImg.style.opacity = '1';
        }, 300);
      }
    }

    // Overlay
    elBgOverlay.className = 'vn-bg-overlay ' + (scene.overlay || '');

    // Location label
    showLocationLabel(scene.bg);

    // Petals
    if (scene.petals) startPetals(); else stopPetals();

    // Speaker
    const spk = VN_SPEAKERS[scene.speaker] || VN_SPEAKERS.narrator;
    elNameTag.textContent      = spk.label;
    elNameTag.style.background = spk.tag_bg;

    // Sprites
    updateSprites(scene);

    // Typewrite
    if (scene.choice) {
      typeText(scene.text, () => showChoiceBox(scene.choice));
    } else {
      typeText(scene.text, () => showNextHint());
    }
  }

  /* ─── LOCATION LABEL ─── */
  function showLocationLabel(bg) {
    if (!elLocLabel) return;
    const label = VN_LOCATIONS[bg] || '';
    if (!label) { elLocLabel.classList.add('hidden'); return; }
    elLocLabel.textContent = label;
    elLocLabel.classList.remove('hidden');
    elLocLabel.classList.remove('vn-loc-show');
    void elLocLabel.offsetWidth;
    elLocLabel.classList.add('vn-loc-show');
    if (elLocLabel._hideTimer) clearTimeout(elLocLabel._hideTimer);
    elLocLabel._hideTimer = setTimeout(() => elLocLabel.classList.add('hidden'), 3500);
  }

  /* ─── SPRITES ─── */
  function updateSprites(scene) {
    elSpriteLeft.classList.remove('speaking','dimmed');
    elSpriteRight.classList.remove('speaking','dimmed');

    if (scene.speaker === 'narrator') {
      if (!elSpriteLeft.classList.contains('hidden'))  elSpriteLeft.classList.add('dimmed');
      if (!elSpriteRight.classList.contains('hidden')) elSpriteRight.classList.add('dimmed');
      return;
    }

    const spk  = VN_SPEAKERS[scene.speaker];
    if (!spk || !spk.sprite_slot) return;
    const mood = scene.mood || 'neutral';
    const src  = spk.sprites[mood] || spk.sprites.neutral;

    if (spk.sprite_slot === 'left') {
      elSpriteLeft.src = src;
      elSpriteLeft.classList.remove('hidden');
      elSpriteLeft.classList.add('speaking');
      if (!elSpriteRight.classList.contains('hidden')) elSpriteRight.classList.add('dimmed');
    } else {
      elSpriteRight.src = src;
      elSpriteRight.classList.remove('hidden');
      elSpriteRight.classList.add('speaking');
      if (!elSpriteLeft.classList.contains('hidden')) elSpriteLeft.classList.add('dimmed');
    }
  }

  /* ─── TYPEWRITER ─── */
  function typeText(text, onDone) {
    clearTimeout(typeTimer);
    elText.textContent = '';
    elNextHint.classList.add('hidden');
    isTyping = true;
    let i = 0;
    function tick() {
      if (i < text.length) {
        elText.textContent += text[i++];
        try { if (typeof AUDIO !== 'undefined' && i % 3 === 0) AUDIO.tick(); } catch(e) {}
        typeTimer = setTimeout(tick, 30);
      } else {
        isTyping = false;
        if (onDone) onDone();
      }
    }
    tick();
  }

  function showNextHint() { elNextHint.classList.remove('hidden'); }

  /* ─── CHOICE BOX ─── */
  function showChoiceBox(choice) {
    if (!elChoiceBox) { showNextHint(); return; }
    awaitingChoice = true;
    elNextHint.classList.add('hidden');
    elChoiceBox.innerHTML = '';
    elChoiceBox.classList.remove('hidden');

    const prompt = document.createElement('div');
    prompt.className = 'vn-choice-prompt';
    prompt.textContent = choice.prompt;
    elChoiceBox.appendChild(prompt);

    choice.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'vn-choice-btn pixel-btn';
      btn.textContent = opt.label;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        elChoiceBox.classList.add('hidden');
        elChoiceBox.innerHTML = '';
        awaitingChoice = false;
        pendingChoiceResult = opt.result;
        // Move to the next scene (which may be a skip-labelled response scene)
        currentScene++;
        playScene();
      });
      elChoiceBox.appendChild(btn);
    });
  }

  /* ─── ADVANCE ─── */
  function advance() {
    if (clickLocked || awaitingChoice) return;
    if (isTyping) {
      clearTimeout(typeTimer);
      isTyping = false;
      const scenes = inFlashback
        ? flashbackData.scenes
        : (VN_CHAPTERS[currentChapter] || {}).scenes || [];
      const sc = scenes[inFlashback ? flashbackSceneIdx : currentScene];
      if (sc) elText.textContent = sc.text;
      if (sc && sc.choice) showChoiceBox(sc.choice);
      else showNextHint();
      return;
    }
    if (inFlashback) {
      flashbackSceneIdx++;
      playFlashbackScene();
    } else if (currentChapter === -1) {
      currentScene++;
      playCosmosScene();
    } else {
      currentScene++;
      playScene();
    }
  }

  function finishChapter() {
    stopPetals();
    flashTransition(() => {
      hideVNScreen();
      if (onChapterDone) onChapterDone();
    });
  }

  function skipChapter() {
    clearTimeout(typeTimer);
    isTyping = false;
    awaitingChoice = false;
    pendingChoiceResult = null;
    if (elChoiceBox) elChoiceBox.classList.add('hidden');
    stopPetals();
    stopCosmosCanvas();
    flashTransition(() => {
      hideVNScreen();
      if (onChapterDone) onChapterDone();
    });
  }

  /* ─── FLASH TRANSITION ─── */
  function flashTransition(cb) {
    clickLocked = true;
    const flash = document.createElement('div');
    flash.className = 'vn-flash';
    document.body.appendChild(flash);
    requestAnimationFrame(() => {
      flash.classList.add('go');
      setTimeout(() => {
        cb();
        flash.classList.remove('go');
        setTimeout(() => { flash.remove(); clickLocked = false; }, 300);
      }, 200);
    });
  }

  /* ─── HEART FLASHBACKS ─── */
  function triggerFlashback(heartNum, done) {
    const fb = HEART_FLASHBACKS[heartNum];
    if (!fb) { done && done(); return; }

    inFlashback        = true;
    flashbackSceneIdx  = 0;
    flashbackData      = fb;
    flashbackDone      = done;

    showVNScreen();

    // Show a mini chapter card for the flashback
    elChapterCard.classList.remove('hidden');
    elChapterNum.textContent     = '💗 Memory';
    elChapterTitle.textContent   = 'A Hidden Moment';
    elChapterKaomoji.textContent = '(ˊ˘ˋ*)♡';
    document.getElementById('vn-textbox').style.opacity = '0';

    setTimeout(() => {
      elChapterCard.classList.add('hidden');
      document.getElementById('vn-textbox').style.opacity = '1';
      playFlashbackScene();
    }, 1800);
  }

  function playFlashbackScene() {
    if (!flashbackData || flashbackSceneIdx >= flashbackData.scenes.length) {
      endFlashback();
      return;
    }
    const scene = { ...flashbackData.scenes[flashbackSceneIdx], bg: flashbackData.bg, overlay: flashbackData.overlay, petals: flashbackData.petals };
    applyScene(scene);
  }

  function endFlashback() {
    inFlashback = false;
    clearTimeout(typeTimer);
    isTyping = false;
    stopPetals();
    flashTransition(() => {
      hideVNScreen();
      if (flashbackDone) flashbackDone();
      flashbackDone = null;
    });
  }

  /* ─── PETALS ─── */
  const PETAL_SVGS_VN = [
    'assets/petal_blossom.svg','assets/petal_heart.svg',
    'assets/petal_petal.svg','assets/petal_star.svg','assets/petal_blossom2.svg'
  ];

  function startPetals() {
    if (petalInterval) return;
    spawnVNPetal();
    petalInterval = setInterval(spawnVNPetal, 1400);
  }

  function stopPetals() {
    clearInterval(petalInterval);
    petalInterval = null;
    if (elPetals) elPetals.innerHTML = '';
  }

  function spawnVNPetal() {
    if (!elPetals) return;
    const p = document.createElement('img');
    p.className = 'vn-petal';
    p.src = PETAL_SVGS_VN[Math.floor(Math.random() * PETAL_SVGS_VN.length)];
    p.style.left = (10 + Math.random() * 80) + 'vw';
    const dur = 9 + Math.random() * 5;
    const sz  = 18 + Math.floor(Math.random() * 14);
    p.style.width  = sz + 'px';
    p.style.height = 'auto';
    p.style.animationDuration = dur + 's';
    p.style.setProperty('--pr', (Math.random() * 360 - 180) + 'deg');
    p.style.setProperty('--px', (Math.random() * 80 - 40) + 'px');
    p.style.setProperty('--ps', (0.85 + Math.random() * 0.4) + '');
    elPetals.appendChild(p);
    setTimeout(() => { if (p.parentNode) p.remove(); }, (dur + 0.3) * 1000);
  }

  /* ─── COSMOS CANVAS ─── */
  let cosmosCanvas = null;
  let cosmosCtx    = null;
  let cosmosAnim   = null;
  let cosmosStars  = [];
  let cosmosShoots = [];

  function startCosmosCanvas() {
    if (cosmosCanvas) { cosmosCanvas.style.opacity = '1'; return; }
    cosmosCanvas = document.createElement('canvas');
    cosmosCanvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:1;transition:opacity 0.8s ease;opacity:0;';
    elBgImg.parentNode.appendChild(cosmosCanvas);

    cosmosCtx = cosmosCanvas.getContext('2d');
    resizeCosmos();
    window.addEventListener('resize', resizeCosmos);

    // Seed stars
    cosmosStars = [];
    for (let i = 0; i < 280; i++) {
      cosmosStars.push({
        x: Math.random(), y: Math.random(),
        r: 0.4 + Math.random() * 1.6,
        a: 0.4 + Math.random() * 0.6,
        twinkleSpeed: 0.008 + Math.random() * 0.018,
        twinklePhase: Math.random() * Math.PI * 2,
        color: ['#fff','#ffe8f5','#e8d0ff','#ffd6f0'][Math.floor(Math.random()*4)]
      });
    }

    setTimeout(() => { cosmosCanvas.style.opacity = '1'; }, 50);
    animateCosmos();
  }

  function resizeCosmos() {
    if (!cosmosCanvas) return;
    cosmosCanvas.width  = cosmosCanvas.offsetWidth  || window.innerWidth;
    cosmosCanvas.height = cosmosCanvas.offsetHeight || window.innerHeight;
  }

  function animateCosmos() {
    if (!cosmosCanvas || !cosmosCtx) return;
    const W = cosmosCanvas.width, H = cosmosCanvas.height;
    const ctx = cosmosCtx;

    // Background gradient
    const grad = ctx.createRadialGradient(W*0.5, H*0.3, 0, W*0.5, H*0.5, W*0.8);
    grad.addColorStop(0,   '#2a0a3e');
    grad.addColorStop(0.4, '#0e0320');
    grad.addColorStop(1,   '#030008');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Nebula wisps
    const now = Date.now() * 0.0004;
    [[0.3,0.35,'#ff79c640'],[0.65,0.55,'#bd93f930'],[0.5,0.7,'#ff92d040']].forEach(([nx,ny,col]) => {
      const ng = ctx.createRadialGradient(nx*W, ny*H, 0, nx*W, ny*H, W*0.28);
      ng.addColorStop(0, col);
      ng.addColorStop(1, 'transparent');
      ctx.fillStyle = ng;
      ctx.fillRect(0, 0, W, H);
    });

    // Stars with twinkle
    cosmosStars.forEach(s => {
      s.twinklePhase += s.twinkleSpeed;
      const alpha = s.a * (0.6 + 0.4 * Math.sin(s.twinklePhase));
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = alpha;
      ctx.fill();
      // Glow for bigger stars
      if (s.r > 1.2) {
        const sg = ctx.createRadialGradient(s.x*W, s.y*H, 0, s.x*W, s.y*H, s.r*5);
        sg.addColorStop(0, s.color + '88');
        sg.addColorStop(1, 'transparent');
        ctx.fillStyle = sg;
        ctx.globalAlpha = alpha * 0.5;
        ctx.beginPath();
        ctx.arc(s.x*W, s.y*H, s.r*5, 0, Math.PI*2);
        ctx.fill();
      }
    });
    ctx.globalAlpha = 1;

    // Shooting stars
    if (Math.random() < 0.008) {
      cosmosShoots.push({ x: Math.random()*W, y: Math.random()*H*0.5, len: 80+Math.random()*120, speed: 6+Math.random()*8, angle: 0.4+Math.random()*0.3, alpha: 1 });
    }
    cosmosShoots = cosmosShoots.filter(s => s.alpha > 0.05);
    cosmosShoots.forEach(s => {
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - Math.cos(s.angle)*s.len, s.y - Math.sin(s.angle)*s.len);
      const sg = ctx.createLinearGradient(s.x, s.y, s.x - Math.cos(s.angle)*s.len, s.y - Math.sin(s.angle)*s.len);
      sg.addColorStop(0, `rgba(255,240,255,${s.alpha})`);
      sg.addColorStop(1, 'transparent');
      ctx.strokeStyle = sg;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.alpha -= 0.022;
    });

    cosmosAnim = requestAnimationFrame(animateCosmos);
  }

  function stopCosmosCanvas() {
    if (cosmosAnim) { cancelAnimationFrame(cosmosAnim); cosmosAnim = null; }
    if (cosmosCanvas) {
      cosmosCanvas.style.opacity = '0';
      setTimeout(() => {
        if (cosmosCanvas && cosmosCanvas.parentNode) cosmosCanvas.parentNode.removeChild(cosmosCanvas);
        cosmosCanvas = null; cosmosCtx = null;
      }, 800);
    }
  }

  /* ─── COSMOS ENDING CHAPTER ─── */
  function playCosmosEnding(done) {
    const ch = VN_COSMOS_CHAPTER;
    currentChapter = -1; // flag as cosmos
    currentScene   = 0;
    onChapterDone  = done;

    showVNScreen();
    // Override chapter card for cosmos
    elChapterCard.classList.remove('hidden');
    elChapterNum.textContent     = ch.chapter;
    elChapterTitle.textContent   = ch.title;
    elChapterKaomoji.textContent = ch.kaomoji;
    document.getElementById('vn-textbox').style.opacity = '0';

    setTimeout(() => {
      elChapterCard.classList.add('hidden');
      document.getElementById('vn-textbox').style.opacity = '1';
      playCosmosScene();
    }, 2400);
  }

  function playCosmosScene() {
    const scenes = VN_COSMOS_CHAPTER.scenes;
    if (currentScene >= scenes.length) {
      stopCosmosCanvas();
      finishChapter();
      return;
    }
    applyScene(scenes[currentScene]);
  }

  // Patch advance() to handle cosmos chapter
  const _origAdvance_ref = { fn: null };

  return { init, showTitleScreen, playChapter, triggerFlashback, playCosmosEnding };
})();

/* ── DOMContentLoaded INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  VNEngine.init();
  window._VN_playChapter    = (idx, done) => VNEngine.playChapter(idx, done);
  window._VN_showTitle      = (done)      => VNEngine.showTitleScreen(done);
  window._VN_heartFlashback = (n, done)   => VNEngine.triggerFlashback(n, done);
  window._VN_cosmosEnding   = (done)      => VNEngine.playCosmosEnding(done);
});
