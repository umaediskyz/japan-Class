/* ==========================================================================
   NIHONGO FOURNITY - REAL-TIME MULTIPLAYER KANA BATTLE ENGINE
   Architecture: Firebase Realtime DB Sync + Web Audio Procedural Synth
   Features: Live Speed Race, 1v1 Room Matchmaking, Bot AI Rival, Emotes
   ========================================================================== */

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getDatabase, ref, set, get, onValue, update, remove, 
    push, onDisconnect, child 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// ==========================================================================
// 1. FIREBASE CONFIGURATION & INITIALIZATION
// ==========================================================================
const firebaseConfig = {
    apiKey: "AIzaSyBedu3Z7AMdD5dmaudzeCwxzkegpX5Qfvs",
    authDomain: "nihongo-trinity.firebaseapp.com",
    projectId: "nihongo-trinity",
    databaseURL: "https://nihongo-trinity-default-rtdb.firebaseio.com",
    storageBucket: "nihongo-trinity.firebasestorage.app",
    messagingSenderId: "369587231010",
    appId: "1:369587231010:web:6f69eb2516d660b9dfad7b"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

// ==========================================================================
// 2. KANA VOCABULARY DATABASE (HIRAGANA & KATAKANA)
// ==========================================================================
const HIRAGANA_DATA = [
    { kana: "あ", romaji: "a" }, { kana: "い", romaji: "i" }, { kana: "う", romaji: "u" }, { kana: "え", romaji: "e" }, { kana: "お", romaji: "o" },
    { kana: "か", romaji: "ka" }, { kana: "き", romaji: "ki" }, { kana: "く", romaji: "ku" }, { kana: "け", romaji: "ke" }, { kana: "こ", romaji: "ko" },
    { kana: "さ", romaji: "sa" }, { kana: "し", romaji: "shi" }, { kana: "す", romaji: "su" }, { kana: "せ", romaji: "se" }, { kana: "そ", romaji: "so" },
    { kana: "た", romaji: "ta" }, { kana: "ち", romaji: "chi" }, { kana: "つ", romaji: "tsu" }, { kana: "て", romaji: "te" }, { kana: "と", romaji: "to" },
    { kana: "な", romaji: "na" }, { kana: "に", romaji: "ni" }, { kana: "ぬ", romaji: "nu" }, { kana: "ね", romaji: "ne" }, { kana: "の", romaji: "no" },
    { kana: "は", romaji: "ha" }, { kana: "ひ", romaji: "hi" }, { kana: "ふ", romaji: "fu" }, { kana: "へ", romaji: "he" }, { kana: "ほ", romaji: "ho" },
    { kana: "ま", romaji: "ma" }, { kana: "み", romaji: "mi" }, { kana: "む", romaji: "mu" }, { kana: "め", romaji: "me" }, { kana: "も", romaji: "mo" },
    { kana: "や", romaji: "ya" }, { kana: "ゆ", romaji: "yu" }, { kana: "よ", romaji: "yo" },
    { kana: "ら", romaji: "ra" }, { kana: "り", romaji: "ri" }, { kana: "る", romaji: "ru" }, { kana: "れ", romaji: "re" }, { kana: "ろ", romaji: "ro" },
    { kana: "わ", romaji: "wa" }, { kana: "を", romaji: "wo" }, { kana: "ん", romaji: "n" }
];

const KATAKANA_DATA = [
    { kana: "ア", romaji: "a" }, { kana: "イ", romaji: "i" }, { kana: "ウ", romaji: "u" }, { kana: "エ", romaji: "e" }, { kana: "オ", romaji: "o" },
    { kana: "カ", romaji: "ka" }, { kana: "キ", romaji: "ki" }, { kana: "ク", romaji: "ku" }, { kana: "ケ", romaji: "ke" }, { kana: "コ", romaji: "ko" },
    { kana: "サ", romaji: "sa" }, { kana: "シ", romaji: "shi" }, { kana: "ス", romaji: "su" }, { kana: "セ", romaji: "se" }, { kana: "ソ", romaji: "so" },
    { kana: "タ", romaji: "ta" }, { kana: "チ", romaji: "chi" }, { kana: "ツ", romaji: "tsu" }, { kana: "テ", romaji: "te" }, { kana: "ト", romaji: "to" },
    { kana: "ナ", romaji: "na" }, { kana: "ニ", romaji: "ni" }, { kana: "ヌ", romaji: "nu" }, { kana: "ネ", romaji: "ne" }, { kana: "ノ", romaji: "no" },
    { kana: "ハ", romaji: "ha" }, { kana: "ヒ", romaji: "hi" }, { kana: "フ", romaji: "fu" }, { kana: "ヘ", romaji: "he" }, { kana: "ホ", romaji: "ho" },
    { kana: "マ", romaji: "ma" }, { kana: "ミ", romaji: "mi" }, { kana: "ム", romaji: "mu" }, { kana: "メ", romaji: "me" }, { kana: "モ", romaji: "mo" },
    { kana: "ヤ", romaji: "ya" }, { kana: "ユ", romaji: "yu" }, { kana: "ヨ", romaji: "yo" },
    { kana: "ラ", romaji: "ra" }, { kana: "リ", romaji: "ri" }, { kana: "ル", romaji: "ru" }, { kana: "レ", romaji: "re" }, { kana: "ロ", romaji: "ro" },
    { kana: "ワ", romaji: "wa" }, { kana: "ヲ", romaji: "wo" }, { kana: "ン", romaji: "n" }
];

// Kanji Battle Data (N5 & N4)
const KANJI_BATTLE_DATA = [
    { kanji: "水", meaning: "Air", reading: "mizu", level: "n5" },
    { kanji: "火", meaning: "Api", reading: "hi", level: "n5" },
    { kanji: "木", meaning: "Pohon / Kayu", reading: "ki", level: "n5" },
    { kanji: "金", meaning: "Emas / Uang", reading: "kane / kin", level: "n5" },
    { kanji: "土", meaning: "Tanah", reading: "tsuchi", level: "n5" },
    { kanji: "日", meaning: "Matahari / Hari", reading: "hi / nichi", level: "n5" },
    { kanji: "月", meaning: "Bulan", reading: "tsuki", level: "n5" },
    { kanji: "山", meaning: "Gunung", reading: "yama", level: "n5" },
    { kanji: "川", meaning: "Sungai", reading: "kawa", level: "n5" },
    { kanji: "雨", meaning: "Hujan", reading: "ame", level: "n5" },
    { kanji: "人", meaning: "Orang / Manusia", reading: "hito", level: "n5" },
    { kanji: "口", meaning: "Mulut", reading: "kuchi", level: "n5" },
    { kanji: "目", meaning: "Mata", reading: "me", level: "n5" },
    { kanji: "手", meaning: "Tangan", reading: "te", level: "n5" },
    { kanji: "足", meaning: "Kaki", reading: "ashi", level: "n5" },
    { kanji: "心", meaning: "Hati / Jiwa", reading: "kokoro", level: "n4" },
    { kanji: "力", meaning: "Kekuatan", reading: "chikara", level: "n5" },
    { kanji: "大", meaning: "Besar", reading: "ookii", level: "n5" },
    { kanji: "小", meaning: "Kecil", reading: "chiisai", level: "n5" },
    { kanji: "上", meaning: "Atas", reading: "ue", level: "n5" },
    { kanji: "下", meaning: "Bawah", reading: "shita", level: "n5" },
    { kanji: "中", meaning: "Dalam / Tengah", reading: "naka", level: "n5" },
    { kanji: "花", meaning: "Bunga", reading: "hana", level: "n5" },
    { kanji: "犬", meaning: "Anjing", reading: "inu", level: "n5" },
    { kanji: "猫", meaning: "Kucing", reading: "neko", level: "n4" },
    { kanji: "魚", meaning: "Ikan", reading: "sakana", level: "n5" },
    { kanji: "鳥", meaning: "Burung", reading: "tori", level: "n4" },
    { kanji: "天", meaning: "Langit / Surga", reading: "ten", level: "n5" },
    { kanji: "空", meaning: "Langit / Udara", reading: "sora", level: "n5" },
    { kanji: "海", meaning: "Laut", reading: "umi", level: "n4" },
    { kanji: "車", meaning: "Mobil / Kendaraan", reading: "kuruma", level: "n5" },
    { kanji: "門", meaning: "Gerbang", reading: "mon", level: "n5" },
    { kanji: "道", meaning: "Jalan / Ajaran", reading: "michi", level: "n4" },
    { kanji: "本", meaning: "Buku / Asal", reading: "hon", level: "n5" },
    { kanji: "学", meaning: "Belajar / Ilmu", reading: "manabu", level: "n5" },
    { kanji: "校", meaning: "Sekolah", reading: "kou", level: "n5" },
    { kanji: "友", meaning: "Sahabat / Teman", reading: "tomo", level: "n5" },
    { kanji: "時", meaning: "Waktu / Jam", reading: "toki", level: "n5" }
];

// Shiritori Chain Database
const SHIRITORI_DATA = [
    { prevWord: "ねこ (Kucing)", lastChar: "こ", correct: "こども (Anak)", wrong: ["さくら (Bunga)", "やま (Gunung)", "ほん (Buku)"] },
    { prevWord: "りんご (Apel)", lastChar: "ご", correct: "ごはん (Nasi)", wrong: ["くるま (Mobil)", "みず (Air)", "いぬ (Anjing)"] },
    { prevWord: "さくら (Sakura)", lastChar: "ら", correct: "らいおん (Singa)", wrong: ["とり (Burung)", "ゆき (Salju)", "つき (Bulan)"] },
    { prevWord: "いぬ (Anjing)", lastChar: "ぬ", correct: "ぬいぐるみ (Boneka)", wrong: ["はな (Bunga)", "そら (Langit)", "あめ (Hujan)"] },
    { prevWord: "やま (Gunung)", lastChar: "ま", correct: "まつり (Festival)", wrong: ["かわ (Sungai)", "ひ (Api)", "かぜ (Angin)"] },
    { prevWord: "くるま (Mobil)", lastChar: "ま", correct: "まんが (Manga)", wrong: ["て (Tangan)", "め (Mata)", "あし (Kaki)"] },
    { prevWord: "すし (Sushi)", lastChar: "し", correct: "しか (Rusa)", wrong: ["とり (Burung)", "うみ (Laut)", "ふね (Kapal)"] },
    { prevWord: "みず (Air)", lastChar: "ず", correct: "ずぼん (Celana)", wrong: ["ほん (Buku)", "えんぴつ (Pensil)", "かさ (Payung)"] },
    { prevWord: "つき (Bulan)", lastChar: "き", correct: "きつね (Rubah)", wrong: ["たいよう (Matahari)", "くも (Awan)", "ほし (Bintang)"] },
    { prevWord: "ほし (Bintang)", lastChar: "し", correct: "しろ (Kastil / Putih)", wrong: ["あお (Biru)", "あか (Merah)", "きいろ (Kuning)"] },
    { prevWord: "たぬき (Tanuki)", lastChar: "き", correct: "きもの (Kimono)", wrong: ["ゆかた (Yukata)", "げた (Geta)", "せんす (Kipas)"] },
    { prevWord: "うみ (Laut)", lastChar: "み", correct: "みかん (Jeruk)", wrong: ["ばなな (Pisang)", "いちご (Stroberi)", "すいか (Semangka)"] }
];

// Dojo Reflex Actions Data
const DOJO_REFLEX_DATA = [
    { prompt: "⚡ Musuh menghunus pedang tajam! Cepat TANGKIS! (防御)", targetPrompt: "⚔️ Serangan Datang!", target: "🛡️ TANGKIS (Bougyo)", options: ["🛡️ TANGKIS (Bougyo)", "👊 PUKUL (Kougeki)", "💨 HINDARI (Kaihi)", "🏃 LARI (Nige)"] },
    { prompt: "🔥 Musuh membuka celah pertahanan! Cepat PUKUL! (攻撃)", targetPrompt: "🥋 Celah Terbuka!", target: "👊 PUKUL (Kougeki)", options: ["👊 PUKUL (Kougeki)", "🛡️ TANGKIS (Bougyo)", "💨 HINDARI (Kaihi)", "🧘 MEDITASI (Zazen)"] },
    { prompt: "💨 Shuriken melesat ke arahmu! Segera HINDARI! (回避)", targetPrompt: "🌪️ Shuriken Lewat!", target: "💨 HINDARI (Kaihi)", options: ["💨 HINDARI (Kaihi)", "👊 PUKUL (Kougeki)", "🛡️ TANGKIS (Bougyo)", "👏 TEPUK (Hakushu)"] },
    { prompt: "🥋 Aba-aba Sensei: Hormati lawan sebelum tanding! (礼)", targetPrompt: "⛩️ Aba-aba Sensei!", target: "🙇 HORMAT (Rei)", options: ["🙇 HORMAT (Rei)", "👊 PUKUL (Kougeki)", "🛡️ TANGKIS (Bougyo)", "💨 HINDARI (Kaihi)"] },
    { prompt: "💥 Jurus pamungkas terisi penuh! Lancarkan SERANG BALIK! (反撃)", targetPrompt: "🔥 Hangeki Siap!", target: "⚡ HANGEKI (Serang Balik)", options: ["⚡ HANGEKI (Serang Balik)", "🛡️ TANGKIS (Bougyo)", "💨 HINDARI (Kaihi)", "💤 DIAM (Seishi)"] },
    { prompt: "🌊 Gelombang air menerjang lantai dojo! LOMPAT TINGGI! (跳躍)", targetPrompt: "🌊 Banjir Menerjang!", target: "🌪️ LOMPAT (Chouyaku)", options: ["🌪️ LOMPAT (Chouyaku)", "🛡️ TANGKIS (Bougyo)", "👊 PUKUL (Kougeki)", "🙇 HORMAT (Rei)"] }
];

// Multiplayer Games Metadata
const MULTIPLAYER_GAMES = {
    kana: {
        id: "kana",
        name: "Kana Speed Battle",
        jpName: "カナスピード",
        icon: "⚡",
        badge: "⚡ KANA SPEED",
        tag: "Huruf Kana",
        desc: "Tantang teman atau pemain lain di seluruh Indonesia! Tebak huruf Hiragana & Katakana secepat kilat. Siapa paling cepat dan bertahan sampai akhir, dia juara!",
        hint: "Tebak cara baca Romaji yang benar:",
        modes: [
            { id: "hiragana", label: "Hiragana (平)" },
            { id: "katakana", label: "Katakana (片)" },
            { id: "mixed", label: "Campur (Mix)" }
        ]
    },
    kanji: {
        id: "kanji",
        name: "Kanji Showdown",
        jpName: "漢字ストライク",
        icon: "🀄",
        badge: "🀄 KANJI SHOWDOWN",
        tag: "Kanji N5-N4",
        desc: "Adu pemahaman dan wawasan Kanji bahasa Jepang! Tebak arti kata bahasa Indonesia dari kanji N5 dan N4 secepat kilat 1v1!",
        hint: "Tebak arti bahasa Indonesia dari kanji ini:",
        modes: [
            { id: "n5", label: "N5 Dasar (初級)" },
            { id: "n4", label: "N4 Menengah (中級)" },
            { id: "mixed", label: "Campur (Mix)" }
        ]
    },
    janken: {
        id: "janken",
        name: "Jankenpon Royale",
        jpName: "じゃんけん対決",
        icon: "🤜",
        badge: "🤜 JANKEN ROYALE",
        tag: "Suit Royale",
        desc: "Adu taktik dan psikologi suit klasik Jepang: Guu (Batu), Choki (Gunting), Paa (Kertas)! Siapa menang ronde terbanyak, raih gelar Raja Jankenpon!",
        hint: "Keluarkan jurus tanganmu sebelum waktu habis:",
        modes: [
            { id: "standard", label: "Best of 5" },
            { id: "extended", label: "Best of 7" },
            { id: "marathon", label: "10 Ronde" }
        ]
    },
    shiritori: {
        id: "shiritori",
        name: "Kotoba Shiritori",
        jpName: "しりとり対戦",
        icon: "🗣️",
        badge: "🗣️ SHIRITORI CHAIN",
        tag: "Kosakata Kilat",
        desc: "Estafet kata bahasa Jepang tradisional! Lawan mengeluarkan kata, kamu harus menyambung kata baru dari huruf terakhir kata lawan tanpa boleh salah!",
        hint: "Pilih kata yang diawali dengan huruf terakhir:",
        modes: [
            { id: "standard", label: "Kosakata Santai" },
            { id: "mixed", label: "Kosakata Campur" }
        ]
    },
    dojo: {
        id: "dojo",
        name: "Reflex Dojo",
        jpName: "早押し道場",
        icon: "🥋",
        badge: "🥋 REFLEX DOJO",
        tag: "Refleks 0.5s",
        desc: "Uji kecepatan refleks dan pemahaman aba-aba ninja! Saat aba-aba muncul (Tangkis, Pukul, Hindari), segera tekan tombol yang tepat sebelum 3 detik!",
        hint: "Lakukan aksi secepat kilat sesuai aba-aba Sensei:",
        modes: [
            { id: "normal", label: "Normal (3.0s)" },
            { id: "fast", label: "Kilat (2.0s)" }
        ]
    }
};

// ==========================================================================
// 3. PROCEDURAL WEB AUDIO SYNTHESIZER
// ==========================================================================
let audioCtx = null;
function getAudioContext() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume();
    }
    return audioCtx;
}

