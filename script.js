/* ==========================================================================
   NIHONGO TRINITY - CORE JAPANESE LEARNING ENGINE & ATMOSPHERE
   Features: Kanji of the Day, Audio Speech Engine, Kana Soundboard, 
   Writing Canvas, Phrasebook Vault, Katakana Name Maker, Zen Timer & Sakura FX
   ========================================================================== */

// 1. EXTENSIVE KANA DATABASE (Seion, Dakuon, Yoon)
const kanaList = [
    // Seion Hiragana
    { kana: "あ", romaji: "a", type: "HIRAGANA", row: "a" },
    { kana: "い", romaji: "i", type: "HIRAGANA", row: "a" },
    { kana: "う", romaji: "u", type: "HIRAGANA", row: "a" },
    { kana: "え", romaji: "e", type: "HIRAGANA", row: "a" },
    { kana: "お", romaji: "o", type: "HIRAGANA", row: "a" },

    { kana: "か", romaji: "ka", type: "HIRAGANA", row: "ka" },
    { kana: "き", romaji: "ki", type: "HIRAGANA", row: "ka" },
    { kana: "く", romaji: "ku", type: "HIRAGANA", row: "ka" },
    { kana: "け", romaji: "ke", type: "HIRAGANA", row: "ka" },
    { kana: "こ", romaji: "ko", type: "HIRAGANA", row: "ka" },

    { kana: "さ", romaji: "sa", type: "HIRAGANA", row: "sa" },
    { kana: "し", romaji: "shi", type: "HIRAGANA", row: "sa" },
    { kana: "す", romaji: "su", type: "HIRAGANA", row: "sa" },
    { kana: "せ", romaji: "se", type: "HIRAGANA", row: "sa" },
    { kana: "そ", romaji: "so", type: "HIRAGANA", row: "sa" },

    { kana: "た", romaji: "ta", type: "HIRAGANA", row: "ta" },
    { kana: "ち", romaji: "chi", type: "HIRAGANA", row: "ta" },
    { kana: "つ", romaji: "tsu", type: "HIRAGANA", row: "ta" },
    { kana: "て", romaji: "te", type: "HIRAGANA", row: "ta" },
    { kana: "と", romaji: "to", type: "HIRAGANA", row: "ta" },

    { kana: "な", romaji: "na", type: "HIRAGANA", row: "na" },
    { kana: "に", romaji: "ni", type: "HIRAGANA", row: "na" },
    { kana: "ぬ", romaji: "nu", type: "HIRAGANA", row: "na" },
    { kana: "ね", romaji: "ne", type: "HIRAGANA", row: "na" },
    { kana: "の", romaji: "no", type: "HIRAGANA", row: "na" },

    { kana: "は", romaji: "ha", type: "HIRAGANA", row: "ha" },
    { kana: "ひ", romaji: "hi", type: "HIRAGANA", row: "ha" },
    { kana: "ふ", romaji: "fu", type: "HIRAGANA", row: "ha" },
    { kana: "へ", romaji: "he", type: "HIRAGANA", row: "ha" },
    { kana: "ほ", romaji: "ho", type: "HIRAGANA", row: "ha" },

    { kana: "ま", romaji: "ma", type: "HIRAGANA", row: "ma" },
    { kana: "み", romaji: "mi", type: "HIRAGANA", row: "ma" },
    { kana: "む", romaji: "mu", type: "HIRAGANA", row: "ma" },
    { kana: "め", romaji: "me", type: "HIRAGANA", row: "ma" },
    { kana: "も", romaji: "mo", type: "HIRAGANA", row: "ma" },

    { kana: "や", romaji: "ya", type: "HIRAGANA", row: "ya" },
    { kana: "ゆ", romaji: "yu", type: "HIRAGANA", row: "ya" },
    { kana: "よ", romaji: "yo", type: "HIRAGANA", row: "ya" },

    { kana: "ら", romaji: "ra", type: "HIRAGANA", row: "ra" },
    { kana: "り", romaji: "ri", type: "HIRAGANA", row: "ra" },
    { kana: "る", romaji: "ru", type: "HIRAGANA", row: "ra" },
    { kana: "れ", romaji: "re", type: "HIRAGANA", row: "ra" },
    { kana: "ろ", romaji: "ro", type: "HIRAGANA", row: "ra" },

    { kana: "わ", romaji: "wa", type: "HIRAGANA", row: "wa" },
    { kana: "を", romaji: "wo", type: "HIRAGANA", row: "wa" },
    { kana: "ん", romaji: "n", type: "HIRAGANA", row: "wa" },

    // Dakuon & Handakuon Hiragana
    { kana: "が", romaji: "ga", type: "HIRAGANA", row: "dakuon" },
    { kana: "ぎ", romaji: "gi", type: "HIRAGANA", row: "dakuon" },
    { kana: "ぐ", romaji: "gu", type: "HIRAGANA", row: "dakuon" },
    { kana: "げ", romaji: "ge", type: "HIRAGANA", row: "dakuon" },
    { kana: "ご", romaji: "go", type: "HIRAGANA", row: "dakuon" },
    { kana: "ざ", romaji: "za", type: "HIRAGANA", row: "dakuon" },
    { kana: "じ", romaji: "ji", type: "HIRAGANA", row: "dakuon" },
    { kana: "ず", romaji: "zu", type: "HIRAGANA", row: "dakuon" },
    { kana: "ぜ", romaji: "ze", type: "HIRAGANA", row: "dakuon" },
    { kana: "ぞ", romaji: "zo", type: "HIRAGANA", row: "dakuon" },
    { kana: "だ", romaji: "da", type: "HIRAGANA", row: "dakuon" },
    { kana: "ぢ", romaji: "ji", type: "HIRAGANA", row: "dakuon" },
    { kana: "づ", romaji: "zu", type: "HIRAGANA", row: "dakuon" },
    { kana: "で", romaji: "de", type: "HIRAGANA", row: "dakuon" },
    { kana: "ど", romaji: "do", type: "HIRAGANA", row: "dakuon" },
    { kana: "ば", romaji: "ba", type: "HIRAGANA", row: "dakuon" },
    { kana: "び", romaji: "bi", type: "HIRAGANA", row: "dakuon" },
    { kana: "ぶ", romaji: "bu", type: "HIRAGANA", row: "dakuon" },
    { kana: "べ", romaji: "be", type: "HIRAGANA", row: "dakuon" },
    { kana: "ぼ", romaji: "bo", type: "HIRAGANA", row: "dakuon" },
    { kana: "ぱ", romaji: "pa", type: "HIRAGANA", row: "dakuon" },
    { kana: "ぴ", romaji: "pi", type: "HIRAGANA", row: "dakuon" },
    { kana: "ぷ", romaji: "pu", type: "HIRAGANA", row: "dakuon" },
    { kana: "ぺ", romaji: "pe", type: "HIRAGANA", row: "dakuon" },
    { kana: "ぽ", romaji: "po", type: "HIRAGANA", row: "dakuon" },

    // Katakana
    { kana: "ア", romaji: "a", type: "KATAKANA", row: "a" },
    { kana: "イ", romaji: "i", type: "KATAKANA", row: "a" },
    { kana: "ウ", romaji: "u", type: "KATAKANA", row: "a" },
    { kana: "エ", romaji: "e", type: "KATAKANA", row: "a" },
    { kana: "オ", romaji: "o", type: "KATAKANA", row: "a" },

    { kana: "カ", romaji: "ka", type: "KATAKANA", row: "ka" },
    { kana: "キ", romaji: "ki", type: "KATAKANA", row: "ka" },
    { kana: "ク", romaji: "ku", type: "KATAKANA", row: "ka" },
    { kana: "ケ", romaji: "ke", type: "KATAKANA", row: "ka" },
    { kana: "コ", romaji: "ko", type: "KATAKANA", row: "ka" },

    { kana: "サ", romaji: "sa", type: "KATAKANA", row: "sa" },
    { kana: "シ", romaji: "shi", type: "KATAKANA", row: "sa" },
    { kana: "ス", romaji: "su", type: "KATAKANA", row: "sa" },
    { kana: "セ", romaji: "se", type: "KATAKANA", row: "sa" },
    { kana: "ソ", romaji: "so", type: "KATAKANA", row: "sa" },

    { kana: "タ", romaji: "ta", type: "KATAKANA", row: "ta" },
    { kana: "チ", romaji: "chi", type: "KATAKANA", row: "ta" },
    { kana: "ツ", romaji: "tsu", type: "KATAKANA", row: "ta" },
    { kana: "テ", romaji: "te", type: "KATAKANA", row: "ta" },
    { kana: "ト", romaji: "to", type: "KATAKANA", row: "ta" },

    { kana: "ナ", romaji: "na", type: "KATAKANA", row: "na" },
    { kana: "ニ", romaji: "ni", type: "KATAKANA", row: "na" },
    { kana: "ヌ", romaji: "nu", type: "KATAKANA", row: "na" },
    { kana: "ネ", romaji: "ne", type: "KATAKANA", row: "na" },
    { kana: "ノ", romaji: "no", type: "KATAKANA", row: "na" },

    { kana: "ハ", romaji: "ha", type: "KATAKANA", row: "ha" },
    { kana: "ヒ", romaji: "hi", type: "KATAKANA", row: "ha" },
    { kana: "フ", romaji: "fu", type: "KATAKANA", row: "ha" },
    { kana: "ヘ", romaji: "he", type: "KATAKANA", row: "ha" },
    { kana: "ホ", romaji: "ho", type: "KATAKANA", row: "ha" },

    { kana: "マ", romaji: "ma", type: "KATAKANA", row: "ma" },
    { kana: "ミ", romaji: "mi", type: "KATAKANA", row: "ma" },
    { kana: "ム", romaji: "mu", type: "KATAKANA", row: "ma" },
    { kana: "メ", romaji: "me", type: "KATAKANA", row: "ma" },
    { kana: "モ", romaji: "mo", type: "KATAKANA", row: "ma" },

    { kana: "ヤ", romaji: "ya", type: "KATAKANA", row: "ya" },
    { kana: "ユ", romaji: "yu", type: "KATAKANA", row: "ya" },
    { kana: "ヨ", romaji: "yo", type: "KATAKANA", row: "ya" },

    { kana: "ラ", romaji: "ra", type: "KATAKANA", row: "ra" },
    { kana: "リ", romaji: "ri", type: "KATAKANA", row: "ra" },
    { kana: "ル", romaji: "ru", type: "KATAKANA", row: "ra" },
    { kana: "レ", romaji: "re", type: "KATAKANA", row: "ra" },
    { kana: "ロ", romaji: "ro", type: "KATAKANA", row: "ra" },

    { kana: "ワ", romaji: "wa", type: "KATAKANA", row: "wa" },
    { kana: "ヲ", romaji: "wo", type: "KATAKANA", row: "wa" },
    { kana: "ン", romaji: "n", type: "KATAKANA", row: "wa" }
];

