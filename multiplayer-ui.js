/* ==========================================================================
   NIHONGO FOURNITY - MULTIPLAYER UI & MODAL SETUP CONTROLLER
   Universal Standalone Engine: Runs on both file:/// and http:// protocols.
   Handles: Game card selection, Custom Game popup modal, Max Players (2,3,4),
   Question Categories, Rounds, Timer, Real User Avatar Sync, and Offline AI Fallback.
   ========================================================================== */

(function () {
    'use strict';

    // 1. METADATA PERMAINAN MULTIPLAYER
    const MULTIPLAYER_GAMES = {
        kana: {
            id: "kana",
            name: "Kana Speed Battle",
            jpName: "カナスピード",
            icon: "⚡",
            badge: "Populer",
            desc: "Adu kecepatan tebak Romaji Hiragana & Katakana 1v1 secara live! Siapa paling cepat dan bertahan sampai akhir, dia juara!",
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
            badge: "N5 - N4",
            desc: "Duel pemahaman makna dan cara baca Kanji JLPT N5 & N4! Uji ketangkasan membaca kanji dasarmu secepat kilat.",
            modes: [
                { id: "n5", label: "N5 Dasar (初級)" },
                { id: "n4", label: "N4 Menengah (中級)" },
                { id: "mixed", label: "Campur (N5+N4)" }
            ]
        },
        janken: {
            id: "janken",
            name: "Jankenpon Royale",
            jpName: "じゃんけん対決",
            icon: "🤜",
            badge: "Royale 1v1",
            desc: "Adu taktik & insting suit klasik Jepang: Guu (Batu), Choki (Gunting), dan Paa (Kertas)! Kumpulkan poin kemenangan terbanyak.",
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
            badge: "Kata Kilat",
            desc: "Estafet kata bahasa Jepang tradisional! Sambung kata berikutnya dari huruf terakhir kata lawan secepat mungkin.",
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
            badge: "Refleks 0.5s",
            desc: "Uji kecepatan refleks dan pemahaman aba-aba ninja! Sentuh aksi yang tepat sesuai perintah Sensei sebelum waktu habis.",
            modes: [
                { id: "normal", label: "Normal (3.0s)" },
                { id: "fast", label: "Kilat (2.0s)" }
            ]
        }
    };

    // 2. STATE SETTING CUSTOM GAME
    let selectedGameType = "kana";
    let selectedMaxPlayers = 2; // 2, 3, 4 pemain
    let selectedMode = "hiragana";
    let selectedRounds = 10;
    let selectedTimerSeconds = 5;

    // 3. AUDIO SFX SYNTHESIZER (Web Audio API Tanpa File Eksternal)
    let audioCtx = null;
    function getAudioContext() {
        try {
            if (!audioCtx) {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (AudioContextClass) audioCtx = new AudioContextClass();
            }
            if (audioCtx && audioCtx.state === "suspended") {
                audioCtx.resume();
            }
        } catch (e) {}
        return audioCtx;
    }

    function playTone(freq, duration = 0.12, type = "sine", gainVal = 0.12) {
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

    const UI_SFX = {
        pop: () => playTone(650, 0.08, "triangle", 0.1),
        beep: () => playTone(440, 0.1, "sine", 0.08),
        fanfare: () => {
            [523, 659, 784, 1046].forEach((f, i) => {
                setTimeout(() => playTone(f, 0.25, "triangle", 0.12), i * 90);
            });
        }
    };

    // 4. SINKRONISASI IDENTITAS & FOTO PROFIL PENGGUNA
    function getPlayerAvatar(username) {
        if (!username) return "../gambar/icon.png";
        const clean = username.trim();

        // 1. Sinkronisasi dari Firebase RTDB user profiles jika ada
        if (window.userProfiles && window.userProfiles[clean]?.photoBase64) {
            return window.userProfiles[clean].photoBase64;
        }

        // 2. Cek localStorage avatar_<user> atau fournity_user_avatar
        const localAv = localStorage.getItem("avatar_" + clean) || (clean === myName ? localStorage.getItem("fournity_user_avatar") : null);
        if (localAv) {
            if (!localAv.startsWith('../') && !localAv.startsWith('http') && !localAv.startsWith('data:')) {
                return '../' + localAv;
            }
            return localAv;
        }

        // 3. Cek localStorage fournity_user_profiles
        try {
            const saved = JSON.parse(localStorage.getItem("fournity_user_profiles") || "{}");
            if (saved[clean]?.photoBase64) return saved[clean].photoBase64;
        } catch (e) {}

        // 4. Cek fallback avatar admin bawaan
        const defaultAvatars = ["admin", "dimas", "fathan", "rifqi", "haikal", "sultan", "indra", "bayu", "arya"];
        if (defaultAvatars.includes(clean.toLowerCase())) {
            return `../gambar/${clean.toLowerCase()}.png`;
        }

        return "../gambar/icon.png";
    }

    function syncUserProfiles() {
        const hasAuth = !!localStorage.getItem("nihongoChatUid");
        let storedUser = localStorage.getItem("nihongoChatUser");
        if (!hasAuth && storedUser && ["umaedi", "iqbal", "rifki", "fasya"].includes(storedUser.toLowerCase())) {
            localStorage.removeItem("nihongoChatUser");
            storedUser = null;
        }
        const myName = (hasAuth && storedUser) ? storedUser : "Gakusei";
        const myAvatar = getPlayerAvatar(myName);

        // Status bar atas
        const chipAv = document.getElementById("myChipAvatar");
        const chipNm = document.getElementById("myChipName");
        if (chipAv) chipAv.src = myAvatar;
        if (chipNm) chipNm.textContent = myName;

        // Lobby slot 1
        const p1Av = document.getElementById("p1Avatar");
        const p1Nm = document.getElementById("p1Name");
        if (p1Av) p1Av.src = myAvatar;
        if (p1Nm) p1Nm.textContent = myName;

        // Battle arena
        const bAv = document.getElementById("battleMyAvatar");
        const bNm = document.getElementById("battleMyName");
        if (bAv) bAv.src = myAvatar;
        if (bNm) bNm.textContent = myName;

        // Podium
        const podAv = document.getElementById("podiumMyAvatar");
        const podNm = document.getElementById("podiumMyName");
        if (podAv) podAv.src = myAvatar;
        if (podNm) podNm.textContent = myName;
    }

    // 5. BUKA & TUTUP MODAL POPUP SETTING CUSTOM GAME
    function openGameSetupModal(gameType) {
        if (!MULTIPLAYER_GAMES[gameType]) gameType = "kana";
        selectedGameType = gameType;

        const g = MULTIPLAYER_GAMES[gameType];
        const overlay = document.getElementById("gameSetupOverlay");
        if (!overlay) return;

        // Update header & info modal
        const iconEl = document.getElementById("modalGameIcon");
        const titleEl = document.getElementById("modalGameTitle");
        const jpEl = document.getElementById("modalGameJp");
        const badgeEl = document.getElementById("modalGameBadge");
        const descEl = document.getElementById("modalGameDesc");

        if (iconEl) {
            iconEl.textContent = g.icon;
            iconEl.className = `mp-modal-game-icon icon-${g.id}`;
        }
        if (titleEl) titleEl.textContent = g.name;
        if (jpEl) jpEl.textContent = g.jpName;
        if (badgeEl) badgeEl.textContent = g.badge;
        if (descEl) descEl.textContent = g.desc;

        // Update Hero Banner di latar belakang
        const heroTitle = document.getElementById("mpHeroTitle");
        const heroBadge = document.getElementById("mpHeroBadge");
        const heroDesc = document.getElementById("mpHeroDesc");
        if (heroTitle) heroTitle.innerHTML = `${g.name} <span>(対戦)</span>`;
        if (heroBadge) heroBadge.textContent = `${g.badge} · REALTIME MULTIPLAYER`;
        if (heroDesc) heroDesc.textContent = g.desc;

        // Render Opsi Kategori / Mode Dinamis
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
                    const match = g.modes.find(m => m.id === selectedMode);
                    if (valCategory) valCategory.textContent = match ? match.label : selectedMode;
                    UI_SFX.beep();
                });
            });
        }

        // Sinkronisasi Max Pemain
        const valMaxPlayers = document.getElementById("valMaxPlayers");
        if (valMaxPlayers) {
            valMaxPlayers.textContent = `${selectedMaxPlayers} Pemain ${selectedMaxPlayers === 2 ? '(1v1 Duel)' : selectedMaxPlayers === 3 ? '(3P Segitiga)' : '(4P Party)'}`;
        }
        document.querySelectorAll("#modalMaxPlayersSelectorGroup .mp-setting-option-btn").forEach(btn => {
            btn.classList.toggle("is-active", parseInt(btn.dataset.max, 10) === selectedMaxPlayers);
        });

        // Sinkronisasi Ronde
        const valRounds = document.getElementById("valRounds");
        if (valRounds) valRounds.textContent = `${selectedRounds} Soal`;
        document.querySelectorAll("#modalRoundsSelectorGroup .mp-setting-option-btn").forEach(btn => {
            btn.classList.toggle("is-active", parseInt(btn.dataset.rounds, 10) === selectedRounds);
        });

        // Sinkronisasi Timer
        const valTimer = document.getElementById("valTimer");
        if (valTimer) valTimer.textContent = `${selectedTimerSeconds}.0 Detik`;
        document.querySelectorAll("#modalTimerSelectorGroup .mp-setting-option-btn").forEach(btn => {
            btn.classList.toggle("is-active", parseFloat(btn.dataset.timer) === selectedTimerSeconds);
        });

        // Tampilkan Modal Popup dengan animasi
        overlay.classList.add("is-open");
        overlay.style.display = "flex";
        overlay.style.opacity = "1";
        overlay.style.visibility = "visible";
        overlay.style.pointerEvents = "auto";
        overlay.setAttribute("aria-hidden", "false");

        UI_SFX.pop();
    }

    function closeGameSetupModal() {
        const overlay = document.getElementById("gameSetupOverlay");
        if (!overlay) return;
        overlay.classList.remove("is-open");
        overlay.style.display = "none";
        overlay.style.opacity = "0";
        overlay.style.visibility = "hidden";
        overlay.style.pointerEvents = "none";
        overlay.setAttribute("aria-hidden", "true");
    }

    // Ekspos ke window
    window.openGameSetupModal = openGameSetupModal;
    window.closeGameSetupModal = closeGameSetupModal;
    window.syncUserProfiles = syncUserProfiles;
    window.MULTIPLAYER_GAMES = MULTIPLAYER_GAMES;

    // 6. EVENT BINDING: CARDS, MODAL BUTTONS, MAX PLAYERS, ROUNDS, TIMER
    function initUIEvents() {
        syncUserProfiles();

        // Pantau pembaruan profil dari luar (misal admin modal)
        window.addEventListener("profilesUpdated", syncUserProfiles);
        window.addEventListener("storage", syncUserProfiles);

        // Bind Kartu Permainan di Game Hub
        const gameCards = document.querySelectorAll("#gameGridHub .mp-game-card, .mp-game-card");
        gameCards.forEach(card => {
            card.addEventListener("click", function (e) {
                e.preventDefault();
                const gt = this.dataset.gametype || "kana";
                gameCards.forEach(c => c.classList.remove("is-active"));
                this.classList.add("is-active");
                openGameSetupModal(gt);
            });
        });

        // Global delegation untuk klik kartu game (proteksi tambahan)
        document.addEventListener("click", function (e) {
            const card = e.target.closest(".mp-game-card");
            if (card) {
                e.preventDefault();
                const gt = card.dataset.gametype || "kana";
                document.querySelectorAll(".mp-game-card").forEach(c => c.classList.remove("is-active"));
                card.classList.add("is-active");
                openGameSetupModal(gt);
            }
        });

        // Tombol Tutup Modal (✕)
        const btnClose = document.getElementById("btnCloseGameSetup");
        if (btnClose) btnClose.addEventListener("click", closeGameSetupModal);

        // Tutup saat klik di latar belakang modal
        const overlay = document.getElementById("gameSetupOverlay");
        if (overlay) {
            overlay.addEventListener("click", function (e) {
                if (e.target === overlay) closeGameSetupModal();
            });
        }

        // Tutup dengan tombol Escape
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") closeGameSetupModal();
        });

        // Selector Max Pemain (2, 3, 4 pemain)
        const maxBtns = document.querySelectorAll("#modalMaxPlayersSelectorGroup .mp-setting-option-btn");
        maxBtns.forEach(btn => {
            btn.addEventListener("click", function () {
                maxBtns.forEach(b => b.classList.remove("is-active"));
                this.classList.add("is-active");
                selectedMaxPlayers = parseInt(this.dataset.max, 10) || 2;
                const valEl = document.getElementById("valMaxPlayers");
                if (valEl) {
                    valEl.textContent = `${selectedMaxPlayers} Pemain ${selectedMaxPlayers === 2 ? '(1v1 Duel)' : selectedMaxPlayers === 3 ? '(3P Segitiga)' : '(4P Party)'}`;
                }
                UI_SFX.beep();
            });
        });

        // Selector Jumlah Ronde
        const roundBtns = document.querySelectorAll("#modalRoundsSelectorGroup .mp-setting-option-btn");
        roundBtns.forEach(btn => {
            btn.addEventListener("click", function () {
                roundBtns.forEach(b => b.classList.remove("is-active"));
                this.classList.add("is-active");
                selectedRounds = parseInt(this.dataset.rounds, 10) || 10;
                const valEl = document.getElementById("valRounds");
                if (valEl) valEl.textContent = `${selectedRounds} Soal`;
                UI_SFX.beep();
            });
        });

        // Selector Batas Waktu
        const timerBtns = document.querySelectorAll("#modalTimerSelectorGroup .mp-setting-option-btn");
        timerBtns.forEach(btn => {
            btn.addEventListener("click", function () {
                timerBtns.forEach(b => b.classList.remove("is-active"));
                this.classList.add("is-active");
                selectedTimerSeconds = parseFloat(this.dataset.timer) || 5;
                const valEl = document.getElementById("valTimer");
                if (valEl) valEl.textContent = `${selectedTimerSeconds}.0 Detik`;
                UI_SFX.beep();
            });
        });

        // Tombol "🤖 Lawan AI Sensei"
        const btnBot = document.getElementById("modalBtnPlayBot");
        if (btnBot) {
            btnBot.addEventListener("click", function () {
                closeGameSetupModal();
                UI_SFX.fanfare();
                if (window.mpStartBotMatch) {
                    window.mpStartBotMatch(selectedGameType, selectedMode, selectedRounds, selectedTimerSeconds);
                } else {
                    launchStandaloneBotMatch(selectedGameType, selectedMode, selectedRounds, selectedTimerSeconds);
                }
            });
        }

        // Tombol "⚡ Tanding Cepat (Online)"
        const btnQuick = document.getElementById("modalBtnQuickMatch");
        if (btnQuick) {
            btnQuick.addEventListener("click", function () {
                closeGameSetupModal();
                if (window.mpQuickMatch) {
                    window.mpQuickMatch();
                } else if (window.mpCreateRoom) {
                    window.mpCreateRoom(selectedGameType, selectedMode, selectedRounds, selectedMaxPlayers, selectedTimerSeconds, false);
                } else {
                    showOfflineNotice();
                }
            });
        }

        // Tombol "➕ Buat Room"
        const btnCreate = document.getElementById("modalBtnCreateRoom");
        if (btnCreate) {
            btnCreate.addEventListener("click", function () {
                closeGameSetupModal();
                UI_SFX.fanfare();
                if (window.mpCreateRoom) {
                    window.mpCreateRoom(selectedGameType, selectedMode, selectedRounds, selectedMaxPlayers, selectedTimerSeconds, false);
                } else {
                    showOfflineNotice();
                }
            });
        }

        // Tombol "Gabung dengan Kode"
        const btnJoinCode = document.getElementById("btnJoinByCode");
        const inputCode = document.getElementById("inputRoomCode");
        if (btnJoinCode && inputCode) {
            btnJoinCode.addEventListener("click", function () {
                const code = inputCode.value.trim().toUpperCase();
                if (!code) {
                    alert("Silakan masukkan 4-digit kode room!");
                    return;
                }
                if (window.mpJoinByCode) {
                    window.mpJoinByCode(code);
                } else {
                    showOfflineNotice();
                }
            });
        }
    }

    // 7. NOTIFIKASI JIKA PROTOKOL FILE:// (OFFLINE/LOCAL CORPS BLOCKED)
    function showOfflineNotice() {
        const confirmed = confirm(
            "💡 Info Mode Multiplayer:\n\n" +
            "Fitur online room realtime membutuhkan server lokal (seperti Live Server di VS Code http://127.0.0.1:5500) agar database sinkronisasi aktif.\n\n" +
            "Apakah kamu ingin langsung bermain melawan AI Sensei sekarang juga?"
        );
        if (confirmed) {
            launchStandaloneBotMatch(selectedGameType, selectedMode, selectedRounds, selectedTimerSeconds);
        }
    }

    // 8. STANDALONE BOT MATCH ENGINE (Bisa dimainkan di mana saja tanpa server!)
    function launchStandaloneBotMatch(gameType, mode, rounds, timerSec) {
        const views = {
            lobby: document.getElementById("viewLobby"),
            waiting: document.getElementById("viewWaiting"),
            battle: document.getElementById("viewBattle"),
            podium: document.getElementById("viewPodium")
        };

        function switchView(target) {
            Object.keys(views).forEach(k => {
                if (views[k]) views[k].style.display = (k === target) ? "block" : "none";
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
        }

        // Data Soal Mini untuk Mode Standalone
        const SAMPLE_QUESTIONS = {
            kana: [
                { kana: "あ", answer: "a", options: ["a", "i", "u", "e"] },
                { kana: "か", answer: "ka", options: ["ka", "ki", "ku", "ke"] },
                { kana: "さ", answer: "sa", options: ["sa", "shi", "su", "se"] },
                { kana: "た", answer: "ta", options: ["ta", "chi", "tsu", "te"] },
                { kana: "な", answer: "na", options: ["na", "ni", "nu", "ne"] },
                { kana: "は", answer: "ha", options: ["ha", "hi", "fu", "he"] },
                { kana: "ま", answer: "ma", options: ["ma", "mi", "mu", "me"] },
                { kana: "や", answer: "ya", options: ["ya", "yu", "yo", "wa"] },
                { kana: "ら", answer: "ra", options: ["ra", "ri", "ru", "re"] },
                { kana: "わ", answer: "wa", options: ["wa", "wo", "n", "a"] }
            ],
            kanji: [
                { kana: "水", answer: "Air", options: ["Air", "Api", "Pohon", "Tanah"] },
                { kana: "火", answer: "Api", options: ["Api", "Bulan", "Air", "Emas"] },
                { kana: "木", answer: "Pohon", options: ["Pohon", "Gunung", "Sungai", "Hujan"] },
                { kana: "金", answer: "Emas / Uang", options: ["Emas / Uang", "Besi", "Batu", "Kayu"] },
                { kana: "日", answer: "Matahari", options: ["Matahari", "Bulan", "Bintang", "Langit"] },
                { kana: "山", answer: "Gunung", options: ["Gunung", "Laut", "Sungai", "Lembah"] },
                { kana: "川", answer: "Sungai", options: ["Sungai", "Danau", "Laut", "Sumur"] },
                { kana: "人", answer: "Orang", options: ["Orang", "Anak", "Teman", "Guru"] },
                { kana: "手", answer: "Tangan", options: ["Tangan", "Kaki", "Mata", "Mulut"] },
                { kana: "本", answer: "Buku", options: ["Buku", "Sekolah", "Pena", "Kertas"] }
            ],
            janken: [
                { kana: "⚔️ じゃんけん ⚔️", answer: "✊ Batu (Guu)", options: ["✊ Batu (Guu)", "✌️ Gunting (Choki)", "🖐️ Kertas (Paa)", "🤝 Seri"] },
                { kana: "⚔️ じゃんけん ⚔️", answer: "✌️ Gunting (Choki)", options: ["✊ Batu (Guu)", "✌️ Gunting (Choki)", "🖐️ Kertas (Paa)", "🤝 Seri"] },
                { kana: "⚔️ じゃんけん ⚔️", answer: "🖐️ Kertas (Paa)", options: ["✊ Batu (Guu)", "✌️ Gunting (Choki)", "🖐️ Kertas (Paa)", "🤝 Seri"] }
            ],
            shiritori: [
                { kana: "ねこ (Kucing) ➔ ?", answer: "こども (Anak)", options: ["こども (Anak)", "さくら (Bunga)", "やま (Gunung)", "ほん (Buku)"] },
                { kana: "りんご (Apel) ➔ ?", answer: "ごはん (Nasi)", options: ["ごはん (Nasi)", "くるま (Mobil)", "みず (Air)", "いぬ (Anjing)"] },
                { kana: "さくら (Bunga) ➔ ?", answer: "らいおん (Singa)", options: ["らいおん (Singa)", "とり (Burung)", "つき (Bulan)", "ゆき (Salju)"] }
            ],
            dojo: [
                { kana: "⚔️ Serangan Datang!", answer: "🛡️ TANGKIS", options: ["🛡️ TANGKIS", "👊 PUKUL", "💨 HINDARI", "🏃 LARI"] },
                { kana: "🥋 Celah Terbuka!", answer: "👊 PUKUL", options: ["👊 PUKUL", "🛡️ TANGKIS", "💨 HINDARI", "🧘 MEDITASI"] },
                { kana: "🌪️ Shuriken Melesat!", answer: "💨 HINDARI", options: ["💨 HINDARI", "👊 PUKUL", "🛡️ TANGKIS", "👏 TEPUK"] }
            ]
        };

        const pool = SAMPLE_QUESTIONS[gameType] || SAMPLE_QUESTIONS.kana;
        let qList = [];
        for (let i = 0; i < rounds; i++) {
            qList.push(pool[i % pool.length]);
        }

        let currIdx = 0;
        let userScore = 0;
        let botScore = 0;
        let timerVal = timerSec;
        let timerInterval = null;

        // Buka Arena Battle
        switchView("battle");

        // Set Nama & Avatar
        const gMeta = MULTIPLAYER_GAMES[gameType] || MULTIPLAYER_GAMES.kana;
        const bGameBadge = document.getElementById("battleGameBadge");
        if (bGameBadge) bGameBadge.textContent = `${gMeta.icon} ${gMeta.name.toUpperCase()}`;

        const enemyName = document.getElementById("battleEnemyName");
        if (enemyName) enemyName.textContent = "AI Sensei 🤖";

        function renderRound() {
            if (currIdx >= qList.length) {
                // Game Selesai -> Tampilkan Podium
                clearInterval(timerInterval);
                switchView("podium");
                const podTitle = document.getElementById("podiumTitle");
                const podSub = document.getElementById("podiumSub");
                const pMyScore = document.getElementById("podiumMyScore");
                const pEnScore = document.getElementById("podiumEnemyScore");
                const pEnName = document.getElementById("podiumEnemyName");

                if (pEnName) pEnName.textContent = "AI Sensei 🤖";
                if (pMyScore) pMyScore.textContent = userScore;
                if (pEnScore) pEnScore.textContent = botScore;

                if (userScore >= botScore) {
                    if (podTitle) podTitle.textContent = "🏆 KAMU MENANG TELAK!";
                    if (podSub) podSub.textContent = `Hebat! Kamu berhasil mengungguli AI Sensei dengan total ${userScore} poin!`;
                    UI_SFX.fanfare();
                } else {
                    if (podTitle) podTitle.textContent = "🥈 PERTANDINGAN KETAT!";
                    if (podSub) podSub.textContent = "AI Sensei lebih cepat kali ini! Coba lagi dan kalahkan dia!";
                }
                return;
            }

            const q = qList[currIdx];
            const roundText = document.getElementById("battleRoundText");
            if (roundText) roundText.textContent = `Ronde ${currIdx + 1} / ${qList.length}`;

            const targetKana = document.getElementById("battleTargetKana");
            if (targetKana) targetKana.textContent = q.kana;

            const optGrid = document.getElementById("battleOptionsGrid");
            if (optGrid) {
                optGrid.innerHTML = q.options.map(opt => `
                    <button type="button" class="mp-option-btn" data-val="${opt}">${opt}</button>
                `).join("");

                optGrid.querySelectorAll(".mp-option-btn").forEach(btn => {
                    btn.addEventListener("click", function () {
                        handleAnswer(this.dataset.val === q.answer, this);
                    });
                });
            }

            // Reset Timer Bar
            timerVal = timerSec;
            updateTimerDisplay();
            clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                timerVal -= 0.1;
                if (timerVal <= 0) {
                    clearInterval(timerInterval);
                    handleAnswer(false, null);
                } else {
                    updateTimerDisplay();
                }
            }, 100);

            // Simulasi Bot menjawab
            const botDelay = (Math.random() * (timerSec - 1) + 1.2) * 1000;
            setTimeout(() => {
                if (currIdx < qList.length && Math.random() > 0.3) {
                    botScore += Math.floor(80 + Math.random() * 40);
                    updateTracks();
                }
            }, botDelay);
        }

        function updateTimerDisplay() {
            const tText = document.getElementById("battleTimerText");
            const tBar = document.getElementById("battleTimerBar");
            if (tText) tText.textContent = `${Math.max(0, timerVal).toFixed(1)}s`;
            if (tBar) tBar.style.width = `${Math.max(0, (timerVal / timerSec) * 100)}%`;
        }

        function updateTracks() {
            const myProg = document.getElementById("battleMyProgress");
            const enProg = document.getElementById("battleEnemyProgress");
            const mySc = document.getElementById("battleMyScore");
            const enSc = document.getElementById("battleEnemyScore");

            const pct = ((currIdx + 1) / qList.length) * 100;
            if (myProg) myProg.style.width = `${pct}%`;
            if (enProg) enProg.style.width = `${pct}%`;
            if (mySc) mySc.textContent = `${userScore} PTS`;
            if (enSc) enSc.textContent = `${botScore} PTS`;
        }

        function handleAnswer(isCorrect, btnEl) {
            clearInterval(timerInterval);
            if (isCorrect) {
                if (btnEl) btnEl.classList.add("btn-correct");
                const pts = Math.floor(100 + (timerVal / timerSec) * 50);
                userScore += pts;
                playTone(880, 0.15, "sine", 0.15);
            } else {
                if (btnEl) btnEl.classList.add("btn-wrong");
                playTone(200, 0.2, "sawtooth", 0.1);
            }
            updateTracks();

            setTimeout(() => {
                currIdx++;
                renderRound();
            }, 600);
        }

        renderRound();

        // Tombol Kembali ke Lobby dari Podium
        const btnLobby = document.getElementById("btnPodiumLobby");
        if (btnLobby) {
            btnLobby.onclick = () => switchView("lobby");
        }
        const btnRematch = document.getElementById("btnRematch");
        if (btnRematch) {
            btnRematch.onclick = () => launchStandaloneBotMatch(gameType, mode, rounds, timerSec);
        }
    }

    // Inisialisasi saat script selesai dimuat
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initUIEvents);
    } else {
        initUIEvents();
    }

})();