function playTone(freq, duration = 0.15, type = "sine", gainVal = 0.15) {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(gainVal, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {}
}

const AudioSFX = {
    beep: (high = false) => playTone(high ? 880 : 440, 0.12, "triangle", 0.12),
    correct: () => {
        playTone(587.33, 0.1, "sine", 0.12);
        setTimeout(() => playTone(880, 0.22, "sine", 0.15), 80);
    },
    wrong: () => {
        playTone(220, 0.12, "sawtooth", 0.1);
        setTimeout(() => playTone(180, 0.2, "sawtooth", 0.1), 90);
    },
    speedBonus: () => {
        playTone(523.25, 0.08, "triangle", 0.1);
        setTimeout(() => playTone(659.25, 0.08, "triangle", 0.1), 60);
        setTimeout(() => playTone(1046.50, 0.2, "triangle", 0.12), 120);
    },
    fanfare: () => {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            setTimeout(() => playTone(freq, 0.35, "sine", 0.15), idx * 110);
        });
    }
};

// ==========================================================================
// 4. PLAYER IDENTITY & LOCAL STATE
// ==========================================================================
// 4. PLAYER IDENTITY & REAL PROFILE SYNCHRONIZATION
// ==========================================================================
function getOrCreatePlayerId() {
    let pid = sessionStorage.getItem("fournity_mp_pid");
    if (!pid) {
        pid = "p_" + Math.random().toString(36).substring(2, 9);
        sessionStorage.setItem("fournity_mp_pid", pid);
    }
    return pid;
}