// 2. DAILY KANJI DICTIONARY (JLPT N5 / N4)
const kanjiList = [
    {
        kanji: "日",
        level: "N5",
        meaning: "Matahari / Hari",
        onyomi: "ニチ, ジツ (nichi, jitsu)",
        kunyomi: "ひ, か (hi, ka)",
        stroke: 4,
        desc: "Kanji paling fundamental yang melambangkan matahari dan penanda waktu hari. Digunakan juga dalam nama negara Jepang (日本 - Nihon).",
        exampleJp: "今日はいい天気ですね。",
        exampleRomaji: "Kyou wa ii tenki desu ne.",
        exampleId: "Hari ini cuacanya sangat bagus ya."
    },
    {
        kanji: "学",
        level: "N5",
        meaning: "Belajar / Ilmu",
        onyomi: "ガク (gaku)",
        kunyomi: "まな・ぶ (mana-bu)",
        stroke: 8,
        desc: "Melambangkan anak di bawah naungan atap yang sedang menimba ilmu. Kunci dari kata Gakkou (sekolah) dan Gakusei (murid).",
        exampleJp: "日本語を一生懸命学びます。",
        exampleRomaji: "Nihongo o isshoukenmei manabimasu.",
        exampleId: "Saya belajar bahasa Jepang dengan sungguh-sungguh."
    },
    {
        kanji: "友",
        level: "N5",
        meaning: "Teman / Sahabat",
        onyomi: "ユウ (yuu)",
        kunyomi: "とも (tomo)",
        stroke: 4,
        desc: "Berasal dari dua tangan yang saling menggenggam sebagai simbol persahabatan sejati (Tomodachi).",
        exampleJp: "私たちは大切な友達です。",
        exampleRomaji: "Watashitachi wa taisetsu na tomodachi desu.",
        exampleId: "Kita adalah sahabat yang sangat berharga."
    },
    {
        kanji: "心",
        level: "N5",
        meaning: "Hati / Jiwa",
        onyomi: "シン (shin)",
        kunyomi: "こころ (kokoro)",
        stroke: 4,
        desc: "Bentuk piktogram menyerupai organ jantung, melambangkan perasaan, ketulusan, dan tekad batin seseorang.",
        exampleJp: "心から感謝しています。",
        exampleRomaji: "Kokoro kara kansha shite imasu.",
        exampleId: "Saya berterima kasih dari lubuk hati terdalam."
    },
    {
        kanji: "道",
        level: "N4",
        meaning: "Jalan / Ajaran Moral",
        onyomi: "ドウ, トウ (dou, tou)",
        kunyomi: "みち (michi)",
        stroke: 12,
        desc: "Jalan yang ditempuh dengan kesadaran dan disiplin spiritual. Dasar kata Shodou (kaligrafi), Bushido (jalan samurai).",
        exampleJp: "夢への道は諦めないことだ。",
        exampleRomaji: "Yume e no michi wa akiramenai koto da.",
        exampleId: "Jalan menuju impian adalah pantang menyerah."
    },
    {
        kanji: "桜",
        level: "N3",
        meaning: "Bunga Sakura",
        onyomi: "オウ (ou)",
        kunyomi: "さくら (sakura)",
        stroke: 10,
        desc: "Bunga nasional Jepang yang melambangkan keindahan sekaligus kefanaan hidup yang berharga.",
        exampleJp: "春になると桜が美しく咲く。",
        exampleRomaji: "Haru ni naru to sakura ga utsukushiku saku.",
        exampleId: "Saat musim semi tiba, bunga sakura mekar dengan indahnya."
    },
    {
        kanji: "力",
        level: "N5",
        meaning: "Kekuatan / Daya",
        onyomi: "リョク, リキ (ryoku, riki)",
        kunyomi: "ちから (chikara)",
        stroke: 2,
        desc: "Menggambarkan otot lengan yang kuat. Digunakan dalam peribahasa 'Keizoku wa chikara nari' (Konsistensi adalah kekuatan).",
        exampleJp: "継続は力なり。",
        exampleRomaji: "Keizoku wa chikara nari.",
        exampleId: "Konsistensi adalah kunci kekuatan sejati."
    }
];

// 3. ESSENTIAL JAPANESE PHRASEBOOK
const phrasebookData = [
    {
        category: "salam",
        tag: "Salam Harian",
        jp: "おはようございます",
        romaji: "Ohayou gozaimasu",
        id: "Selamat pagi (sopan, diucapkan kepada guru/senpai)."
    },
    {
        category: "salam",
        tag: "Salam Harian",
        jp: "お疲れ様でした",
        romaji: "Otsukaresama deshita",
        id: "Terima kasih atas kerja kerasnya (diucapkan saat selesai kerja/belajar)."
    },
    {
        category: "salam",
        tag: "Kesopanan",
        jp: "よろしくお願いします",
        romaji: "Yoroshiku onegaishimasu",
        id: "Mohon bantuannya / senang bekerja sama dengan Anda."
    },
    {
        category: "restoran",
        tag: "Restoran",
        jp: "すみません、注文をお願いします",
        romaji: "Sumimasen, chuumon o onegaishimasu",
        id: "Permisi, tolong saya ingin memesan makanan."
    },
    {
        category: "restoran",
        tag: "Restoran",
        jp: "お会計をお願いします",
        romaji: "O-kaikei o onegaishimasu",
        id: "Bisa minta tolong bon / pembayarannya?"
    },
    {
        category: "restoran",
        tag: "Ungkapan Makan",
        jp: "いただきます / ごちそうさまでした",
        romaji: "Itadakimasu / Gochisousama deshita",
        id: "Selamat makan / Terima kasih atas makanannya."
    },
    {
        category: "anime",
        tag: "Anime & Slang",
        jp: "さすがですね！",
        romaji: "Sasuga desu ne!",
        id: "Seperti yang diharapkan dari Anda! (Memuji kehebatan seseorang)."
    },
    {
        category: "anime",
        tag: "Anime & Slang",
        jp: "諦めるな、最後まで戦え！",
        romaji: "Akirameru na, saigo made tatakae!",
        id: "Jangan menyerah, bertarunglah sampai akhir!"
    },
    {
        category: "anime",
        tag: "Slang Internet",
        jp: "草生える (草)",
        romaji: "Kusa haeru (Kusa / www)",
        id: "Lucu banget / bikin ngakak (akar kata 'w' = warai mirip rumput)."
    },
    {
        category: "darurat",
        tag: "Darurat",
        jp: "助けてください！",
        romaji: "Tasukete kudasai!",
        id: "Tolong bantu saya! (Keadaan genting)."
    },
    {
        category: "darurat",
        tag: "Navigasi",
        jp: "駅はどこにありますか？",
        romaji: "Eki wa doko ni arimasu ka?",
        id: "Stasiun kereta ada di sebelah mana ya?"
    }
];

