/* ==========================================================================
   NIHONGO FOURNITY - CORE JAPANESE LEARNING ENGINE & ATMOSPHERE
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
        } else if (type === 'legendary') {
            // Mythic Arpeggio Fanfare (C5 -> E5 -> G5 -> B5 -> C6)
            const notes = [523.25, 659.25, 783.99, 987.77, 1046.5];
            notes.forEach((freq, idx) => {
                const subOsc = audioCtx.createOscillator();
                const subGain = audioCtx.createGain();
                subOsc.connect(subGain);
                subGain.connect(audioCtx.destination);
                subOsc.type = 'triangle';
                const startTime = now + idx * 0.08;
                subOsc.frequency.setValueAtTime(freq, startTime);
                subGain.gain.setValueAtTime(0.25, startTime);
                subGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);
                subOsc.start(startTime);
                subOsc.stop(startTime + 0.8);
            });
            return;
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
window.showToast = showToast;

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
                if (typeof window.recordStudyActivity === 'function') {
                    window.recordStudyActivity('soundboard', k.kana);
                }
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
            card.querySelector(".listen-btn")?.addEventListener("click", () => {
                speakJapanese(p.jp);
                if (typeof window.recordStudyActivity === 'function') {
                    window.recordStudyActivity('kotoba', p.jp);
                }
            });
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
            const wasLearned = learned.has(kana);
            wasLearned ? learned.delete(kana) : learned.add(kana);
            localStorage.setItem(storageKey, JSON.stringify([...learned]));
            updateProgress();
            speakJapanese(kana);
            if (!wasLearned && typeof window.recordStudyActivity === 'function') {
                window.recordStudyActivity('kana', kana);
            }
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

// ==========================================================================
// 15. PHOTO CARDS DATABASE & RARITY SYSTEM (EDISI UMUM FOURNITY)
// 12 Edisi Koleksi Kartu Jepang dengan Penamaan & Nilai Filosofi Umum
// Rarity Tiers: Rare (R), Ultra Rare (UR), Lagend (LG)
// ==========================================================================
const CARDS_DATABASE = [
    {
        id: "card_lagend_01",
        aliasIds: ["card_aoi_legend"],
        name: "Lagend Card · Vol. 01",
        kanjiName: "神話の章 · 第一号",
        rarity: "legendary",
        image: "gambar/fotocard/lagend/card1.png",
        kanjiSeal: "神話"
    },
    {
        id: "card_lagend_02",
        aliasIds: ["card_yozakura_legend"],
        name: "Lagend Card · Vol. 02",
        kanjiName: "極光の章 · 第二号",
        rarity: "legendary",
        image: "gambar/fotocard/lagend/card2.png",
        kanjiSeal: "極光"
    },
    {
        id: "card_lagend_03",
        aliasIds: ["card_katana_legend"],
        name: "Lagend Card · Vol. 03",
        kanjiName: "名刀の章 · 第三号",
        rarity: "legendary",
        image: "gambar/fotocard/lagend/card3.png",
        kanjiSeal: "名刀"
    },
    {
        id: "card_ur_01",
        aliasIds: ["card_miko_ur"],
        name: "Ultra Rare Card · Vol. 01",
        kanjiName: "幽玄の章 · 第一号",
        rarity: "ultra_rare",
        image: "gambar/fotocard/ultra_rare/card1.png",
        kanjiSeal: "幽玄"
    },
    {
        id: "card_ur_02",
        aliasIds: ["card_kinkakuji_ur"],
        name: "Ultra Rare Card · Vol. 02",
        kanjiName: "金閣の章 · 第二号",
        rarity: "ultra_rare",
        image: "gambar/fotocard/ultra_rare/card2.png",
        kanjiSeal: "金閣"
    },
    {
        id: "card_ur_03",
        aliasIds: ["card_hanafubuki_ur"],
        name: "Ultra Rare Card · Vol. 03",
        kanjiName: "雅美の章 · 第三号",
        rarity: "ultra_rare",
        image: "gambar/fotocard/ultra_rare/card3.png",
        kanjiSeal: "雅美"
    },
    {
        id: "card_ur_04",
        aliasIds: ["card_tokyo_ur"],
        name: "Ultra Rare Card · Vol. 04",
        kanjiName: "明星の章 · 第四号",
        rarity: "ultra_rare",
        image: "gambar/fotocard/ultra_rare/card4.png",
        kanjiSeal: "明星"
    },
    {
        id: "card_rare_01",
        aliasIds: ["card_yukata_rare"],
        name: "Rare Card · Vol. 01",
        kanjiName: "風雅の章 · 第一号",
        rarity: "rare",
        image: "gambar/fotocard/rare/card1.png",
        kanjiSeal: "風雅"
    },
    {
        id: "card_rare_02",
        aliasIds: ["card_fuji_sakura_rare"],
        name: "Rare Card · Vol. 02",
        kanjiName: "清流の章 · 第二号",
        rarity: "rare",
        image: "gambar/fotocard/rare/card2.png",
        kanjiSeal: "清流"
    },
    {
        id: "card_rare_03",
        aliasIds: ["card_omamori_rare"],
        name: "Rare Card · Vol. 03",
        kanjiName: "御守の章 · 第三号",
        rarity: "rare",
        image: "gambar/fotocard/rare/card3.png",
        kanjiSeal: "御守"
    },
    {
        id: "card_rare_04",
        aliasIds: ["card_torii_rare"],
        name: "Rare Card · Vol. 04",
        kanjiName: "吉祥の章 · 第四号",
        rarity: "rare",
        image: "gambar/fotocard/rare/card4.png",
        kanjiSeal: "吉祥"
    },
    {
        id: "card_rare_05",
        aliasIds: ["card_shibuya_rare"],
        name: "Rare Card · Vol. 05",
        kanjiName: "光彩の章 · 第五号",
        rarity: "rare",
        image: "gambar/fotocard/rare/card5.png",
        kanjiSeal: "光彩"
    }
];

function findBaseCard(idOrAlias) {
    if (!idOrAlias) return CARDS_DATABASE[0];
    return CARDS_DATABASE.find(c => c.id === idOrAlias || (c.aliasIds && c.aliasIds.includes(idOrAlias))) || CARDS_DATABASE[0];
}

// Koleksi variasi kutipan motivasi & deskripsi umum Jepang
const UNIVERSAL_CARD_VARIANTS = [
    {
        kanjiQuote: "「継続は力なり」",
        romajiQuote: "Keizoku wa chikara nari.",
        idQuote: "Ketekunan dan konsistensi adalah kunci kekuatan sejati.",
        desc: "Kartu koleksi resmi edisi ketekunan. Melambangkan dedikasi tanpa henti dalam menguasai bahasa dan budaya Jepang langkah demi langkah.",
        versionName: "Ver. 1.0 · First Print"
    },
    {
        kanjiQuote: "「一期一会」",
        romajiQuote: "Ichigo ichie.",
        idQuote: "Setiap momen dan pertemuan adalah anugerah berharga tak tergantikan.",
        desc: "Kartu koleksi edisi kenangan berharga. Mengabadikan setiap jengkal proses belajar dan kehangatan kelas bersama Sensei.",
        versionName: "Ver. 1.1 · Special Print"
    },
    {
        kanjiQuote: "「初心忘るべからず」",
        romajiQuote: "Shoshin wasurubekarazu.",
        idQuote: "Jangan pernah melupakan niat tulus dan semangat awal saat memulai.",
        desc: "Kartu koleksi edisi tekad baja. Mengingatkan agar kobaran semangat hari pertama selalu membimbing langkah menuju masa depan.",
        versionName: "Ver. 1.2 · Limited Edition"
    },
    {
        kanjiQuote: "「千里の道も一歩から」",
        romajiQuote: "Senri no michi mo ippo kara.",
        idQuote: "Perjalanan seribu mil selalu dimulai dari satu langkah kecil.",
        desc: "Kartu koleksi edisi langkah awal. Mengapresiasi keberanian melangkah dari pengenalan huruf kana hingga fasih berkomunikasi.",
        versionName: "Ver. 2.0 · Collector Edition"
    },
    {
        kanjiQuote: "「七転び八起き」",
        romajiQuote: "Nanakorobi yaoki.",
        idQuote: "Tujuh kali terjatuh, delapan kali bangkit berdiri kembali.",
        desc: "Kartu koleksi edisi daya juang. Lambang kegigihan pembelajar sejati yang pantang mundur menghadapi rintangan kanji dan tata bahasa.",
        versionName: "Ver. 2.1 · Mythic Foil"
    },
    {
        kanjiQuote: "「日進月歩」",
        romajiQuote: "Nisshingeppo.",
        idQuote: "Kemajuan yang pesat dan berkembang setiap hari tiada henti.",
        desc: "Kartu koleksi edisi akselerasi. Diberikan sebagai bukti peningkatan pemahaman bahasa Jepang yang kian tajam dan matang.",
        versionName: "Ver. 1.0 · Prime Batch"
    },
    {
        kanjiQuote: "「日日是好日」",
        romajiQuote: "Nichinichi kore koujitsu.",
        idQuote: "Setiap hari yang dijalani adalah hari yang baik dan berharga.",
        desc: "Kartu koleksi edisi kedamaian batin. Merayakan indahnya proses menikmati pembelajaran budaya Jepang dengan hati tenang.",
        versionName: "Ver. 1.3 · Silver Edition"
    },
    {
        kanjiQuote: "「温故知新」",
        romajiQuote: "Onko chishin.",
        idQuote: "Belajar dari kearifan masa lalu untuk melangkah ke masa depan.",
        desc: "Kartu koleksi edisi wawasan mendalam. Menjembatani keagungan sejarah tradisional Jepang menuju komunikasi global modern.",
        versionName: "Ver. 2.2 · Gold Edition"
    },
    {
        kanjiQuote: "「明日は明日の風が吹く」",
        romajiQuote: "Ashita wa ashita no kaze ga fuku.",
        idQuote: "Hari esok akan membawa angin dan harapan baru yang membahagiakan.",
        desc: "Kartu koleksi edisi optimisme. Simbol keyakinan bahwa impian menjejakkan kaki di Jepang akan segera menjadi kenyataan.",
        versionName: "Ver. 1.4 · Rainbow Mint"
    },
    {
        kanjiQuote: "「一意専心」",
        romajiQuote: "Ichii senshin.",
        idQuote: "Memusatkan seluruh jiwa dan raga demi menggapai impian mulia.",
        desc: "Kartu koleksi edisi fokus utama. Bukti dedikasi tulus seorang pembelajar yang bertekad mencapai kelulusan tingkat tertinggi.",
        versionName: "Ver. 3.0 · Master Edition"
    }
];

function generateCardSerial(rarity) {
    const prefix = rarity === "legendary" ? "FN-LG" : (rarity === "ultra_rare" ? "FN-UR" : "FN-R");
    const num = Math.floor(1000 + Math.random() * 9000);
    return `#${prefix}-${num}`;
}

function mintCardInstance(baseCardOrId, variantIdx = null) {
    const base = typeof baseCardOrId === "string" ? findBaseCard(baseCardOrId) : baseCardOrId;
    const vIndex = variantIdx !== null 
        ? (variantIdx % UNIVERSAL_CARD_VARIANTS.length)
        : Math.floor(Math.random() * UNIVERSAL_CARD_VARIANTS.length);
    const variant = UNIVERSAL_CARD_VARIANTS[vIndex];

    return {
        instanceId: "inst_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
        cardId: base.id,
        name: base.name,
        rarity: base.rarity,
        image: base.image,
        kanjiSeal: base.kanjiSeal || "極",
        serialNo: generateCardSerial(base.rarity),
        versionCode: variant.versionName,
        kanjiQuote: variant.kanjiQuote,
        romajiQuote: variant.romajiQuote,
        idQuote: variant.idQuote,
        desc: variant.desc,
        mintDate: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
    };
}

// Progression Ladder (Level 1 to 8)
const PROGRESSION_RANKS = [
    { level: 1, minExp: 0,    maxExp: 150,  title: "見習い MINARAI",  badge: "🌱", sub: "Pemula Gakusei" },
    { level: 2, minExp: 150,  maxExp: 350,  title: "門下生 MONKASEI", badge: "🥋", sub: "Murid Dojo" },
    { level: 3, minExp: 350,  maxExp: 650,  title: "足軽 ASHIGARU",   badge: "🏹", sub: "Pejuang Tangkas" },
    { level: 4, minExp: 650,  maxExp: 1050, title: "武士 BUSHI",      badge: "⚔️", sub: "Pendekar Sejati" },
    { level: 5, minExp: 1050, maxExp: 1600, title: "侍 SAMURAI",    badge: "🗡️", sub: "Kesatria Kehormatan" },
    { level: 6, minExp: 1600, maxExp: 2400, title: "旗本 HATAMOTO",   badge: "🛡️", sub: "Pengawal Elit" },
    { level: 7, minExp: 2400, maxExp: 3500, title: "師範 SHIHAN",     badge: "🌸", sub: "Guru Besar" },
    { level: 8, minExp: 3500, maxExp: 99999,title: "将軍 SHOGUN",     badge: "👑", sub: "Panglima Tertinggi" }
];

function getRankData(exp) {
    for (let i = PROGRESSION_RANKS.length - 1; i >= 0; i--) {
        if (exp >= PROGRESSION_RANKS[i].minExp) {
            return PROGRESSION_RANKS[i];
        }
    }
    return PROGRESSION_RANKS[0];
}

// 1. REALTIME MULTI-MODULE EXP AGGREGATOR
function calculateTotalRealtimeExp() {
    let exp = 80; // Base starter EXP

    // 1. Hiragana Learned (10 XP each)
    try {
        const hiraUpper = JSON.parse(localStorage.getItem("nihongoLearned_HIRAGANA") || "[]");
        const hiraLower = JSON.parse(localStorage.getItem("nihongoLearned_hiragana") || "[]");
        const uniqueHira = new Set([...hiraUpper, ...hiraLower]);
        exp += uniqueHira.size * 10;
    } catch(e) {}

    // 2. Katakana Learned (10 XP each)
    try {
        const kataUpper = JSON.parse(localStorage.getItem("nihongoLearned_KATAKANA") || "[]");
        const kataLower = JSON.parse(localStorage.getItem("nihongoLearned_katakana") || "[]");
        const uniqueKata = new Set([...kataUpper, ...kataLower]);
        exp += uniqueKata.size * 10;
    } catch(e) {}

    // 3. Kanji Memorized (20 XP each)
    try {
        const kanjiMem = JSON.parse(localStorage.getItem("trinity_memorized_kanji") || "[]");
        exp += kanjiMem.length * 20;
    } catch(e) {}

    // 4. Kotoba Phrases Studied (8 XP each)
    try {
        const kotobaStudied = JSON.parse(localStorage.getItem("nihongoLearned_kotoba") || "[]");
        exp += kotobaStudied.length * 8;
    } catch(e) {}

    // 5. Soundboard Listened (4 XP each)
    try {
        const soundListened = JSON.parse(localStorage.getItem("nihongoSoundboard_listened") || "[]");
        exp += soundListened.length * 4;
    } catch(e) {}

    // 6. Kuis Reflex Best Score (3 XP per point)
    try {
        const best = Number(localStorage.getItem("nihongoBestScore") || 0);
        exp += best * 3;
    } catch(e) {}

    // 7. Delta EXP from multiplayer / chat activities
    try {
        const storedTrinExp = Number(localStorage.getItem("trinity_exp") || 80);
        if (storedTrinExp > 80) {
            exp += (storedTrinExp - 80);
        }
    } catch(e) {}

    // 8. Daily Check-in Claimed EXP
    try {
        const checkinExp = Number(localStorage.getItem("fournity_checkin_exp") || 0);
        exp += checkinExp;
    } catch(e) {}

    // 9. Quests Bonus EXP
    try {
        const questExp = Number(localStorage.getItem("fournity_quest_bonus_exp") || 0);
        exp += questExp;
    } catch(e) {}

    // 10. Photo Card Collection Prestige (25 XP each card instance)
    try {
        const instances = JSON.parse(localStorage.getItem("fournity_card_instances_v3") || "[]");
        exp += (Array.isArray(instances) ? instances.length : 1) * 25;
    } catch(e) {}

    return Math.max(80, exp);
}

// Helper Penanggalan Lokal Standar Anti-Bug (Reset tepat pukul 00:00 tengah malam lokal)
function getLocalDateString(dateObj = new Date()) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
window.getLocalDateString = getLocalDateString;

function getDaysDifference(dateStr1, dateStr2) {
    if (!dateStr1 || !dateStr2) return 999;
    const parts1 = dateStr1.split('-').map(Number);
    const parts2 = dateStr2.split('-').map(Number);
    if (parts1.length < 3 || parts2.length < 3) return 999;
    const utc1 = Date.UTC(parts1[0], parts1[1] - 1, parts1[2]);
    const utc2 = Date.UTC(parts2[0], parts2[1] - 1, parts2[2]);
    return Math.round((utc2 - utc1) / (1000 * 60 * 60 * 24));
}
window.getDaysDifference = getDaysDifference;

// Global Activity Recorder across all modules
window.recordStudyActivity = function(type, payload) {
    const todayStr = getLocalDateString();
    const actKey = `fournity_activity_${todayStr}`;
    let act = JSON.parse(localStorage.getItem(actKey) || '{"kana":0,"kotoba":0,"radar":0,"kanji":0,"chat":0,"checkin":0}');

    if (type === 'kana') act.kana = (act.kana || 0) + 1;
    if (type === 'kotoba') act.kotoba = (act.kotoba || 0) + 1;
    if (type === 'soundboard') act.kotoba = (act.kotoba || 0) + 1;
    if (type === 'radar') act.radar = (act.radar || 0) + 1;
    if (type === 'kanji') act.kanji = (act.kanji || 0) + 1;
    if (type === 'chat') act.chat = (act.chat || 0) + 1;
    if (type === 'checkin') act.checkin = 1;

    localStorage.setItem(actKey, JSON.stringify(act));

    // Also update module-specific persistent storage
    if (type === 'kotoba' && typeof payload === 'string') {
        try {
            let kotobaList = JSON.parse(localStorage.getItem("nihongoLearned_kotoba") || "[]");
            if (!kotobaList.includes(payload)) {
                kotobaList.push(payload);
                localStorage.setItem("nihongoLearned_kotoba", JSON.stringify(kotobaList));
            }
        } catch(e) {}
    }
    if (type === 'soundboard' && typeof payload === 'string') {
        try {
            let sndList = JSON.parse(localStorage.getItem("nihongoSoundboard_listened") || "[]");
            if (!sndList.includes(payload)) {
                sndList.push(payload);
                localStorage.setItem("nihongoSoundboard_listened", JSON.stringify(sndList));
            }
        } catch(e) {}
    }

    // Refresh UI & Quests
    if (typeof refreshPass === 'function') refreshPass();
    if (typeof checkAndUpdateDailyQuests === 'function') checkAndUpdateDailyQuests();

    window.dispatchEvent(new CustomEvent('studyProgressUpdated'));
};

// A.0 SINKRONISASI FOTO PROFIL UTAMA DI POJOK KANAN ATAS (DENGAN EFEK RAINBOW LAGEND)
function syncMainTopHeaderProfile() {
    const topAvatar = document.getElementById("topAvatar");
    const topIcon = document.getElementById("topIcon");
    const topText = document.getElementById("topLoginText");
    const topPill = document.getElementById("topLoginToggle");
    const topWrap = document.getElementById("topAvatarWrap");

    if (!topAvatar && !topPill) return;

    const hasAuthUid = !!localStorage.getItem("nihongoChatUid");
    let user = localStorage.getItem("nihongoChatUser");

    const customPhoto = localStorage.getItem("fournity_custom_avatar");
    const cardAvatar = localStorage.getItem("fournity_user_avatar");
    const userStoredAvatar = user ? localStorage.getItem(`avatar_${user}`) : null;
    const profileFromDb = (window.userProfiles && user && window.userProfiles[user]) ? window.userProfiles[user].photoBase64 : null;
    const equippedAvatar = cardAvatar || customPhoto || userStoredAvatar || profileFromDb || window.newPhotoBase64;
    const equippedRarity = localStorage.getItem("fournity_avatar_rarity") || (user ? localStorage.getItem(`avatar_rarity_${user}`) : null);

    // Update Text Username di Header
    if (topText) {
        if (user) {
            topText.textContent = user;
        } else {
            topText.textContent = "Login";
        }
    }

    // Tentukan URL Foto yang Benar
    const isPages = window.location.pathname.includes('/pages/');
    const defaultIcon = isPages ? '../gambar/icon.png' : 'gambar/icon.png';
    let finalPhoto = equippedAvatar || (user ? defaultIcon : null);

    if (finalPhoto && topAvatar) {
        let src = finalPhoto;
        if (!src.startsWith('data:') && !src.startsWith('http')) {
            if (isPages && !src.startsWith('../')) {
                src = '../' + src;
            } else if (!isPages && src.startsWith('../')) {
                src = src.replace('../', '');
            }
        }

        topAvatar.onerror = function() {
            this.onerror = null;
            this.src = defaultIcon;
        };

        topAvatar.src = src;
        topAvatar.style.display = "block";
        if (topIcon) topIcon.style.display = "none";
    } else if (!user && !equippedAvatar) {
        if (topAvatar) topAvatar.style.display = "none";
        if (topIcon) topIcon.style.display = "inline-block";
    }

    // Sinkronkan juga ke avatar hero pass jika elemen ada
    const heroPassAvatar = document.getElementById("heroPassAvatar");
    if (heroPassAvatar && finalPhoto) {
        heroPassAvatar.onerror = function() {
            this.onerror = null;
            this.src = defaultIcon;
        };
        heroPassAvatar.src = topAvatar ? topAvatar.src : finalPhoto;
    }

    // Terapkan Efek Border Rarity (Warna-Warni untuk Lagend)
    const targets = [topWrap, topPill, topAvatar].filter(Boolean);
    targets.forEach(el => {
        el.classList.remove("is-vip-legend", "is-avatar-ur", "is-avatar-rare");
    });

    if (equippedRarity === "legendary") {
        if (topWrap) topWrap.classList.add("is-vip-legend");
        if (topPill) topPill.classList.add("is-vip-legend");
        if (topAvatar) topAvatar.classList.add("is-vip-legend");
    } else if (equippedRarity === "ultra_rare") {
        if (topWrap) topWrap.classList.add("is-avatar-ur");
        if (topPill) topPill.classList.add("is-avatar-ur");
        if (topAvatar) topAvatar.classList.add("is-avatar-ur");
    } else if (equippedRarity === "rare") {
        if (topWrap) topWrap.classList.add("is-avatar-rare");
        if (topPill) topPill.classList.add("is-avatar-rare");
        if (topAvatar) topAvatar.classList.add("is-avatar-rare");
    }
}
window.syncMainTopHeaderProfile = syncMainTopHeaderProfile;

// A. STUDENT PASS & REALTIME EXP SYSTEM
function setupMobileAppHub() {
    syncMainTopHeaderProfile();

    const userNameEl = document.getElementById("heroPassUserName");
    const rankEl = document.getElementById("heroPassRank");
    const streakEl = document.getElementById("heroPassStreak");
    const expValEl = document.getElementById("heroExpVal");
    const expFillEl = document.getElementById("heroExpFill");
    const avatarEl = document.getElementById("heroPassAvatar");
    const heroCheckinStatus = document.getElementById("heroCheckinStatus");
    const heroAlbumCount = document.getElementById("heroAlbumCount");

    if (!userNameEl) return;

    window.refreshPass = function() {
        syncMainTopHeaderProfile();

        const hasAuthUid = !!localStorage.getItem("nihongoChatUid");
        const user = hasAuthUid ? localStorage.getItem("nihongoChatUser") : null;
        if (user) {
            userNameEl.textContent = `Okaeri, ${user}! 🌸`;
        } else {
            userNameEl.textContent = "Konnichiwa, Gakusei! 🌸";
        }

        // Profile Avatar Sync with Rarity Effect
        const customPhoto = hasAuthUid ? localStorage.getItem("fournity_custom_avatar") : null;
        const cardAvatar = hasAuthUid ? localStorage.getItem("fournity_user_avatar") : null;
        const userStoredAvatar = (hasAuthUid && user) ? localStorage.getItem(`avatar_${user}`) : null;
        const profileFromDb = (hasAuthUid && window.userProfiles && user && window.userProfiles[user]) ? window.userProfiles[user].photoBase64 : null;
        const equippedAvatar = hasAuthUid ? (cardAvatar || customPhoto || userStoredAvatar || profileFromDb || window.newPhotoBase64) : null;
        const equippedRarity = hasAuthUid ? (localStorage.getItem("fournity_avatar_rarity") || (user ? localStorage.getItem(`avatar_rarity_${user}`) : null)) : null;
        const passWrapper = document.getElementById("passAvatarWrapper") || (avatarEl ? avatarEl.parentElement : null);

        if (avatarEl) {
            const isPages = window.location.pathname.includes('/pages/');
            const defaultIcon = isPages ? '../gambar/icon.png' : 'gambar/icon.png';
            let finalSrc = equippedAvatar || defaultIcon;
            if (!finalSrc.startsWith('data:') && !finalSrc.startsWith('http')) {
                if (isPages && !finalSrc.startsWith('../')) {
                    finalSrc = '../' + finalSrc;
                } else if (!isPages && finalSrc.startsWith('../')) {
                    finalSrc = finalSrc.replace('../', '');
                }
            }
            avatarEl.onerror = function() {
                this.onerror = null;
                this.src = defaultIcon;
            };
            avatarEl.src = finalSrc;
        }

        if (passWrapper) {
            passWrapper.classList.remove("is-vip-legend", "is-avatar-ur", "is-avatar-rare");
            const existingVipBadge = passWrapper.querySelector(".pass-vip-badge");
            if (existingVipBadge) existingVipBadge.remove();

            if (equippedRarity === "legendary") {
                passWrapper.classList.add("is-vip-legend");
                const vipBadge = document.createElement("span");
                vipBadge.className = "pass-vip-badge legend-vip";
                vipBadge.innerHTML = `👑 LAGEND VIP`;
                passWrapper.appendChild(vipBadge);
            } else if (equippedRarity === "ultra_rare") {
                passWrapper.classList.add("is-avatar-ur");
                const urBadge = document.createElement("span");
                urBadge.className = "pass-vip-badge ur-vip";
                urBadge.innerHTML = `💜 UR`;
                passWrapper.appendChild(urBadge);
            } else if (equippedRarity === "rare") {
                passWrapper.classList.add("is-avatar-rare");
                const rareBadge = document.createElement("span");
                rareBadge.className = "pass-vip-badge rare-vip";
                rareBadge.innerHTML = `💎 RARE`;
                passWrapper.appendChild(rareBadge);
            }
        }

        // Realtime Aggregated EXP calculation from ALL modules
        const currentExp = calculateTotalRealtimeExp();
        const rank = getRankData(currentExp);

        if (rankEl) rankEl.textContent = `${rank.badge} ${rank.title} · LV.${rank.level}`;
        if (expValEl) expValEl.textContent = `${currentExp} / ${rank.maxExp} XP`;
        if (expFillEl) {
            const expInLevel = currentExp - rank.minExp;
            const levelRange = rank.maxExp - rank.minExp;
            const pct = Math.min(100, Math.max(5, Math.round((expInLevel / levelRange) * 100)));
            expFillEl.style.width = `${pct}%`;
        }

        // Checkin Status & Streak
        try {
            const checkinData = JSON.parse(localStorage.getItem("fournity_checkin_v2") || '{"streak":0,"lastDate":""}');
            const todayStr = getLocalDateString();
            const isClaimedToday = Boolean(checkinData.lastDate && checkinData.lastDate === todayStr);

            let activeStreak = Number(checkinData.streak) || 0;
            if (checkinData.lastDate && checkinData.lastDate !== todayStr) {
                const diff = getDaysDifference(checkinData.lastDate, todayStr);
                if (diff > 1) {
                    activeStreak = 0;
                }
            }

            if (streakEl) {
                const streakSpan = streakEl.querySelector("span");
                if (streakSpan) streakSpan.textContent = `${activeStreak} Hari`;
            }

            const heroBtn = document.getElementById("heroCheckinBtn");
            const quickBtn = document.getElementById("quickCheckinBtn");

            if (heroCheckinStatus) {
                heroCheckinStatus.textContent = isClaimedToday ? "✓ Sudah Hari Ini" : "Klaim XP & Kartu";
            }
            if (heroBtn) {
                heroBtn.classList.toggle("is-claimed-today", isClaimedToday);
            }
            if (quickBtn) {
                quickBtn.classList.toggle("is-claimed-today", isClaimedToday);
                const quickText = quickBtn.querySelector("span:not(.chip-icon)");
                if (quickText) {
                    quickText.textContent = isClaimedToday ? "Check-In ✓" : "Check-In";
                }
            }
        } catch(e) {}

        // Card Collection Count
        try {
            const instances = getOwnedCardInstances();
            if (heroAlbumCount) {
                heroAlbumCount.textContent = `${instances.length} Kartu Dimiliki`;
            }
            const showcaseCount = document.querySelector("#showcaseOpenAlbumBtn span");
            if (showcaseCount) showcaseCount.textContent = `${instances.length} Kartu`;
        } catch(e) {}
    };

    window.refreshPass();
    window.addEventListener("storage", window.refreshPass);
    window.addEventListener("studyProgressUpdated", window.refreshPass);
    window.addEventListener("profilesUpdated", window.refreshPass);

    // Hero buttons click actions
    document.getElementById("heroCheckinBtn")?.addEventListener("click", () => {
        openCheckinModal();
    });
    document.getElementById("heroAlbumBtn")?.addEventListener("click", () => {
        openCardAlbumModal();
    });
    document.getElementById("quickCheckinBtn")?.addEventListener("click", () => {
        openCheckinModal();
    });
    document.getElementById("quickCardAlbumBtn")?.addEventListener("click", () => {
        openCardAlbumModal();
    });
    document.getElementById("showcaseOpenAlbumBtn")?.addEventListener("click", () => {
        openCardAlbumModal();
    });

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

// B. AUTOMATED DAILY MASTERY QUESTS TRACKER (ANTI-CHEAT)
function setupDailyQuests() {
    const progressText = document.getElementById("questProgressText");
    const questItem1 = document.getElementById("questItem1");
    const questItem2 = document.getElementById("questItem2");
    const questItem3 = document.getElementById("questItem3");
    const questItem4 = document.getElementById("questItem4");
    const allQuestsBanner = document.getElementById("allQuestsBanner");

    if (!progressText || !questItem1) return;

    window.checkAndUpdateDailyQuests = function() {
        const todayStr = getLocalDateString();
        const actKey = `fournity_activity_${todayStr}`;
        const act = JSON.parse(localStorage.getItem(actKey) || '{"kana":0,"kotoba":0,"radar":0,"kanji":0,"chat":0,"checkin":0}');

        // Checkin status from checkin store
        try {
            const checkinData = JSON.parse(localStorage.getItem("fournity_checkin_v2") || '{}');
            if (checkinData.lastDate === todayStr) act.checkin = 1;
        } catch(e) {}

        const questStoreKey = `fournity_quests_cleared_${todayStr}`;
        let questsCleared = JSON.parse(localStorage.getItem(questStoreKey) || '{"q1":false,"q2":false,"q3":false,"q4":false,"allBonus":false}');

        // 1. Quest 1: 3 Kana / Kotoba
        const totalKanaKotoba = (act.kana || 0) + (act.kotoba || 0);
        const q1Done = totalKanaKotoba >= 3;
        const step1El = document.getElementById("questStep1");
        const tag1El = document.getElementById("questTag1");
        const check1El = document.getElementById("questCheck1");
        if (step1El) step1El.textContent = `${Math.min(3, totalKanaKotoba)} / 3 Materi`;
        if (questItem1) questItem1.classList.toggle("is-completed", q1Done);
        if (tag1El) tag1El.textContent = q1Done ? "Selesai ✓" : "Belum";
        if (check1El) check1El.textContent = q1Done ? "✓" : "⏳";

        if (q1Done && !questsCleared.q1) {
            questsCleared.q1 = true;
            playChime('success');
            showToast("🎯 Misi 1 Selesai Otomatis: Pelajari Kana & Kotoba (+35 XP)!");
            let qBonus = Number(localStorage.getItem("fournity_quest_bonus_exp") || 0);
            localStorage.setItem("fournity_quest_bonus_exp", qBonus + 35);
        }

        // 2. Quest 2: 3 Refleks Radar Benar
        const totalRadar = act.radar || 0;
        const q2Done = totalRadar >= 3;
        const step2El = document.getElementById("questStep2");
        const tag2El = document.getElementById("questTag2");
        const check2El = document.getElementById("questCheck2");
        if (step2El) step2El.textContent = `${Math.min(3, totalRadar)} / 3 Benar`;
        if (questItem2) questItem2.classList.toggle("is-completed", q2Done);
        if (tag2El) tag2El.textContent = q2Done ? "Selesai ✓" : "Belum";
        if (check2El) check2El.textContent = q2Done ? "✓" : "⏳";

        if (q2Done && !questsCleared.q2) {
            questsCleared.q2 = true;
            playChime('success');
            showToast("🎯 Misi 2 Selesai Otomatis: Refleks Radar Beranda (+40 XP)!");
            let qBonus = Number(localStorage.getItem("fournity_quest_bonus_exp") || 0);
            localStorage.setItem("fournity_quest_bonus_exp", qBonus + 40);
        }

        // 3. Quest 3: 1 Kanji Hafal atau Sapa Sensei
        const totalKanjiChat = (act.kanji || 0) + (act.chat || 0);
        const q3Done = totalKanjiChat >= 1;
        const step3El = document.getElementById("questStep3");
        const tag3El = document.getElementById("questTag3");
        const check3El = document.getElementById("questCheck3");
        if (step3El) step3El.textContent = q3Done ? "1 / 1 Target" : "0 / 1 Target";
        if (questItem3) questItem3.classList.toggle("is-completed", q3Done);
        if (tag3El) tag3El.textContent = q3Done ? "Selesai ✓" : "Belum";
        if (check3El) check3El.textContent = q3Done ? "✓" : "⏳";

        if (q3Done && !questsCleared.q3) {
            questsCleared.q3 = true;
            playChime('success');
            showToast("🎯 Misi 3 Selesai Otomatis: Kanji Radar / Chat Sensei (+45 XP)!");
            let qBonus = Number(localStorage.getItem("fournity_quest_bonus_exp") || 0);
            localStorage.setItem("fournity_quest_bonus_exp", qBonus + 45);
        }

        // 4. Quest 4: Check-In Hari Ini
        const q4Done = (act.checkin || 0) >= 1;
        const step4El = document.getElementById("questStep4");
        const tag4El = document.getElementById("questTag4");
        const check4El = document.getElementById("questCheck4");
        if (step4El) step4El.textContent = q4Done ? "1 / 1 Hari" : "0 / 1 Hari";
        if (questItem4) questItem4.classList.toggle("is-completed", q4Done);
        if (tag4El) tag4El.textContent = q4Done ? "Selesai ✓" : "Belum";
        if (check4El) check4El.textContent = q4Done ? "✓" : "⏳";

        if (q4Done && !questsCleared.q4) {
            questsCleared.q4 = true;
            playChime('success');
            showToast("🎯 Misi 4 Selesai Otomatis: Check-In Harian (+30 XP)!");
            let qBonus = Number(localStorage.getItem("fournity_quest_bonus_exp") || 0);
            localStorage.setItem("fournity_quest_bonus_exp", qBonus + 30);
        }

        // Count completed
        let completedCount = 0;
        if (q1Done) completedCount++;
        if (q2Done) completedCount++;
        if (q3Done) completedCount++;
        if (q4Done) completedCount++;

        progressText.textContent = `${completedCount} / 4 Selesai`;

        // All 4 Cleared Bonus
        if (completedCount === 4) {
            progressText.style.background = "rgba(76, 175, 80, 0.2)";
            progressText.style.color = "#a5d6a7";
            progressText.style.borderColor = "#4CAF50";
            if (allQuestsBanner) allQuestsBanner.style.display = "flex";

            if (!questsCleared.allBonus) {
                questsCleared.allBonus = true;
                playChime('legendary');
                showToast("👑 SEMUA MISI SELESAI! +80 Bonus EXP & Roll Gacha Kartu!");
                let qBonus = Number(localStorage.getItem("fournity_quest_bonus_exp") || 0);
                localStorage.setItem("fournity_quest_bonus_exp", qBonus + 80);

                // Chance to drop a photo card from discipline quests!
                setTimeout(() => {
                    dropRandomCard({ source: 'quests', forceNew: false });
                }, 1200);
            }
        } else {
            if (allQuestsBanner) allQuestsBanner.style.display = "none";
        }

        // Simpan pembaruan progres misi dan EXP ke cloud Firebase jika login
        if (typeof window.syncUserDataToCloud === 'function') {
            window.syncUserDataToCloud('progress');
        }

        localStorage.setItem(questStoreKey, JSON.stringify(questsCleared));
        if (typeof window.refreshPass === 'function') window.refreshPass();
    };

    // Guide Navigation on Click (No Manual Toggling!)
    questItem1?.addEventListener("click", () => {
        showToast("📖 Menuju modul Kotoba & Kana...");
        setTimeout(() => window.location.href = "pages/kotoba.html", 300);
    });

    questItem2?.addEventListener("click", () => {
        const radarSec = document.getElementById("fastRadarSection");
        if (radarSec) {
            radarSec.scrollIntoView({ behavior: "smooth", block: "center" });
            radarSec.style.transform = "scale(1.02)";
            setTimeout(() => radarSec.style.transform = "", 300);
            showToast("⚡ Jawab 3 kuis refleks di bawah!");
        }
    });

    questItem3?.addEventListener("click", () => {
        const kanjiSec = document.getElementById("kanjiRadarSection");
        if (kanjiSec) {
            kanjiSec.scrollIntoView({ behavior: "smooth", block: "center" });
            showToast("漢 Tandai hafal kanji di bawah atau tanya Sensei!");
        }
    });

    questItem4?.addEventListener("click", () => {
        openCheckinModal();
    });

    document.getElementById("bannerGachaBtn")?.addEventListener("click", () => {
        openCardAlbumModal();
    });

    checkAndUpdateDailyQuests();
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

            // Award XP & Record Activity
            if (typeof window.recordStudyActivity === 'function') {
                window.recordStudyActivity('radar', currentKana.romaji);
            }

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
            if (typeof window.recordStudyActivity === 'function') {
                window.recordStudyActivity('kanji', item.kanji);
            }
            let curExp = Number(localStorage.getItem("trinity_exp") || 80);
            localStorage.setItem("trinity_exp", curExp + 20);
            setupMobileAppHub();
        }
        localStorage.setItem("trinity_memorized_kanji", JSON.stringify(memorized));
        renderKanjiCard(kanjiIdx);
    });
}

// ==========================================================================
// 15.5 DAILY CHECK-IN & PHOTO CARD COLLECTION ENGINES
// ==========================================================================

// Koleksi Fotocard Terintegrasi Firebase Realtime DB (Non-Destruktif)

const DEFAULT_STARTER_CARDS = [
    {
        id: "card_lagend_01",
        cardId: "card_lagend_01",
        instanceId: "inst_starter_lg01",
        name: "Lagend Card · Vol. 01",
        kanjiName: "神話の章 · 第一号",
        rarity: "legendary",
        image: "gambar/fotocard/lagend/card1.png",
        kanjiSeal: "神話",
        serialNo: "#FN-LG-0001",
        versionCode: "Ver. 1.0 · Founder Print",
        kanjiQuote: "「継続は力なり」",
        romajiQuote: "Keizoku wa chikara nari.",
        idQuote: "Ketekunan dan konsistensi adalah kunci kekuatan sejati.",
        desc: "Kartu koleksi resmi edisi ketekunan Founder Fournity. Melambangkan dedikasi tanpa henti dalam menguasai bahasa dan budaya Jepang.",
        mintDate: "13 Okt 2026"
    },
    {
        id: "card_lagend_02",
        cardId: "card_lagend_02",
        instanceId: "inst_starter_lg02",
        name: "Lagend Card · Vol. 02",
        kanjiName: "極光の章 · 第二号",
        rarity: "legendary",
        image: "gambar/fotocard/lagend/card2.png",
        kanjiSeal: "極光",
        serialNo: "#FN-LG-0002",
        versionCode: "Ver. 1.0 · Founder Print",
        kanjiQuote: "「一期一会」",
        romajiQuote: "Ichigo ichie.",
        idQuote: "Setiap momen dan pertemuan adalah anugerah berharga tak tergantikan.",
        desc: "Kartu koleksi edisi kenangan berharga. Mengabadikan setiap jengkal proses belajar dan kehangatan kelas bersama Sensei.",
        mintDate: "13 Okt 2026"
    },
    {
        id: "card_ur_01",
        cardId: "card_ur_01",
        instanceId: "inst_starter_ur01",
        name: "Ultra Rare Card · Vol. 01",
        kanjiName: "幽玄の章 · 第一号",
        rarity: "ultra_rare",
        image: "gambar/fotocard/ultra_rare/card1.png",
        kanjiSeal: "幽玄",
        serialNo: "#FN-UR-1001",
        versionCode: "Ver. 1.0 · First Print",
        kanjiQuote: "「日日是好日」",
        romajiQuote: "Nichinichi kore koujitsu.",
        idQuote: "Setiap hari yang dijalani adalah hari yang baik dan berharga.",
        desc: "Kartu koleksi edisi kedamaian batin. Merayakan indahnya proses menikmati pembelajaran budaya Jepang dengan hati tenang.",
        mintDate: "13 Okt 2026"
    },
    {
        id: "card_ur_02",
        cardId: "card_ur_02",
        instanceId: "inst_starter_ur02",
        name: "Ultra Rare Card · Vol. 02",
        kanjiName: "金閣の章 · 第二号",
        rarity: "ultra_rare",
        image: "gambar/fotocard/ultra_rare/card2.png",
        kanjiSeal: "金閣",
        serialNo: "#FN-UR-1002",
        versionCode: "Ver. 1.1 · Special Print",
        kanjiQuote: "「千里の道も一歩から」",
        romajiQuote: "Senri no michi mo ippo kara.",
        idQuote: "Perjalanan seribu mil selalu dimulai dari satu langkah kecil.",
        desc: "Kartu koleksi edisi langkah awal. Mengapresiasi keberanian melangkah dari pengenalan huruf kana hingga fasih berkomunikasi.",
        mintDate: "13 Okt 2026"
    },
    {
        id: "card_rare_01",
        cardId: "card_rare_01",
        instanceId: "inst_starter_r01",
        name: "Rare Card · Vol. 01",
        kanjiName: "風雅の章 · 第一号",
        rarity: "rare",
        image: "gambar/fotocard/rare/card1.png",
        kanjiSeal: "風雅",
        serialNo: "#FN-R-2001",
        versionCode: "Ver. 1.0 · Standard Print",
        kanjiQuote: "「七転び八起き」",
        romajiQuote: "Nanakorobi yaoki.",
        idQuote: "Jatuh tujuh kali, bangkit delapan kali.",
        desc: "Filosofi ketangguhan jiwa. Setiap kegagalan adalah guru terbaik untuk melompat lebih tinggi.",
        mintDate: "13 Okt 2026"
    }
];

function getOwnedCardInstances() {
    try {
        const stored = localStorage.getItem("fournity_card_instances_v3");
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                // Pastikan setiap instans memiliki field lengkap (image, rarity, name, serialNo)
                return parsed.map(resolveCardData);
            }
        }
        // Auto-restitusi paket kartu awal agar pengguna tidak pernah kehilangan koleksi
        const starter = DEFAULT_STARTER_CARDS.map(resolveCardData);
        localStorage.setItem("fournity_card_instances_v3", JSON.stringify(starter));
        const uniqueIds = [...new Set(starter.map(inst => inst.cardId || inst.id))];
        localStorage.setItem("fournity_unlocked_cards", JSON.stringify(uniqueIds));
        if (!localStorage.getItem("fournity_user_avatar")) {
            localStorage.setItem("fournity_user_avatar", "gambar/fotocard/lagend/card1.png");
            localStorage.setItem("fournity_avatar_rarity", "legendary");
            localStorage.setItem("fournity_avatar_serial", "#FN-LG-0001");
        }
        return starter;
    } catch(e) {
        return DEFAULT_STARTER_CARDS.map(resolveCardData);
    }
}

function saveOwnedCardInstances(instances) {
    const enriched = (instances || []).map(resolveCardData);
    localStorage.setItem("fournity_card_instances_v3", JSON.stringify(enriched));
    const uniqueIds = [...new Set(enriched.map(inst => inst.cardId || inst.id))];
    localStorage.setItem("fournity_unlocked_cards", JSON.stringify(uniqueIds));
    if (typeof window.syncUserDataToCloud === 'function') {
        window.syncUserDataToCloud('inventory');
    }
}

function getUnlockedCardIds() {
    const instances = getOwnedCardInstances();
    return [...new Set(instances.map(i => i.cardId))];
}

function resolveCardData(item) {
    if (!item) return CARDS_DATABASE[0];
    if (item.instanceId && item.cardId) {
        const base = findBaseCard(item.cardId);
        return {
            ...base,
            ...item,
            id: item.cardId,
            instanceId: item.instanceId
        };
    }
    const base = findBaseCard(item.id || item);
    return {
        ...base,
        ...item,
        serialNo: item.serialNo || generateCardSerial(base.rarity),
        versionCode: item.versionCode || "Ver. 1.0 · Standard Print",
        kanjiQuote: item.kanjiQuote || UNIVERSAL_CARD_VARIANTS[0].kanjiQuote,
        romajiQuote: item.romajiQuote || UNIVERSAL_CARD_VARIANTS[0].romajiQuote,
        idQuote: item.idQuote || UNIVERSAL_CARD_VARIANTS[0].idQuote,
        desc: item.desc || UNIVERSAL_CARD_VARIANTS[0].desc
    };
}

// Expose card helpers to window for chat module and external components
window.CARDS_DATABASE = CARDS_DATABASE;
window.findBaseCard = findBaseCard;
window.resolveCardData = resolveCardData;
window.getOwnedCardInstances = getOwnedCardInstances;
window.saveOwnedCardInstances = saveOwnedCardInstances;
window.mintCardInstance = mintCardInstance;

function renderSingleCardHTML(cardData) {
    const card = resolveCardData(cardData);

    const rarityClass = card.rarity === "legendary" 
        ? "card-legendary" 
        : (card.rarity === "ultra_rare" ? "card-ultra-rare" : "card-rare");

    const rarityBadgeText = card.rarity === "legendary" 
        ? "★ LAGEND ★" 
        : (card.rarity === "ultra_rare" ? "★ ULTRA RARE ★" : "✦ RARE ✦");

    const rankTierText = card.rarity === "legendary"
        ? "RANK SSS · LAGEND"
        : (card.rarity === "ultra_rare" ? "RANK SS · ULTRA RARE" : "RANK S · RARE");

    return `
        <div class="photo-card ${rarityClass}" data-instance-id="${card.instanceId || ''}" data-card-id="${card.id}">
            <div class="card-inner">
                <div class="card-foil-overlay"></div>
                ${card.rarity === "legendary" ? '<div class="card-particles-overlay"></div>' : ''}
                
                <div class="card-image-box">
                    <img src="${card.image}" alt="${card.name}" class="card-img" loading="lazy">
                    <div class="card-scrim-gradient"></div>
                </div>

                <div class="card-meta-top">
                    <span class="card-rarity-badge">${rarityBadgeText}</span>
                </div>

                <div class="card-meta-bottom">
                    <div class="card-rank-tag-row">
                        <span class="card-rank-pill ${card.rarity}">${rankTierText}</span>
                        <span class="card-serial-badge">${card.serialNo || '#FN-0000'}</span>
                    </div>
                    <h4 class="card-title-text">${card.name}</h4>
                    <p class="card-quote-jp">${card.kanjiQuote}</p>
                    <div class="card-serial-row">
                        <span class="card-ver-tag">${card.versionCode || 'Ver. 1.0'}</span>
                        <span class="card-seal-tag">${card.kanjiSeal || "極"}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 1. SETUP DAILY CHECK-IN (SISTEM PRESENSI HARIAN ANTI-BUG & PERSISTEN)
function setupDailyCheckin() {
    const modal = document.getElementById("checkinModal");
    const closeBtn = document.getElementById("closeCheckinModal");
    const claimBtn = document.getElementById("btnClaimDailyCheckin");
    const daysGrid = document.getElementById("checkinDaysGrid");
    const streakCountEl = document.getElementById("modalStreakCount");
    const rewardHintEl = document.getElementById("modalStreakRewardHint");
    const footnoteEl = document.getElementById("checkinFootnote");

    if (!modal) return;

    let countdownTimer = null;
    let isClaiming = false;

    const CHECKIN_REWARDS = [
        { day: 1, xp: 25, icon: "🎁", text: "+25 XP", isCard: false },
        { day: 2, xp: 35, icon: "🎁", text: "+35 XP", isCard: false },
        { day: 3, xp: 50, icon: "🎴", text: "+50 XP & Kartu", isCard: true, milestone: true },
        { day: 4, xp: 60, icon: "🎁", text: "+60 XP", isCard: false },
        { day: 5, xp: 75, icon: "🎁", text: "+75 XP", isCard: false },
        { day: 6, xp: 90, icon: "🎁", text: "+90 XP", isCard: false },
        { day: 7, xp: 150, icon: "🌟", text: "+150 XP & UR/LR", isCard: true, milestone: true }
    ];

    function getCheckinData() {
        try {
            const parsed = JSON.parse(localStorage.getItem("fournity_checkin_v2") || "null");
            if (parsed && typeof parsed === "object") {
                return {
                    streak: Math.max(0, Number(parsed.streak) || 0),
                    lastDate: typeof parsed.lastDate === "string" ? parsed.lastDate : "",
                    total: Math.max(0, Number(parsed.total) || 0)
                };
            }
        } catch(e) {}
        return { streak: 0, lastDate: "", total: 0 };
    }
    window.getCheckinData = getCheckinData;

    function updateCountdown() {
        if (!footnoteEl) return;
        const now = new Date();
        const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
        const diffMs = Math.max(0, midnight - now);
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        const data = getCheckinData();
        const todayStr = getLocalDateString();
        const isClaimedToday = (data.lastDate === todayStr);

        if (isClaimedToday) {
            footnoteEl.innerHTML = `✓ Presensi hari ini telah dicatat. Reset berikutnya dalam: <strong>${hours} jam ${mins} menit</strong> (pukul 00:00).`;
        } else {
            footnoteEl.innerHTML = `Check-in direset setiap pukul 00:00 tengah malam. Sisa waktu hari ini: <strong>${hours} jam ${mins} menit</strong>.`;
        }
    }

    function renderCheckinUI() {
        const data = getCheckinData();
        const todayStr = getLocalDateString();
        const isClaimedToday = Boolean(data.lastDate && data.lastDate === todayStr);

        let activeStreak = data.streak || 0;
        let diffDays = 999;
        if (data.lastDate) {
            diffDays = getDaysDifference(data.lastDate, todayStr);
        }

        let completedCycleDay = 0;
        let todayTargetCycleDay = 1;

        if (isClaimedToday) {
            // Sudah klaim hari ini: posisi hari yang diklaim di siklus 7 hari
            completedCycleDay = ((activeStreak - 1) % 7) + 1;
            todayTargetCycleDay = completedCycleDay;
        } else {
            // Belum klaim hari ini
            if (diffDays === 1) {
                // Streak berlanjut dari kemarin
                const nextStreak = activeStreak + 1;
                todayTargetCycleDay = ((nextStreak - 1) % 7) + 1;
                completedCycleDay = todayTargetCycleDay - 1;
            } else {
                // Terlewat atau akun baru
                activeStreak = 0;
                todayTargetCycleDay = 1;
                completedCycleDay = 0;
            }
        }

        // Update teks streak di modal
        if (streakCountEl) {
            if (isClaimedToday) {
                streakCountEl.textContent = `${activeStreak} Hari 🔥`;
            } else if (diffDays === 1) {
                streakCountEl.textContent = `${activeStreak} Hari (Lanjutkan!)`;
            } else {
                streakCountEl.textContent = `0 Hari (Mulai Hari Ini!)`;
            }
        }

        // Update hint reward
        if (rewardHintEl) {
            if (isClaimedToday) {
                if (completedCycleDay === 7) {
                    rewardHintEl.textContent = "🎉 Siklus 7 Hari Tuntas! Besok mulai siklus baru & streak tetap berlanjut!";
                } else {
                    rewardHintEl.textContent = `✨ Sukses! Kembali besok untuk klaim reward Hari ke-${completedCycleDay + 1}.`;
                }
            } else {
                if (todayTargetCycleDay === 7) {
                    rewardHintEl.textContent = "🌟 HARI KE-7: Garansi Kartu Ultra Rare / Legendary!";
                } else if (todayTargetCycleDay === 3) {
                    rewardHintEl.textContent = "🎴 HARI KE-3: Bonus Spesial Kartu Koleksi!";
                } else {
                    rewardHintEl.textContent = "✨ Hari ke-3 & 7 Garansi Peluang Kartu Langka!";
                }
            }
        }

        // Render grid 7 hari
        if (daysGrid) {
            daysGrid.innerHTML = "";
            CHECKIN_REWARDS.forEach(r => {
                const card = document.createElement("div");
                card.className = "checkin-day-card";
                if (r.milestone) card.classList.add("is-milestone");

                let isCardClaimed = false;
                let isCardToday = false;

                if (isClaimedToday) {
                    if (r.day <= completedCycleDay) {
                        isCardClaimed = true;
                    }
                } else {
                    if (r.day < todayTargetCycleDay) {
                        isCardClaimed = true;
                    } else if (r.day === todayTargetCycleDay) {
                        isCardToday = true;
                    }
                }

                if (isCardClaimed) card.classList.add("is-claimed");
                if (isCardToday) card.classList.add("is-today");

                card.innerHTML = `
                    <span class="day-label">HARI ${r.day}</span>
                    <span class="day-gift-icon">${isCardClaimed ? "✓" : r.icon}</span>
                    <span class="day-reward-tag">${isCardClaimed ? "TERKLAIM" : r.text}</span>
                `;
                daysGrid.appendChild(card);
            });
        }

        // Update status tombol klaim
        if (claimBtn) {
            if (isClaimedToday) {
                claimBtn.disabled = true;
                claimBtn.classList.remove("btn-gold");
                claimBtn.textContent = "✓ SUDAH CHECK-IN HARI INI (KEMBALI BESOK)";
            } else {
                claimBtn.disabled = false;
                claimBtn.classList.add("btn-gold");
                const currentReward = CHECKIN_REWARDS[todayTargetCycleDay - 1];
                claimBtn.textContent = `🎁 KLAIM REWARD HARI KE-${todayTargetCycleDay} (${currentReward.text})`;
            }
        }

        updateCountdown();
    }
    window.renderCheckinUI = renderCheckinUI;

    window.openCheckinModal = function() {
        modal.style.display = "flex";
        renderCheckinUI();
        if (countdownTimer) clearInterval(countdownTimer);
        countdownTimer = setInterval(updateCountdown, 30000);
    };

    window.closeCheckinModal = function() {
        modal.style.display = "none";
        if (countdownTimer) {
            clearInterval(countdownTimer);
            countdownTimer = null;
        }
    };

    closeBtn?.addEventListener("click", window.closeCheckinModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) window.closeCheckinModal();
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.style.display === "flex") {
            window.closeCheckinModal();
        }
    });

    claimBtn?.addEventListener("click", () => {
        if (isClaiming) return;

        const data = getCheckinData();
        const todayStr = getLocalDateString();

        // VALIDASI KETAT: Hanya 1 kali sehari walaupun website di-refresh
        if (data.lastDate === todayStr) {
            showToast("✓ Kamu sudah check-in hari ini! Kembali lagi besok.");
            renderCheckinUI();
            return;
        }

        isClaiming = true;
        claimBtn.disabled = true;

        try {
            let diffDays = 999;
            if (data.lastDate) {
                diffDays = getDaysDifference(data.lastDate, todayStr);
            }

            let newStreak = 1;
            if (diffDays === 1) {
                newStreak = (data.streak || 0) + 1;
            } else {
                newStreak = 1;
            }

            const dayIdx = ((newStreak - 1) % 7);
            const reward = CHECKIN_REWARDS[dayIdx];

            // 1. Simpan data checkin permanen ke localStorage
            const updatedData = {
                streak: newStreak,
                lastDate: todayStr,
                total: (data.total || 0) + 1,
                lastReward: reward.text,
                updatedAt: Date.now()
            };
            localStorage.setItem("fournity_checkin_v2", JSON.stringify(updatedData));

            // 2. Tambahkan EXP Check-In
            const currentCheckinExp = Number(localStorage.getItem("fournity_checkin_exp") || 0);
            localStorage.setItem("fournity_checkin_exp", currentCheckinExp + reward.xp);

            // 3. Catat aktivitas belajar harian (otomatis menyelesaikan Misi 4)
            window.recordStudyActivity('checkin', 1);

            // 4. Sinkronkan ke cloud
            if (typeof window.syncUserDataToCloud === 'function') {
                window.syncUserDataToCloud('checkin');
                window.syncUserDataToCloud('progress');
            }

            playChime('success');
            showToast(`🎉 Berhasil Check-In Hari ke-${dayIdx + 1}! +${reward.xp} EXP Diterima!`);

            // 5. Perbarui tampilan UI
            renderCheckinUI();
            if (typeof window.refreshPass === 'function') window.refreshPass();
            if (typeof window.checkAndUpdateDailyQuests === 'function') window.checkAndUpdateDailyQuests();

            // 6. Gacha / Drop Photo Card
            let shouldDropCard = false;
            let guaranteedTier = null;

            if (reward.isCard) {
                shouldDropCard = true;
                if (dayIdx + 1 === 7) guaranteedTier = "legendary";
                else if (dayIdx + 1 === 3) guaranteedTier = "ultra_rare";
            } else {
                if (Math.random() < 0.25) {
                    shouldDropCard = true;
                }
            }

            if (shouldDropCard) {
                setTimeout(() => {
                    dropRandomCard({ source: 'checkin', guaranteedTier });
                }, 800);
            }
        } catch(err) {
            console.error("Error saat klaim checkin:", err);
            showToast("Terjadi kendala saat check-in, silakan coba lagi.");
        } finally {
            isClaiming = false;
        }
    });

    // Inisialisasi awal UI
    renderCheckinUI();
}

// 2. DROP RANDOM CARD GACHA LOGIC (MENDUKUNG KARTU KEMBAR DENGAN KODE SERI & DESKRIPSI UNIK)
function dropRandomCard(options = {}) {
    const instances = getOwnedCardInstances();
    let candidates = CARDS_DATABASE;

    if (options.guaranteedTier) {
        const byTier = CARDS_DATABASE.filter(c => c.rarity === options.guaranteedTier);
        if (byTier.length > 0) candidates = byTier;
    }

    // Jika ada kartu edisi dasar yang belum dimiliki, prioritaskan (65% peluang),
    // atau jika pemain beruntung, bisa mendapatkan varian kartu kembar baru
    const unownedBases = candidates.filter(c => !instances.some(i => i.cardId === c.id));
    let pickedBase = null;

    if (unownedBases.length > 0 && Math.random() < 0.65) {
        pickedBase = unownedBases[Math.floor(Math.random() * unownedBases.length)];
    } else {
        pickedBase = candidates[Math.floor(Math.random() * candidates.length)];
    }

    // Cek apakah pemain sudah memiliki versi kartu ini (kartu kembar / varian cetak)
    const existingCount = instances.filter(i => i.cardId === pickedBase.id).length;
    const isTwinCard = existingCount > 0;

    // Pilih varian kutipan & versi yang berbeda untuk kartu kembar
    let variantIdx = null;
    if (isTwinCard) {
        variantIdx = (existingCount + Math.floor(Math.random() * (UNIVERSAL_CARD_VARIANTS.length - 1) + 1)) % UNIVERSAL_CARD_VARIANTS.length;
    }

    // Terbitkan (mint) nomor seri dan kode versi baru untuk kartu ini
    const newInstance = mintCardInstance(pickedBase, variantIdx);
    instances.unshift(newInstance); // Kartu terbaru diletakkan di paling depan
    saveOwnedCardInstances(instances);

    const resolvedCard = resolveCardData(newInstance);

    if (isTwinCard) {
        showToast(`🎴 Varian Kembar Diperoleh! [${resolvedCard.name}] Seri Baru: ${resolvedCard.serialNo}!`);
    } else {
        showToast(`🎉 Kartu Koleksi Baru: [${resolvedCard.name}] Seri: ${resolvedCard.serialNo}!`);
    }

    // Putar audio efek pembuka kartu
    if (resolvedCard.rarity === "legendary") {
        playChime('legendary');
    } else {
        playChime('success');
    }

    openUnveilModal(resolvedCard);
    renderShowcaseSlider();
    if (typeof window.refreshPass === 'function') window.refreshPass();
    return resolvedCard;
}

// ==========================================================================
// 15.5.1 MANAJER MODAL OVERLAY FOTOCARD TERPADU (ANTI-TUMPUKAN OVERLAY)
// Menjamin hanya ada 1 modal fotocard yang aktif dalam satu waktu dan
// mengelola riwayat kembali (return stack) dengan mulus.
// ==========================================================================
const PHOTOCARD_MODAL_IDS = [
    "cardAlbumModal",
    "cardInspectModal",
    "sendCardModal",
    "redeemCodeModal",
    "giftReceivedModal",
    "cardUnveilModal"
];

let _photocardReturnModal = null;

function showPhotocardModal(modalId, options = {}) {
    const { saveHistory = true, clearHistory = false } = options;

    if (clearHistory) {
        _photocardReturnModal = null;
    } else if (saveHistory) {
        // Deteksi jika sebelumnya ada modal fotocard yang sedang tampil
        const activeId = PHOTOCARD_MODAL_IDS.find(id => {
            const el = document.getElementById(id);
            return el && el.style.display === "flex" && id !== modalId;
        });
        if (activeId) {
            _photocardReturnModal = activeId;
        }
    }

    // Sembunyikan semua overlay fotocard lain agar backdrop tidak pernah bertumpuk
    PHOTOCARD_MODAL_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (el && id !== modalId) {
            el.style.display = "none";
        }
    });

    const targetEl = document.getElementById(modalId);
    if (targetEl) {
        targetEl.style.display = "flex";
    }
}

function closePhotocardModal(modalId, returnToPrevious = true) {
    const el = document.getElementById(modalId);
    if (el) {
        el.style.display = "none";
    }

    if (returnToPrevious && _photocardReturnModal) {
        const prevId = _photocardReturnModal;
        _photocardReturnModal = null;
        if (prevId === "cardAlbumModal" && typeof window.openCardAlbumModal === "function") {
            window.openCardAlbumModal();
        } else {
            const prevEl = document.getElementById(prevId);
            if (prevEl) {
                prevEl.style.display = "flex";
            }
        }
    }
}
window.showPhotocardModal = showPhotocardModal;
window.closePhotocardModal = closePhotocardModal;

// 3. UNVEIL CELEBRATION MODAL
function openUnveilModal(card) {
    const modal = document.getElementById("cardUnveilModal");
    const slot = document.getElementById("unveilCardSlot");
    const claimBtn = document.getElementById("btnUnveilClaim");
    const titleEl = document.getElementById("unveilTitle");

    if (!modal || !slot) return;

    if (titleEl) {
        titleEl.textContent = `Mendapatkan ${card.name} (${card.serialNo || ''})!`;
    }

    slot.innerHTML = renderSingleCardHTML(card);
    showPhotocardModal("cardUnveilModal", { clearHistory: true });

    claimBtn.onclick = () => {
        closePhotocardModal("cardUnveilModal", false);
        openCardAlbumModal();
    };
    modal.onclick = (e) => {
        if (e.target === modal) closePhotocardModal("cardUnveilModal", false);
    };
}

// 4. PHOTO CARD ALBUM & GALLERY (INSTANCES & SERIAL CODES)
function setupPhotoCardCollection() {
    const modal = document.getElementById("cardAlbumModal");
    const closeBtn = document.getElementById("closeAlbumModal");
    const grid = document.getElementById("albumCardsGrid");
    const filterBtns = document.querySelectorAll(".album-filter-btn");

    if (!modal) return;

    closeBtn?.addEventListener("click", () => {
        closePhotocardModal("cardAlbumModal", false);
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) closePhotocardModal("cardAlbumModal", false);
    });

    window.openCardAlbumModal = function() {
        showPhotocardModal("cardAlbumModal", { clearHistory: true });
        renderAlbum("all");
    };
    window.renderAlbum = renderAlbum;
    window.renderCardAlbum = renderAlbum;

    function renderAlbum(filter = "all") {
        const instances = getOwnedCardInstances();
        // Resolusikan setiap instans kartu lengkap dengan kode seri, nomor versi & kutipan khususnya
        const ownedCards = instances.map(resolveCardData);

        // Update jumlah kartu pada tiap tombol filter berdasarkan koleksi instans pemain
        const countAll = ownedCards.length;
        const countLegend = ownedCards.filter(c => c.rarity === "legendary").length;
        const countUR = ownedCards.filter(c => c.rarity === "ultra_rare").length;
        const countRare = ownedCards.filter(c => c.rarity === "rare").length;

        filterBtns.forEach(btn => {
            const f = btn.dataset.filter;
            if (f === "all") btn.textContent = `Semua (${countAll})`;
            else if (f === "legendary") btn.textContent = `🌟 Lagend (${countLegend})`;
            else if (f === "ultra_rare") btn.textContent = `💜 UR (${countUR})`;
            else if (f === "rare") btn.textContent = `💎 Rare (${countRare})`;
        });

        // Filter kartu yang dimiliki berdasarkan filter aktif
        let displayedCards = ownedCards;
        if (filter !== "all") {
            displayedCards = ownedCards.filter(c => c.rarity === filter);
        }

        if (grid) {
            grid.innerHTML = "";

            if (displayedCards.length === 0) {
                grid.innerHTML = `
                    <div class="album-empty-state">
                        <div class="empty-icon-bubble">🎴</div>
                        <h3 class="empty-title">${filter === "all" ? "Belum Memiliki Kartu Koleksi" : "Belum Memiliki Kartu di Rank Ini"}</h3>
                        <p class="empty-desc">
                            ${filter === "all" 
                                ? "Kartu hanya tampil jika kamu sudah memilikinya. Dapatkan kartu eksklusif dari Check-In Harian (Hari ke-3 & 7) atau selesaikan Misi Disiplin Harian!" 
                                : "Terus kumpulkan streak Check-In atau selesaikan misi belajar untuk membuka kartu rank ini!"}
                        </p>
                        <button type="button" class="btn btn-gold btn-sm" id="emptyAlbumCheckinBtn">
                            🎁 Buka Check-In Harian
                        </button>
                    </div>
                `;
                grid.querySelector("#emptyAlbumCheckinBtn")?.addEventListener("click", () => {
                    modal.style.display = "none";
                    if (typeof openCheckinModal === "function") openCheckinModal();
                });
                return;
            }

            displayedCards.forEach(card => {
                const cardWrapper = document.createElement("div");
                cardWrapper.innerHTML = renderSingleCardHTML(card);
                const el = cardWrapper.firstElementChild;

                el.addEventListener("click", () => {
                    openCardInspectModal(card);
                });

                grid.appendChild(el);
            });
        }
    }

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("is-active"));
            btn.classList.add("is-active");
            renderAlbum(btn.dataset.filter);
        });
    });

    // Tombol Aksi Kotak Hadiah & Klaim Kode Hadiah di Kiri & Kanan Bawah
    document.getElementById("btnOpenGiftInboxModal")?.addEventListener("click", () => {
        if (typeof window.openGiftInboxModal === "function") window.openGiftInboxModal();
    });
    document.getElementById("btnOpenRedeemCodeModal")?.addEventListener("click", () => {
        if (typeof window.openRedeemCodeModal === "function") window.openRedeemCodeModal();
    });

    // Render Homepage Showcase Slider
    renderShowcaseSlider();
}

function renderShowcaseSlider() {
    const slider = document.getElementById("showcaseCardsSlider");
    if (!slider) return;

    const instances = getOwnedCardInstances();
    const ownedCards = instances.map(resolveCardData);

    // Urutkan kartu berdasarkan tingkatan rank tertinggi (Legendary -> Ultra Rare -> Rare)
    const rarityPriority = { legendary: 1, ultra_rare: 2, rare: 3 };
    ownedCards.sort((a, b) => (rarityPriority[a.rarity] || 4) - (rarityPriority[b.rarity] || 4));

    // Sinkronkan badge counter di header showcase
    const showcaseCount = document.querySelector("#showcaseOpenAlbumBtn span");
    if (showcaseCount) showcaseCount.textContent = `${ownedCards.length} Kartu`;

    slider.innerHTML = "";

    if (ownedCards.length === 0) {
        slider.innerHTML = `
            <div class="showcase-empty-state">
                <span style="font-size: 26px;">🎴</span>
                <div class="showcase-empty-text">
                    <h5>Belum Ada Koleksi Foto Card</h5>
                    <p>Selesaikan Check-In Harian atau Misi Disiplin untuk membuka kartu pertamamu!</p>
                </div>
                <button type="button" class="btn btn-gold btn-sm" id="showcaseClaimCheckinBtn">
                    🎁 Klaim Check-In
                </button>
            </div>
        `;
        slider.querySelector("#showcaseClaimCheckinBtn")?.addEventListener("click", () => {
            if (typeof openCheckinModal === "function") openCheckinModal();
        });
        return;
    }

    // Tampilkan hingga 3 kartu terbaik yang dimiliki
    const showcaseCards = ownedCards.slice(0, 3);
    showcaseCards.forEach(card => {
        const cardWrapper = document.createElement("div");
        cardWrapper.innerHTML = renderSingleCardHTML(card);
        const el = cardWrapper.firstElementChild;
        el.addEventListener("click", () => {
            openCardInspectModal(card);
        });
        slider.appendChild(el);
    });
}

// 5. INSPECT DETAIL CARD MODAL (3D TILT & AUDIO DENGAN SERI & VERSI UMUM)
function openCardInspectModal(cardData) {
    const card = resolveCardData(cardData);
    const modal = document.getElementById("cardInspectModal");
    const closeBtn = document.getElementById("closeInspectModal");
    const cardElementBox = document.getElementById("inspectCardElement");
    const rarityPill = document.getElementById("inspectRarityPill");
    const serialPill = document.getElementById("inspectSerialPill");
    const versionPill = document.getElementById("inspectVersionPill");
    const titleEl = document.getElementById("inspectCardTitle");
    const kanjiQuoteEl = document.getElementById("inspectKanjiQuote");
    const romajiQuoteEl = document.getElementById("inspectRomajiQuote");
    const idQuoteEl = document.getElementById("inspectIdQuote");
    const descTextEl = document.getElementById("inspectDescText");
    const speakerBtn = document.getElementById("inspectQuoteSpeaker");
    const shareBtn = document.getElementById("btnShareCard");

    if (!modal) return;

    if (rarityPill) {
        rarityPill.textContent = card.rarity === "legendary" 
            ? "★ LAGEND ★" 
            : (card.rarity === "ultra_rare" ? "★ ULTRA RARE ★" : "✦ RARE ✦");
        rarityPill.style.background = card.rarity === "legendary"
            ? "linear-gradient(135deg, #FF0055, #FFB703)"
            : (card.rarity === "ultra_rare" ? "linear-gradient(135deg, #7209B7, #FFD166)" : "linear-gradient(135deg, #00B4D8, #00F5D4)");
    }

    if (serialPill) {
        serialPill.textContent = card.serialNo || "#FN-0000";
    }

    if (versionPill) {
        versionPill.textContent = card.versionCode || "Ver. 1.0";
    }

    if (titleEl) {
        titleEl.textContent = `${card.name} · ${card.kanjiName || ''}`;
    }

    if (kanjiQuoteEl) kanjiQuoteEl.textContent = card.kanjiQuote;
    if (romajiQuoteEl) romajiQuoteEl.textContent = card.romajiQuote;
    if (idQuoteEl) idQuoteEl.textContent = card.idQuote;
    if (descTextEl) {
        descTextEl.textContent = `${card.desc} Dilengkapi kode seri terverifikasi: ${card.serialNo || '-'}.`;
    }

    if (cardElementBox) {
        cardElementBox.innerHTML = renderSingleCardHTML(card);
        const cardNode = cardElementBox.querySelector(".photo-card");

        // 3D Perspective Tilt on Mouse Movement
        if (cardNode) {
            cardNode.addEventListener("mousemove", (e) => {
                const rect = cardNode.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -12;
                const rotateY = ((x - centerX) / centerX) * 12;
                cardNode.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
                cardNode.style.setProperty('--legend-angle', `${Math.round((x / rect.width) * 360)}deg`);
            });

            cardNode.addEventListener("mouseleave", () => {
                cardNode.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
            });
        }
    }

    if (speakerBtn) {
        speakerBtn.onclick = () => {
            speakJapanese(`${card.kanjiName || ''}。${card.kanjiQuote}`);
        };
    }

    if (shareBtn) {
        shareBtn.onclick = () => {
            navigator.clipboard.writeText(`${card.name} [${card.serialNo}] - ${card.kanjiQuote} (${card.romajiQuote}): ${card.idQuote}`).then(() => {
                showToast("📋 Seri & kutipan kartu disalin ke clipboard!");
            });
        };
    }

    // Tombol Gunakan Sebagai Foto Profil & Latar Belakang Chat
    const setAvatarBtn = document.getElementById("btnSetAsAvatar");
    const setChatBgBtn = document.getElementById("btnSetAsChatBg");

    if (setAvatarBtn) {
        if (card.rarity === "legendary") {
            setAvatarBtn.innerHTML = `👑 Jadikan Foto Profil (Efek VIP Lagend)`;
            setAvatarBtn.className = "btn btn-gold btn-sm inspect-action-btn is-legend-btn";
        } else if (card.rarity === "ultra_rare") {
            setAvatarBtn.innerHTML = `💜 Jadikan Foto Profil (Aura UR)`;
            setAvatarBtn.className = "btn btn-purple btn-sm inspect-action-btn";
        } else {
            setAvatarBtn.innerHTML = `💎 Jadikan Foto Profil (Aura Rare)`;
            setAvatarBtn.className = "btn btn-primary btn-sm inspect-action-btn";
        }

        setAvatarBtn.onclick = () => {
            applyCardAsAvatar(card);
        };
    }

    if (setChatBgBtn) {
        setChatBgBtn.onclick = () => {
            applyCardAsChatBg(card);
        };
    }

    // Tombol Kirim Kartu ke Teman
    const sendCardBtn = document.getElementById("btnSendCardInspect");
    if (sendCardBtn) {
        sendCardBtn.onclick = () => {
            if (typeof window.openSendCardModal === "function") {
                window.openSendCardModal(card);
            }
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            closePhotocardModal("cardInspectModal", true);
        };
    }

    modal.onclick = (e) => {
        if (e.target === modal) closePhotocardModal("cardInspectModal", true);
    };

    showPhotocardModal("cardInspectModal", { saveHistory: true });
}

// 6. TERAPKAN KARTU SEBAGAI FOTO PROFIL (VIP LAGEND EFFECT)
function applyCardAsAvatar(card) {
    if (!card) return;
    const user = localStorage.getItem("nihongoChatUser") || "Gakusei";
    const cleanImg = card.image ? card.image.replace(/^(\.\.\/|\.\/)+/, '') : '';
    
    // Simpan ke storage foto profil aktif & status rarity kartu
    localStorage.setItem("fournity_user_avatar", cleanImg);
    localStorage.setItem("fournity_avatar_rarity", card.rarity);
    localStorage.setItem("fournity_avatar_card_id", card.id);
    localStorage.setItem("fournity_avatar_serial", card.serialNo || '');
    localStorage.setItem(`avatar_${user}`, cleanImg);
    localStorage.setItem(`avatar_rarity_${user}`, card.rarity);
    localStorage.setItem(`avatar_serial_${user}`, card.serialNo || '');

    // Simpan juga ke struktur fournity_user_profiles untuk kompatibilitas penuh
    try {
        let profiles = JSON.parse(localStorage.getItem("fournity_user_profiles") || "{}");
        profiles[user] = profiles[user] || {};
        profiles[user].photoBase64 = cleanImg;
        profiles[user].avatarRarity = card.rarity;
        profiles[user].avatarSerial = card.serialNo || '';
        localStorage.setItem("fournity_user_profiles", JSON.stringify(profiles));
    } catch(e) {}

    // Perbarui in-memory window.userProfiles seketika
    if (window.userProfiles && user) {
        window.userProfiles[user] = window.userProfiles[user] || {};
        window.userProfiles[user].displayName = user;
        window.userProfiles[user].photoBase64 = cleanImg;
        window.userProfiles[user].avatar = cleanImg;
        window.userProfiles[user].avatarRarity = card.rarity;
        window.userProfiles[user].avatarSerial = card.serialNo || '';
    }

    // Suara & Feedback
    if (card.rarity === "legendary") {
        playChime('legendary');
        showToast(`👑 EFEK VIP DIAKTIFKAN! Foto profil utama kini memiliki border pelangi warna-warni & mahkota VIP Lagend!`);
    } else {
        playChime('success');
        showToast(`✨ Foto profil berhasil diganti dengan [${card.name}] (${card.serialNo || ''})!`);
    }

    syncMainTopHeaderProfile();
    if (typeof refreshPass === 'function') refreshPass();
    if (typeof window.updateAllRenderedChatAvatars === 'function') {
        window.updateAllRenderedChatAvatars();
    }
    if (typeof window.syncUserDataToCloud === 'function') {
        window.syncUserDataToCloud('avatar');
    }
    try { window.dispatchEvent(new Event("storage")); } catch(e) {}
}

// 7. TERAPKAN KARTU SEBAGAI LATAR BELAKANG CHAT
function applyCardAsChatBg(card) {
    if (!card) return;
    const isPages = window.location.pathname.includes('/pages/');
    const cardImgPath = isPages ? (card.image.startsWith('../') ? card.image : '../' + card.image) : (card.image.startsWith('../') ? card.image.replace('../', '') : card.image);

    const bgConfig = {
        type: 'custom',
        url: cardImgPath,
        rawPath: card.image,
        cardId: card.id,
        cardName: card.name,
        serialNo: card.serialNo || '',
        rarity: card.rarity,
        overlay: 38,
        blur: 0
    };
    localStorage.setItem("fournity_chat_wallpaper", JSON.stringify(bgConfig));
    if (typeof window.syncUserDataToCloud === 'function') {
        window.syncUserDataToCloud('wallpaper');
    }

    playChime('bell');
    showToast(`🌌 Wallpaper Chat Aktif! [${card.name}] (${card.serialNo || ''}) kini menjadi latar belakang obrolan.`);
    try { window.dispatchEvent(new Event("storage")); } catch(e) {}
}

// ==========================================================================
// 15.6 FITUR KIRIM & TERIMA FOTO CARD KE ORANG LAIN (GIFT & TRANSFER SYSTEM)
// Mendukung Transfer Langsung ke Member Komunitas & Pembuatan Kode Hadiah (Gift Code)
// ==========================================================================

function initCardGiftingSystem() {
    const sendModal = document.getElementById("sendCardModal");
    const closeSendBtn = document.getElementById("closeSendCardModal");
    const thumbImg = document.getElementById("sendCardThumbImg");
    const thumbTitle = document.getElementById("sendCardThumbTitle");
    const thumbSerial = document.getElementById("sendCardThumbSerial");
    const rarityPill = document.getElementById("sendCardRarityPill");
    const selectCardGroup = document.getElementById("sendCardSelectGroup");
    const selectCardInput = document.getElementById("selectCardToSend");
    const tabDirect = document.getElementById("tabBtnDirectSend");
    const tabGiftCode = document.getElementById("tabBtnGiftCode");
    const paneDirect = document.getElementById("paneDirectSend");
    const paneGiftCode = document.getElementById("paneGiftCode");
    const targetUserSelect = document.getElementById("sendTargetUserSelect");
    const targetUserManual = document.getElementById("sendTargetUserManual");
    const cardMsgInput = document.getElementById("sendCardMessage");
    const btnConfirmSend = document.getElementById("btnConfirmSendCard");
    const giftCodeNote = document.getElementById("giftCodeNote");
    const btnGenCode = document.getElementById("btnGenerateGiftCode");
    const codeResultBox = document.getElementById("giftCodeResultBox");
    const codeDisplay = document.getElementById("giftCodeDisplay");
    const btnCopyCode = document.getElementById("btnCopyGiftCode");
    const genCodeActionRow = document.getElementById("generateCodeActionRow");

    // Modal Terima Hadiah
    const receivedModal = document.getElementById("giftReceivedModal");
    const receivedTitle = document.getElementById("giftReceivedTitle");
    const receivedSenderName = document.getElementById("giftSenderName");
    const receivedMsgBubble = document.getElementById("giftMessageBubble");
    const receivedMsgText = document.getElementById("giftMessageText");
    const receivedSlot = document.getElementById("giftReceivedCardSlot");
    const btnClaimGift = document.getElementById("btnClaimReceivedGift");

    // Modal Klaim Kode Hadiah
    const redeemModal = document.getElementById("redeemCodeModal");
    const closeRedeemBtn = document.getElementById("closeRedeemCodeModal");
    const inputRedeemCode = document.getElementById("inputRedeemCode");
    const btnSubmitRedeem = document.getElementById("btnSubmitRedeemCode");

    let currentCardToGift = null;

    // 1. Tab Switcher di Modal Kirim
    tabDirect?.addEventListener("click", () => {
        tabDirect.classList.add("is-active");
        tabGiftCode?.classList.remove("is-active");
        paneDirect?.classList.add("is-active");
        paneGiftCode?.classList.remove("is-active");
    });

    tabGiftCode?.addEventListener("click", () => {
        tabGiftCode.classList.add("is-active");
        tabDirect?.classList.remove("is-active");
        paneGiftCode?.classList.add("is-active");
        paneDirect?.classList.remove("is-active");
    });

    closeSendBtn?.addEventListener("click", () => {
        closePhotocardModal("sendCardModal", true);
    });
    sendModal?.addEventListener("click", (e) => {
        if (e.target === sendModal) closePhotocardModal("sendCardModal", true);
    });

    closeRedeemBtn?.addEventListener("click", () => {
        closePhotocardModal("redeemCodeModal", true);
    });
    redeemModal?.addEventListener("click", (e) => {
        if (e.target === redeemModal) closePhotocardModal("redeemCodeModal", true);
    });

    btnClaimGift?.addEventListener("click", () => {
        closePhotocardModal("giftReceivedModal", false);
        if (typeof openCardAlbumModal === "function") openCardAlbumModal();
    });
    receivedModal?.addEventListener("click", (e) => {
        if (e.target === receivedModal) closePhotocardModal("giftReceivedModal", false);
    });

    // 2. Fungsi Buka Modal Kirim Kartu
    window.openSendCardModal = function(cardParam = null) {
        const instances = getOwnedCardInstances();
        if (!instances || instances.length === 0) {
            showToast("⚠️ Kamu belum memiliki kartu untuk dikirim. Dapatkan kartu dari Check-In atau Misi!");
            return;
        }

        currentCardToGift = cardParam ? resolveCardData(cardParam) : resolveCardData(instances[0]);

        // Atur dropdown pilih kartu
        if (selectCardInput) {
            selectCardInput.innerHTML = "";
            instances.forEach((inst, idx) => {
                const resolved = resolveCardData(inst);
                const opt = document.createElement("option");
                opt.value = inst.instanceId || inst.serialNo || idx;
                opt.textContent = `[${resolved.rarity.toUpperCase()}] ${resolved.name} (${resolved.serialNo})`;
                if (currentCardToGift && ((currentCardToGift.instanceId && currentCardToGift.instanceId === inst.instanceId) || (currentCardToGift.serialNo && currentCardToGift.serialNo === inst.serialNo))) {
                    opt.selected = true;
                }
                selectCardInput.appendChild(opt);
            });

            selectCardInput.onchange = () => {
                const chosen = instances.find(i => (i.instanceId && i.instanceId === selectCardInput.value) || (i.serialNo && i.serialNo === selectCardInput.value));
                if (chosen) {
                    currentCardToGift = resolveCardData(chosen);
                    updateCardPreviewStrip(currentCardToGift);
                }
            };
        }

        if (selectCardGroup) {
            selectCardGroup.style.display = cardParam ? "none" : "block";
        }

        updateCardPreviewStrip(currentCardToGift);
        populateRecipientDropdown();

        // Reset state tabs & input
        if (tabDirect && tabGiftCode && paneDirect && paneGiftCode) {
            tabDirect.classList.add("is-active");
            tabGiftCode.classList.remove("is-active");
            paneDirect.classList.add("is-active");
            paneGiftCode.classList.remove("is-active");
        }
        if (cardMsgInput) cardMsgInput.value = "";
        if (targetUserManual) targetUserManual.value = "";
        if (giftCodeNote) giftCodeNote.value = "";
        if (codeResultBox) codeResultBox.style.display = "none";
        if (genCodeActionRow) genCodeActionRow.style.display = "block";

        showPhotocardModal("sendCardModal", { saveHistory: true });
    };

    function updateCardPreviewStrip(card) {
        if (!card) return;
        if (thumbImg) {
            let src = card.image;
            const isPages = window.location.pathname.includes('/pages/');
            if (isPages && !src.startsWith('../')) src = '../' + src;
            thumbImg.src = src;
        }
        if (thumbTitle) thumbTitle.textContent = card.name;
        if (thumbSerial) thumbSerial.textContent = card.serialNo || "#FN-0000";
        if (rarityPill) {
            rarityPill.textContent = card.rarity === "legendary" 
                ? "★ LAGEND ★" 
                : (card.rarity === "ultra_rare" ? "★ ULTRA RARE ★" : "✦ RARE ✦");
            rarityPill.style.background = card.rarity === "legendary"
                ? "linear-gradient(135deg, #FF0055, #FFB703)"
                : (card.rarity === "ultra_rare" ? "linear-gradient(135deg, #7209B7, #FFD166)" : "linear-gradient(135deg, #00B4D8, #00F5D4)");
        }
    }

    // 3. Muat Anggota Komunitas Penerima dari Firebase & Profil (HANYA NAMA PENGGUNA)
    async function populateRecipientDropdown() {
        if (!targetUserSelect) return;
        targetUserSelect.innerHTML = `<option value="">-- Pilih Anggota Komunitas --</option>`;

        const myUser = (localStorage.getItem("nihongoChatUser") || "").toLowerCase().trim();
        const candidateUsers = new Map();

        // Helper filter format email
        function isEmailFormat(str) {
            if (!str || typeof str !== "string") return true;
            const s = str.trim().toLowerCase();
            return s.includes("@") || s.includes(".com") || s.includes(".net") || s.includes(".org") || s.includes(".id") || s.includes(".co");
        }

        // Helper pembersih display name (buang @ domain jika ada)
        function cleanName(raw) {
            if (!raw || typeof raw !== "string") return "";
            let s = raw.trim();
            if (s.includes("@")) {
                s = s.split("@")[0].trim();
            }
            return s;
        }

        // 1. Anggota 4 Pilar Fournity dengan nama resmi
        const defaultMembers = ["Sensei Iqbal", "Fasya", "Umaedi", "Rifki"];
        defaultMembers.forEach(name => {
            const key = name.toLowerCase();
            if (key !== myUser) {
                candidateUsers.set(key, name);
            }
        });

        // 2. Tarik Profil Publik dari Firebase RTDB (user_profiles)
        try {
            const RTDB_BASE = 'https://nihongo-trinity-default-rtdb.firebaseio.com';
            const res = await fetch(`${RTDB_BASE}/user_profiles.json`, { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                if (data && typeof data === 'object') {
                    Object.entries(data).forEach(([key, val]) => {
                        const rawName = (val && val.displayName) ? val.displayName : key;
                        const name = cleanName(rawName);
                        // Hanya masukkan jika bukan email, tidak kosong, dan bukan akun sendiri
                        if (name && !isEmailFormat(name) && name.toLowerCase() !== myUser) {
                            const nameKey = name.toLowerCase();
                            candidateUsers.set(nameKey, name);
                        }
                    });
                }
            }
        } catch(e) {}

        // 3. Tarik dari in-memory window.userProfiles jika ada
        if (window.userProfiles && typeof window.userProfiles === "object") {
            Object.entries(window.userProfiles).forEach(([key, val]) => {
                const rawName = (val && val.displayName) ? val.displayName : key;
                const name = cleanName(rawName);
                if (name && !isEmailFormat(name) && name.toLowerCase() !== myUser) {
                    const nameKey = name.toLowerCase();
                    if (!candidateUsers.has(nameKey)) {
                        candidateUsers.set(nameKey, name);
                    }
                }
            });
        }

        // 4. Render ke Dropdown: HANYA NAMA PENGGUNA SAJA (TANPA EMAIL)
        candidateUsers.forEach((name) => {
            const opt = document.createElement("option");
            opt.value = name;
            opt.textContent = `👤 ${name}`;
            targetUserSelect.appendChild(opt);
        });
    }

    // 4. Konfirmasi Kirim Langsung ke User
    btnConfirmSend?.addEventListener("click", async () => {
        if (!currentCardToGift) {
            showToast("⚠️ Pilih kartu yang ingin dikirim terlebih dahulu.");
            return;
        }

        let target = targetUserSelect ? targetUserSelect.value.trim() : "";
        if (!target && targetUserManual) {
            target = targetUserManual.value.trim();
            if (target.includes("@")) {
                target = target.split("@")[0].trim();
            }
        }

        if (!target) {
            showToast("⚠️ Pilih atau ketik nama teman/anggota penerima kartu.");
            return;
        }

        const myUser = localStorage.getItem("nihongoChatUser") || "Gakusei";
        if (target.toLowerCase() === myUser.toLowerCase()) {
            showToast("⚠️ Kamu tidak bisa mengirim kartu ke akunmu sendiri.");
            return;
        }

        btnConfirmSend.disabled = true;
        btnConfirmSend.innerHTML = `⏳ Mengirimkan Kartu...`;

        try {
            await transferCardToUser(currentCardToGift, target, cardMsgInput ? cardMsgInput.value.trim() : "");
            closePhotocardModal("sendCardModal", false);
            if (typeof window.openCardAlbumModal === "function") {
                window.openCardAlbumModal();
            }
        } catch(err) {
            console.error("Gagal transfer kartu:", err);
            showToast("⚠️ Gagal mengirim kartu: " + (err.message || "Koneksi terganggu"));
        } finally {
            btnConfirmSend.disabled = false;
            btnConfirmSend.innerHTML = `🚀 Kirim Kartu Sekarang`;
        }
    });

    // 5. Eksekusi Transfer Kartu & Potong dari Inventory Pengirim
    async function transferCardToUser(card, recipientName, message = "") {
        const instances = getOwnedCardInstances();
        const cardIdx = instances.findIndex(i => 
            (card.instanceId && i.instanceId === card.instanceId) ||
            (card.serialNo && i.serialNo === card.serialNo) ||
            (i.cardId === card.id || i.id === card.id)
        );

        if (cardIdx === -1) {
            throw new Error("Kartu tidak ditemukan dalam koleksi milikmu.");
        }

        // Cabut kartu dari pengirim
        const [transferredCard] = instances.splice(cardIdx, 1);
        saveOwnedCardInstances(instances);

        // Jika kartu ini adalah avatar aktif pengirim, perbarui profil
        const activeSerial = localStorage.getItem("fournity_avatar_serial");
        if (activeSerial && transferredCard.serialNo && activeSerial === transferredCard.serialNo) {
            localStorage.removeItem("fournity_user_avatar");
            localStorage.removeItem("fournity_avatar_rarity");
            localStorage.removeItem("fournity_avatar_serial");
            syncMainTopHeaderProfile();
        }

        const myUser = localStorage.getItem("nihongoChatUser") || "Teman Fournity";
        const giftId = 'gift_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
        const giftData = {
            giftId: giftId,
            fromUser: myUser,
            toUser: recipientName,
            card: resolveCardData(transferredCard),
            message: message || "Selamat belajar bahasa Jepang! Ini kartu spesial untukmu 🌸",
            timestamp: Date.now(),
            status: "pending"
        };

        // Kirim ke Firebase RTDB
        const RTDB_BASE = 'https://nihongo-trinity-default-rtdb.firebaseio.com';
        try {
            await fetch(`${RTDB_BASE}/card_gifts/${encodeURIComponent(recipientName)}/${giftId}.json`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(giftData)
            });
        } catch(e) {}

        // Broadcast pengumuman pesan gembira di chat jika tersedia
        try {
            await fetch(`${RTDB_BASE}/messages.json`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: "System",
                    text: `🎁 [${myUser}] telah mengirimkan hadiah Foto Card [${transferredCard.name}] (${transferredCard.serialNo || ''}) kepada [${recipientName}]!`,
                    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                    timestamp: Date.now(),
                    isSystem: true
                })
            });
        } catch(e) {}

        playChime('success');
        showToast(`🎉 Sukses! Kartu [${transferredCard.name}] (${transferredCard.serialNo}) telah dikirimkan ke [${recipientName}]!`);

        // Refresh UI
        if (typeof window.refreshPass === 'function') window.refreshPass();
        const albumModal = document.getElementById("cardAlbumModal");
        if (albumModal && albumModal.style.display !== "none") {
            const activeFilter = document.querySelector(".album-filter-btn.is-active")?.dataset.filter || "all";
            if (typeof window.renderCardAlbum === "function") window.renderCardAlbum(activeFilter);
        }
        if (typeof renderShowcaseSlider === "function") renderShowcaseSlider();
    }

    // 6. Buat Kode Hadiah (Gift Code Transfer)
    btnGenCode?.addEventListener("click", async () => {
        if (!currentCardToGift) {
            showToast("⚠️ Pilih kartu yang ingin dibuatkan kode hadiah.");
            return;
        }

        btnGenCode.disabled = true;
        btnGenCode.innerHTML = `⏳ Menerbitkan Kode...`;

        try {
            const code = await createGiftCodeForCard(currentCardToGift, giftCodeNote ? giftCodeNote.value.trim() : "");
            if (codeDisplay) codeDisplay.textContent = code;
            if (codeResultBox) codeResultBox.style.display = "block";
            if (genCodeActionRow) genCodeActionRow.style.display = "none";
        } catch(err) {
            showToast("⚠️ " + (err.message || "Gagal membuat kode hadiah"));
        } finally {
            btnGenCode.disabled = false;
            btnGenCode.innerHTML = `✨ Terbitkan Kode Hadiah Baru`;
        }
    });

    async function createGiftCodeForCard(card, note = "") {
        const instances = getOwnedCardInstances();
        const cardIdx = instances.findIndex(i => 
            (card.instanceId && i.instanceId === card.instanceId) ||
            (card.serialNo && i.serialNo === card.serialNo) ||
            (i.cardId === card.id || i.id === card.id)
        );

        if (cardIdx === -1) throw new Error("Kartu tidak ditemukan dalam koleksi.");

        const [removedCard] = instances.splice(cardIdx, 1);
        saveOwnedCardInstances(instances);

        // Jika kartu ini adalah avatar aktif pengirim, perbarui profil
        const activeSerial = localStorage.getItem("fournity_avatar_serial");
        if (activeSerial && removedCard.serialNo && activeSerial === removedCard.serialNo) {
            localStorage.removeItem("fournity_user_avatar");
            localStorage.removeItem("fournity_avatar_rarity");
            localStorage.removeItem("fournity_avatar_serial");
            if (typeof syncMainTopHeaderProfile === "function") syncMainTopHeaderProfile();
        }

        const myUser = localStorage.getItem("nihongoChatUser") || "Teman Fournity";
        const codeSuffix = (card.cardId || card.id || 'CARD').replace('card_', '').toUpperCase();
        const cleanCode = `FN-GIFT-${Math.floor(1000 + Math.random() * 9000)}-${codeSuffix}`;

        const codeData = {
            code: cleanCode,
            fromUser: myUser,
            card: resolveCardData(removedCard),
            note: note || "Hadiah Foto Card Fournity spesial untukmu!",
            createdAt: Date.now(),
            status: "active"
        };

        const RTDB_BASE = 'https://nihongo-trinity-default-rtdb.firebaseio.com';
        await fetch(`${RTDB_BASE}/card_gift_codes/${cleanCode}.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(codeData)
        });

        playChime('bell');
        showToast(`✨ Kode Hadiah [${cleanCode}] berhasil diterbitkan!`);

        if (typeof window.refreshPass === 'function') window.refreshPass();
        const curAlbumModal = document.getElementById("cardAlbumModal");
        if (curAlbumModal && curAlbumModal.style.display !== "none") {
            const activeFilter = document.querySelector(".album-filter-btn.is-active")?.dataset.filter || "all";
            if (typeof window.renderCardAlbum === "function") window.renderCardAlbum(activeFilter);
        }
        if (typeof renderShowcaseSlider === "function") renderShowcaseSlider();

        return cleanCode;
    }

    btnCopyCode?.addEventListener("click", () => {
        const code = codeDisplay ? codeDisplay.textContent.trim() : "";
        if (!code) return;
        const msg = `🎁 Hai! Aku kirim Foto Card [${currentCardToGift?.name || 'Koleksi'}] (${currentCardToGift?.serialNo || ''}) untukmu di Nihongo Fournity!\n\n🔑 Kode Hadiah: ${code}\n\nKlaim di Beranda -> Album Foto Card -> Klaim Kode Hadiah!`;
        navigator.clipboard.writeText(msg).then(() => {
            showToast("📋 Kode hadiah dan pesan berhasil disalin ke clipboard!");
        });
    });

    // 7. Klaim Kode Hadiah (Redeem)
    window.openRedeemCodeModal = function() {
        if (inputRedeemCode) inputRedeemCode.value = "";
        showPhotocardModal("redeemCodeModal", { saveHistory: true });
    };

    btnSubmitRedeem?.addEventListener("click", async () => {
        const code = inputRedeemCode ? inputRedeemCode.value.trim().toUpperCase() : "";
        if (!code) {
            showToast("⚠️ Masukkan kode hadiah terlebih dahulu.");
            return;
        }

        btnSubmitRedeem.disabled = true;
        btnSubmitRedeem.innerHTML = `⏳ Memeriksa Kode...`;

        try {
            await redeemGiftCode(code);
            closePhotocardModal("redeemCodeModal", false);
        } catch(err) {
            showToast("⚠️ " + (err.message || "Gagal mengklaim kode"));
        } finally {
            btnSubmitRedeem.disabled = false;
            btnSubmitRedeem.innerHTML = `🎁 Klaim Kartu Sekarang`;
        }
    });

    async function redeemGiftCode(code) {
        const RTDB_BASE = 'https://nihongo-trinity-default-rtdb.firebaseio.com';
        const res = await fetch(`${RTDB_BASE}/card_gift_codes/${encodeURIComponent(code)}.json`, { cache: 'no-store' });
        if (!res.ok) throw new Error("Gagal memeriksa server.");
        const data = await res.json();

        if (!data || data.status !== 'active' || !data.card) {
            throw new Error("Kode hadiah tidak valid atau sudah pernah diklaim.");
        }

        const myUser = localStorage.getItem("nihongoChatUser") || "Gakusei";
        // Tandai sudah diklaim
        await fetch(`${RTDB_BASE}/card_gift_codes/${encodeURIComponent(code)}.json`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'claimed', claimedBy: myUser, claimedAt: Date.now() })
        });

        // Masukkan kartu ke koleksi penerima
        const instances = getOwnedCardInstances();
        const giftedCard = resolveCardData(data.card);
        instances.unshift(giftedCard);
        saveOwnedCardInstances(instances);

        // Buka modal perayaan
        showReceivedGiftCelebration({
            fromUser: data.fromUser || "Teman Fournity",
            message: data.note || "Selamat! Kartu berhasil kamu klaim!",
            card: giftedCard
        });
    }

    function showReceivedGiftCelebration(gift) {
        if (!gift || !gift.card) return;
        if (receivedTitle) receivedTitle.textContent = `Mendapatkan ${gift.card.name}!`;
        if (receivedSenderName) receivedSenderName.textContent = gift.fromUser || "Teman Fournity";
        if (receivedMsgBubble && receivedMsgText) {
            if (gift.message) {
                receivedMsgText.textContent = `“${gift.message}”`;
                receivedMsgBubble.style.display = "block";
            } else {
                receivedMsgBubble.style.display = "none";
            }
        }
        if (receivedSlot) {
            receivedSlot.innerHTML = renderSingleCardHTML(gift.card);
        }

        if (gift.card.rarity === "legendary") {
            playChime('legendary');
        } else {
            playChime('success');
        }

        showPhotocardModal("giftReceivedModal", { clearHistory: true });
        if (typeof window.refreshPass === 'function') window.refreshPass();
    }
    window.showReceivedGiftCelebration = showReceivedGiftCelebration;

    // 8. Listener Realtime Hadiah Masuk ke Akun
    let giftPollingInterval = null;
    async function checkIncomingGifts() {
        const myUser = (localStorage.getItem("nihongoChatUser") || "").trim();
        if (!myUser) return;

        try {
            const RTDB_BASE = 'https://nihongo-trinity-default-rtdb.firebaseio.com';
            const res = await fetch(`${RTDB_BASE}/card_gifts/${encodeURIComponent(myUser)}.json`, { cache: 'no-store' });
            if (!res.ok) return;
            const data = await res.json();
            if (!data || typeof data !== "object") return;

            const giftKeys = Object.keys(data);
            let pendingCount = 0;

            for (const key of giftKeys) {
                const gift = data[key];
                if (gift && gift.status === "pending" && gift.card) {
                    pendingCount++;
                    // Klaim otomatis ke inventory
                    const instances = getOwnedCardInstances();
                    const alreadyHasInst = instances.some(i => i.serialNo === gift.card.serialNo);
                    if (!alreadyHasInst) {
                        instances.unshift(resolveCardData(gift.card));
                        saveOwnedCardInstances(instances);
                    }

                    // Update status claimed di cloud
                    fetch(`${RTDB_BASE}/card_gifts/${encodeURIComponent(myUser)}/${key}.json`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'claimed', claimedAt: Date.now() })
                    });

                    // Tampilkan perayaan hadiah
                    showReceivedGiftCelebration(gift);
                    break; // Tampilkan satu per satu agar meriah
                }
            }

            const counterEl = document.getElementById("giftBadgeCounter");
            if (counterEl) {
                if (pendingCount > 0) {
                    counterEl.textContent = pendingCount;
                    counterEl.style.display = "inline-block";
                } else {
                    counterEl.style.display = "none";
                }
            }
        } catch(e) {}
    }

    // Periksa hadiah saat inisialisasi & polling berkala
    checkIncomingGifts();
    if (!giftPollingInterval) {
        giftPollingInterval = setInterval(checkIncomingGifts, 20000);
    }

    // Modal Kotak Hadiah
    window.openGiftInboxModal = function() {
        checkIncomingGifts();
        showToast("📬 Memeriksa kiriman kartu terbaru dari teman...");
    };
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

    // Inisialisasi Check-in Harian, Koleksi Foto Card & Sistem Kirim Hadiah
    setupDailyCheckin();
    setupPhotoCardCollection();
    initCardGiftingSystem();

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

    syncMainTopHeaderProfile();
});

// Sinkronisasi otomatis saat ada pembaruan storage (misal dari chat modal atau tab lain)
window.addEventListener("storage", (e) => {
    if (!e.key || e.key.includes("avatar") || e.key.includes("card") || e.key.includes("user") || e.key.includes("checkin") || e.key.includes("activity")) {
        syncMainTopHeaderProfile();
        if (typeof window.refreshPass === 'function') window.refreshPass();
        if (typeof window.renderCheckinUI === 'function') window.renderCheckinUI();
        if (typeof window.checkAndUpdateDailyQuests === 'function') window.checkAndUpdateDailyQuests();
    }
});