const myId = getOrCreatePlayerId();
const hasAuthMulti = !!localStorage.getItem("nihongoChatUid");
let storedChatUser = localStorage.getItem("nihongoChatUser");
if (!hasAuthMulti && storedChatUser && ["umaedi", "iqbal", "rifki", "fasya"].includes(storedChatUser.toLowerCase())) {
    localStorage.removeItem("nihongoChatUser");
    storedChatUser = null;
}
let myName = storedChatUser || "Gakusei_" + myId.slice(-3);

/**
 * Mendapatkan foto profil akun pengguna secara akurat dari:
 * 1. window.userProfiles (RTDB user_profiles terupdate dari admin.js)
 * 2. localStorage avatar / fournity_user_profiles
 * 3. File avatar admin bawaan (../gambar/admin.png, dll)
 * 4. Fallback ke icon.png
 */
function getPlayerAvatar(username) {
    if (!username) return "../gambar/icon.png";
    const cleanUser = username.trim();

    // 1. Cek window.userProfiles (Sinkronisasi dari Firebase RTDB)
    if (window.userProfiles && window.userProfiles[cleanUser]?.photoBase64) {
        return window.userProfiles[cleanUser].photoBase64;
    }

    // 2. Cek localStorage avatar_<user> atau fournity_user_avatar
    const localAv = localStorage.getItem("avatar_" + cleanUser) || (cleanUser === myName ? localStorage.getItem("fournity_user_avatar") : null);
    if (localAv) {
        if (!localAv.startsWith('../') && !localAv.startsWith('http') && !localAv.startsWith('data:')) {
            return '../' + localAv;
        }
        return localAv;
    }

    // 3. Cek localStorage fournity_user_profiles
    try {
        const savedProfiles = JSON.parse(localStorage.getItem("fournity_user_profiles") || "{}");
        if (savedProfiles[cleanUser]?.photoBase64) {
            return savedProfiles[cleanUser].photoBase64;
        }
    } catch(e) {}

    // 4. Cek fallback avatar admin bawaan
    const defaultAvatars = ["admin", "dimas", "fathan", "rifqi", "haikal", "sultan", "indra", "bayu", "arya"];
    if (defaultAvatars.includes(cleanUser.toLowerCase())) {
        return `../gambar/${cleanUser.toLowerCase()}.png`;
    }

    return "../gambar/icon.png";
}

let myAvatar = getPlayerAvatar(myName);

// Inisialisasi presence ref dengan aman agar bebas dari Temporal Dead Zone (TDZ)
let myPresenceRef = null;
try {
    myPresenceRef = ref(db, `multiplayer_presence/${myId}`);
} catch(e) {
    console.warn("Presence ref init error:", e);
}

// Fungsi untuk menyinkronkan identitas pemain jika profil diubah di modal profil akun
function refreshMyIdentity() {
    const hasAuth = !!localStorage.getItem("nihongoChatUid");
    let storedUser = localStorage.getItem("nihongoChatUser");
    if (!hasAuth && storedUser && ["umaedi", "iqbal", "rifki", "fasya"].includes(storedUser.toLowerCase())) {
        localStorage.removeItem("nihongoChatUser");
        storedUser = null;
    }
    myName = storedUser || "Gakusei_" + myId.slice(-3);
    myAvatar = getPlayerAvatar(myName);

    const chipAv = document.getElementById("myChipAvatar");
    const chipNm = document.getElementById("myChipName");
    if (chipAv) chipAv.src = myAvatar;
    if (chipNm) chipNm.textContent = myName;

    // Sinkronkan presence online
    if (myPresenceRef) {
        set(myPresenceRef, {
            name: myName,
            avatar: myAvatar,
            onlineAt: Date.now()
        }).catch(() => {});
    }

    // Sinkronkan ke room jika sedang berada di room
    if (currentRoomId) {
        update(ref(db, `multiplayer_rooms/${currentRoomId}/players/${myId}`), {
            name: myName,
            avatar: myAvatar
        }).catch(() => {});
    }
}

// Pantau event pembaruan profil dari admin.js atau localStorage
window.addEventListener("profilesUpdated", refreshMyIdentity);
window.addEventListener("storage", (e) => {
    if (e.key === "nihongoChatUser" || e.key?.startsWith("avatar_") || e.key === "fournity_user_profiles") {
        refreshMyIdentity();
    }
});

// Setting Custom Game Variables
let selectedGameType = "kana";
let selectedMaxPlayers = 2; // 2, 3, 4 pemain
let selectedMode = "hiragana";
let selectedRounds = 10;
let selectedTimerSeconds = 5;

// Room State Variables
let currentRoomId = null;
let roomUnsubscribe = null;
let isHost = false;
let isBotMatch = false;
let roomMaxPlayers = 2;
let roomTimeLimit = 5.0;

// In-match variables
let currentRoundIdx = 0;
let roomQuestions = [];
let myScore = 0;
let myCorrectCount = 0;
let myStreak = 0;
let maxStreak = 0;
let reactionTimes = [];
let roundStartTimestamp = 0;
let roundTimerInterval = null;
let currentRoundSecondsLeft = 5.0;
let isAnswerLocked = false;
let botAnswerTimeout = null;

// Enemy Cache (Primary opponent)
let enemyId = null;
let enemyName = "Lawan";
let enemyAvatar = "../gambar/icon.png";
let enemyScore = 0;
let enemyCorrectCount = 0;
let enemyFinished = false;

// ==========================================================================
// 5. DOM ELEMENTS
// ==========================================================================
const views = {
    lobby: document.getElementById("viewLobby"),
    waiting: document.getElementById("viewWaiting"),
    battle: document.getElementById("viewBattle"),
    podium: document.getElementById("viewPodium")
};