// 4. AUDIO PRONUNCIATION ENGINE (Native SpeechSynthesis)
function speakJapanese(text) {
    if (!('speechSynthesis' in window)) {
        showToast("Audio TTS tidak didukung browser ini.");
        return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    
    // Find Japanese voice if available
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang.includes('ja') || v.lang.includes('JP'));
    if (jaVoice) utterance.voice = jaVoice;

    window.speechSynthesis.speak(utterance);
    showToast(`🔊 Memutar: "${text}"`);
}

// 5. WEB AUDIO CHIME GENERATOR (Offline sound effects)
let audioCtx = null;
function playChime(type = 'success') {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;

        if (type === 'success') {
            // Japanese Bell chime chord
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.3); // C6
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
            osc.start(now);
            osc.stop(now + 0.6);
        } else if (type === 'bell') {
            // Shinto Temple bell
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(220, now);
            gain.gain.setValueAtTime(0.5, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
            osc.start(now);
            osc.stop(now + 1.8);
        } else if (type === 'error') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.linearRampToValueAtTime(120, now + 0.25);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'drop' || type === 'neutral') {
            // iOS subtle spring pop
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
            osc.start(now);
            osc.stop(now + 0.22);
        }
    } catch (e) {
        console.log("Audio FX error", e);
    }
}

// 6. TOAST NOTIFICATION UTILITY
function showToast(message) {
    let toast = document.getElementById("trinityToast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "trinityToast";
        toast.className = "trinity-toast";
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}

// 7. SAKURA FALLING PETALS CANVAS ENGINE
function initSakuraEngine() {
    const canvas = document.getElementById("sakuraCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const petals = [];
    const petalCount = 36;

    for (let i = 0; i < petalCount; i++) {
        petals.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 8 + 6,
            speedY: Math.random() * 1.2 + 0.6,
            speedX: Math.random() * 1.5 - 0.5,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 2 - 1,
            opacity: Math.random() * 0.5 + 0.3,
            color: Math.random() > 0.3 ? '#ffb3c1' : '#ff758f'
        });
    }

    let isRunning = localStorage.getItem("sakuraEnabled") !== "false";
    const sakuraToggleBtn = document.getElementById("toggleSakuraBtn");
    if (sakuraToggleBtn) {
        sakuraToggleBtn.classList.toggle("is-active", isRunning);
        sakuraToggleBtn.addEventListener("click", () => {
            isRunning = !isRunning;
            localStorage.setItem("sakuraEnabled", String(isRunning));
            sakuraToggleBtn.classList.toggle("is-active", isRunning);
            showToast(isRunning ? "🌸 Efek Sakura diaktifkan" : "🌸 Efek Sakura dimatikan");
        });
    }

    function render() {
        ctx.clearRect(0, 0, width, height);
        if (isRunning) {
            for (let i = 0; i < petals.length; i++) {
                const p = petals[i];
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = p.color;

                // Draw organic petal shape
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(p.size, -p.size / 2, p.size * 1.2, p.size / 2, 0, p.size * 1.4);
                ctx.bezierCurveTo(-p.size * 1.2, p.size / 2, -p.size, -p.size / 2, 0, 0);
                ctx.fill();
                ctx.restore();

                p.y += p.speedY;
                p.x += Math.sin(p.y * 0.01) * 0.8 + p.speedX;
                p.rotation += p.rotationSpeed;

                if (p.y > height + 20) {
                    p.y = -20;
                    p.x = Math.random() * width;
                }
                if (p.x > width + 20) p.x = -20;
                else if (p.x < -20) p.x = width + 20;
            }
        }
        requestAnimationFrame(render);
    }
    render();
}

// 8. SETUP DAILY KANJI COMPONENT
let currentKanjiIndex = 0;
function setupDailyKanji() {
    const kanjiContainer = document.getElementById("dailyKanjiSection");
    if (!kanjiContainer) return;

    function renderKanji(idx) {
        const item = kanjiList[idx];
        document.getElementById("kanjiChar").textContent = item.kanji;
        document.getElementById("kanjiLevel").textContent = `JLPT ${item.level}`;
        document.getElementById("kanjiOnyomi").textContent = item.onyomi;
        document.getElementById("kanjiKunyomi").textContent = item.kunyomi;
        document.getElementById("kanjiStrokes").textContent = `${item.stroke} Goresan`;
        document.getElementById("kanjiMeaning").textContent = item.meaning;
        document.getElementById("kanjiDesc").textContent = item.desc;
        document.getElementById("kanjiExJp").textContent = item.exampleJp;
        document.getElementById("kanjiExRomaji").textContent = item.exampleRomaji;
        document.getElementById("kanjiExId").textContent = item.exampleId;
    }

    renderKanji(currentKanjiIndex);

    document.getElementById("nextKanjiBtn")?.addEventListener("click", () => {
        currentKanjiIndex = (currentKanjiIndex + 1) % kanjiList.length;
        renderKanji(currentKanjiIndex);
        playChime('success');
    });

    document.getElementById("playKanjiAudioBtn")?.addEventListener("click", () => {
        const item = kanjiList[currentKanjiIndex];
        speakJapanese(`${item.kanji}。${item.exampleJp}`);
    });

    document.getElementById("kanjiChar")?.addEventListener("click", () => {
        const item = kanjiList[currentKanjiIndex];
        speakJapanese(item.kanji);
    });
}

// 9. SETUP KANA SOUNDBOARD MATRIX
function setupSoundboard() {
    const grid = document.getElementById("soundboardGrid");
    if (!grid) return;

    let activeType = "HIRAGANA";
    const tabHira = document.getElementById("tabSoundHira");
    const tabKata = document.getElementById("tabSoundKata");
    const searchInput = document.getElementById("soundSearch");

    function renderGrid(filter = "") {
        grid.innerHTML = "";
        const query = filter.toLowerCase().trim();
        const filtered = kanaList.filter(k => 
            k.type === activeType && 
            (k.kana.includes(query) || k.romaji.includes(query))
        );

        filtered.forEach(k => {
            const btn = document.createElement("div");
            btn.className = "sound-item";
            btn.setAttribute("role", "button");
            btn.setAttribute("tabindex", "0");
            btn.innerHTML = `
                <span class="sound-kana">${k.kana}</span>
                <span class="sound-romaji">${k.romaji}</span>
            `;
            btn.addEventListener("click", () => {
                speakJapanese(k.kana);
                btn.style.transform = "scale(0.92)";
                setTimeout(() => btn.style.transform = "", 150);
            });
            grid.appendChild(btn);
        });
    }

    tabHira?.addEventListener("click", () => {
        activeType = "HIRAGANA";
        tabHira.classList.add("active");
        tabKata?.classList.remove("active");
        renderGrid(searchInput?.value || "");
    });

    tabKata?.addEventListener("click", () => {
        activeType = "KATAKANA";
        tabKata.classList.add("active");
        tabHira?.classList.remove("active");
        renderGrid(searchInput?.value || "");
    });

    searchInput?.addEventListener("input", (e) => {
        renderGrid(e.target.value);
    });

    renderGrid();
}

// 10. SETUP KOTOBA VAULT / PHRASEBOOK
function setupPhrasebook() {
    const container = document.getElementById("phrasebookList");
    if (!container) return;

    function renderPhrases(category = "all") {
        container.innerHTML = "";
        const list = category === "all" ? phrasebookData : phrasebookData.filter(p => p.category === category);
        list.forEach(p => {
            const card = document.createElement("div");
            card.className = "phrase-card";
            card.innerHTML = `
                <div>
                    <span class="phrase-tag">${p.tag}</span>
                    <h3 class="phrase-jp">${p.jp}</h3>
                    <p class="phrase-romaji">${p.romaji}</p>
                    <p class="phrase-id">${p.id}</p>
                </div>
                <div class="phrase-footer">
                    <button class="listen-btn" type="button" aria-label="Dengar audio">
                        <span>🔊</span> Dengarkan
                    </button>
                    <button class="listen-btn copy-phrase-btn" type="button" aria-label="Salin teks">
                        <span>📋</span> Salin
                    </button>
                </div>
            `;
            card.querySelector(".listen-btn")?.addEventListener("click", () => speakJapanese(p.jp));
            card.querySelector(".copy-phrase-btn")?.addEventListener("click", () => {
                navigator.clipboard.writeText(`${p.jp} (${p.romaji}) - ${p.id}`).then(() => {
                    showToast("Teks percakapan disalin!");
                });
            });
            container.appendChild(card);
        });
    }

    const filterBtns = document.querySelectorAll(".phrase-filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderPhrases(btn.dataset.category);
        });
    });

    renderPhrases("all");
}

