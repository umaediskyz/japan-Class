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
window.isFirebaseActive = true;

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
    if (!pid || !window.name || !window.name.startsWith("fournity_tab_")) {
        const tabToken = "tab_" + Math.random().toString(36).substring(2, 9);
        window.name = "fournity_tab_" + tabToken;
        pid = "p_" + tabToken;
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
 * Normalisasi URL Avatar khusus halaman /pages/multiplayer.html
 * Memastikan path lokal berawalan '../', dan data: / http:// / https:// tetap utuh.
 */
function normalizeAvatarUrl(url) {
    if (!url || typeof url !== "string") return "../gambar/icon.png";
    let src = url.trim();
    if (!src) return "../gambar/icon.png";

    if (src.startsWith("data:") || src.startsWith("http://") || src.startsWith("https://") || src.startsWith("blob:")) {
        return src;
    }

    const cleanPath = src.replace(/^(\.\.\/|\.\/)+/, '');
    return "../" + cleanPath;
}

/**
 * Mendapatkan foto profil akun pengguna yang sedang login secara 100% REAL dari:
 * 1. Kartu fotocard yang dipasang di halaman utama (fournity_user_avatar)
 * 2. Foto profil custom upload dari halaman utama (fournity_custom_avatar)
 * 3. LocalStorage avatar_<user>
 * 4. Firebase RTDB window.userProfiles (sinkronisasi dari admin.js & profil)
 * 5. LocalStorage fournity_user_profiles
 * 6. Memory window.newPhotoBase64
 * 7. Avatar admin/pilar bawaan jika sesuai
 * 8. Fallback ../gambar/icon.png
 */
function getMyRealAvatar(username = null) {
    const hasAuth = !!localStorage.getItem("nihongoChatUid");
    const rawUser = username || (hasAuth ? localStorage.getItem("nihongoChatUser") : null) || myName || "Gakusei";
    const cleanUser = rawUser ? rawUser.trim() : "";

    // 1. Cek kartu fotocard yang dipasang sebagai avatar aktif di halaman utama
    const cardAvatar = localStorage.getItem("fournity_user_avatar");
    if (cardAvatar && cardAvatar.trim()) {
        return normalizeAvatarUrl(cardAvatar);
    }

    // 2. Cek foto profil custom upload dari halaman utama
    const customPhoto = localStorage.getItem("fournity_custom_avatar");
    if (customPhoto && customPhoto.trim()) {
        return normalizeAvatarUrl(customPhoto);
    }

    // 3. Cek localStorage avatar_<user>
    if (cleanUser) {
        const userStored = localStorage.getItem("avatar_" + cleanUser);
        if (userStored && userStored.trim()) {
            return normalizeAvatarUrl(userStored);
        }
        const lowerStored = localStorage.getItem("avatar_" + cleanUser.toLowerCase());
        if (lowerStored && lowerStored.trim()) {
            return normalizeAvatarUrl(lowerStored);
        }
    }

    // 4. Cek window.userProfiles (dari database Firebase RTDB)
    if (window.userProfiles && cleanUser) {
        const prof = window.userProfiles[cleanUser] || 
                     Object.entries(window.userProfiles).find(([k]) => k.toLowerCase() === cleanUser.toLowerCase())?.[1];
        if (prof) {
            const dbPhoto = prof.photoBase64 || prof.avatar || prof.customPhoto;
            if (dbPhoto && dbPhoto.trim()) {
                return normalizeAvatarUrl(dbPhoto);
            }
        }
    }

    // 5. Cek localStorage fournity_user_profiles
    try {
        const saved = JSON.parse(localStorage.getItem("fournity_user_profiles") || "{}");
        if (cleanUser && saved[cleanUser]) {
            const sPhoto = saved[cleanUser].photoBase64 || saved[cleanUser].avatar;
            if (sPhoto && sPhoto.trim()) {
                return normalizeAvatarUrl(sPhoto);
            }
        }
    } catch(e) {}

    // 6. Memory window.newPhotoBase64
    if (window.newPhotoBase64) {
        return normalizeAvatarUrl(window.newPhotoBase64);
    }

    // 7. Cek fallback avatar pilar / admin
    const defaultAvatars = ["admin", "dimas", "fathan", "rifqi", "haikal", "sultan", "indra", "bayu", "arya"];
    if (cleanUser && defaultAvatars.includes(cleanUser.toLowerCase())) {
        return `../gambar/${cleanUser.toLowerCase()}.png`;
    }

    return "../gambar/icon.png";
}

/**
 * Mendapatkan foto profil untuk lawan atau pemain lain di room
 */
function getPlayerAvatar(username, playerObj = null) {
    if (!username) return "../gambar/icon.png";
    const cleanUser = username.trim();

    // Jika objek player di room sudah membawa avatar valid
    if (playerObj && playerObj.avatar) {
        return normalizeAvatarUrl(playerObj.avatar);
    }

    // Jika diri sendiri, gunakan real avatar terbaru
    if (cleanUser.toLowerCase() === myName.toLowerCase() || (localStorage.getItem("nihongoChatUser") && cleanUser.toLowerCase() === localStorage.getItem("nihongoChatUser").trim().toLowerCase())) {
        return getMyRealAvatar(cleanUser);
    }

    // 1. Cek window.userProfiles (RTDB user_profiles)
    if (window.userProfiles) {
        const prof = window.userProfiles[cleanUser] || 
                     Object.entries(window.userProfiles).find(([k]) => k.toLowerCase() === cleanUser.toLowerCase())?.[1];
        if (prof) {
            const pPhoto = prof.photoBase64 || prof.avatar || prof.customPhoto;
            if (pPhoto && pPhoto.trim()) {
                return normalizeAvatarUrl(pPhoto);
            }
        }
    }

    // 2. Cek localStorage avatar_<cleanUser>
    const localAv = localStorage.getItem("avatar_" + cleanUser) || localStorage.getItem("avatar_" + cleanUser.toLowerCase());
    if (localAv && localAv.trim()) {
        return normalizeAvatarUrl(localAv);
    }

    // 3. Cek localStorage fournity_user_profiles
    try {
        const saved = JSON.parse(localStorage.getItem("fournity_user_profiles") || "{}");
        const sProf = saved[cleanUser] || Object.entries(saved).find(([k]) => k.toLowerCase() === cleanUser.toLowerCase())?.[1];
        if (sProf) {
            const sPhoto = sProf.photoBase64 || sProf.avatar;
            if (sPhoto && sPhoto.trim()) {
                return normalizeAvatarUrl(sPhoto);
            }
        }
    } catch(e) {}

    // 4. Fallback avatar admin pilar
    const defaultAvatars = ["admin", "dimas", "fathan", "rifqi", "haikal", "sultan", "indra", "bayu", "arya"];
    if (defaultAvatars.includes(cleanUser.toLowerCase())) {
        return `../gambar/${cleanUser.toLowerCase()}.png`;
    }

    return "../gambar/icon.png";
}

let myAvatar = getMyRealAvatar(myName);

// Setting Custom Game Variables
let selectedGameType = "kana";
let selectedMaxPlayers = 2; // 2, 3, 4 pemain
let selectedMode = "hiragana";
let selectedRounds = 10;
let selectedTimerSeconds = 5;

// Room State Variables (Inisialisasi awal agar bebas Temporal Dead Zone & ReferenceError)
let currentRoomId = null;
let roomUnsubscribe = null;
let isHost = false;
let isBotMatch = false;
let roomMaxPlayers = 2;
let roomTimeLimit = 5.0;

// Inisialisasi presence ref dengan aman agar bebas dari Temporal Dead Zone (TDZ)
let myPresenceRef = null;
try {
    myPresenceRef = ref(db, `multiplayer_presence/${myId}`);
} catch(e) {
    console.warn("Presence ref init error:", e);
}

// Fungsi untuk menyinkronkan identitas pemain di seluruh tampilan (Top Chip, Waiting Room, Battle, Podium)
function refreshMyIdentity() {
    const hasAuth = !!localStorage.getItem("nihongoChatUid");
    let storedUser = localStorage.getItem("nihongoChatUser");
    if (!hasAuth && storedUser && ["umaedi", "iqbal", "rifki", "fasya"].includes(storedUser.toLowerCase())) {
        localStorage.removeItem("nihongoChatUser");
        storedUser = null;
    }
    myName = storedUser || "Gakusei_" + myId.slice(-3);
    myAvatar = getMyRealAvatar(myName);

    // 1. Update Chip di Top Status Bar
    const chipAv = document.getElementById("myChipAvatar");
    const chipNm = document.getElementById("myChipName");
    if (chipAv) {
        chipAv.src = myAvatar;
        chipAv.onerror = function() { this.onerror = null; this.src = "../gambar/icon.png"; };
    }
    if (chipNm) chipNm.textContent = myName;

    // 2. Update Avatar di Waiting Room / Lobby Pertandingan (P1 Slot)
    const p1Av = document.getElementById("p1Avatar");
    const p1Nm = document.getElementById("p1Name");
    if (p1Av) {
        p1Av.src = myAvatar;
        p1Av.onerror = function() { this.onerror = null; this.src = "../gambar/icon.png"; };
    }
    if (p1Nm && (!currentRoomId || isHost)) {
        p1Nm.textContent = `${myName} (Kamu)`;
    }

    // 3. Update Avatar di Battle Arena
    const battleMyAv = document.getElementById("battleMyAvatar");
    const battleMyNm = document.getElementById("battleMyName");
    if (battleMyAv) {
        battleMyAv.src = myAvatar;
        battleMyAv.onerror = function() { this.onerror = null; this.src = "../gambar/icon.png"; };
    }
    if (battleMyNm) battleMyNm.textContent = myName;

    // 4. Update Avatar di Podium
    const podiumMyAv = document.getElementById("podiumMyAvatar");
    const podiumMyNm = document.getElementById("podiumMyName");
    if (podiumMyAv) {
        podiumMyAv.src = myAvatar;
        podiumMyAv.onerror = function() { this.onerror = null; this.src = "../gambar/icon.png"; };
    }
    if (podiumMyNm) podiumMyNm.textContent = `${myName} (Kamu)`;

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

// Sinkronisasi data profil dari Firebase Realtime Database
try {
    const profilesRef = ref(db, "user_profiles");
    onValue(profilesRef, (snapshot) => {
        if (snapshot.exists()) {
            window.userProfiles = Object.assign(window.userProfiles || {}, snapshot.val());
            refreshMyIdentity();
        }
    });

    const authUid = localStorage.getItem("nihongoChatUid");
    if (authUid) {
        const userProfileRef = ref(db, `users/${authUid}/profile`);
        onValue(userProfileRef, (snapshot) => {
            if (snapshot.exists()) {
                const pData = snapshot.val();
                if (pData) {
                    if (!window.userProfiles) window.userProfiles = {};
                    if (myName) window.userProfiles[myName] = Object.assign(window.userProfiles[myName] || {}, pData);
                    refreshMyIdentity();
                }
            }
        });
    }
} catch(e) {
    console.warn("RTDB profile listener error:", e);
}

// Pantau event pembaruan profil dari admin.js atau localStorage
window.addEventListener("profilesUpdated", refreshMyIdentity);
window.addEventListener("userRoleUpdated", refreshMyIdentity);
window.addEventListener("storage", (e) => {
    if (!e.key || e.key === "nihongoChatUser" || e.key === "fournity_user_avatar" || e.key === "fournity_custom_avatar" || e.key.startsWith("avatar_") || e.key === "fournity_user_profiles") {
        refreshMyIdentity();
    }
});

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
if (myChipAvatar) {
    myChipAvatar.src = myAvatar;
    myChipAvatar.onerror = function() { this.onerror = null; this.src = "../gambar/icon.png"; };
}
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
    const roundsCount = parseInt(totalRounds, 10) || 10;

    if (gameType === "kanji") {
        let pool = [...KANJI_BATTLE_DATA];
        if (mode === "n5") pool = pool.filter(k => k.level === "n5");
        else if (mode === "n4") pool = pool.filter(k => k.level === "n4");
        
        const shuffled = pool.sort(() => Math.random() - 0.5);
        const selected = [];
        for (let i = 0; i < roundsCount; i++) {
            selected.push(shuffled[i % shuffled.length]);
        }

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
        const handsList = [
            { name: "✊ Batu (Guu)", beats: "✌️ Gunting (Choki)", losesTo: "🖐️ Kertas (Paa)", icon: "✊" },
            { name: "✌️ Gunting (Choki)", beats: "🖐️ Kertas (Paa)", losesTo: "✊ Batu (Guu)", icon: "✌️" },
            { name: "🖐️ Kertas (Paa)", beats: "✊ Batu (Guu)", losesTo: "✌️ Gunting (Choki)", icon: "🖐️" }
        ];
        const rounds = [];
        for (let i = 1; i <= roundsCount; i++) {
            const oppHand = handsList[(i - 1 + Math.floor(Math.random() * 3)) % 3];
            const winningHand = oppHand.losesTo;
            rounds.push({
                gameType: "janken",
                kana: `⚔️ ${oppHand.icon} ⚔️`,
                subHint: `Ronde ${i}: Lawan bersiap dengan ${oppHand.name}!`,
                hint: `Pilih jurus tangan yang MENGALAHKAN ${oppHand.name}:`,
                answer: winningHand,
                options: ["✊ Batu (Guu)", "✌️ Gunting (Choki)", "🖐️ Kertas (Paa)"].sort(() => Math.random() - 0.5)
            });
        }
        return rounds;
    }

    if (gameType === "shiritori") {
        const shuffled = [...SHIRITORI_DATA].sort(() => Math.random() - 0.5);
        const selected = [];
        for (let i = 0; i < roundsCount; i++) {
            selected.push(shuffled[i % shuffled.length]);
        }

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
        for (let i = 0; i < roundsCount; i++) {
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
    const selectedList = [];
    for (let i = 0; i < roundsCount; i++) {
        selectedList.push(shuffledPool[i % shuffledPool.length]);
    }

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
            const authed = window.requireFirebaseAuth("Multiplayer Quick Match");
            if (!authed) return;
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
            const authed = window.requireFirebaseAuth("Multiplayer Custom Room");
            if (!authed) return;
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

    // Purge/filter out stale rooms (> 2 jam atau 0 pemain)
    const now = Date.now();
    Object.keys(rooms).forEach(rid => {
        const r = rooms[rid];
        if (!r) return;
        const maxCap = parseInt(r.maxPlayers, 10) || 2;
        const currentCount = Object.keys(r.players || {}).length;
        const isStale = (now - (r.createdAt || 0)) > 2 * 60 * 60 * 1000;

        if (currentCount === 0 || isStale) {
            remove(ref(db, `multiplayer_rooms/${rid}`)).catch(() => {});
            return;
        }

        if (r.status === "waiting" && currentCount < maxCap) {
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
            const hostPlayer = r.players?.[r.hostId];
            const hostAvatar = normalizeAvatarUrl(hostPlayer?.avatar || getPlayerAvatar(r.hostName, hostPlayer));
            const isMyRoom = (r.hostId === myId);

            return `
            <div class="mp-room-item ${isMyRoom ? 'is-my-room' : ''}">
                <div class="mp-room-info" style="display: flex; flex-direction: row; align-items: center; gap: 12px;">
                    <img src="${hostAvatar}" alt="${r.hostName}" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 2px solid var(--mp-accent-cyan); background: #1e293b;" onerror="this.src='../gambar/icon.png'">
                    <div>
                        <div class="mp-room-host">
                            <span>⛩️ ${r.hostName || "Host"}${isMyRoom ? ' <strong style="color: var(--mp-gold); font-size: 11px;">(Room Milikmu)</strong>' : ''}</span>
                            <span style="color: var(--mp-accent-cyan); font-weight: 800;">${gInfo.icon} ${gInfo.name}</span>
                        </div>
                        <div class="mp-room-meta">
                            Kode: <strong style="color: var(--mp-gold);">${r.code}</strong> · ${(r.mode || "").toUpperCase()} · ${r.totalRounds} Soal · 👥 ${r.pCount}/${r.maxCap} Pemain
                        </div>
                    </div>
                </div>
                <button type="button" class="mp-room-btn-join" data-roomid="${r.id}">
                    ${isMyRoom ? 'Masuk Lobby Room →' : 'Tantang Lawan →'}
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
            else alert("Harap masukkan 4 digit kode room!");
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
        let latestTime = 0;

        Object.keys(rooms).forEach(rid => {
            const r = rooms[rid];
            if (!r) return;
            const maxCap = parseInt(r.maxPlayers, 10) || 2;
            const pCount = Object.keys(r.players || {}).length;
            if (r.status === "waiting" && pCount < maxCap && pCount > 0 && r.hostId !== myId) {
                const roomTime = r.createdAt || 0;
                if (roomTime >= latestTime) {
                    latestTime = roomTime;
                    foundRoomId = rid;
                }
            }
        });

        if (foundRoomId) {
            await joinRoomById(foundRoomId);
        } else {
            // Jika belum ada room terbuka, buat room instan dengan setting yang dipilih
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
    if (currentRoomId) {
        leaveCurrentRoom();
    }

    refreshMyIdentity();

    const code = generateRoomCode();
    const newRoomRef = push(ref(db, "multiplayer_rooms"));
    const roomId = newRoomRef.key;
    currentRoomId = roomId;
    isHost = true;
    isBotMatch = withBot;
    selectedGameType = gameType;
    selectedMode = mode;
    selectedRounds = parseInt(totalRounds, 10) || 10;
    roomMaxPlayers = parseInt(maxPlayers, 10) || 2;
    roomTimeLimit = parseFloat(timeLimit) || 5.0;

    const questions = generateGameQuestions(gameType, mode, selectedRounds);

    const roomPayload = {
        code: code,
        gameType: gameType,
        mode: mode,
        totalRounds: selectedRounds,
        maxPlayers: roomMaxPlayers,
        timeLimit: roomTimeLimit,
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
                answeredCount: 0,
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
            answeredCount: 0,
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
    if (!roomId || typeof roomId !== "string") {
        alert("ID room tidak valid.");
        return;
    }

    if (currentRoomId && currentRoomId !== roomId) {
        leaveCurrentRoom();
    }

    // Refresh identitas lokal sebelum join (tanpa menulis ke Firebase room dulu!)
    refreshMyIdentity();

    try {
        const snap = await get(ref(db, `multiplayer_rooms/${roomId}`));
        const r = snap.val();
        if (!r) {
            alert("Room tidak ditemukan atau sudah ditutup.");
            return;
        }

        const maxCap = parseInt(r.maxPlayers, 10) || 2;
        const players = r.players || {};
        const isAlreadyIn = !!players[myId];
        const currentCount = Object.keys(players).length;

        // Cek jika room sudah penuh dan pemain belum ada di dalam room
        if (!isAlreadyIn && currentCount >= maxCap) {
            alert(`Room sudah penuh (${maxCap} pemain)!`);
            return;
        }

        // Cek jika status room bukan waiting dan pemain belum terdaftar
        if (!isAlreadyIn && r.status !== "waiting") {
            alert("Pertandingan di room ini sudah berlangsung!");
            return;
        }

        currentRoomId = roomId;
        isHost = (r.hostId === myId);
        isBotMatch = !!players["bot_aoi"];
        selectedGameType = r.gameType || "kana";
        selectedMode = r.mode || "mixed";
        selectedRounds = r.totalRounds || 10;
        roomMaxPlayers = maxCap;
        roomTimeLimit = r.timeLimit || 5.0;

        const playerPayload = {
            name: myName,
            avatar: myAvatar,
            score: isAlreadyIn ? (players[myId].score || 0) : 0,
            correctCount: isAlreadyIn ? (players[myId].correctCount || 0) : 0,
            answeredCount: isAlreadyIn ? (players[myId].answeredCount || 0) : 0,
            finished: isAlreadyIn ? (players[myId].finished || false) : false,
            reaction: null,
            isHost: isHost
        };

        await update(ref(db, `multiplayer_rooms/${roomId}/players/${myId}`), playerPayload);
        onDisconnect(ref(db, `multiplayer_rooms/${roomId}/players/${myId}`)).remove();

        subscribeToRoom(roomId);
    } catch (e) {
        console.error("Gagal join room:", e);
        alert("Gagal bergabung ke room. Periksa koneksi internet Anda.");
    }
}

async function joinRoomByCode(code) {
    const cleanCode = (code || "").toString().trim().toUpperCase();
    if (!cleanCode) {
        alert("Silakan masukkan 4-digit kode room!");
        return;
    }
    try {
        const snap = await get(ref(db, "multiplayer_rooms"));
        const rooms = snap.val() || {};
        let targetId = null;
        let latestTime = 0;

        Object.keys(rooms).forEach(rid => {
            const r = rooms[rid];
            if (!r) return;
            const rCode = (r.code || "").toString().trim().toUpperCase();
            const pCount = Object.keys(r.players || {}).length;
            const maxCap = parseInt(r.maxPlayers, 10) || 2;
            const isAlreadyIn = !!(r.players && r.players[myId]);

            if (rCode === cleanCode && r.status === "waiting" && (pCount < maxCap || isAlreadyIn) && pCount > 0) {
                const roomTime = r.createdAt || 0;
                if (roomTime >= latestTime) {
                    latestTime = roomTime;
                    targetId = rid;
                }
            }
        });

        if (targetId) {
            await joinRoomById(targetId);
        } else {
            alert(`Room dengan kode [${cleanCode}] tidak ditemukan, sudah penuh, atau pertandingan telah dimulai!`);
        }
    } catch (e) {
        console.error("Gagal join by code:", e);
        alert("Gagal memproses kode room.");
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
let lastEnemyReaction = null;

function subscribeToRoom(roomId) {
    if (roomUnsubscribe) roomUnsubscribe();

    const roomRef = ref(db, `multiplayer_rooms/${roomId}`);
    roomUnsubscribe = onValue(roomRef, (snapshot) => {
        const r = snapshot.val();
        if (!r) {
            // Room was closed or deleted
            if (views.podium && views.podium.style.display === "block") {
                if (roomUnsubscribe) { roomUnsubscribe(); roomUnsubscribe = null; }
                currentRoomId = null;
                const btnRem = document.getElementById("btnRematch");
                if (btnRem) {
                    btnRem.disabled = true;
                    btnRem.textContent = "🚪 Host Telah Keluar";
                    btnRem.classList.remove("mp-rematch-pulse");
                }
                const sub = document.getElementById("podiumSub");
                if (sub) {
                    sub.textContent = "Host telah meninggalkan room. Silakan kembali ke lobby.";
                }
                return;
            }
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

    // Deteksi seluruh pemain yang terhubung
    const players = roomData.players || {};
    const playerIds = Object.keys(players);
    const otherPlayerIds = playerIds.filter(id => id !== myId);
    enemyId = otherPlayerIds[0] || null;

    if (enemyId && players[enemyId]) {
        enemyName = players[enemyId].name || "Lawan";
        enemyAvatar = normalizeAvatarUrl(players[enemyId].avatar || getPlayerAvatar(enemyName, players[enemyId]));
        enemyScore = players[enemyId].score || 0;
        enemyCorrectCount = players[enemyId].correctCount || 0;
        enemyFinished = players[enemyId].finished || false;

        // Cek jika lawan mengirim reaction emote (cegah duplikasi)
        if (players[enemyId].reaction) {
            const rx = players[enemyId].reaction;
            if (rx !== lastEnemyReaction) {
                lastEnemyReaction = rx;
                showFloatingReaction(rx);
                setTimeout(() => { if (lastEnemyReaction === rx) lastEnemyReaction = null; }, 1600);
            }
        }
    } else {
        enemyId = null;
        enemyName = "Lawan";
        enemyAvatar = "../gambar/icon.png";
        enemyScore = 0;
        enemyCorrectCount = 0;
        enemyFinished = false;
    }

    // Deteksi jika lawan kabur/disconnect saat pertandingan berlangsung
    if (roomData.status === "playing" && !isBotMatch && otherPlayerIds.length === 0 && !myFinished) {
        alert("Lawanmu telah meninggalkan pertandingan!");
        myFinished = true;
        finishMyRace();
        return;
    }

    // Pergantian Tampilan Sesuai Status Room
    if (roomData.status === "waiting") {
        switchView("waiting");
        updateWaitingRoomUI(roomData);
    } else if (roomData.status === "playing") {
        // Transisi ke arena bertanding jika belum di arena (termasuk rematch dari podium!)
        if (views.battle && views.battle.style.display !== "block") {
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
                    const pAv = normalizeAvatarUrl(isPMe ? myAvatar : (p.avatar || getPlayerAvatar(p.name, p)));
                    slotsHtml += `
                        <div class="mp-player-slot is-ready" style="padding: 16px 10px;">
                            <img src="${pAv}" alt="${p.name}" class="mp-player-slot-avatar" style="width: 64px; height: 64px; border-color: ${isPMe ? 'var(--mp-accent-cyan)' : '#FF2A54'};" onerror="this.onerror=null;this.src='../gambar/icon.png';">
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
            const enemyAv = normalizeAvatarUrl(enemyData ? (enemyData.avatar || getPlayerAvatar(enemyData.name, enemyData)) : "../gambar/icon.png");

            stage.innerHTML = `
                <div class="mp-player-slot is-ready" id="p1Slot">
                    <img src="${myAvatar}" alt="Avatar Me" class="mp-player-slot-avatar" id="p1Avatar" onerror="this.onerror=null;this.src='../gambar/icon.png';">
                    <span class="mp-player-slot-name" id="p1Name">${myName} (Kamu)</span>
                    <span class="mp-player-slot-status status-ready" id="p1Status">✓ Siap Bertarung</span>
                </div>
                <div class="mp-vs-circle">VS</div>
                <div class="mp-player-slot ${enemyData ? 'is-ready' : ''}" id="p2Slot">
                    <img src="${enemyAv}" 
                         alt="Avatar Opponent" class="mp-player-slot-avatar" id="p2Avatar" 
                         style="${enemyData ? 'border-color: var(--mp-accent-cyan); opacity: 1;' : 'border-color: #64748B; opacity: 0.7;'}"
                         onerror="this.onerror=null;this.src='../gambar/icon.png';">
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
        const shareUrl = `${window.location.origin}${window.location.pathname}?code=${code}`;
        const shareText = `Ayo tanding bahasa Jepang di Nihongo Fournity! Masukkan kode room: ${code} atau klik link: ${shareUrl}`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareText).then(() => {
                btnCopyRoomLink.textContent = "✓ Disalin!";
                setTimeout(() => { btnCopyRoomLink.textContent = "📋 Salin"; }, 2000);
            }).catch(() => {
                prompt("Salin teks undangan ini:", shareText);
            });
        } else {
            prompt("Salin teks undangan ini:", shareText);
        }
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
            remove(ref(db, `multiplayer_rooms/${currentRoomId}`)).catch(() => {});
        } else {
            remove(ref(db, `multiplayer_rooms/${currentRoomId}/players/${myId}`)).catch(() => {});
        }
        currentRoomId = null;
    }
    isHost = false;
    isBotMatch = false;
    enemyId = null;
    myFinished = false;
    clearInterval(roundTimerInterval);
    clearTimeout(botAnswerTimeout);
    switchView("lobby");
}

// Cleanup saat navigasi/tutup tab
window.addEventListener("beforeunload", () => {
    if (currentRoomId) {
        if (isHost) {
            remove(ref(db, `multiplayer_rooms/${currentRoomId}`)).catch(() => {});
        } else {
            remove(ref(db, `multiplayer_rooms/${currentRoomId}/players/${myId}`)).catch(() => {});
        }
    }
});

window.addEventListener("pagehide", () => {
    if (currentRoomId) {
        if (isHost) {
            remove(ref(db, `multiplayer_rooms/${currentRoomId}`)).catch(() => {});
        } else {
            remove(ref(db, `multiplayer_rooms/${currentRoomId}/players/${myId}`)).catch(() => {});
        }
    }
});

// ==========================================================================
// 11. BATTLE ARENA ENGINE (SPEED RACE)
// ==========================================================================
let myFinished = false;

function startBattleArena() {
    switchView("battle");

    // Pastikan container soal aktif ditampilkan dan overlay selesai disembunyikan
    const activeContent = document.getElementById("battleActiveQuestionContent");
    const finishedOverlay = document.getElementById("battleFinishedOverlay");
    if (activeContent) activeContent.style.display = "block";
    if (finishedOverlay) finishedOverlay.style.display = "none";

    currentRoundIdx = 0;
    myScore = 0;
    myCorrectCount = 0;
    myStreak = 0;
    maxStreak = 0;
    myFinished = false;
    reactionTimes = [];
    botRoundIdx = 0;
    enemyScore = 0;
    enemyCorrectCount = 0;
    enemyFinished = false;
    isAnswerLocked = false;
    hasAwardedPodiumForSession = false;

    // Reset floating reactions
    const rxBox = document.getElementById("floatingReactionBox");
    if (rxBox) rxBox.innerHTML = "";

    // Reset tombol Rematch di podium ke keadaan awal
    const btnRem = document.getElementById("btnRematch");
    if (btnRem) {
        btnRem.disabled = false;
        btnRem.textContent = "🔄 Tanding Lagi (Rematch)";
        btnRem.classList.remove("mp-rematch-pulse");
    }

    // Bersihkan timer sebelumnya jika ada
    clearInterval(roundTimerInterval);
    clearTimeout(botAnswerTimeout);

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
        const clashBox = document.getElementById("jankenClashBox");
        const myHandEl = document.getElementById("jankenMyHand");
        const enHandEl = document.getElementById("jankenEnemyHand");
        if (clashBox && myHandEl && enHandEl) {
            clashBox.style.display = "flex";
            myHandEl.textContent = chosenOpt.split(" ")[0];
            enHandEl.textContent = (correctOpt || "✊").split(" ")[0];
        }

        const isWin = (chosenOpt === correctOpt);

        if (isWin) {
            buttonEl.classList.add("btn-correct");
            AudioSFX.correct();
            const speedBonus = Math.floor(currentRoundSecondsLeft * 15);
            myScore += (100 + speedBonus);
            myCorrectCount++;
            myStreak++;
            if (myStreak > maxStreak) maxStreak = myStreak;
            showFloatingReaction("🔥");
        } else {
            buttonEl.classList.add("btn-wrong");
            AudioSFX.wrong();
            myStreak = 0;
            showFloatingReaction("😭");
            document.querySelectorAll("#battleOptionsGrid .mp-option-btn").forEach(b => {
                if (b.dataset.opt === correctOpt) b.classList.add("btn-correct");
            });
        }

        syncMyProgressToFirebase();

        setTimeout(() => {
            currentRoundIdx++;
            loadNextQuestion();
        }, 850);
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

    update(ref(db, `multiplayer_rooms/${currentRoomId}/players/${myId}`), {
        score: myScore,
        correctCount: myCorrectCount,
        answeredCount: currentRoundIdx,
        finished: myFinished
    }).catch(e => console.warn("Sync progress error:", e));
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
            const pAvatar = normalizeAvatarUrl(isMe ? myAvatar : (p.avatar || getPlayerAvatar(p.name, p)));
            const pAnswered = p.finished ? totalQ : (p.answeredCount || p.correctCount || 0);
            const pScore = p.score || 0;
            const pPct = Math.min(100, (pAnswered / totalQ) * 100);
            const color = laneColors[idx % laneColors.length];

            return `
            <div class="mp-lane" style="border-left: 3px solid ${color.stroke};">
                <div class="mp-lane-user">
                    <img src="${pAvatar}" alt="${p.name}" class="mp-lane-avatar" style="border-color: ${color.stroke};" onerror="this.onerror=null;this.src='../gambar/icon.png';">
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
    const allFinished = playerList.length >= 1 && playerList.every(pid => players[pid]?.finished);
    if (allFinished && currentRoomId) {
        if (isHost || playerList.length === 1) {
            update(ref(db, `multiplayer_rooms/${currentRoomId}`), {
                status: "finished"
            }).catch(() => {});
        }
    }
}

async function finishMyRace() {
    clearInterval(roundTimerInterval);
    myFinished = true;
    syncMyProgressToFirebase();

    // Tampilkan overlay selesai sementara menunggu lawan tanpa merusak struktur DOM soal
    const activeContent = document.getElementById("battleActiveQuestionContent");
    const finishedOverlay = document.getElementById("battleFinishedOverlay");
    const finishedScoreText = document.getElementById("battleFinishedScoreText");
    if (activeContent) activeContent.style.display = "none";
    if (finishedOverlay) finishedOverlay.style.display = "block";
    if (finishedScoreText) finishedScoreText.textContent = `Skor Akhir: ${myScore.toLocaleString()} PTS`;

    if (isBotMatch || !enemyId) {
        setTimeout(async () => {
            if (currentRoomId) {
                await update(ref(db, `multiplayer_rooms/${currentRoomId}`), {
                    status: "finished"
                }).catch(() => {});
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
let hasAwardedPodiumForSession = false;

function showPodiumScreen(players) {
    switchView("podium");
    clearInterval(roundTimerInterval);
    clearTimeout(botAnswerTimeout);

    // Urutkan seluruh pemain dari skor tertinggi ke terendah
    const sortedPlayers = Object.entries(players).map(([id, p]) => ({
        id,
        name: p.name || "Pemain",
        avatar: (id === myId) ? myAvatar : normalizeAvatarUrl(p.avatar || getPlayerAvatar(p.name, p)),
        score: p.score || 0,
        correctCount: p.correctCount || 0,
        isMe: (id === myId),
        rematchReady: !!p.rematchReady
    })).sort((a, b) => b.score - a.score);

    const winner = sortedPlayers[0] || { name: myName, score: myScore };
    const isWinner = winner.isMe;
    const isTie = sortedPlayers.length >= 2 && sortedPlayers[0].score === sortedPlayers[1].score;

    const trophyIcon = document.getElementById("podiumIcon");
    const podiumTitle = document.getElementById("podiumTitle");
    const podiumSub = document.getElementById("podiumSub");
    const myCard = document.getElementById("podiumMyCard");
    const enemyCard = document.getElementById("podiumEnemyCard");

    if (isTie) {
        if (trophyIcon) trophyIcon.textContent = "🤝";
        if (podiumTitle) podiumTitle.textContent = "HASIL IMBANG!";
        if (podiumSub) podiumSub.textContent = "Skor pemain sama persis! Pertarungan yang sangat seru dan sengit!";
        if (myCard) myCard.classList.remove("winner");
        if (enemyCard) enemyCard.classList.remove("winner");
    } else if (isWinner) {
        if (!hasAwardedPodiumForSession) AudioSFX.fanfare();
        if (trophyIcon) trophyIcon.textContent = "👑";
        if (podiumTitle) podiumTitle.textContent = "KEMENANGAN TELAK!";
        if (podiumSub) podiumSub.textContent = "Kamu mengalahkan lawan dengan kecepatan refleks dan ketepatan luar biasa!";
        if (myCard) myCard.classList.add("winner");
        if (enemyCard) enemyCard.classList.remove("winner");
    } else {
        if (!hasAwardedPodiumForSession) AudioSFX.wrong();
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

    if (myPodiumAv) {
        myPodiumAv.src = myAvatar;
        myPodiumAv.onerror = function() { this.onerror = null; this.src = "../gambar/icon.png"; };
    }
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

    if (rivalAv) {
        rivalAv.src = normalizeAvatarUrl(topRival.avatar);
        rivalAv.onerror = function() { this.onerror = null; this.src = "../gambar/icon.png"; };
    }
    if (rivalNm) rivalNm.textContent = topRival.name;
    if (rivalSc) rivalSc.textContent = topRival.score.toLocaleString();
    if (rivalCor) rivalCor.textContent = `🎯 ${topRival.correctCount} / ${totalQ} Benar`;
    if (rivalSpd) rivalSpd.textContent = `⚡ Rata-rata: 1.6s`;
    if (rivalStr) rivalStr.textContent = `🔥 Max Streak: ${topRival.correctCount}`;

    // EXP Gain (diberikan sekali saja per ronde pertandingan)
    const expGain = (isWinner && !isTie) ? 120 : (isTie ? 75 : 45);
    const expEl = document.getElementById("podiumExpGained");
    if (expEl) expEl.textContent = `+${expGain} XP`;

    if (!hasAwardedPodiumForSession) {
        hasAwardedPodiumForSession = true;
        try {
            const curExp = Number(localStorage.getItem("trinity_exp") || 80);
            localStorage.setItem("trinity_exp", curExp + expGain);
        } catch(e) {}
    }

    // Update status tombol Rematch berdasarkan kesiapan lawan
    const btnRematchEl = document.getElementById("btnRematch");
    if (btnRematchEl) {
        if (isHost) {
            const rival = sortedPlayers.find(p => !p.isMe);
            if (rival && rival.rematchReady) {
                btnRematchEl.textContent = `🔄 ${rival.name} Siap! Mulai Rematch Sekarang 🔥`;
                btnRematchEl.classList.add("mp-rematch-pulse");
                btnRematchEl.disabled = false;
            } else if (!btnRematchEl.disabled) {
                btnRematchEl.textContent = "🔄 Tanding Lagi (Rematch)";
                btnRematchEl.classList.remove("mp-rematch-pulse");
            }
        }
    }
}

// Rematch & Leave from Podium
const btnRematch = document.getElementById("btnRematch");
if (btnRematch) {
    btnRematch.addEventListener("click", async () => {
        if (!currentRoomId) {
            leaveCurrentRoom();
            return;
        }

        if (isBotMatch) {
            btnRematch.disabled = true;
            btnRematch.textContent = "⏳ Mempersiapkan Ronde...";
            try {
                const newQuestions = generateGameQuestions(selectedGameType, selectedMode, selectedRounds);
                const resetPlayers = {
                    [myId]: {
                        name: myName,
                        avatar: myAvatar,
                        score: 0,
                        correctCount: 0,
                        answeredCount: 0,
                        finished: false,
                        reaction: null,
                        rematchReady: false,
                        isHost: true
                    },
                    "bot_aoi": {
                        name: "Aoi Sensei 🌸 (AI)",
                        avatar: "../gambar/aoi_sensei.jpg",
                        score: 0,
                        correctCount: 0,
                        answeredCount: 0,
                        finished: false,
                        reaction: null,
                        rematchReady: true,
                        isHost: false
                    }
                };
                await update(ref(db, `multiplayer_rooms/${currentRoomId}`), {
                    status: "playing",
                    questions: newQuestions,
                    players: resetPlayers
                });
            } catch (e) {
                console.error("Bot rematch error:", e);
                await createRoom(selectedGameType, selectedMode, selectedRounds, 2, roomTimeLimit, true);
            } finally {
                btnRematch.disabled = false;
                btnRematch.textContent = "🔄 Tanding Lagi (Rematch)";
            }
            return;
        }

        if (isHost) {
            btnRematch.disabled = true;
            btnRematch.textContent = "⏳ Mempersiapkan Ronde...";
            try {
                const snap = await get(ref(db, `multiplayer_rooms/${currentRoomId}`));
                const r = snap.val();
                if (!r) {
                    alert("Room sudah tidak aktif.");
                    leaveCurrentRoom();
                    return;
                }

                const currentPlayers = r.players || {};
                const playerIds = Object.keys(currentPlayers);
                const otherPlayerIds = playerIds.filter(id => id !== myId);

                // Cek jika lawan sudah tidak ada di room
                if (otherPlayerIds.length === 0) {
                    alert("Lawan telah meninggalkan room. Kembali ke lobby untuk mencari pemain baru.");
                    leaveCurrentRoom();
                    return;
                }

                const resetPlayers = {};
                playerIds.forEach(pid => {
                    const p = currentPlayers[pid];
                    resetPlayers[pid] = {
                        name: p.name || "Pemain",
                        avatar: p.avatar || "../gambar/icon.png",
                        score: 0,
                        correctCount: 0,
                        answeredCount: 0,
                        finished: false,
                        reaction: null,
                        rematchReady: false,
                        isHost: (pid === myId)
                    };
                });

                const newQuestions = generateGameQuestions(selectedGameType, selectedMode, selectedRounds);
                await update(ref(db, `multiplayer_rooms/${currentRoomId}`), {
                    status: "playing",
                    questions: newQuestions,
                    players: resetPlayers
                });
            } catch (e) {
                console.error("Rematch error:", e);
                alert("Gagal memulai tanding ulang.");
                btnRematch.disabled = false;
                btnRematch.textContent = "🔄 Tanding Lagi (Rematch)";
            }
        } else {
            // Non-host: beri tahu host bahwa pemain siap tanding ulang
            btnRematch.disabled = true;
            btnRematch.textContent = "✓ Siap! Menunggu Host...";
            try {
                await update(ref(db, `multiplayer_rooms/${currentRoomId}/players/${myId}`), {
                    reaction: "🔥",
                    rematchReady: true
                });
            } catch (e) {
                btnRematch.disabled = false;
                btnRematch.textContent = "🔄 Tanding Lagi (Rematch)";
            }
        }
    });
}

const btnPodiumLobby = document.getElementById("btnPodiumLobby");
if (btnPodiumLobby) {
    btnPodiumLobby.addEventListener("click", () => {
        leaveCurrentRoom();
    });
}

// Quick Name Customizer via Profile Chip
const userChip = document.getElementById("userProfileChip");
if (userChip) {
    userChip.style.cursor = "pointer";
    userChip.title = "Klik untuk ganti nama tampilan";
    userChip.addEventListener("click", () => {
        const newName = prompt("Ganti nama panggilan untuk duel multiplayer:", myName);
        if (newName && newName.trim()) {
            const clean = newName.trim().slice(0, 16);
            localStorage.setItem("nihongoChatUser", clean);
            refreshMyIdentity();
        }
    });
}

// Auto-join via URL query parameter (?code=XXXX atau ?room=RID)
function checkUrlJoinParams() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const roomId = urlParams.get("room");
        if (roomId) {
            joinRoomById(roomId);
        } else if (code) {
            const cleanCode = code.trim().toUpperCase();
            if (cleanCode.length === 4) {
                const input = document.getElementById("inputRoomCode");
                if (input) input.value = cleanCode;
                joinRoomByCode(cleanCode);
            }
        }
    } catch (e) {
        console.warn("URL join check error:", e);
    }
}

// Panggil saat halaman selesai dimuat
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkUrlJoinParams);
} else {
    setTimeout(checkUrlJoinParams, 400);
}