function switchView(targetView) {
    Object.keys(views).forEach(key => {
        if (views[key]) {
            views[key].style.display = (key === targetView) ? "block" : "none";
        }
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Inisialisasi Top User Chip
const myChipAvatar = document.getElementById("myChipAvatar");
const myChipName = document.getElementById("myChipName");
if (myChipAvatar) myChipAvatar.src = myAvatar;
if (myChipName) myChipName.textContent = myName;

// ==========================================================================
// 6. ONLINE PRESENCE SYSTEM (REALTIME)
// ==========================================================================
if (myPresenceRef) {
    set(myPresenceRef, {
        name: myName,
        avatar: myAvatar,
        onlineAt: Date.now()
    }).catch(() => {});
    onDisconnect(myPresenceRef).remove();
}

const allPresenceRef = ref(db, "multiplayer_presence");
onValue(allPresenceRef, (snapshot) => {
    const data = snapshot.val() || {};
    const count = Object.keys(data).length;
    const countEl = document.getElementById("liveOnlineCount");
    if (countEl) countEl.textContent = `${count} Online`;
});

// ==========================================================================
// 7. MULTI-GAME QUESTION & ROUND GENERATOR ENGINE
// ==========================================================================

function generateGameQuestions(gameType = "kana", mode = "mixed", totalRounds = 10) {
    if (gameType === "kanji") {
        let pool = [...KANJI_BATTLE_DATA];
        if (mode === "n5") pool = pool.filter(k => k.level === "n5");
        else if (mode === "n4") pool = pool.filter(k => k.level === "n4");
        
        const shuffled = pool.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(totalRounds, shuffled.length));

        return selected.map(item => {
            const correctAnswer = item.meaning;
            const otherMeanings = pool.filter(p => p.meaning !== correctAnswer).map(p => p.meaning);
            const shuffledOthers = otherMeanings.sort(() => Math.random() - 0.5).slice(0, 3);
            const options = [correctAnswer, ...shuffledOthers].sort(() => Math.random() - 0.5);
            return {
                gameType: "kanji",
                kana: item.kanji,
                subHint: `Cara baca: ${item.reading}`,
                hint: "Tebak arti bahasa Indonesia dari kanji ini:",
                answer: correctAnswer,
                options: options
            };
        });
    }

    if (gameType === "janken") {
        const rounds = [];
        const roundsCount = mode === "standard" ? 5 : (mode === "extended" ? 7 : 10);
        for (let i = 1; i <= roundsCount; i++) {
            rounds.push({
                gameType: "janken",
                kana: "⚔️ じゃんけん ⚔️",
                subHint: `Ronde ${i}: Siapkan jurus tanganmu!`,
                hint: "Pilih Batu, Gunting, atau Kertas sebelum waktu habis:",
                answer: "janken_choice",
                options: ["✊ Batu (Guu)", "✌️ Gunting (Choki)", "🖐️ Kertas (Paa)"]
            });
        }
        return rounds;
    }

    if (gameType === "shiritori") {
        const shuffled = [...SHIRITORI_DATA].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(totalRounds, shuffled.length));

        return selected.map(item => {
            const options = [item.correct, ...item.wrong].sort(() => Math.random() - 0.5);
            return {
                gameType: "shiritori",
                kana: item.lastChar,
                subHint: `Kata Lawan: ${item.prevWord}`,
                hint: `Pilih kata yang diawali dengan huruf 「${item.lastChar}」:`,
                answer: item.correct,
                options: options
            };
        });
    }

    if (gameType === "dojo") {
        const shuffled = [...DOJO_REFLEX_DATA].sort(() => Math.random() - 0.5);
        const selected = [];
        for (let i = 0; i < totalRounds; i++) {
            selected.push(shuffled[i % shuffled.length]);
        }
        return selected.map(item => {
            return {
                gameType: "dojo",
                kana: item.targetPrompt,
                subHint: item.prompt,
                hint: "Aksi kilat! Sentuh tombol yang tepat sesuai perintah:",
                answer: item.target,
                options: [...item.options].sort(() => Math.random() - 0.5)
            };
        });
    }

    // Default Game: Kana Speed Battle
    let pool = [];
    if (mode === "hiragana") pool = [...HIRAGANA_DATA];
    else if (mode === "katakana") pool = [...KATAKANA_DATA];
    else pool = [...HIRAGANA_DATA, ...KATAKANA_DATA];

    const shuffledPool = pool.sort(() => Math.random() - 0.5);
    const selectedList = shuffledPool.slice(0, totalRounds);

    return selectedList.map(item => {
        const correctAnswer = item.romaji;
        const allRomajis = [...new Set(pool.map(p => p.romaji))].filter(r => r !== correctAnswer);
        const distractors = allRomajis.sort(() => Math.random() - 0.5).slice(0, 3);
        const options = [correctAnswer, ...distractors].sort(() => Math.random() - 0.5);
        return {
            gameType: "kana",
            kana: item.kana,
            hint: "Tebak cara baca Romaji yang benar:",
            answer: correctAnswer,
            options: options
        };
    });
}

// ==========================================================================
// 8. LOBBY & ROOM LIST MANAGEMENT
// ==========================================================================
// ==========================================================================
// 8. POPUP MODAL CUSTOM GAME & LOBBY MANAGEMENT
// ==========================================================================
const gameSetupOverlay = document.getElementById("gameSetupOverlay");
const btnCloseGameSetup = document.getElementById("btnCloseGameSetup");
const modalBtnQuickMatch = document.getElementById("modalBtnQuickMatch");
const modalBtnPlayBot = document.getElementById("modalBtnPlayBot");
const modalBtnCreateRoom = document.getElementById("modalBtnCreateRoom");

// Fungsi membuka popup modal setting custom game
function openGameSetupModal(gameType) {
    if (!MULTIPLAYER_GAMES[gameType]) gameType = "kana";
    selectedGameType = gameType;

    const g = MULTIPLAYER_GAMES[gameType];

    // Update Header Modal
    const iconEl = document.getElementById("modalGameIcon");
    const titleEl = document.getElementById("modalGameTitle");
    const tagEl = document.getElementById("modalGameTag");
    if (iconEl) iconEl.textContent = g.icon;
    if (titleEl) titleEl.textContent = g.name;
    if (tagEl) tagEl.textContent = g.badge;

    // Update Hero Lobby
    const heroTitle = document.getElementById("mpHeroTitle");
    const heroBadge = document.getElementById("mpHeroBadge");
    const heroDesc = document.getElementById("mpHeroDesc");
    if (heroTitle) heroTitle.innerHTML = `${g.name} <span>(対戦)</span>`;
    if (heroBadge) heroBadge.textContent = `${g.badge} · REALTIME 1V1 & PARTY`;
    if (heroDesc) heroDesc.textContent = g.desc;

    // Render Kategori Mode Soal Dinamis
    const modeWrap = document.getElementById("modalModeSelectorGroup");
    const valCategory = document.getElementById("valCategory");
    if (modeWrap && g.modes) {
        modeWrap.innerHTML = g.modes.map((m, idx) => `
            <button type="button" class="mp-setting-option-btn ${idx === 0 ? 'is-active' : ''}" data-mode="${m.id}">
                ${m.label}
            </button>
        `).join("");

        selectedMode = g.modes[0].id;
        if (valCategory) valCategory.textContent = g.modes[0].label;

        modeWrap.querySelectorAll(".mp-setting-option-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                modeWrap.querySelectorAll(".mp-setting-option-btn").forEach(b => b.classList.remove("is-active"));
                btn.classList.add("is-active");
                selectedMode = btn.dataset.mode;
                const matchMode = g.modes.find(m => m.id === selectedMode);
                if (valCategory) valCategory.textContent = matchMode ? matchMode.label : selectedMode;
                AudioSFX.beep();
            });
        });
    }

    // Update Preview Label Nilai Setting
    const valMaxPlayers = document.getElementById("valMaxPlayers");
    if (valMaxPlayers) {
        valMaxPlayers.textContent = `${selectedMaxPlayers} Pemain ${selectedMaxPlayers === 2 ? '(Duel 1v1)' : selectedMaxPlayers === 3 ? '(Segitiga)' : '(Party 4P)'}`;
    }
    const valRounds = document.getElementById("valRounds");
    if (valRounds) valRounds.textContent = `${selectedRounds} Soal`;
    const valTimer = document.getElementById("valTimer");
    if (valTimer) valTimer.textContent = `${selectedTimerSeconds}.0 Detik`;

    // Pastikan tombol aktif tersinkronisasi
    document.querySelectorAll("#modalMaxPlayersSelectorGroup .mp-setting-option-btn").forEach(b => {
        b.classList.toggle("is-active", parseInt(b.dataset.max, 10) === selectedMaxPlayers);
    });
    document.querySelectorAll("#modalRoundsSelectorGroup .mp-setting-option-btn").forEach(b => {
        b.classList.toggle("is-active", parseInt(b.dataset.rounds, 10) === selectedRounds);
    });
    document.querySelectorAll("#modalTimerSelectorGroup .mp-setting-option-btn").forEach(b => {
        b.classList.toggle("is-active", parseFloat(b.dataset.timer) === selectedTimerSeconds);
    });

    // Tampilkan Modal dengan class is-open dan inline visibility
    if (gameSetupOverlay) {
        gameSetupOverlay.classList.add("is-open");
        gameSetupOverlay.style.display = "flex";
        gameSetupOverlay.style.opacity = "1";
        gameSetupOverlay.style.visibility = "visible";
        gameSetupOverlay.style.pointerEvents = "auto";
        AudioSFX.beep(true);
    }
}

function closeGameSetupModal() {
    if (gameSetupOverlay) {
        gameSetupOverlay.classList.remove("is-open");
        gameSetupOverlay.style.display = "none";
        gameSetupOverlay.style.opacity = "0";
        gameSetupOverlay.style.visibility = "hidden";
        gameSetupOverlay.style.pointerEvents = "none";
    }
}

// Ekspos ke window agar dapat dipanggil dari mana saja (termasuk fallback inline)
window.openGameSetupModal = openGameSetupModal;
window.closeGameSetupModal = closeGameSetupModal;

// Handler Tutup Modal
if (btnCloseGameSetup) {
    btnCloseGameSetup.addEventListener("click", closeGameSetupModal);
}
if (gameSetupOverlay) {
    gameSetupOverlay.addEventListener("click", (e) => {
        if (e.target === gameSetupOverlay) closeGameSetupModal();
    });
}

// Handler Pilihan Max Pemain di Modal
document.querySelectorAll("#modalMaxPlayersSelectorGroup .mp-setting-option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll("#modalMaxPlayersSelectorGroup .mp-setting-option-btn").forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        selectedMaxPlayers = parseInt(btn.dataset.max, 10) || 2;
        const valMaxPlayers = document.getElementById("valMaxPlayers");
        if (valMaxPlayers) {
            valMaxPlayers.textContent = `${selectedMaxPlayers} Pemain ${selectedMaxPlayers === 2 ? '(Duel 1v1)' : selectedMaxPlayers === 3 ? '(Segitiga)' : '(Party 4P)'}`;
        }
        AudioSFX.beep();
    });
});

// Handler Pilihan Jumlah Ronde di Modal
document.querySelectorAll("#modalRoundsSelectorGroup .mp-setting-option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll("#modalRoundsSelectorGroup .mp-setting-option-btn").forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        selectedRounds = parseInt(btn.dataset.rounds, 10) || 10;
        const valRounds = document.getElementById("valRounds");
        if (valRounds) valRounds.textContent = `${selectedRounds} Soal`;
        AudioSFX.beep();
    });
});

// Handler Pilihan Batas Waktu di Modal
document.querySelectorAll("#modalTimerSelectorGroup .mp-setting-option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll("#modalTimerSelectorGroup .mp-setting-option-btn").forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        selectedTimerSeconds = parseFloat(btn.dataset.timer) || 5;
        const valTimer = document.getElementById("valTimer");
        if (valTimer) valTimer.textContent = `${selectedTimerSeconds}.0 Detik`;
        AudioSFX.beep();
    });
});

// Tombol Tanding Cepat (Quick Match) di Modal
if (modalBtnQuickMatch) {
    modalBtnQuickMatch.addEventListener("click", async () => {
        if (typeof window.requireFirebaseAuth === 'function') {
            if (!window.requireFirebaseAuth("Multiplayer Quick Match", () => handleQuickMatch())) {
                return;
            }
        }
        closeGameSetupModal();
        await handleQuickMatch();
    });
}

// Tombol Main Lawan Bot AI di Modal
if (modalBtnPlayBot) {
    modalBtnPlayBot.addEventListener("click", async () => {
        closeGameSetupModal();
        AudioSFX.fanfare();
        await createRoom(selectedGameType, selectedMode, selectedRounds, 2, selectedTimerSeconds, true);
    });
}

// Tombol Buat Room Custom di Modal
if (modalBtnCreateRoom) {
    modalBtnCreateRoom.addEventListener("click", async () => {
        if (typeof window.requireFirebaseAuth === 'function') {
            if (!window.requireFirebaseAuth("Multiplayer Custom Room")) {
                return;
            }
        }
        closeGameSetupModal();
        AudioSFX.fanfare();
        await createRoom(selectedGameType, selectedMode, selectedRounds, selectedMaxPlayers, selectedTimerSeconds, false);
    });
}