// 11. SETUP KANA WRITING BRUSH CANVAS
function setupWritingCanvas() {
    const canvas = document.getElementById("drawCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const guideEl = document.getElementById("canvasGuide");
    const clearBtn = document.getElementById("clearCanvasBtn");
    const charButtons = document.querySelectorAll(".char-pick-btn");

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#E63946";
        ctx.lineWidth = 10;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let drawing = false;

    function start(e) {
        drawing = true;
        ctx.beginPath();
        const pos = getPos(e);
        ctx.moveTo(pos.x, pos.y);
    }

    function move(e) {
        if (!drawing) return;
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    }

    function stop() {
        drawing = false;
    }

    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    window.addEventListener("mouseup", stop);

    canvas.addEventListener("touchstart", (e) => { e.preventDefault(); start(e); });
    canvas.addEventListener("touchmove", (e) => { e.preventDefault(); move(e); });
    window.addEventListener("touchend", stop);

    clearBtn?.addEventListener("click", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        showToast("Kanvas dibersihkan.");
    });

    charButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            charButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            if (guideEl) guideEl.textContent = btn.textContent;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            speakJapanese(btn.textContent);
        });
    });
}

// 12. SETUP JAPANESE KATAKANA NAME GENERATOR
function setupNameGenerator() {
    const input = document.getElementById("nameInput");
    const resultBox = document.getElementById("nameResultBox");
    const btn = document.getElementById("convertNameBtn");
    if (!input || !btn || !resultBox) return;

    // Indonesian/English sound to Katakana mapping dictionary
    const syllableMap = {
        "a": "ア", "i": "イ", "u": "ウ", "e": "エ", "o": "オ",
        "ka": "カ", "ki": "キ", "ku": "ク", "ke": "ケ", "ko": "コ",
        "sa": "サ", "si": "シ", "shi": "シ", "su": "ス", "se": "セ", "so": "ソ",
        "ta": "タ", "ti": "ティ", "tu": "トゥ", "te": "テ", "to": "ト", "tsu": "ツ",
        "na": "ナ", "ni": "ニ", "nu": "ヌ", "ne": "ネ", "no": "ノ",
        "ha": "ハ", "hi": "ヒ", "fu": "フ", "he": "ヘ", "ho": "ホ",
        "ma": "マ", "mi": "ミ", "mu": "ム", "me": "メ", "mo": "モ",
        "ya": "ヤ", "yu": "ユ", "yo": "ヨ",
        "ra": "ラ", "ri": "リ", "ru": "ル", "re": "レ", "ro": "ロ",
        "la": "ラ", "li": "リ", "lu": "ル", "le": "レ", "lo": "ロ",
        "wa": "ワ", "wi": "ウィ", "we": "ウェ", "wo": "ウォ",
        "ga": "ガ", "gi": "ギ", "gu": "グ", "ge": "ゲ", "go": "ゴ",
        "za": "ザ", "ji": "ジ", "zu": "ズ", "ze": "ゼ", "zo": "ゾ",
        "da": "ダ", "di": "ディ", "du": "ドゥ", "de": "デ", "do": "ド",
        "ba": "バ", "bi": "ビ", "bu": "ブ", "be": "ベ", "bo": "ボ",
        "pa": "パ", "pi": "ピ", "pu": "プ", "pe": "ペ", "po": "ポ",
        "fa": "ファ", "fi": "フィ", "fe": "フェ", "fo": "フォ",
        "va": "ヴァ", "vi": "ヴィ", "vu": "ヴ", "ve": "ヴェ", "vo": "ヴォ"
    };

    const kanjiKanjiAura = [
        { kanji: "勇栄大", meaning: "Pemberani, Jaya, dan Berjiwa Agung (Yū-ei-dai)" },
        { kanji: "光星", meaning: "Cahaya Bintang Penunjuk Jalan (Kōsei)" },
        { kanji: "天心", meaning: "Hati Murni Seluas Cakrawala (Tenshin)" },
        { kanji: "雷神", meaning: "Kekuatan Petir Yang Menggelegar (Raijin)" },
        { kanji: "桜翔", meaning: "Bunga Sakura yang Terbang Menggapai Cita (Ōshō)" }
    ];

    btn.addEventListener("click", () => {
        const raw = input.value.trim().toLowerCase();
        if (!raw) {
            showToast("Ketik namamu terlebih dahulu!");
            return;
        }

        let katakana = "";
        let i = 0;
        while (i < raw.length) {
            if (i + 3 <= raw.length && syllableMap[raw.substr(i, 3)]) {
                katakana += syllableMap[raw.substr(i, 3)];
                i += 3;
            } else if (i + 2 <= raw.length && syllableMap[raw.substr(i, 2)]) {
                katakana += syllableMap[raw.substr(i, 2)];
                i += 2;
            } else if (syllableMap[raw[i]]) {
                katakana += syllableMap[raw[i]];
                i++;
            } else if (raw[i] === 'n' && (i === raw.length - 1 || !'aiueo'.includes(raw[i + 1]))) {
                katakana += "ン";
                i++;
            } else {
                katakana += raw[i].toUpperCase();
                i++;
            }
        }

        const aura = kanjiKanjiAura[Math.floor(Math.random() * kanjiKanjiAura.length)];

        resultBox.style.display = "block";
        resultBox.innerHTML = `
            <div style="text-align: center; padding: 15px; background: rgba(8,11,17,0.7); border-radius: 8px; border: 1px solid var(--japan-gold);">
                <span style="font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px;">Katakana Resmi</span>
                <h2 style="font-size: 2.2rem; color: #fff; margin: 5px 0 10px; font-family: 'Noto Serif JP', serif;">${katakana}</h2>
                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.08);">
                    <span style="font-size: 11px; color: var(--japan-gold); font-weight: 700;">Gelar Kanji (当て字):</span>
                    <p style="font-size: 1.2rem; color: #fff; margin: 4px 0; font-family: 'Noto Serif JP', serif;">${aura.kanji}</p>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;"><em>"${aura.meaning}"</em></p>
                </div>
                <button class="btn btn-secondary" id="speakNameBtn" style="margin-top: 15px; padding: 8px 16px; font-size: 11px;">🔊 Dengar Pelafalan</button>
            </div>
        `;

        document.getElementById("speakNameBtn")?.addEventListener("click", () => {
            speakJapanese(katakana);
        });

        playChime('success');
    });
}

// 13. SETUP ZEN FOCUS TIMER (POMODORO)
function setupZenTimer() {
    const display = document.getElementById("zenTimerDisplay");
    const startBtn = document.getElementById("startZenBtn");
    const resetBtn = document.getElementById("resetZenBtn");
    if (!display || !startBtn) return;

    let timeLeft = 25 * 60; // 25 minutes
    let timerInt = null;
    let isRunning = false;

    function formatTime(s) {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    }

    display.textContent = formatTime(timeLeft);

    startBtn.addEventListener("click", () => {
        if (!isRunning) {
            isRunning = true;
            startBtn.textContent = "JEDA";
            startBtn.classList.remove("btn-primary");
            startBtn.classList.add("btn-outline");
            playChime('bell');
            showToast("Sesi belajar Zen dimulai. Tetap fokus!");

            timerInt = setInterval(() => {
                timeLeft--;
                display.textContent = formatTime(timeLeft);
                if (timeLeft <= 0) {
                    clearInterval(timerInt);
                    isRunning = false;
                    playChime('bell');
                    startBtn.textContent = "MULAI FOKUS";
                    showToast("⛩️ Sesi 25 menit selesai! Istirahatlah sejenak.");
                }
            }, 1000);
        } else {
            isRunning = false;
            clearInterval(timerInt);
            startBtn.textContent = "LANJUTKAN";
            startBtn.classList.remove("btn-outline");
            startBtn.classList.add("btn-primary");
        }
    });

    resetBtn?.addEventListener("click", () => {
        clearInterval(timerInt);
        isRunning = false;
        timeLeft = 25 * 60;
        display.textContent = formatTime(timeLeft);
        startBtn.textContent = "MULAI FOKUS";
        startBtn.classList.remove("btn-outline");
        startBtn.classList.add("btn-primary");
        showToast("Timer direset ke 25:00.");
    });
}

// 14. EXISTING STUDY & QUIZ FUNCTIONALITIES
let currentScore = 0;
let currentStreak = 0;
let bestScore = Number(localStorage.getItem("nihongoBestScore") || 0);
let currentQuestion = {};

function setupInfoProfile() {
    const profile = document.getElementById("developerProfile");
    const message = document.getElementById("developerMessage");
    if (!profile || !message) return;
    profile.addEventListener("click", () => {
        const isOpen = profile.getAttribute("aria-expanded") === "true";
        profile.setAttribute("aria-expanded", String(!isOpen));
        message.classList.toggle("is-hidden", isOpen);
        message.setAttribute("aria-hidden", String(isOpen));
    });
}