// Game Selector Hub: Saat Pemain Klik Salah Satu Game -> Buka Pop Up Setting Custom Game!
function bindGameSelector() {
    const cards = document.querySelectorAll("#gameGridHub .mp-game-card, .mp-game-card");
    cards.forEach(card => {
        card.addEventListener("click", (e) => {
            e.preventDefault();
            const gt = card.dataset.gametype;
            if (!gt) return;
            document.querySelectorAll("#gameGridHub .mp-game-card").forEach(c => c.classList.remove("is-active"));
            card.classList.add("is-active");
            openGameSetupModal(gt);
        });
    });
}

// Panggil saat script dieksekusi dan saat DOMContentLoaded selesai
bindGameSelector();
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindGameSelector);
}

// Delegasi event global di document: Jaminan 100% klik kartu game di mana pun selalu memicu popup!
document.addEventListener("click", (e) => {
    const card = e.target.closest("#gameGridHub .mp-game-card, .mp-game-card");
    if (card) {
        e.preventDefault();
        const gt = card.dataset.gametype || "kana";
        document.querySelectorAll("#gameGridHub .mp-game-card").forEach(c => c.classList.remove("is-active"));
        card.classList.add("is-active");
        openGameSetupModal(gt);
    }
});

// Listen to Public Waiting Rooms (Tampil di bagian paling atas halaman)
const roomsRef = ref(db, "multiplayer_rooms");
onValue(roomsRef, (snapshot) => {
    const listEl = document.getElementById("publicRoomList");
    if (!listEl) return;
    const rooms = snapshot.val() || {};
    const waitingRooms = [];

    Object.keys(rooms).forEach(rid => {
        const r = rooms[rid];
        const maxCap = r.maxPlayers || 2;
        const currentCount = Object.keys(r.players || {}).length;
        if (r && r.status === "waiting" && currentCount < maxCap) {
            waitingRooms.push({ id: rid, ...r, pCount: currentCount, maxCap: maxCap });
        }
    });

    if (waitingRooms.length === 0) {
        listEl.innerHTML = `
            <div class="mp-room-empty">
                <span>📡 Belum ada room yang menunggu lawan. Pilih game di bawah &amp; buat room sekarang!</span>
            </div>
        `;
    } else {
        listEl.innerHTML = waitingRooms.map(r => {
            const gInfo = MULTIPLAYER_GAMES[r.gameType || "kana"] || MULTIPLAYER_GAMES.kana;
            // Ambil avatar host asli
            const hostAvatar = r.players?.[r.hostId]?.avatar || getPlayerAvatar(r.hostName);
            return `
            <div class="mp-room-item">
                <div class="mp-room-info" style="display: flex; flex-direction: row; align-items: center; gap: 12px;">
                    <img src="${hostAvatar}" alt="${r.hostName}" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 2px solid var(--mp-accent-cyan); background: #1e293b;" onerror="this.src='../gambar/icon.png'">
                    <div>
                        <div class="mp-room-host">
                            <span>⛩️ ${r.hostName || "Host"}</span>
                            <span style="color: var(--mp-accent-cyan); font-weight: 800;">${gInfo.icon} ${gInfo.name}</span>
                        </div>
                        <div class="mp-room-meta">
                            Kode: <strong style="color: var(--mp-gold);">${r.code}</strong> · ${r.mode?.toUpperCase()} · ${r.totalRounds} Soal · 👥 ${r.pCount}/${r.maxCap} Pemain
                        </div>
                    </div>
                </div>
                <button type="button" class="mp-room-btn-join" data-roomid="${r.id}">
                    Tantang Lawan →
                </button>
            </div>
            `;
        }).join("");

        listEl.querySelectorAll(".mp-room-btn-join").forEach(btn => {
            btn.addEventListener("click", () => joinRoomById(btn.dataset.roomid));
        });
    }
});

// Join by Code Action (Di bagian paling atas halaman)
const btnJoinByCode = document.getElementById("btnJoinByCode");
const inputRoomCode = document.getElementById("inputRoomCode");
if (btnJoinByCode && inputRoomCode) {
    btnJoinByCode.addEventListener("click", async () => {
        const code = inputRoomCode.value.trim().toUpperCase();
        if (code.length !== 4) {
            alert("Harap masukkan 4 digit kode room!");
            return;
        }
        await joinRoomByCode(code);
    });

    inputRoomCode.addEventListener("keypress", async (e) => {
        if (e.key === "Enter") {
            const code = inputRoomCode.value.trim().toUpperCase();
            if (code.length === 4) await joinRoomByCode(code);
        }
    });
}

// Fungsi Quick Matchmaking Terpusat
async function handleQuickMatch() {
    AudioSFX.beep();
    try {
        const snap = await get(ref(db, "multiplayer_rooms"));
        const rooms = snap.val() || {};
        let foundRoomId = null;

        for (const rid of Object.keys(rooms)) {
            const r = rooms[rid];
            const maxCap = r.maxPlayers || 2;
            const pCount = Object.keys(r.players || {}).length;
            if (r && r.status === "waiting" && pCount < maxCap && r.hostId !== myId) {
                foundRoomId = rid;
                break;
            }
        }

        if (foundRoomId) {
            await joinRoomById(foundRoomId);
        } else {
            // Jika belum ada room terbuka, buat room instan dengan game yang dipilih
            await createRoom(selectedGameType, selectedMode, selectedRounds, selectedMaxPlayers, selectedTimerSeconds, false);
        }
    } catch (e) {
        console.error("Quick match error:", e);
    }
}

// ==========================================================================
// 9. ROOM CREATION & JOIN LOGIC
// ==========================================================================
function generateRoomCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

async function createRoom(gameType = "kana", mode = "mixed", totalRounds = 10, maxPlayers = 2, timeLimit = 5, withBot = false) {
    const code = generateRoomCode();
    const newRoomRef = push(ref(db, "multiplayer_rooms"));
    const roomId = newRoomRef.key;
    currentRoomId = roomId;
    isHost = true;
    isBotMatch = withBot;
    selectedGameType = gameType;
    roomMaxPlayers = maxPlayers;
    roomTimeLimit = timeLimit;

    // Refresh identitas & foto profil asli akun sebelum membuat room
    refreshMyIdentity();

    const questions = generateGameQuestions(gameType, mode, totalRounds);

    const roomPayload = {
        code: code,
        gameType: gameType,
        mode: mode,
        totalRounds: totalRounds,
        maxPlayers: maxPlayers,
        timeLimit: timeLimit,
        status: "waiting",
        hostId: myId,
        hostName: myName,
        createdAt: Date.now(),
        questions: questions,
        players: {
            [myId]: {
                name: myName,
                avatar: myAvatar,
                score: 0,
                correctCount: 0,
                finished: false,
                reaction: null,
                isHost: true
            }
        }
    };

    if (withBot) {
        roomPayload.players["bot_aoi"] = {
            name: "Aoi Sensei 🌸 (AI)",
            avatar: "../gambar/aoi_sensei.jpg",
            score: 0,
            correctCount: 0,
            finished: false,
            reaction: null,
            isHost: false
        };
        roomPayload.status = "playing"; // Langsung mulai jika mode AI
    }

    await set(newRoomRef, roomPayload);
    // Cleanup otomatis jika host disconnect
    onDisconnect(newRoomRef).remove();

    subscribeToRoom(roomId);
}

async function joinRoomById(roomId) {
    currentRoomId = roomId;
    isHost = false;
    isBotMatch = false;

    // Pastikan identitas & avatar paling mutakhir
    refreshMyIdentity();

    try {
        const snap = await get(ref(db, `multiplayer_rooms/${roomId}`));
        const r = snap.val();
        if (!r) {
            alert("Room tidak ditemukan atau sudah ditutup.");
            return;
        }

        const maxCap = r.maxPlayers || 2;
        const currentCount = Object.keys(r.players || {}).length;
        if (currentCount >= maxCap) {
            alert(`Room sudah penuh (${maxCap} pemain)!`);
            return;
        }

        const playerPayload = {
            name: myName,
            avatar: myAvatar,
            score: 0,
            correctCount: 0,
            finished: false,
            reaction: null,
            isHost: false
        };

        await update(ref(db, `multiplayer_rooms/${roomId}/players/${myId}`), playerPayload);
        onDisconnect(ref(db, `multiplayer_rooms/${roomId}/players/${myId}`)).remove();

        subscribeToRoom(roomId);
    } catch (e) {
        console.error("Gagal join room:", e);
    }
}

async function joinRoomByCode(code) {
    try {
        const snap = await get(ref(db, "multiplayer_rooms"));
        const rooms = snap.val() || {};
        let targetId = null;

        Object.keys(rooms).forEach(rid => {
            if (rooms[rid]?.code === code && rooms[rid]?.status === "waiting") {
                targetId = rid;
            }
        });

        if (targetId) {
            await joinRoomById(targetId);
        } else {
            alert(`Room dengan kode [${code}] tidak ditemukan atau sudah mulai bertanding!`);
        }
    } catch (e) {
        console.error(e);
    }
}

// Ekspos metode matchmaking realtime ke window agar multiplayer-ui.js dapat memicu secara mulus
window.mpCreateRoom = createRoom;
window.mpJoinByCode = joinRoomByCode;
window.mpJoinById = joinRoomById;
window.mpStartBotMatch = (gType, mode, rounds, timer) => createRoom(gType, mode, rounds, 2, timer, true);
window.mpQuickMatch = handleQuickMatch;
window.isFirebaseActive = true;