function setupStudyPage() {
    const studyPage = document.querySelector(".study-page");
    if (!studyPage) return;

    const kanaType = studyPage.dataset.kanaType || "HIRAGANA";
    const storageKey = `nihongoLearned_${kanaType}`;
    const learned = new Set(JSON.parse(localStorage.getItem(storageKey) || "[]"));
    const cards = [...document.querySelectorAll(".kana-box")].filter(card => card.querySelector("span"));
    const search = document.getElementById("kanaSearch");
    const progressText = document.getElementById("progressText");
    const progressBar = document.getElementById("progressBar");

    function updateProgress() {
        const amount = learned.size;
        if (progressText) progressText.innerText = `${amount} / ${cards.length}`;
        if (progressBar) progressBar.style.width = `${(amount / cards.length) * 100}%`;
        cards.forEach(card => {
            const span = card.querySelector("span");
            if (span) card.classList.toggle("is-learned", learned.has(span.innerText));
        });
    }

    cards.forEach(card => {
        card.addEventListener("click", () => {
            const kana = card.querySelector("span").innerText;
            learned.has(kana) ? learned.delete(kana) : learned.add(kana);
            localStorage.setItem(storageKey, JSON.stringify([...learned]));
            updateProgress();
            speakJapanese(kana);
        });
        card.addEventListener("dblclick", () => {
            const kana = card.querySelector("span").innerText;
            speakJapanese(kana);
        });
    });

    search?.addEventListener("input", () => {
        const query = search.value.toLowerCase().trim();
        cards.forEach(card => {
            card.style.display = card.innerText.toLowerCase().includes(query) ? "grid" : "none";
        });
    });

    document.getElementById("resetProgress")?.addEventListener("click", () => {
        if (confirm("Reset seluruh progres hafalan kana di halaman ini?")) {
            learned.clear();
            localStorage.removeItem(storageKey);
            updateProgress();
            showToast("Progres direset.");
        }
    });

    updateProgress();
}

function loadQuestion() {
    const randomIndex = Math.floor(Math.random() * kanaList.length);
    currentQuestion = kanaList[randomIndex];
    const qKana = document.getElementById("questionKana");
    if (qKana) qKana.innerText = currentQuestion.kana;
    
    const typeLabel = document.getElementById("kanaType");
    if (typeLabel) {
        typeLabel.innerText = currentQuestion.type;
        typeLabel.style.color = currentQuestion.type === "HIRAGANA" ? "#00f3ff" : "#ff758f";
    }

    const input = document.getElementById("answerInput");
    if (input) {
        input.value = "";
        input.focus();
    }
    const feedback = document.getElementById("feedback");
    if (feedback) feedback.innerText = "";
}

function updateQuizStats() {
    const s = document.getElementById("score");
    const st = document.getElementById("streak");
    const b = document.getElementById("bestScore");
    if (s) s.innerText = currentScore;
    if (st) st.innerText = currentStreak;
    if (b) b.innerText = bestScore;
}

function checkAnswer() {
    const input = document.getElementById("answerInput");
    if (!input) return;
    const userAnswer = input.value.toLowerCase().trim();
    const feedbackText = document.getElementById("feedback");

    if (userAnswer === currentQuestion.romaji) {
        currentScore += 10;
        currentStreak += 1;
        bestScore = Math.max(bestScore, currentScore);
        localStorage.setItem("nihongoBestScore", bestScore);
        updateQuizStats();
        window.dispatchEvent(new CustomEvent('updateLeaderboard', { detail: bestScore }));
        
        playChime('success');
        if (feedbackText) {
            feedbackText.innerText = "SEMPURNA! 正解 (SEIKAI) ⚡";
            feedbackText.style.color = "#00f3ff";
            feedbackText.style.textShadow = "0 0 10px #00f3ff";
        }
        setTimeout(loadQuestion, 900);
    } else {
        currentStreak = 0;
        updateQuizStats();
        playChime('error');
        if (feedbackText) {
            feedbackText.innerText = `JAWABAN BENAR: '${currentQuestion.romaji.toUpperCase()}'`;
            feedbackText.style.color = "#ff758f";
            feedbackText.style.textShadow = "0 0 10px #ff758f";
        }
    }
}

// ==========================================
// 15. MOBILE-FIRST ADVANCED HOMEPAGE ENGINES
// ==========================================

// A. STUDENT PASS & EXP SYSTEM
function setupMobileAppHub() {
    const userNameEl = document.getElementById("heroPassUserName");
    const rankEl = document.getElementById("heroPassRank");
    const streakEl = document.getElementById("heroPassStreak");
    const expValEl = document.getElementById("heroExpVal");
    const expFillEl = document.getElementById("heroExpFill");
    const avatarEl = document.getElementById("heroPassAvatar");

    if (!userNameEl) return;

    function refreshPass() {
        const user = localStorage.getItem("nihongoChatUser");
        if (user) {
            userNameEl.textContent = `Okaeri, ${user}! 🌸`;
        } else {
            userNameEl.textContent = "Konnichiwa, Gakusei! 🌸";
        }

        // Profile Avatar Sync
        const savedAvatar = localStorage.getItem(`avatar_${user}`);
        if (savedAvatar && avatarEl) {
            avatarEl.src = savedAvatar;
        }

        // Calculate XP based on best score & completed quests
        let currentExp = Number(localStorage.getItem("trinity_exp") || 80);
        const best = Number(localStorage.getItem("nihongoBestScore") || 0);
        currentExp = Math.max(currentExp, 80 + best * 2);

        // Determine Level & Rank
        let level = 1;
        let rankTitle = "見習い MINARAI";
        let maxExp = 300;

        if (currentExp >= 750) {
            level = 4;
            rankTitle = "侍 SAMURAI";
            maxExp = 1500;
        } else if (currentExp >= 400) {
            level = 3;
            rankTitle = "武士 BUSHI";
            maxExp = 750;
        } else if (currentExp >= 180) {
            level = 2;
            rankTitle = "門下生 MONKASEI";
            maxExp = 400;
        }

        if (rankEl) rankEl.textContent = `⚔️ ${rankTitle} · LV.${level}`;
        if (expValEl) expValEl.textContent = `${currentExp} / ${maxExp} XP`;
        if (expFillEl) {
            const pct = Math.min(100, Math.round((currentExp / maxExp) * 100));
            expFillEl.style.width = `${pct}%`;
        }

        // Streak Tracker
        const streakDays = Number(localStorage.getItem("trinity_streak_days") || 1);
        if (streakEl) {
            const streakSpan = streakEl.querySelector("span");
            if (streakSpan) streakSpan.textContent = `${streakDays} Hari`;
        }
    }

    refreshPass();
    window.addEventListener("storage", refreshPass);
    window.addEventListener("profilesUpdated", refreshPass);

    // Segmented Tabs Switcher (Leaderboard vs Team)
    const tabRank = document.getElementById("tabBtnRank");
    const tabTeam = document.getElementById("tabBtnTeam");
    const paneRank = document.getElementById("paneRank");
    const paneTeam = document.getElementById("paneTeam");

    tabRank?.addEventListener("click", () => {
        tabRank.classList.add("is-active");
        tabTeam?.classList.remove("is-active");
        paneRank?.classList.add("is-active");
        paneTeam?.classList.remove("is-active");
    });

    tabTeam?.addEventListener("click", () => {
        tabTeam.classList.add("is-active");
        tabRank?.classList.remove("is-active");
        paneTeam?.classList.add("is-active");
        paneRank?.classList.remove("is-active");
    });
}

// B. DAILY MASTERY QUESTS TRACKER
function setupDailyQuests() {
    const progressText = document.getElementById("questProgressText");
    const questItems = [
        document.getElementById("questItem1"),
        document.getElementById("questItem2"),
        document.getElementById("questItem3")
    ];

    if (!progressText || !questItems[0]) return;

    const todayKey = `trinity_quests_${new Date().toISOString().slice(0, 10)}`;
    let questState = JSON.parse(localStorage.getItem(todayKey) || "[false, false, false]");

    function updateQuestUI() {
        let completed = 0;
        questItems.forEach((item, idx) => {
            if (!item) return;
            const isDone = questState[idx];
            item.classList.toggle("is-completed", isDone);
            if (isDone) completed++;
        });

        progressText.textContent = `${completed} / 3 Selesai`;
        if (completed === 3) {
            progressText.style.background = "rgba(76, 175, 80, 0.2)";
            progressText.style.color = "#a5d6a7";
            progressText.style.borderColor = "#4CAF50";
        }
    }

    questItems.forEach((item, idx) => {
        item?.addEventListener("click", () => {
            questState[idx] = !questState[idx];
            localStorage.setItem(todayKey, JSON.stringify(questState));
            if (questState[idx]) {
                playChime('success');
                showToast("✨ Misi harian selesai! +EXP");
                let curExp = Number(localStorage.getItem("trinity_exp") || 80);
                localStorage.setItem("trinity_exp", curExp + 30);
                setupMobileAppHub();
            }
            updateQuestUI();
        });
    });

    updateQuestUI();

    // Auto complete quest 2 from other activities
    window.completeQuest = function(index) {
        if (!questState[index]) {
            questState[index] = true;
            localStorage.setItem(todayKey, JSON.stringify(questState));
            updateQuestUI();
            playChime('success');
            showToast("🎯 Misi Harian Berhasil Dicapai!");
        }
    };
}