// ==========================================================================
// 10. REALTIME ROOM LISTENER & STATE SYNC
// ==========================================================================
function subscribeToRoom(roomId) {
    if (roomUnsubscribe) roomUnsubscribe();

    const roomRef = ref(db, `multiplayer_rooms/${roomId}`);
    roomUnsubscribe = onValue(roomRef, (snapshot) => {
        const r = snapshot.val();
        if (!r) {
            // Room was closed or deleted
            alert("Room pertandingan telah ditutup.");
            leaveCurrentRoom();
            return;
        }

        handleRoomStateChange(r);
    });
}

function handleRoomStateChange(roomData) {
    roomQuestions = roomData.questions || [];
    selectedGameType = roomData.gameType || "kana";
    selectedMode = roomData.mode || "hiragana";
    selectedRounds = roomData.totalRounds || 10;
    roomMaxPlayers = roomData.maxPlayers || 2;
    roomTimeLimit = roomData.timeLimit || 5.0;

    // Deteksi pemain yang terhubung
    const players = roomData.players || {};
    const playerIds = Object.keys(players);
    const otherPlayerIds = playerIds.filter(id => id !== myId);
    enemyId = otherPlayerIds[0] || null;

    if (enemyId && players[enemyId]) {
        enemyName = players[enemyId].name || "Lawan";
        enemyAvatar = players[enemyId].avatar || getPlayerAvatar(enemyName);
        enemyScore = players[enemyId].score || 0;
        enemyCorrectCount = players[enemyId].correctCount || 0;
        enemyFinished = players[enemyId].finished || false;

        // Cek jika lawan mengirim reaction emote
        if (players[enemyId].reaction) {
            showFloatingReaction(players[enemyId].reaction);
        }
    }

    // Pergantian Tampilan Sesuai Status Room
    if (roomData.status === "waiting") {
        switchView("waiting");
        updateWaitingRoomUI(roomData);
    } else if (roomData.status === "playing") {
        if (views.battle.style.display !== "block" && views.podium.style.display !== "block") {
            startBattleArena();
        }
        updateBattleRaceUI(players);
    } else if (roomData.status === "finished") {
        showPodiumScreen(players);
    }
}

// Waiting Room UI: Menampilkan Slot Pemain & Foto Profil Akun Asli
function updateWaitingRoomUI(r) {
    const badge = document.getElementById("waitingRoomModeBadge");
    const codeEl = document.getElementById("waitingRoomCode");
    const startBtn = document.getElementById("btnStartGame");
    const stage = document.getElementById("waitingVsStage");

    const gInfo = MULTIPLAYER_GAMES[r.gameType || selectedGameType] || MULTIPLAYER_GAMES.kana;
    const players = r.players || {};
    const pIds = Object.keys(players);
    const pCount = pIds.length;
    const maxCap = r.maxPlayers || 2;

    if (badge) {
        badge.textContent = `${gInfo.name.toUpperCase()} · ${r.mode?.toUpperCase()} · ${r.totalRounds} SOAL · 👥 ${pCount}/${maxCap} PEMAIN`;
    }
    if (codeEl) codeEl.textContent = r.code;

    // Render Slot Pemain (Mendukung 2, 3, atau 4 Pemain)
    if (stage) {
        if (maxCap > 2) {
            // Mode Party / Multi-Player Grid
            let slotsHtml = `<div class="mp-multi-slots-grid" style="width: 100%;">`;
            for (let i = 0; i < maxCap; i++) {
                const pid = pIds[i];
                if (pid && players[pid]) {
                    const p = players[pid];
                    const isPMe = (pid === myId);
                    const pAv = isPMe ? myAvatar : (p.avatar || getPlayerAvatar(p.name));
                    slotsHtml += `
                        <div class="mp-player-slot is-ready" style="padding: 16px 10px;">
                            <img src="${pAv}" alt="${p.name}" class="mp-player-slot-avatar" style="width: 64px; height: 64px; border-color: ${isPMe ? 'var(--mp-accent-cyan)' : '#FF2A54'};" onerror="this.src='../gambar/icon.png'">
                            <span class="mp-player-slot-name" style="font-size: 13px;">${p.name}${isPMe ? ' (Kamu)' : ''}</span>
                            <span class="mp-player-slot-status status-ready" style="font-size: 11px;">${p.isHost ? '👑 Host' : '✓ Siap'}</span>
                        </div>
                    `;
                } else {
                    slotsHtml += `
                        <div class="mp-player-slot" style="padding: 16px 10px; opacity: 0.6;">
                            <img src="../gambar/icon.png" alt="Empty Slot" class="mp-player-slot-avatar" style="width: 64px; height: 64px; border-color: #64748B; filter: grayscale(1);">
                            <span class="mp-player-slot-name" style="color: #94A3B8; font-size: 13px;">Slot ${i + 1}</span>
                            <span class="mp-player-slot-status status-waiting" style="font-size: 11px;">⏳ Menunggu...</span>
                        </div>
                    `;
                }
            }
            slotsHtml += `</div>`;
            stage.innerHTML = slotsHtml;
        } else {
            // Mode Duel 1v1 Klasik
            const enemyData = enemyId ? players[enemyId] : null;
            const enemyAv = enemyData ? (enemyData.avatar || getPlayerAvatar(enemyData.name)) : "../gambar/icon.png";

            stage.innerHTML = `
                <div class="mp-player-slot is-ready" id="p1Slot">
                    <img src="${myAvatar}" alt="Avatar Me" class="mp-player-slot-avatar" id="p1Avatar" onerror="this.src='../gambar/icon.png'">
                    <span class="mp-player-slot-name" id="p1Name">${myName} (Kamu)</span>
                    <span class="mp-player-slot-status status-ready" id="p1Status">✓ Siap Bertarung</span>
                </div>
                <div class="mp-vs-circle">VS</div>
                <div class="mp-player-slot ${enemyData ? 'is-ready' : ''}" id="p2Slot">
                    <img src="${enemyAv}" 
                         alt="Avatar Opponent" class="mp-player-slot-avatar" id="p2Avatar" 
                         style="${enemyData ? 'border-color: var(--mp-accent-cyan); opacity: 1;' : 'border-color: #64748B; opacity: 0.7;'}"
                         onerror="this.src='../gambar/icon.png'">
                    <span class="mp-player-slot-name" id="p2Name" style="${enemyData ? 'color: #fff;' : 'color: #94A3B8;'}">
                        ${enemyData ? enemyData.name : 'Menunggu Lawan...'}
                    </span>
                    <span class="mp-player-slot-status ${enemyData ? 'status-ready' : 'status-waiting'}" id="p2Status">
                        ${enemyData ? '✓ Lawan Siap!' : '⏳ Menunggu...'}
                    </span>
                </div>
            `;
        }
    }

    // Tombol Mulai: Aktif jika Host dan sudah ada minimal 2 pemain bergabung
    if (startBtn) {
        if (isHost) {
            startBtn.disabled = (pCount < 2);
            startBtn.textContent = (pCount >= 2) ? "⚔️ MULAI PERTANDINGAN" : `⏳ MENUNGGU LAWAN (${pCount}/${maxCap})`;
        } else {
            startBtn.disabled = true;
            startBtn.textContent = "⏳ MENUNGGU HOST MEMULAI...";
        }
    }
}

// Copy Room Link / Code Action
const btnCopyRoomLink = document.getElementById("btnCopyRoomLink");
if (btnCopyRoomLink) {
    btnCopyRoomLink.addEventListener("click", () => {
        const code = document.getElementById("waitingRoomCode")?.textContent || "";
        navigator.clipboard.writeText(code).then(() => {
            btnCopyRoomLink.textContent = "✓ Disalin!";
            setTimeout(() => { btnCopyRoomLink.textContent = "📋 Salin"; }, 2000);
        });
    });
}

// Start Game by Host
const btnStartGame = document.getElementById("btnStartGame");
if (btnStartGame) {
    btnStartGame.addEventListener("click", async () => {
        if (!currentRoomId || !isHost) return;
        AudioSFX.fanfare();
        await update(ref(db, `multiplayer_rooms/${currentRoomId}`), {
            status: "playing"
        });
    });
}

// Leave Room
const btnLeaveRoom = document.getElementById("btnLeaveRoom");
if (btnLeaveRoom) {
    btnLeaveRoom.addEventListener("click", () => {
        leaveCurrentRoom();
    });
}

function leaveCurrentRoom() {
    if (roomUnsubscribe) {
        roomUnsubscribe();
        roomUnsubscribe = null;
    }
    if (currentRoomId) {
        if (isHost) {
            remove(ref(db, `multiplayer_rooms/${currentRoomId}`));
        } else {
            remove(ref(db, `multiplayer_rooms/${currentRoomId}/players/${myId}`));
        }
        currentRoomId = null;
    }
    clearInterval(roundTimerInterval);
    clearTimeout(botAnswerTimeout);
    switchView("lobby");
}

// ==========================================================================
// 11. BATTLE ARENA ENGINE (SPEED RACE)
// ==========================================================================
function startBattleArena() {
    switchView("battle");
    currentRoundIdx = 0;
    myScore = 0;
    myCorrectCount = 0;
    myStreak = 0;
    maxStreak = 0;
    reactionTimes = [];

    // Load first question
    loadNextQuestion();

    // If bot match, start bot cycle
    if (isBotMatch) {
        scheduleBotAnswer();
    }
}