// C. FAST 1-TAP KANA RADAR (INLINE MINI-GAME)
function setupFastKanaRadar() {
    const targetCharEl = document.getElementById("fastRadarChar");
    const optionsContainer = document.getElementById("fastRadarOptions");
    const streakEl = document.getElementById("fastRadarStreak");
    const feedbackEl = document.getElementById("fastRadarFeedback");
    const speakerBtn = document.getElementById("fastRadarSpeaker");

    if (!targetCharEl || !optionsContainer) return;

    let currentKana = null;
    let radarStreak = 0;
    let isLocked = false;

    // Filter clear single-syllable kana
    const validKana = kanaList.filter(k => k.romaji.length <= 3 && k.row !== "dakuon");

    function nextQuestion() {
        isLocked = false;
        const randomIndex = Math.floor(Math.random() * validKana.length);
        currentKana = validKana[randomIndex];

        targetCharEl.textContent = currentKana.kana;
        targetCharEl.style.transform = "scale(0.85)";
        setTimeout(() => targetCharEl.style.transform = "scale(1)", 150);

        // Generate 1 correct + 3 distinct wrong choices
        const choices = [currentKana.romaji];
        while (choices.length < 4) {
            const randItem = validKana[Math.floor(Math.random() * validKana.length)];
            if (!choices.includes(randItem.romaji)) {
                choices.push(randItem.romaji);
            }
        }

        // Shuffle choices
        choices.sort(() => Math.random() - 0.5);

        optionsContainer.innerHTML = "";
        choices.forEach(choice => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "radar-option-btn";
            btn.textContent = choice;
            btn.dataset.romaji = choice;
            btn.addEventListener("click", () => handleChoice(choice, btn));
            optionsContainer.appendChild(btn);
        });

        if (feedbackEl) {
            feedbackEl.textContent = "Pilih salah satu jawaban";
            feedbackEl.style.color = "var(--muted)";
        }
    }

    function handleChoice(selected, btn) {
        if (isLocked) return;
        isLocked = true;

        if (selected === currentKana.romaji) {
            btn.classList.add("is-correct");
            playChime('success');
            radarStreak++;
            if (streakEl) {
                const s = streakEl.querySelector("span");
                if (s) s.textContent = radarStreak;
            }

            if (feedbackEl) {
                feedbackEl.textContent = `正解! Benar: "${currentKana.romaji}" ⚡`;
                feedbackEl.style.color = "#81C784";
            }

            // Award XP
            let curExp = Number(localStorage.getItem("trinity_exp") || 80);
            localStorage.setItem("trinity_exp", curExp + 10);
            setupMobileAppHub();

            // Mark Quest 2 as completed
            if (window.completeQuest) window.completeQuest(1);

            setTimeout(nextQuestion, 600);
        } else {
            btn.classList.add("is-wrong");
            playChime('error');
            radarStreak = 0;
            if (streakEl) {
                const s = streakEl.querySelector("span");
                if (s) s.textContent = "0";
            }

            // Highlight the correct one
            optionsContainer.querySelectorAll(".radar-option-btn").forEach(b => {
                if (b.dataset.romaji === currentKana.romaji) b.classList.add("is-correct");
            });

            if (feedbackEl) {
                feedbackEl.textContent = `Jawaban tepat: "${currentKana.romaji}" ❌`;
                feedbackEl.style.color = "#FF758F";
            }

            setTimeout(nextQuestion, 1200);
        }
    }

    speakerBtn?.addEventListener("click", () => {
        if (currentKana) speakJapanese(currentKana.kana);
    });

    nextQuestion();
}

// D. KANJI RADAR CARD WIDGET
function setupKanjiRadarWidget() {
    const charBox = document.getElementById("kanjiRadarChar");
    const levelEl = document.getElementById("kanjiRadarLevel");
    const strokesEl = document.getElementById("kanjiRadarStrokes");
    const meaningEl = document.getElementById("kanjiRadarMeaning");
    const readingsEl = document.getElementById("kanjiRadarReadings");
    const exJpEl = document.getElementById("kanjiRadarExJp");
    const exIdEl = document.getElementById("kanjiRadarExId");
    const speakerBtn = document.getElementById("kanjiRadarSpeaker");
    const randomBtn = document.getElementById("kanjiRadarRandomBtn");
    const markBtn = document.getElementById("kanjiRadarMarkBtn");
    const counterEl = document.getElementById("kanjiRadarCounter");

    if (!charBox || !meaningEl) return;

    let kanjiIdx = 0;

    function renderKanjiCard(idx) {
        const item = kanjiList[idx];
        if (!item) return;

        charBox.textContent = item.kanji;
        if (levelEl) levelEl.textContent = `JLPT ${item.level}`;
        if (strokesEl) strokesEl.textContent = `${item.stroke} Goresan`;
        if (meaningEl) meaningEl.textContent = item.meaning;
        if (readingsEl) {
            readingsEl.innerHTML = `
                <div><strong>On:</strong> ${item.onyomi}</div>
                <div><strong>Kun:</strong> ${item.kunyomi}</div>
            `;
        }
        if (exJpEl) exJpEl.textContent = item.exampleJp;
        if (exIdEl) exIdEl.textContent = item.exampleId;

        // Check memorized state
        const memorized = JSON.parse(localStorage.getItem("trinity_memorized_kanji") || "[]");
        if (markBtn) {
            const isMem = memorized.includes(item.kanji);
            markBtn.textContent = isMem ? "✅ Dihafal" : "✓ Tandai Hafal";
            markBtn.classList.toggle("btn-primary", isMem);
            markBtn.classList.toggle("btn-secondary", !isMem);
        }
        if (counterEl) counterEl.textContent = `Hafal: ${memorized.length}`;
    }

    renderKanjiCard(kanjiIdx);

    speakerBtn?.addEventListener("click", () => {
        const item = kanjiList[kanjiIdx];
        if (item) speakJapanese(`${item.kanji}。${item.exampleJp}`);
    });

    charBox.addEventListener("click", () => {
        const item = kanjiList[kanjiIdx];
        if (item) speakJapanese(item.kanji);
    });

    randomBtn?.addEventListener("click", () => {
        let nextIdx;
        do {
            nextIdx = Math.floor(Math.random() * kanjiList.length);
        } while (nextIdx === kanjiIdx && kanjiList.length > 1);

        kanjiIdx = nextIdx;
        playChime('bell');
        renderKanjiCard(kanjiIdx);
    });

    markBtn?.addEventListener("click", () => {
        const item = kanjiList[kanjiIdx];
        let memorized = JSON.parse(localStorage.getItem("trinity_memorized_kanji") || "[]");
        if (memorized.includes(item.kanji)) {
            memorized = memorized.filter(k => k !== item.kanji);
            showToast(`Kanji "${item.kanji}" dihapus dari daftar hafal`);
        } else {
            memorized.push(item.kanji);
            playChime('success');
            showToast(`✨ Kanji "${item.kanji}" berhasil dihafal! +20 XP`);
            let curExp = Number(localStorage.getItem("trinity_exp") || 80);
            localStorage.setItem("trinity_exp", curExp + 20);
            setupMobileAppHub();
        }
        localStorage.setItem("trinity_memorized_kanji", JSON.stringify(memorized));
        renderKanjiCard(kanjiIdx);
    });
}

// ==========================================================================
// 16. iOS DYNAMIC ISLAND VOICE NOTE (VN) - COMPACT CAPSULE DARK RGB
// Ultra-compact capsule with real tutor profile photo, animated VN bars,
// spontaneous encouraging voice notes, cool exit animation on completion,
// and max 3 times limit per page load (resets on refresh).
// ==========================================================================
const VN_PLAYLIST = [
    {
        id: "vn_aoi_cheer",
        sender: "Aoi Sensei",
        avatarImg: "aoi_sensei.jpg",
        caption: "Konnichiwa! Tetap semangat belajarnya ya, kamu pasti bisa! 🌸",
        audioFile: "aoi_sensei.mp3",
        fallbackText: "Konnichiwa, minna-san! Kyou mo issho ni Nihongo wo ganbarimashou ne! Anata nara kanarazu dekimasu yo!",
        speechLang: "ja-JP",
        duration: 8
    },
    {
        id: "vn_aoi_rest",
        sender: "Aoi Sensei",
        avatarImg: "aoi_sensei.jpg",
        caption: "Otsukaresama! Istirahatkan mata sejenak & minum air ya~ ✨",
        audioFile: "vn2.mp3",
        fallbackText: "Otsukaresama desu! Sukoshi me wo yasumete, ocha demo nonde kudasai ne. Ganbari sugizu ni ne!",
        speechLang: "ja-JP",
        duration: 7
    },
    {
        id: "vn_aoi_dream",
        sender: "Aoi Sensei",
        avatarImg: "aoi_sensei.jpg",
        caption: "Setiap huruf yang kamu hafal adalah langkah menuju Jepang! 🇯🇵",
        audioFile: "vn3.mp3",
        fallbackText: "Ganbatte kudasai! Mainichi no benkyou ga, kanarazu anata no yume wo kanaemasu yo! Ouen shiteimasu!",
        speechLang: "ja-JP",
        duration: 8
    },
    {
        id: "vn_founder_cheer",
        sender: "Umaedi • Dev",
        avatarImg: "umaedi.png",
        caption: "Keren banget masih aktif belajar! Nikmati setiap prosesnya 🚀",
        audioFile: "vn4.mp3",
        fallbackText: "Halo pejuang bahasa Jepang! Keren sekali kamu masih konsisten belajar hari ini. Terus melangkah maju dan raih impianmu ya!",
        speechLang: "id-ID",
        duration: 8
    }
];

// Batas maksimal 3 kali Voice Note per masuk halaman (reset saat refresh)
let pageVnTriggerCount = 0;
const MAX_VN_PER_PAGE = 3;

let diCurrentVnIndex = 0;
let diCurrentAudio = null;
let diIsPlaying = false;
let diFallbackTicker = null;
let diFallbackElapsed = 0;
let diDismissTimeout = null;
let diZenMelody = null;
let diPlaybackSpeed = 1.0;

function getAssetsDir() {
    const path = (window.location.pathname || '').replace(/\\/g, '/');
    if (path.includes('/pages/game/') || path.includes('/pages/musik/') || path.includes('/pages/movie/')) {
        return '../../assets/';
    } else if (path.includes('/pages/')) {
        return '../assets/';
    }
    return 'assets/';
}

function getGambarDir() {
    const path = (window.location.pathname || '').replace(/\\/g, '/');
    if (path.includes('/pages/game/') || path.includes('/pages/musik/') || path.includes('/pages/movie/')) {
        return '../../gambar/';
    } else if (path.includes('/pages/')) {
        return '../gambar/';
    }
    return 'gambar/';
}

function playZenLofiMelody(durationSec = 8) {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return null;
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        // Pentatonic Insen scale notes (Hz)
        const notes = [293.66, 311.13, 392.00, 440.00, 466.16, 587.33, 622.25, 783.99];
        let noteTimer = null;
        let noteCount = 0;
        const maxNotes = Math.floor(durationSec * 2.2);

        function playSinglePluck() {
            if (!audioCtx || audioCtx.state === 'closed') return;
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            const freq = notes[Math.floor(Math.random() * notes.length)];
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

            osc.start(now);
            osc.stop(now + 0.45);
        }

        playSinglePluck();
        noteTimer = setInterval(() => {
            noteCount++;
            playSinglePluck();
            if (noteCount >= maxNotes) {
                clearInterval(noteTimer);
            }
        }, Math.floor(450 / diPlaybackSpeed));

        return {
            stop: () => {
                if (noteTimer) clearInterval(noteTimer);
            }
        };
    } catch (e) {
        return null;
    }
}