function loadNextQuestion() {
    if (currentRoundIdx >= roomQuestions.length) {
        finishMyRace();
        return;
    }

    isAnswerLocked = false;
    const q = roomQuestions[currentRoundIdx];
    // Batas waktu tiap ronde dinamis sesuai kustom setting host
    const maxSeconds = (q.gameType === "dojo") ? 3.0 : (roomTimeLimit || 5.0);
    currentRoundSecondsLeft = maxSeconds;
    roundStartTimestamp = Date.now();

    const roundText = document.getElementById("battleRoundText");
    const gameBadge = document.getElementById("battleGameBadge");
    const targetKana = document.getElementById("battleTargetKana");
    const targetHint = document.getElementById("battleTargetHint");
    const optionsGrid = document.getElementById("battleOptionsGrid");
    const timerText = document.getElementById("battleTimerText");
    const timerBar = document.getElementById("battleTimerBar");
    const clashBox = document.getElementById("jankenClashBox");

    if (clashBox) clashBox.style.display = "none";

    const gInfo = MULTIPLAYER_GAMES[q.gameType || selectedGameType] || MULTIPLAYER_GAMES.kana;
    if (gameBadge) gameBadge.textContent = gInfo.badge;
    if (roundText) roundText.textContent = `Ronde ${currentRoundIdx + 1} / ${roomQuestions.length}`;
    if (targetKana) targetKana.textContent = q.kana;
    if (timerText) timerText.textContent = `0${maxSeconds.toFixed(1)}s`;
    if (timerBar) {
        timerBar.style.width = "100%";
        timerBar.classList.remove("danger");
    }

    if (targetHint) {
        if (q.subHint) {
            targetHint.innerHTML = `<span style="color: var(--mp-gold); font-weight: 700; display: block; margin-bottom: 2px;">${q.subHint}</span><span>${q.hint}</span>`;
        } else {
            targetHint.textContent = q.hint;
        }
    }

    // Render Options
    if (optionsGrid) {
        optionsGrid.innerHTML = q.options.map(opt => `
            <button type="button" class="mp-option-btn" data-opt="${opt}">
                ${opt}
            </button>
        `).join("");

        optionsGrid.querySelectorAll(".mp-option-btn").forEach(btn => {
            btn.addEventListener("click", () => handleAnswerClick(btn, btn.dataset.opt, q.answer));
        });
    }

    // Start countdown timer
    clearInterval(roundTimerInterval);
    roundTimerInterval = setInterval(() => {
        currentRoundSecondsLeft -= 0.1;
        if (currentRoundSecondsLeft <= 0) {
            currentRoundSecondsLeft = 0;
            clearInterval(roundTimerInterval);
            handleTimeOut(q.answer);
        }

        const pct = Math.max(0, (currentRoundSecondsLeft / maxSeconds) * 100);
        if (timerBar) {
            timerBar.style.width = `${pct}%`;
            if (currentRoundSecondsLeft <= 1.5) timerBar.classList.add("danger");
        }
        if (timerText) {
            timerText.textContent = `0${currentRoundSecondsLeft.toFixed(1)}s`;
        }
    }, 100);
}

function handleAnswerClick(buttonEl, chosenOpt, correctOpt) {
    if (isAnswerLocked) return;
    isAnswerLocked = true;
    clearInterval(roundTimerInterval);

    const timeSpentMs = Date.now() - roundStartTimestamp;
    reactionTimes.push(timeSpentMs);

    const q = roomQuestions[currentRoundIdx];

    if (q && q.gameType === "janken") {
        // Jankenpon Hand Clash
        const hands = ["✊ Batu (Guu)", "✌️ Gunting (Choki)", "🖐️ Kertas (Paa)"];
        const botHand = hands[Math.floor(Math.random() * hands.length)];

        const clashBox = document.getElementById("jankenClashBox");
        const myHandEl = document.getElementById("jankenMyHand");
        const enHandEl = document.getElementById("jankenEnemyHand");
        if (clashBox && myHandEl && enHandEl) {
            clashBox.style.display = "flex";
            myHandEl.textContent = chosenOpt.split(" ")[0];
            enHandEl.textContent = botHand.split(" ")[0];
        }

        let isWin = false;
        let isDraw = false;
        if (chosenOpt.startsWith("✊") && botHand.startsWith("✌️")) isWin = true;
        else if (chosenOpt.startsWith("✌️") && botHand.startsWith("🖐️")) isWin = true;
        else if (chosenOpt.startsWith("🖐️") && botHand.startsWith("✊")) isWin = true;
        else if (chosenOpt.slice(0, 2) === botHand.slice(0, 2)) isDraw = true;

        if (isWin) {
            buttonEl.classList.add("btn-correct");
            AudioSFX.correct();
            myScore += 120;
            myCorrectCount++;
            myStreak++;
            if (myStreak > maxStreak) maxStreak = myStreak;
            showFloatingReaction("🔥");
        } else if (isDraw) {
            buttonEl.classList.add("btn-correct");
            AudioSFX.speedBonus();
            myScore += 40;
            showFloatingReaction("⚡");
        } else {
            buttonEl.classList.add("btn-wrong");
            AudioSFX.wrong();
            myStreak = 0;
            showFloatingReaction("😭");
        }

        syncMyProgressToFirebase();

        setTimeout(() => {
            currentRoundIdx++;
            loadNextQuestion();
        }, 950);
        return;
    }

    // Standard Correct/Wrong check (Kana, Kanji, Shiritori, Dojo)
    if (chosenOpt === correctOpt) {
        buttonEl.classList.add("btn-correct");
        AudioSFX.correct();

        const speedBonus = Math.floor(currentRoundSecondsLeft * 20);
        const roundPts = 100 + speedBonus;
        myScore += roundPts;
        myCorrectCount++;
        myStreak++;
        if (myStreak > maxStreak) maxStreak = myStreak;

        if (speedBonus > 60) AudioSFX.speedBonus();
    } else {
        buttonEl.classList.add("btn-wrong");
        AudioSFX.wrong();
        myStreak = 0;

        document.querySelectorAll("#battleOptionsGrid .mp-option-btn").forEach(b => {
            if (b.dataset.opt === correctOpt) b.classList.add("btn-correct");
        });
    }

    syncMyProgressToFirebase();

    setTimeout(() => {
        currentRoundIdx++;
        loadNextQuestion();
    }, 450);
}

function handleTimeOut(correctOpt) {
    if (isAnswerLocked) return;
    isAnswerLocked = true;
    AudioSFX.wrong();
    myStreak = 0;
    reactionTimes.push(5000);

    // Highlight correct
    document.querySelectorAll("#battleOptionsGrid .mp-option-btn").forEach(b => {
        if (b.dataset.opt === correctOpt) b.classList.add("btn-correct");
    });

    syncMyProgressToFirebase();

    setTimeout(() => {
        currentRoundIdx++;
        loadNextQuestion();
    }, 600);
}

function syncMyProgressToFirebase() {
    if (!currentRoomId) return;
    const isFinished = currentRoundIdx >= roomQuestions.length - 1;

    update(ref(db, `multiplayer_rooms/${currentRoomId}/players/${myId}`), {
        score: myScore,
        correctCount: myCorrectCount,
        finished: isFinished
    });
}

// Render Seluruh Lane Balapan Pemain Real-Time dengan Avatar Asli
function updateBattleRaceUI(players) {
    const totalQ = roomQuestions.length || 10;
    const trackCard = document.getElementById("battleRaceTrackCard");
    const playerList = Object.keys(players);

    if (trackCard && playerList.length > 0) {
        const laneColors = [
            { stroke: "var(--mp-accent-cyan)", bg: "linear-gradient(90deg, #00F5D4, #00BBF9)" },
            { stroke: "#FF2A54", bg: "linear-gradient(90deg, #FF2A54, #FF758C)" },
            { stroke: "var(--mp-gold)", bg: "linear-gradient(90deg, #FFD166, #FF9E00)" },
            { stroke: "#A855F7", bg: "linear-gradient(90deg, #A855F7, #C084FC)" }
        ];

        trackCard.innerHTML = playerList.map((pid, idx) => {
            const p = players[pid];
            const isMe = (pid === myId);
            const pAvatar = isMe ? myAvatar : (p.avatar || getPlayerAvatar(p.name));
            const pCorrect = p.correctCount || 0;
            const pScore = p.score || 0;
            const pPct = Math.min(100, (pCorrect / totalQ) * 100);
            const color = laneColors[idx % laneColors.length];

            return `
            <div class="mp-lane" style="border-left: 3px solid ${color.stroke};">
                <div class="mp-lane-user">
                    <img src="${pAvatar}" alt="${p.name}" class="mp-lane-avatar" style="border-color: ${color.stroke};" onerror="this.src='../gambar/icon.png'">
                    <span class="mp-lane-name" style="${isMe ? 'color: var(--mp-accent-cyan); font-weight: 800;' : ''}">${p.name}${isMe ? ' (Kamu)' : ''}</span>
                </div>
                <div class="mp-lane-track">
                    <div class="mp-lane-fill" style="width: ${pPct}%; background: ${color.bg};"></div>
                </div>
                <div class="mp-lane-score" style="color: ${color.stroke}; font-weight: 800;">${pScore.toLocaleString()} PTS</div>
            </div>
            `;
        }).join("");
    }

    // Cek apakah semua pemain telah menyelesaikan pertandingan
    const allFinished = playerList.length >= 2 && playerList.every(pid => players[pid]?.finished);
    if (allFinished && isHost) {
        update(ref(db, `multiplayer_rooms/${currentRoomId}`), {
            status: "finished"
        });
    }
}

async function finishMyRace() {
    clearInterval(roundTimerInterval);
    syncMyProgressToFirebase();

    // Tampilkan overlay selesai sementara menunggu lawan
    const flashcard = document.getElementById("battleFlashcardBox");
    if (flashcard) {
        flashcard.innerHTML = `
            <div style="padding: 40px 10px;">
                <span style="font-size: 48px;">🏁</span>
                <h3 style="color: #fff; margin: 12px 0 6px;">Kamu Telah Selesai!</h3>
                <p style="color: var(--mp-gold); font-size: 14px; font-weight: 700;">Skor Akhir: ${myScore.toLocaleString()} PTS</p>
                <p style="color: #94A3B8; font-size: 12px;">Menunggu semua pemain menyelesaikan pertandingan...</p>
            </div>
        `;
    }

    if (isBotMatch || !enemyId) {
        setTimeout(async () => {
            if (currentRoomId) {
                await update(ref(db, `multiplayer_rooms/${currentRoomId}`), {
                    status: "finished"
                });
            }
        }, 1200);
    }
}

// ==========================================================================
// 12. BOT AI (AOI SENSEI) SIMULATION
// ==========================================================================
let botRoundIdx = 0;
function scheduleBotAnswer() {
    if (!currentRoomId || !isBotMatch) return;
    if (botRoundIdx >= roomQuestions.length) return;

    // Bot menjawab antara 1.4s hingga 2.8s
    const botDelay = 1400 + Math.random() * 1400;
    botAnswerTimeout = setTimeout(async () => {
        // 90% akurasi
        const isBotCorrect = Math.random() < 0.90;
        if (isBotCorrect) {
            enemyCorrectCount++;
            const botPts = 100 + Math.floor(Math.random() * 60);
            enemyScore += botPts;
        }

        botRoundIdx++;
        const isBotDone = botRoundIdx >= roomQuestions.length;

        // Sesekali bot kirim emote
        const randomEmote = Math.random() < 0.25 ? ["🌸", "👏", "🔥"][Math.floor(Math.random() * 3)] : null;

        await update(ref(db, `multiplayer_rooms/${currentRoomId}/players/bot_aoi`), {
            score: enemyScore,
            correctCount: enemyCorrectCount,
            finished: isBotDone,
            reaction: randomEmote
        });

        if (!isBotDone) {
            scheduleBotAnswer();
        }
    }, botDelay);
}

// ==========================================================================
// 13. LIVE EMOTE REACTIONS
// ==========================================================================
document.querySelectorAll(".mp-emote-dock .mp-emote-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
        const emote = btn.dataset.emote;
        showFloatingReaction(emote);
        if (currentRoomId) {
            await update(ref(db, `multiplayer_rooms/${currentRoomId}/players/${myId}`), {
                reaction: emote
            });
            // Reset reaction after 1.5s
            setTimeout(() => {
                if (currentRoomId) {
                    update(ref(db, `multiplayer_rooms/${currentRoomId}/players/${myId}`), { reaction: null });
                }
            }, 1500);
        }
    });
});

function showFloatingReaction(emote) {
    const box = document.getElementById("floatingReactionBox");
    if (!box) return;
    const el = document.createElement("span");
    el.className = "mp-floating-reaction";
    el.textContent = emote;
    el.style.left = `${20 + Math.random() * 60}%`;
    el.style.top = "60%";
    box.appendChild(el);
    setTimeout(() => {
        if (box.contains(el)) box.removeChild(el);
    }, 1800);
}

// ==========================================================================
// 14. VICTORY PODIUM & GAME OVER SCREEN
// ==========================================================================
function showPodiumScreen(players) {
    switchView("podium");
    clearInterval(roundTimerInterval);
    clearTimeout(botAnswerTimeout);

    // Urutkan seluruh pemain dari skor tertinggi ke terendah
    const sortedPlayers = Object.entries(players).map(([id, p]) => ({
        id,
        name: p.name || "Pemain",
        avatar: (id === myId) ? myAvatar : (p.avatar || getPlayerAvatar(p.name)),
        score: p.score || 0,
        correctCount: p.correctCount || 0,
        isMe: (id === myId)
    })).sort((a, b) => b.score - a.score);

    const winner = sortedPlayers[0] || { name: myName, score: myScore };
    const isWinner = winner.isMe;
    const isTie = sortedPlayers.length >= 2 && sortedPlayers[0].score === sortedPlayers[1].score;

    const trophyIcon = document.getElementById("podiumIcon");
    const podiumTitle = document.getElementById("podiumTitle");
    const podiumSub = document.getElementById("podiumSub");
    const myCard = document.getElementById("podiumMyCard");
    const enemyCard = document.getElementById("podiumEnemyCard");

    if (isWinner) {
        AudioSFX.fanfare();
        if (trophyIcon) trophyIcon.textContent = "👑";
        if (podiumTitle) podiumTitle.textContent = "KEMENANGAN TELAK!";
        if (podiumSub) podiumSub.textContent = "Kamu mengalahkan lawan dengan kecepatan refleks dan ketepatan luar biasa!";
        if (myCard) myCard.classList.add("winner");
        if (enemyCard) enemyCard.classList.remove("winner");
    } else if (isTie) {
        if (trophyIcon) trophyIcon.textContent = "🤝";
        if (podiumTitle) podiumTitle.textContent = "HASIL IMBANG!";
        if (podiumSub) podiumSub.textContent = "Skor pemain sama persis! Pertarungan yang sangat seru dan sengit!";
        if (myCard) myCard.classList.remove("winner");
        if (enemyCard) enemyCard.classList.remove("winner");
    } else {
        AudioSFX.wrong();
        if (trophyIcon) trophyIcon.textContent = "🥈";
        if (podiumTitle) podiumTitle.textContent = "PERJALANAN HEBAT!";
        if (podiumSub) podiumSub.textContent = `${winner.name} sedikit lebih unggul kali ini. Jangan menyerah, coba tanding ulang!`;
        if (myCard) myCard.classList.remove("winner");
        if (enemyCard) enemyCard.classList.add("winner");
    }

    // Populate Stats Pemain Lokal
    const totalQ = roomQuestions.length || 10;
    const avgMs = reactionTimes.length > 0 ? (reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length / 1000).toFixed(1) : "1.5";

    const myPodiumAv = document.getElementById("podiumMyAvatar");
    const myPodiumNm = document.getElementById("podiumMyName");
    const myPodiumSc = document.getElementById("podiumMyScore");
    const myPodiumCor = document.getElementById("podiumMyCorrect");
    const myPodiumSpd = document.getElementById("podiumMyAvgSpeed");
    const myPodiumStr = document.getElementById("podiumMyStreak");

    if (myPodiumAv) myPodiumAv.src = myAvatar;
    if (myPodiumNm) myPodiumNm.textContent = `${myName} (Kamu)`;
    if (myPodiumSc) myPodiumSc.textContent = myScore.toLocaleString();
    if (myPodiumCor) myPodiumCor.textContent = `🎯 ${myCorrectCount} / ${totalQ} Benar`;
    if (myPodiumSpd) myPodiumSpd.textContent = `⚡ Rata-rata: ${avgMs}s`;
    if (myPodiumStr) myPodiumStr.textContent = `🔥 Max Streak: ${maxStreak}`;

    // Populate Stats Lawan Utama / Juara
    const topRival = sortedPlayers.find(p => !p.isMe) || sortedPlayers[1] || { name: "Lawan", score: 0, correctCount: 0, avatar: "../gambar/icon.png" };
    const rivalAv = document.getElementById("podiumEnemyAvatar");
    const rivalNm = document.getElementById("podiumEnemyName");
    const rivalSc = document.getElementById("podiumEnemyScore");
    const rivalCor = document.getElementById("podiumEnemyCorrect");
    const rivalSpd = document.getElementById("podiumEnemyAvgSpeed");
    const rivalStr = document.getElementById("podiumEnemyStreak");

    if (rivalAv) rivalAv.src = topRival.avatar;
    if (rivalNm) rivalNm.textContent = topRival.name;
    if (rivalSc) rivalSc.textContent = topRival.score.toLocaleString();
    if (rivalCor) rivalCor.textContent = `🎯 ${topRival.correctCount} / ${totalQ} Benar`;
    if (rivalSpd) rivalSpd.textContent = `⚡ Rata-rata: 1.6s`;
    if (rivalStr) rivalStr.textContent = `🔥 Max Streak: ${topRival.correctCount}`;

    // EXP Gain
    const expGain = isWinner ? 120 : (isTie ? 75 : 45);
    const expEl = document.getElementById("podiumExpGained");
    if (expEl) expEl.textContent = `+${expGain} XP`;

    // Persist EXP to LocalStorage
    try {
        const curExp = Number(localStorage.getItem("trinity_exp") || 80);
        localStorage.setItem("trinity_exp", curExp + expGain);
    } catch(e) {}
}

// Rematch & Leave from Podium
const btnRematch = document.getElementById("btnRematch");
if (btnRematch) {
    btnRematch.addEventListener("click", async () => {
        if (isBotMatch) {
            await createRoom(selectedMode, selectedRounds, true);
        } else if (currentRoomId && isHost) {
            const newQuestions = generateGameQuestions(selectedMode, selectedRounds);
            await update(ref(db, `multiplayer_rooms/${currentRoomId}`), {
                status: "playing",
                questions: newQuestions,
                players: {
                    [myId]: { name: myName, avatar: myAvatar, score: 0, correctCount: 0, finished: false, isHost: true },
                    [enemyId]: { name: enemyName, avatar: enemyAvatar, score: 0, correctCount: 0, finished: false, isHost: false }
                }
            });
        } else {
            leaveCurrentRoom();
        }
    });
}

const btnPodiumLobby = document.getElementById("btnPodiumLobby");
if (btnPodiumLobby) {
    btnPodiumLobby.addEventListener("click", () => {
        leaveCurrentRoom();
    });
}