function formatDiTime(sec) {
    const s = Math.floor(sec || 0);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem < 10 ? '0' : ''}${rem}`;
}

// Pola tinggi waveform alami VN (20 bar ramping untuk kapsul)
const VN_BAR_HEIGHTS = [
    25, 45, 70, 38, 85, 95, 60, 44, 90, 100, 75, 48, 30, 
    55, 82, 92, 85, 65, 42, 70, 88, 55
];

const RGB_WAVE_PALETTE = [
    '#00F2FE', '#00d9fe', '#00FF87', '#55ff88', 
    '#FFB800', '#ff9400', '#FF007A', '#ff1a8c', 
    '#7928CA', '#9d4edd'
];

function renderVnWaveformBars() {
    const container = document.getElementById('diWaveContainer');
    if (!container) return;
    container.innerHTML = '';

    VN_BAR_HEIGHTS.forEach((h, i) => {
        const bar = document.createElement('span');
        bar.className = 'di-vn-bar';
        bar.style.height = `${Math.max(4, Math.round(h * 0.16))}px`;
        const color = RGB_WAVE_PALETTE[i % RGB_WAVE_PALETTE.length];
        bar.style.setProperty('--bar-rgb', color);
        bar.dataset.index = i;
        container.appendChild(bar);
    });
}

function updateWaveformProgress(percent) {
    const container = document.getElementById('diWaveContainer');
    if (!container) return;
    const bars = container.querySelectorAll('.di-vn-bar');
    const total = bars.length;
    const activeIndex = Math.floor((percent / 100) * total);

    bars.forEach((bar, idx) => {
        if (idx <= activeIndex) {
            bar.classList.add('is-played');
            if (diIsPlaying && Math.abs(idx - activeIndex) <= 2) {
                bar.classList.add('is-active-wave');
            } else {
                bar.classList.remove('is-active-wave');
            }
        } else {
            bar.classList.remove('is-played', 'is-active-wave');
        }
    });
}

function injectDynamicIslandDOM() {
    if (document.getElementById('iosDynamicIsland')) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'iosDynamicIsland';
    wrapper.className = 'dynamic-island-wrapper di-hidden';
    wrapper.setAttribute('role', 'dialog');
    wrapper.setAttribute('aria-label', 'Dynamic Island Voice Note');

    const gambarDir = getGambarDir();

    wrapper.innerHTML = `
        <div class="di-rgb-glow-ring"></div>
        <div class="di-capsule" id="diCapsule">
            
            <!-- Left: Realistic Tutor Profile Photo with Live Dot -->
            <div class="di-vn-avatar-wrap">
                <img id="diVnAvatarImg" src="${gambarDir}aoi_sensei.jpg" alt="Aoi Sensei" class="di-vn-avatar-img">
                <span class="di-vn-live-dot"></span>
            </div>

            <!-- Center: Name + Micro Tag + Waveform -->
            <div class="di-vn-center-col">
                <div class="di-vn-header-row">
                    <div class="di-vn-name-group">
                        <span class="di-vn-sender" id="diVnSender">Aoi Sensei</span>
                        <span class="di-vn-tag">🎙️ VN</span>
                    </div>
                    <span class="di-vn-time" id="diTimeCur">0:00</span>
                </div>
                <!-- Waveform Track -->
                <div class="di-vn-waveform-track" id="diSliderTrack" title="Klik untuk memutar bagian ini">
                    <div class="di-vn-wave-container" id="diWaveContainer"></div>
                </div>
            </div>

            <!-- Right: Play Button + Close 'X' -->
            <div class="di-vn-action-group">
                <button type="button" class="di-vn-play-btn" id="diPlayBtn" title="Putar Pesan Suara" aria-label="Putar Voice Note">
                    <svg class="di-icon-play" id="diIconPlay" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                    <svg class="di-icon-pause" id="diIconPause" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="display:none;">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                    </svg>
                </button>
                <button type="button" class="di-vn-close-btn" id="diCloseBtn" title="Tutup" aria-label="Tutup">✕</button>
            </div>

        </div>
    `;

    document.body.appendChild(wrapper);
    renderVnWaveformBars();
    bindDynamicIslandEvents();
}

function loadVnData(index) {
    diCurrentVnIndex = (index >= 0 && index < VN_PLAYLIST.length) ? index : 0;
    const vn = VN_PLAYLIST[diCurrentVnIndex];

    const avatarImg = document.getElementById('diVnAvatarImg');
    const sender = document.getElementById('diVnSender');
    const timeCur = document.getElementById('diTimeCur');

    if (avatarImg) {
        avatarImg.src = getGambarDir() + (vn.avatarImg || 'aoi_sensei.jpg');
        avatarImg.alt = vn.sender;
    }
    if (sender) sender.textContent = vn.sender;
    if (timeCur) timeCur.textContent = "0:00";

    updateWaveformProgress(0);
}

function setDiPlayingState(playing) {
    diIsPlaying = playing;
    const capsule = document.getElementById('diCapsule');
    const iconPlay = document.getElementById('diIconPlay');
    const iconPause = document.getElementById('diIconPause');

    if (capsule) {
        if (playing) capsule.classList.add('is-playing');
        else capsule.classList.remove('is-playing');
    }
    if (iconPlay && iconPause) {
        iconPlay.style.display = playing ? 'none' : 'block';
        iconPause.style.display = playing ? 'block' : 'none';
    }
}

function stopDiPlayback() {
    setDiPlayingState(false);
    if (diCurrentAudio) {
        try {
            diCurrentAudio.pause();
            diCurrentAudio.currentTime = 0;
        } catch (e) {}
        diCurrentAudio = null;
    }
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    if (diFallbackTicker) {
        clearInterval(diFallbackTicker);
        diFallbackTicker = null;
    }
    if (diZenMelody) {
        diZenMelody.stop();
        diZenMelody = null;
    }
    updateWaveformProgress(0);
}

// Menghilangkan notifikasi dengan animasi keren saat VN selesai
function dismissWithCoolExit() {
    const wrapper = document.getElementById('iosDynamicIsland');
    if (!wrapper || wrapper.classList.contains('di-hidden')) return;

    wrapper.classList.add('di-exit-cool');
    setTimeout(() => {
        wrapper.classList.remove('di-exit-cool');
        wrapper.classList.add('di-hidden');
        stopDiPlayback();
    }, 600);
}

function onVnEnded() {
    setDiPlayingState(false);
    updateWaveformProgress(100);
    const vn = VN_PLAYLIST[diCurrentVnIndex];
    const timeCur = document.getElementById('diTimeCur');
    if (timeCur) timeCur.textContent = formatDiTime(vn.duration || 8);

    if (typeof playChime === 'function') {
        playChime('bell');
    }

    // Beri jeda 850ms agar pengguna mendengar penutup, lalu hilangkan dengan animasi keren
    setTimeout(() => {
        dismissWithCoolExit();
    }, 850);
}

function playDiFallbackSpeech(vn) {
    stopDiPlayback();
    setDiPlayingState(true);

    const baseDur = vn.duration || 8;
    const adjustedDur = baseDur / diPlaybackSpeed;
    const timeCur = document.getElementById('diTimeCur');

    diZenMelody = playZenLofiMelody(adjustedDur);

    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(vn.fallbackText);
        utter.lang = vn.speechLang || 'ja-JP';
        utter.rate = 0.95 * diPlaybackSpeed;
        utter.pitch = 1.1;

        utter.onend = () => {
            onVnEnded();
        };

        utter.onerror = () => {
            onVnEnded();
        };

        window.speechSynthesis.speak(utter);
    }

    diFallbackElapsed = 0;
    diFallbackTicker = setInterval(() => {
        diFallbackElapsed += 0.25;
        if (timeCur) timeCur.textContent = formatDiTime(diFallbackElapsed * diPlaybackSpeed);
        const pct = Math.min(100, (diFallbackElapsed / adjustedDur) * 100);
        updateWaveformProgress(pct);

        if (diFallbackElapsed >= adjustedDur) {
            clearInterval(diFallbackTicker);
            diFallbackTicker = null;
            if (!('speechSynthesis' in window)) {
                onVnEnded();
            }
        }
    }, 250);
}

function startDiPlayback() {
    const vn = VN_PLAYLIST[diCurrentVnIndex];
    if (!vn) return;

    stopDiPlayback();

    const assetsDir = getAssetsDir();
    const primaryPath = assetsDir + vn.audioFile;

    const audio = new Audio(primaryPath);
    diCurrentAudio = audio;
    audio.playbackRate = diPlaybackSpeed;

    const timeCur = document.getElementById('diTimeCur');

    audio.ontimeupdate = () => {
        if (!audio.duration) return;
        const cur = audio.currentTime;
        const dur = audio.duration;
        if (timeCur) timeCur.textContent = formatDiTime(cur);
        const pct = Math.min(100, (cur / dur) * 100);
        updateWaveformProgress(pct);
    };

    audio.onended = () => {
        onVnEnded();
    };

    audio.onerror = () => {
        console.log(`[Dynamic Island] File audio "${vn.audioFile}" di folder assets/ belum ada. Menggunakan Web Speech Synthesis.`);
        diCurrentAudio = null;
        playDiFallbackSpeech(vn);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            setDiPlayingState(true);
        }).catch((err) => {
            playDiFallbackSpeech(vn);
        });
    }
}

function toggleDiPlay() {
    if (diIsPlaying) {
        stopDiPlayback();
    } else {
        startDiPlayback();
    }
}

function hideDynamicIsland() {
    dismissWithCoolExit();
}

function showDynamicIsland(customIndex = null) {
    injectDynamicIslandDOM();
    const wrapper = document.getElementById('iosDynamicIsland');
    if (!wrapper) return;

    wrapper.classList.remove('di-exit-cool');

    const idx = (customIndex !== null) 
        ? customIndex 
        : Math.floor(Math.random() * VN_PLAYLIST.length);
    
    loadVnData(idx);
    wrapper.classList.remove('di-hidden');

    if (typeof playChime === 'function') {
        playChime('drop');
    }

    // Auto dismiss setelah 20 detik jika pengguna tidak memutar
    if (diDismissTimeout) clearTimeout(diDismissTimeout);
    diDismissTimeout = setTimeout(() => {
        if (!diIsPlaying) {
            dismissWithCoolExit();
        }
    }, 20000);
}

function bindDynamicIslandEvents() {
    const playBtn = document.getElementById('diPlayBtn');
    const closeBtn = document.getElementById('diCloseBtn');
    const sliderTrack = document.getElementById('diSliderTrack');

    closeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        dismissWithCoolExit();
    });

    playBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDiPlay();
    });

    sliderTrack?.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = sliderTrack.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const pct = Math.max(0, Math.min(1, clickX / width));

        if (diCurrentAudio && diCurrentAudio.duration) {
            diCurrentAudio.currentTime = pct * diCurrentAudio.duration;
            updateWaveformProgress(pct * 100);
        } else {
            const vn = VN_PLAYLIST[diCurrentVnIndex];
            const dur = (vn && vn.duration) ? vn.duration : 8;
            diFallbackElapsed = pct * (dur / diPlaybackSpeed);
            const timeCur = document.getElementById('diTimeCur');
            if (timeCur) timeCur.textContent = formatDiTime(diFallbackElapsed * diPlaybackSpeed);
            updateWaveformProgress(pct * 100);
        }
    });
}

// Mekanisme kemunculan acak & batas maksimal 3 kali per masuk halaman
function initDynamicIslandScheduler() {
    injectDynamicIslandDOM();

    // Fungsi pemicu kemunculan VN berikutnya
    function triggerNextScheduledVN() {
        if (pageVnTriggerCount >= MAX_VN_PER_PAGE) {
            console.log(`[Dynamic Island] Batas maksimal ${MAX_VN_PER_PAGE} VN untuk halaman ini telah tercapai. Silakan refresh halaman untuk memunculkan kembali.`);
            return;
        }

        // Tampilkan VN
        pageVnTriggerCount++;
        showDynamicIsland();

        // Jadwalkan kemunculan berikutnya jika belum mencapai batas 3 kali
        if (pageVnTriggerCount < MAX_VN_PER_PAGE) {
            // Waktu tunggu acak menuju VN ke-2 dan ke-3 (antara 90 - 180 detik)
            const nextInterval = 90000 + Math.random() * 90000;
            setTimeout(triggerNextScheduledVN, nextInterval);
        }
    }

    // Kemunculan pertama kali: acak antara 25 - 45 detik setelah halaman dimuat
    const initialDelay = 25000 + Math.random() * 20000;
    setTimeout(triggerNextScheduledVN, initialDelay);
}

// Global hooks untuk pengetesan manual di console
window.triggerDynamicIslandVN = (index = null) => {
    showDynamicIsland(index);
};
window.testDynamicIsland = () => {
    showDynamicIsland(0);
};

// 17. INITIALIZATION ON DOM LOAD
window.addEventListener("DOMContentLoaded", () => {
    initSakuraEngine();
    setupMobileAppHub();
    setupDailyQuests();
    setupFastKanaRadar();
    setupKanjiRadarWidget();

    setupDailyKanji();
    setupSoundboard();
    setupPhrasebook();
    setupWritingCanvas();
    setupNameGenerator();
    setupZenTimer();
    setupInfoProfile();
    setupStudyPage();

    // Inisialisasi Dynamic Island Voice Note
    initDynamicIslandScheduler();

    if (document.getElementById("questionKana")) {
        updateQuizStats();
        loadQuestion();
    }

    document.getElementById("answerInput")?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") checkAnswer();
    });

    document.getElementById("mottoSpeaker")?.addEventListener("click", () => {
        speakJapanese("継続は力なり。");
    });
});