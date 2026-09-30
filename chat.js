import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, onValue, onDisconnect, set, query, limitToLast } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

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

const chatBox = document.getElementById("chatBox");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const sessionKey = "nihongoChatUser";
let currentUser = localStorage.getItem(sessionKey);

const coreMembers = ["umaedi", "iqbal", "rifki", "fasya"];
const isCore = currentUser && coreMembers.includes(currentUser.toLowerCase());

let currentRoom = null; 
let activeChatListener = null;
let activeWipeListener = null; 
let activeTypingListener = null;
let sessionLastRead = Date.now();
let unreadDividerAdded = false;
let lastRenderedDateString = ""; 
const pendingMessages = [];
let currentOnlineUsers = []; 

let activeReplyData = null;
const replyPreviewArea = document.getElementById("replyPreviewArea");
const replyPreviewName = document.getElementById("replyPreviewName");
const replyPreviewText = document.getElementById("replyPreviewText");
const cancelReplyBtn = document.getElementById("cancelReplyBtn");

const chatListView = document.getElementById("chatListView");
const chatRoomView = document.getElementById("chatRoomView");
const backToListBtn = document.getElementById("backToListBtn");
const chatImageUpload = document.getElementById("chatImageUpload");
const sendImageBtn = document.getElementById("sendImageBtn");
const recordAudioBtn = document.getElementById("recordAudioBtn"); 

// In-chat search & tools
const clearSenseiBtn = document.getElementById("clearSenseiBtn");
const toggleSearchBtn = document.getElementById("toggleSearchBtn");
const inchatSearchBar = document.getElementById("inchatSearchBar");
const inchatSearchInput = document.getElementById("inchatSearchInput");
const closeSearchBtn = document.getElementById("closeSearchBtn");
const ttsRecentBtn = document.getElementById("ttsRecentBtn");

// Lightbox
const imageLightboxOverlay = document.getElementById("imageLightboxOverlay");
const lightboxImg = document.getElementById("lightboxImg");
const closeLightbox = document.getElementById("closeLightbox");

const typingIndicatorContainer = document.createElement("div");
typingIndicatorContainer.className = "typing-indicator-container";
typingIndicatorContainer.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div><span id="typingUserNameText">Seseorang sedang mengetik...</span>`;
let typingTimeout = null;

if (isCore) {
    if (sendImageBtn) sendImageBtn.style.display = "grid"; 
    if (recordAudioBtn) recordAudioBtn.style.display = "grid";
}

if (cancelReplyBtn) cancelReplyBtn.addEventListener("click", cancelReply);

function cancelReply() {
    activeReplyData = null;
    if (replyPreviewArea) replyPreviewArea.style.display = "none";
}

function triggerReply(name, text) {
    activeReplyData = { name, text };
    if (replyPreviewArea) {
        replyPreviewArea.style.display = "flex";
        replyPreviewName.textContent = name;
        replyPreviewText.textContent = text;
    }
    if (chatInput) chatInput.focus();
}

// ==========================================
// AUDIO PRONUNCIATION / SPEECH SYNTHESIS
// ==========================================
function playJapaneseAudio(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[()]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9;
    
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang.includes('ja') || v.lang.includes('JP'));
    if (jaVoice) utterance.voice = jaVoice;
    
    window.speechSynthesis.speak(utterance);
}

// ==========================================
// VOICE NOTE RECORDER (VOICE RECORDING)
// ==========================================
let mediaRecorder;
let audioChunks = [];
let isRecording = false;

if (recordAudioBtn) {
    recordAudioBtn.addEventListener("click", async () => {
        if (!isRecording) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];
                
                mediaRecorder.ondataavailable = event => {
                    if (event.data.size > 0) audioChunks.push(event.data);
                };
                
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' }); 
                    const reader = new FileReader();
                    reader.onloadend = function() {
                        const base64Audio = reader.result;
                        if (confirm("Kirim rekaman suara (Voice Note) ini?")) {
                            if (currentRoom === "sensei") {
                                sendSenseiMessage("", null, base64Audio);
                            } else {
                                const dbRefName = currentRoom === "core" ? "messages" : "messages_public";
                                let payload = { name: currentUser, message: "", audio: base64Audio, timestamp: Date.now() };
                                if (activeReplyData) payload.replyTo = activeReplyData;
                                push(ref(db, dbRefName), payload);
                            }
                            cancelReply();
                        }
                    };
                    reader.readAsDataURL(audioBlob);
                    stream.getTracks().forEach(track => track.stop());
                };
                
                mediaRecorder.start();
                isRecording = true;
                recordAudioBtn.style.color = "#E63946"; 
                recordAudioBtn.style.animation = "pulseGlow 1s infinite";
                if(chatInput) chatInput.placeholder = "Merekam suara... (Klik mic lagi untuk stop)";
            } catch (err) {
                alert("Gagal mengakses mikrofon. Pastikan Anda mengizinkan akses mic di browser.");
            }
        } else {
            if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
            isRecording = false;
            recordAudioBtn.style.color = ""; 
            recordAudioBtn.style.animation = "none";
            if(chatInput) chatInput.placeholder = "Tulis pesan (bisa romaji atau kana)...";
        }
    });
}

// ==========================================
// FOTO ATTACHMENT
// ==========================================
if (sendImageBtn && chatImageUpload) {
    sendImageBtn.addEventListener("click", () => chatImageUpload.click());
    chatImageUpload.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                const maxSize = 400; 
                let width = img.width; let height = img.height;
                if (width > height) { if (width > maxSize) { height *= maxSize / width; width = maxSize; } } 
                else { if (height > maxSize) { width *= maxSize / height; height = maxSize; } }
                
                canvas.width = width; canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                const base64Img = canvas.toDataURL("image/jpeg", 0.6); 

                if (confirm("Kirim gambar ini ke ruang chat?")) {
                    if (currentRoom === "sensei") {
                        sendSenseiMessage("", base64Img, null);
                    } else {
                        const dbRefName = currentRoom === "core" ? "messages" : "messages_public";
                        let payload = { name: currentUser, message: "", image: base64Img, timestamp: Date.now() };
                        if (activeReplyData) payload.replyTo = activeReplyData;
                        push(ref(db, dbRefName), payload);
                    }
                    cancelReply();
                }
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
        chatImageUpload.value = ""; 
    });
}

// ==========================================
// LIGHTBOX VIEWER
// ==========================================
function openLightbox(src) {
    if (!imageLightboxOverlay || !lightboxImg) return;
    lightboxImg.src = src;
    imageLightboxOverlay.style.display = "flex";
}

if (closeLightbox) {
    closeLightbox.addEventListener("click", () => {
        imageLightboxOverlay.style.display = "none";
    });
}

if (imageLightboxOverlay) {
    imageLightboxOverlay.addEventListener("click", (e) => {
        if (e.target === imageLightboxOverlay) imageLightboxOverlay.style.display = "none";
    });
}

// ==========================================
// PREVIEW ROOM & LISTENER
// ==========================================
function listenRoomPreview(roomType) {
    const refName = roomType === "core" ? "messages" : "messages_public";
    const recentMessages = query(ref(db, refName), limitToLast(30));
    
    onValue(recentMessages, (snapshot) => {
        if (snapshot.exists()) {
            let unreadCount = 0;
            let lastMsgData = null;
            let lastRead = Number(localStorage.getItem("lastRead_" + roomType)) || Date.now();

            snapshot.forEach((childSnap) => {
                const msg = childSnap.val();
                lastMsgData = msg; 
                if (msg.timestamp > lastRead && msg.name !== currentUser && msg.name !== "SYSTEM" && currentRoom !== roomType) {
                    unreadCount++;
                }
            });

            const lastMsgEl = document.getElementById(roomType === "core" ? "lastMsgCore" : "lastMsgPublic");
            const timeEl = document.getElementById(roomType === "core" ? "timeCore" : "timePublic");
            const badgeEl = document.getElementById(roomType === "core" ? "badgeCore" : "badgePublic");

            if (lastMsgData && lastMsgEl && timeEl) {
                let msgText = lastMsgData.image ? "📷 Mengirim foto" : (lastMsgData.audio ? "🎤 Voice Note" : lastMsgData.message);
                if (lastMsgData.isCountdown) msgText = "⚠️ Pembersihan sistem dimulai...";
                if (lastMsgData.isPostClear) msgText = "✅ Ruang obrolan bersih.";

                const isMe = lastMsgData.name === currentUser ? "Anda: " : (lastMsgData.name === "SYSTEM" ? "System: " : `${lastMsgData.name}: `);
                lastMsgEl.textContent = isMe + msgText;
                
                const dateObj = new Date(lastMsgData.timestamp);
                const hrs = String(dateObj.getHours()).padStart(2, '0');
                const mins = String(dateObj.getMinutes()).padStart(2, '0');
                timeEl.textContent = `${hrs}:${mins}`;
            }

            if (badgeEl) {
                if (unreadCount > 0) {
                    badgeEl.textContent = unreadCount > 9 ? "9+" : unreadCount;
                    badgeEl.style.display = "block";
                    if (lastMsgEl) lastMsgEl.style.color = "#fff"; 
                } else {
                    badgeEl.style.display = "none";
                    if (lastMsgEl) lastMsgEl.style.color = "var(--muted)";
                }
            }
        }
    });
}

// ==========================================
// SWITCH ROOM (PUBLIC / SENSEI / CORE)
// ==========================================
window.openRoom = function(type) {
    if (type === "core" && !isCore) {
        alert("🔒 AKSES TERBATAS: Ruang Trinity Core dikhususkan untuk founder & tim pengembang inti (Umaedi, Iqbal, Rifki, Fasya).");
        return;
    }

    currentRoom = type;
    cancelReply(); 
    
    if(chatListView) chatListView.style.display = "none";
    if(chatRoomView) chatRoomView.style.display = "flex";
    if(inchatSearchBar) inchatSearchBar.style.display = "none";
    
    const roomLabel = document.getElementById("roomLabel");
    const roomTitle = document.getElementById("roomTitle");
    const roomIcon = document.getElementById("roomIcon");
    const coreMemberAvatarList = document.getElementById("coreMemberAvatarList");
    const onlineCountText = document.getElementById("onlineCountText");

    if (type === "core") {
        if(roomLabel) roomLabel.textContent = "TRINITY CORE (PRIVATE)"; 
        if(roomTitle) roomTitle.textContent = "Markas Utama Tim";
        if(roomIcon) { roomIcon.textContent = "🛡️"; roomIcon.style.background = "#D32F2F"; }
        if(coreMemberAvatarList) coreMemberAvatarList.style.display = "flex";
        if(clearSenseiBtn) clearSenseiBtn.style.display = "none";
    } else if (type === "sensei") {
        if(roomLabel) roomLabel.textContent = "AI SENSEI 1-ON-1 DOJO"; 
        if(roomTitle) roomTitle.textContent = "Aoi Sensei (葵先生)";
        if(roomIcon) { roomIcon.textContent = "🌸"; roomIcon.style.background = "linear-gradient(135deg, #FF6584, #8e44ad)"; }
        if(coreMemberAvatarList) coreMemberAvatarList.style.display = "none";
        if(onlineCountText) onlineCountText.innerHTML = `<span style="color:#FF758C;">🌸 Aoi Sensei siap memandu belajarmu</span>`;
        if(clearSenseiBtn) clearSenseiBtn.style.display = "grid";
    } else {
        if(roomLabel) roomLabel.textContent = "PUBLIC LOUNGE"; 
        if(roomTitle) roomTitle.textContent = "Ruang Diskusi Publik";
        if(roomIcon) { roomIcon.textContent = "🌐"; roomIcon.style.background = "#1E88E5"; }
        if(coreMemberAvatarList) coreMemberAvatarList.style.display = "none"; 
        if(clearSenseiBtn) clearSenseiBtn.style.display = "none";
    }

    if (chatBox) chatBox.replaceChildren();
    pendingMessages.length = 0;
    unreadDividerAdded = false;
    lastRenderedDateString = ""; 

    if (type !== "sensei") {
        renderOnlineUsers();
    }

    let lastReadVal = Number(localStorage.getItem("lastRead_" + type)) || Date.now();
    sessionLastRead = lastReadVal;
    localStorage.setItem("lastRead_" + type, Date.now());

    if (activeChatListener) { activeChatListener(); activeChatListener = null; }
    if (activeWipeListener) { activeWipeListener(); activeWipeListener = null; }
    if (activeTypingListener) { activeTypingListener(); activeTypingListener = null; }

    if (type === "sensei") {
        loadSenseiHistory();
        return;
    }

    const dbRefName = type === "core" ? "messages" : "messages_public";
    const typingRefName = type === "core" ? "typing_core" : "typing_public";

    activeChatListener = onChildAdded(ref(db, dbRefName), (snapshot) => {
        const data = snapshot.val();
        const msgKey = snapshot.key; 
        pendingMessages.push({ data, key: msgKey });
        renderMessage(data, msgKey);
    });

    activeWipeListener = onValue(ref(db, dbRefName), (snapshot) => {
        if (!snapshot.exists()) {
            if (chatBox) chatBox.replaceChildren();
            pendingMessages.length = 0;
            unreadDividerAdded = false;
            lastRenderedDateString = "";
        }
    });

    activeTypingListener = onValue(ref(db, typingRefName), (snapshot) => {
        if (!chatBox) return;
        let typingUsers = [];
        if (snapshot.exists()) {
            const data = snapshot.val();
            typingUsers = Object.keys(data).filter(name => name !== currentUser && data[name] === true);
        }

        if (typingUsers.length > 0) {
            const displayNames = typingUsers.map(name => {
                const profile = window.userProfiles ? window.userProfiles[name] : null;
                return profile && profile.displayName ? profile.displayName : name;
            });
            const textEl = typingIndicatorContainer.querySelector("#typingUserNameText");
            if (displayNames.length === 1) textEl.textContent = `${displayNames[0]} sedang mengetik...`;
            else textEl.textContent = `${displayNames[0]} dan ${displayNames.length - 1} lainnya sedang mengetik...`;

            typingIndicatorContainer.style.display = "flex";
            chatBox.appendChild(typingIndicatorContainer);
            chatBox.scrollTop = chatBox.scrollHeight;
        } else {
            typingIndicatorContainer.style.display = "none";
        }
    });
};

// ==========================================
// TOMBOL KEMBALI KE DAFTAR CHAT
// ==========================================
if (backToListBtn) {
    backToListBtn.addEventListener("click", () => {
        if (currentRoom) localStorage.setItem("lastRead_" + currentRoom, Date.now()); 
        currentRoom = null;
        chatRoomView.style.display = "none";
        chatListView.style.display = "flex";
        if (activeChatListener) { activeChatListener(); activeChatListener = null; }
        if (activeWipeListener) { activeWipeListener(); activeWipeListener = null; }
        if (activeTypingListener) { activeTypingListener(); activeTypingListener = null; }
        cancelReply();
    });
}

// Buka Core Card jika core
const cardCore = document.getElementById("roomCardCore");
if (isCore && cardCore) {
    cardCore.style.display = "flex";
} else if (cardCore) {
    cardCore.style.display = "flex";
    cardCore.style.opacity = "0.7";
    cardCore.querySelector("h3").innerHTML = `TRINITY CORE <span style="color:#ff3b30;">(🔒 Terkunci)</span>`;
}

listenRoomPreview("public");
listenRoomPreview("core");

// ==========================================
// FITUR PENCARIAN DI DALAM PESAN
// ==========================================
if (toggleSearchBtn && inchatSearchBar) {
    toggleSearchBtn.addEventListener("click", () => {
        const isShown = inchatSearchBar.style.display === "flex";
        inchatSearchBar.style.display = isShown ? "none" : "flex";
        if (!isShown && inchatSearchInput) inchatSearchInput.focus();
    });
}

if (closeSearchBtn && inchatSearchBar) {
    closeSearchBtn.addEventListener("click", () => {
        inchatSearchBar.style.display = "none";
        filterMessages("");
    });
}

if (inchatSearchInput) {
    inchatSearchInput.addEventListener("input", (e) => {
        filterMessages(e.target.value.toLowerCase().trim());
    });
}

function filterMessages(query) {
    const allMsgs = chatBox.querySelectorAll(".msg");
    allMsgs.forEach(m => {
        if (!query) {
            m.style.display = "flex";
            return;
        }
        const text = m.innerText.toLowerCase();
        m.style.display = text.includes(query) ? "flex" : "none";
    });
}

// TTS Recent message
if (ttsRecentBtn) {
    ttsRecentBtn.addEventListener("click", () => {
        const lastMsg = pendingMessages[pendingMessages.length - 1];
        if (lastMsg && lastMsg.data && lastMsg.data.message) {
            playJapaneseAudio(lastMsg.data.message);
        } else {
            playJapaneseAudio("こんにちは、日本語トリニティへようこそ。");
        }
    });
}

// Quick reaction chips
const quickPhraseBar = document.getElementById("quickPhraseBar");
if (quickPhraseBar) {
    const chips = quickPhraseBar.querySelectorAll(".phrase-chip");
    chips.forEach(chip => {
        chip.addEventListener("click", () => {
            const phrase = chip.dataset.text || chip.textContent;
            if (chatInput) {
                chatInput.value = (chatInput.value + " " + phrase).trim();
                chatInput.focus();
            }
        });
// Emoji quick picker
const chatEmojiBtn = document.getElementById("chatEmojiBtn");
if (chatEmojiBtn && chatInput) {
    const emojis = ["🌸", "⛩️", "✨", "🏮", "🍵", "🎌", "🍙", "🎎", "🙏", "😊", "🔥", "💯", "👍", "👏", "🐱", "草"];
    const emojiPopup = document.createElement("div");
    emojiPopup.className = "inchat-emoji-popup";
    emojiPopup.style.cssText = "display: none; position: absolute; bottom: 65px; left: 14px; background: rgba(16, 22, 33, 0.98); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 10px; gap: 8px; z-index: 50; flex-wrap: wrap; max-width: 280px; box-shadow: 0 10px 30px rgba(0,0,0,0.6);";
    
    emojis.forEach(emo => {
        const emoSpan = document.createElement("span");
        emoSpan.textContent = emo;
        emoSpan.style.cssText = "font-size: 20px; cursor: pointer; padding: 4px; border-radius: 6px; transition: transform 0.15s; display: inline-block;";
        emoSpan.onmouseenter = () => emoSpan.style.transform = "scale(1.25)";
        emoSpan.onmouseleave = () => emoSpan.style.transform = "scale(1)";
        emoSpan.onclick = () => {
            chatInput.value += emo;
            chatInput.focus();
            emojiPopup.style.display = "none";
        };
        emojiPopup.appendChild(emoSpan);
    });

    const chatRoomViewEl = document.getElementById("chatRoomView");
    if (chatRoomViewEl) {
        chatRoomViewEl.style.position = "relative";
        chatRoomViewEl.appendChild(emojiPopup);
    }

    chatEmojiBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        emojiPopup.style.display = emojiPopup.style.display === "flex" ? "none" : "flex";
    });

    document.addEventListener("click", (e) => {
        if (!emojiPopup.contains(e.target) && e.target !== chatEmojiBtn) {
            emojiPopup.style.display = "none";
        }
    });
}

// ==========================================
// AI SENSEI SYSTEM (1-ON-1 SMART JAPANESE TUTOR)
// ==========================================
if (clearSenseiBtn) {
    clearSenseiBtn.addEventListener("click", () => {
        if (currentRoom !== "sensei") return;
        const confirmClean = confirm(
            "🧹 BERSIHKAN DATABASE CHAT AI SENSEI\n\n" +
            "Apakah Anda yakin ingin menghapus semua riwayat percakapan dengan Aoi Sensei?\n\n" +
            "Penyimpanan lokal browser akan dikosongkan agar memori perangkat Anda tetap lega dan tidak penuh."
        );
        if (!confirmClean) return;

        const historyKey = `nihongo_sensei_history_${currentUser || 'guest'}`;
        localStorage.removeItem(historyKey);

        if (chatBox) chatBox.replaceChildren();
        pendingMessages.length = 0;
        unreadDividerAdded = false;
        lastRenderedDateString = "";

        loadSenseiHistory();
        alert("✨ Sukses! Database percakapan dengan Aoi Sensei berhasil dibersihkan.");
    });
}

function loadSenseiHistory() {
    const historyKey = `nihongo_sensei_history_${currentUser || 'guest'}`;
    let history = JSON.parse(localStorage.getItem(historyKey) || "[]");

    if (history.length === 0) {
        history.push({
            name: "AI_SENSEI",
            message: `Konnichiwa, ${currentUser || 'Pelajar'}-san! 🌸 Watashi wa Aoi Sensei desu (私は葵先生です).\n\nSelamat datang di ruang belajar privat AI Sensei! Saya siap menjadi tutor dan teman berlatih bahasa Jepangmu 24 jam.\n\nKamu bisa tanya arti kata, cara baca kanji, bedah pola tata bahasa (bunpou), kosakata, atau latihan percakapan santai. Nani o benkyou shitai desu ka? (Mau belajar apa hari ini?) ✨`,
            timestamp: Date.now()
        });
        localStorage.setItem(historyKey, JSON.stringify(history));
    }

    history.forEach(item => {
        renderMessage(item, "sensei_" + item.timestamp);
    });
}

function sendSenseiMessage(text, image = null, audio = null) {
    const historyKey = `nihongo_sensei_history_${currentUser || 'guest'}`;
    let history = JSON.parse(localStorage.getItem(historyKey) || "[]");

    const userMsg = {
        name: currentUser,
        message: text,
        image: image,
        audio: audio,
        timestamp: Date.now()
    };
    if (activeReplyData) userMsg.replyTo = activeReplyData;

    history.push(userMsg);
    pendingMessages.push({ data: userMsg, key: "sensei_" + userMsg.timestamp });
    renderMessage(userMsg, "sensei_" + userMsg.timestamp);

    // AI Sensei Response Generation
    const botTyping = document.getElementById("typingUserNameText");
    if (botTyping) botTyping.textContent = "Aoi Sensei sedang mengetik...";
    typingIndicatorContainer.style.display = "flex";
    chatBox.appendChild(typingIndicatorContainer);
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
        typingIndicatorContainer.style.display = "none";
        const replyText = generateSenseiReply(text);
        const senseiMsg = {
            name: "AI_SENSEI",
            message: replyText,
            timestamp: Date.now()
        };
        history.push(senseiMsg);
        localStorage.setItem(historyKey, JSON.stringify(history));
        pendingMessages.push({ data: senseiMsg, key: "sensei_" + senseiMsg.timestamp });
        renderMessage(senseiMsg, "sensei_" + senseiMsg.timestamp);
    }, 700);
}

function generateSenseiReply(input) {
    const raw = (input || "").toLowerCase().trim();

    if (!raw) {
        return `Hai, ${currentUser}-san! Gambarnya sudah saya terima 🌸 Ada pertanyaan seputar gambar tersebut atau ingin saya bantu jelaskan dalam bahasa Jepang?`;
    }

    if (raw.includes("halo") || raw.includes("hai") || raw.includes("konnichiwa") || raw.includes("ohayou") || raw.includes("selamat pagi")) {
        return `Konnichiwa, ${currentUser}-san! (こんにちは！)\n\nSenang bertemu denganmu hari ini 🌸 Bagaimana latihan kanamu? Jangan lupa konsisten ya: 継続は力なり (Keizoku wa chikara nari)! Ada materi yang ingin kamu tanyakan ke Aoi Sensei?`;
    }
    if (raw.includes("terima kasih") || raw.includes("arigatou") || raw.includes("makasih") || raw.includes("arigato")) {
        return `Dou itashimashite! (どういたしまして！ Sama-sama!)\n\nSemangat terus ya, ${currentUser}-san! Jika ada kosakata atau kanji baru yang sulit, langsung tanyakan saja ya ✨`;
    }
    if (raw.includes("nama") || raw.includes("kamu siapa") || raw.includes("siapa nama")) {
        return `Watashi wa Aoi Sensei desu (私は葵先生です 🌸).\nSaya adalah asisten tutor AI perempuan untuk Nihongo Trinity, siap membimbingmu belajar Hiragana, Katakana, Kanji, dan percakapan Jepang kapan saja!`;
    }
    if (raw.includes("partikel") || raw.includes("wa dan ga") || raw.includes("wa") || raw.includes("ga")) {
        return `Pertanyaan tata bahasa yang sangat bagus! 💡\n\n1. Partikel は (wa): Menandai TOPIK umum pembicaraan ("Adapun mengenai...").\nContoh: 私は学生です (Watashi wa gakusei desu - Saya adalah pelajar).\n\n2. Partikel が (ga): Menandai SUBJEK spesifik tindakan atau sifat baru ("Siapa/apa yang...").\nContoh: 誰が来ましたか？ (Dare ga kimashita ka? - Siapa yang datang?).\n\nApakah penjelasannya cukup jelas, ${currentUser}-san?`;
    }
    if (raw.includes("makan") || raw.includes("restoran") || raw.includes("pesan")) {
        return `Tips praktis memesan di restoran Jepang 🍜:\n\n1. Panggil pelayan: "Sumimasen!" (すみません！ - Permisi!)\n2. Tunjuk menu: "Kore o kudasai" (これをください - Tolong pesan yang ini)\n3. Saat makan: "Itadakimasu" (いただきます)\n4. Selesai makan: "Gochisousama deshita" (ごちそうさまでした)\n\nCoba latih pelafalannya ya!`;
    }
    if (raw.includes("perkenalan") || raw.includes("jikoshoukai")) {
        return `Contoh perkenalan diri (自己紹介 - Jikoshoukai) sopan:\n\n"Hajimemashite. Watashi wa ${currentUser} desu. Indonesia kara kimashita. Nihongo o benkyou shite imasu. Douzo yoroshiku onegaishimasu!"\n\n(Salam kenal. Nama saya ${currentUser}. Saya dari Indonesia. Sedang belajar bahasa Jepang. Mohon bantuannya!) 🌸`;
    }
    if (raw.includes("capek") || raw.includes("lelah") || raw.includes("otsukaresama")) {
        return `Otsukaresama deshita! (お疲れ様でした！ 🍵)\n\nKerja kerasmu hari ini sangat hebat, ${currentUser}-san! Istirahatlah sejenak, rilekskan pikiranmu dengan musik lofi di tab Hiburan, lalu kita lanjut lagi dengan semangat baru!`;
    }
    if (raw.includes("hiragana") || raw.includes("katakana") || raw.includes("kana")) {
        return `Untuk menguasai Hiragana & Katakana dengan cepat:\n\n1. Mulai dari vokal dasar: A-I-U-E-O (あいうえお).\n2. Gunakan fitur "Latihan Tulis Kuas" untuk melatih memori otot tangan.\n3. Uji kecepatanmu di "Uji Refleks Dojo" setiap hari 10-15 menit!\n\nMau latihan huruf apa sekarang?`;
    }
    if (raw.includes("kanji")) {
        return `Kanji itu seru karena setiap karakter menyimpan gambar dan makna filosofis! ⛩️\n\nMisalnya kanji 日 (matahari/hari) + 月 (bulan) digabung menjadi 明 (terang/cerah).\nBuka menu "Kanji Dojo" untuk menjelajahi kanji JLPT N5 sampai N3 ya!`;
    }

    return `Pertanyaan yang bagus sekali tentang "${input}"! ✨\n\nDalam bahasa Jepang, pemahaman konteks dan kesopanan (Keigo/Teineigo) adalah kunci utama.\n\n💡 Tips Aoi Sensei: Coba terapkan pola dasar [Topik は Deskripsi です] untuk membuat kalimat sederhana. Mau saya buatkan contoh praktisnya? 🌸`;
}

// ==========================================
// RENDER PESAN NORMAL & SYSTEM
// ==========================================
function renderMessage(data, msgKey) {
    if (!currentUser || !chatBox || !currentRoom) return;
    const senderName = data.name || "Unknown";
    const isSensei = senderName === "AI_SENSEI";
    
    // 1. TANGGAL & WAKTU
    const msgDate = new Date(data.timestamp || Date.now());
    const timeString = String(msgDate.getHours()).padStart(2, '0') + ':' + String(msgDate.getMinutes()).padStart(2, '0');
    
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    let displayDate = msgDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    if (msgDate.toDateString() === today.toDateString()) {
        displayDate = "HARI INI";
    } else if (msgDate.toDateString() === yesterday.toDateString()) {
        displayDate = "KEMARIN";
    }

    if (displayDate !== lastRenderedDateString) {
        const dayDivider = document.createElement("div");
        dayDivider.className = "chat-day";
        dayDivider.innerText = displayDate;
        chatBox.appendChild(dayDivider);
        lastRenderedDateString = displayDate;
    }

    // 2. PESAN SYSTEM WIPE
    if (senderName === "SYSTEM") {
        if (data.isPostClear && localStorage.getItem("hidden_sys_" + msgKey)) return;
        const msgDiv = document.createElement("div");
        msgDiv.className = `msg is-other`; 
        const headerDiv = document.createElement("div");
        headerDiv.className = "msg-header";
        const avatar = document.createElement("div");
        avatar.className = "message-avatar";
        const sender = document.createElement("strong");
        sender.textContent = "SYSTEM";
        const badge = document.createElement("span");
        badge.className = "tag-founder"; 

        if (data.isCountdown) {
            let timeLeft = 10 - Math.floor((Date.now() - data.timestamp) / 1000);
            if (timeLeft <= 0) return; 
            avatar.style.background = "#000"; avatar.style.border = "1px solid #00f3ff"; avatar.innerHTML = `<span style="font-size:14px;">👾</span>`; 
            badge.style.background = "#000"; badge.style.color = "#00f3ff"; badge.style.borderColor = "#00f3ff"; badge.innerText = "⚠️ SYSTEM OVERRIDE"; 
            sender.appendChild(badge);
            headerDiv.append(avatar, sender);
            
            const contentDiv = document.createElement("div");
            contentDiv.className = "msg-content";
            const textSpan = document.createElement("span");
            textSpan.id = `countdownText_${msgKey}`;
            textSpan.style.fontFamily = "monospace"; 
            textSpan.innerHTML = `<em>${data.message}</em> <strong style="color:#ff3b30; font-size:16px;">${timeLeft} detik</strong>.`;
            contentDiv.appendChild(textSpan);
            
            const timeEl = document.createElement("div");
            timeEl.className = "msg-time"; timeEl.textContent = timeString;
            contentDiv.appendChild(timeEl);

            msgDiv.append(headerDiv, contentDiv);
            chatBox.appendChild(msgDiv);
            
            if (typingIndicatorContainer.parentNode === chatBox) chatBox.appendChild(typingIndicatorContainer);
            chatBox.scrollTop = chatBox.scrollHeight;

            if (timeLeft > 0) {
                const timer = setInterval(() => {
                    let newTimeLeft = 10 - Math.floor((Date.now() - data.timestamp) / 1000);
                    if (newTimeLeft > 0) {
                        const el = document.getElementById(`countdownText_${msgKey}`);
                        if(el) el.innerHTML = `<em>${data.message}</em> <strong style="color:#ff3b30; font-size:16px;">${newTimeLeft} detik</strong>.`;
                    } else { clearInterval(timer); }
                }, 1000);
            }
            return;
        }

        if (data.isPostClear) {
            avatar.style.background = "#131921"; avatar.innerHTML = `<span style="font-size:14px; color:#4CAF50;">🤖</span>`; 
            badge.className = "tag-core"; badge.style.background = "#4CAF50"; badge.style.color = "#fff"; badge.style.borderColor = "#4CAF50"; badge.innerText = "✅ BERSIH"; 
            sender.appendChild(badge);
            headerDiv.append(avatar, sender);

            const contentDiv = document.createElement("div");
            contentDiv.className = "msg-content";
            const message = document.createElement("span");
            message.innerHTML = `${data.message}<br><br><span style="font-size:9px; color:var(--muted);">(Pesan sistem ini akan hangus dalam 60 detik)</span>`;
            contentDiv.appendChild(message);
            
            const timeEl = document.createElement("div");
            timeEl.className = "msg-time"; timeEl.textContent = timeString;
            contentDiv.appendChild(timeEl);

            msgDiv.append(headerDiv, contentDiv);
            chatBox.appendChild(msgDiv);
            if (typingIndicatorContainer.parentNode === chatBox) chatBox.appendChild(typingIndicatorContainer);
            chatBox.scrollTop = chatBox.scrollHeight;
            localStorage.setItem("hidden_sys_" + msgKey, "true"); 
            setTimeout(() => {
                msgDiv.style.transition = "opacity 1.5s ease, transform 1.5s ease";
                msgDiv.style.opacity = "0"; msgDiv.style.transform = "scale(0.9)";
                setTimeout(() => { if (msgDiv.parentNode) msgDiv.remove(); }, 1500);
            }, 60000); 
            return;
        }
    }

    // 3. PESAN NORMAL
    if (!unreadDividerAdded && data.timestamp > sessionLastRead && senderName !== currentUser && !isSensei) {
        const divider = document.createElement("div");
        divider.className = "chat-day unread-divider";
        divider.innerText = "PESAN BARU BELUM DIBACA";
        chatBox.appendChild(divider);
        unreadDividerAdded = true;
    }

    const msgDiv = document.createElement("div");
    let bubbleClass = "is-other";
    if (senderName === currentUser) bubbleClass = "is-own";
    else if (isSensei) bubbleClass = "is-sensei";
    msgDiv.className = `msg ${bubbleClass}`;

    const headerDiv = document.createElement("div");
    headerDiv.className = "msg-header";

    const profile = window.userProfiles ? (window.userProfiles[senderName] || {}) : {};
    let displayName = senderName === currentUser ? "Kamu" : (profile.displayName || senderName);
    if (isSensei) displayName = "Aoi Sensei (葵先生)";

    const isPages = window.location.pathname.includes('/pages/');
    const basePath = isPages ? `../gambar/${senderName.toLowerCase()}.png` : `gambar/${senderName.toLowerCase()}.png`;
    const finalPhoto = profile.photoBase64 || basePath;
    const initial = displayName.charAt(0).toUpperCase();

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    if (isSensei) {
        avatar.style.background = "linear-gradient(135deg, #FF6584, #8e44ad)";
        avatar.innerHTML = `🌸`;
    } else {
        avatar.style.backgroundColor = "#fff"; 
        avatar.innerHTML = `<img src="${finalPhoto}" alt="${initial}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.parentNode.style.backgroundColor='#131921'; this.parentNode.innerHTML='${initial}';">`;
    }
    
    const sender = document.createElement("strong");
    sender.textContent = displayName;
    const rawName = senderName.toLowerCase();
    
    if (rawName === "umaedi") sender.innerHTML += `<span class="tag-founder">👑 FOUNDER</span>`;
    else if (isSensei) sender.innerHTML += `<span class="tag-sensei" style="background: rgba(255, 101, 132, 0.2); color: #FF758C; border: 1px solid rgba(255, 101, 132, 0.4); margin-left: 6px; padding: 2px 7px; border-radius: 4px; font-size: 10px;">🌸 AOI SENSEI</span>`;
    else if (coreMembers.includes(rawName)) sender.innerHTML += `<span class="tag-core">⭐ CORE</span>`;
    
    headerDiv.append(avatar, sender);

    const contentDiv = document.createElement("div");
    contentDiv.className = "msg-content";

    // Reply Box
    if (data.replyTo) {
        const replyDiv = document.createElement("div");
        replyDiv.className = "msg-reply-box";
        replyDiv.innerHTML = `<strong>${data.replyTo.name}</strong><p>${data.replyTo.text}</p>`;
        contentDiv.appendChild(replyDiv);
    }
    
    // Text Content
    if (data.message) {
        const message = document.createElement("span");
        message.textContent = data.message;
        contentDiv.appendChild(message);

        // Jika pesan AI Sensei atau terdapat karakter Jepang, beri tombol speaker instan
        if (isSensei || /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(data.message)) {
            const speakBtn = document.createElement("button");
            speakBtn.className = "chat-tool-btn";
            speakBtn.style = "display:inline-flex; width:auto; height:auto; padding:2px 6px; font-size:12px; margin-left:6px; cursor:pointer;";
            speakBtn.title = "Dengarkan pelafalan";
            speakBtn.innerHTML = "🔊";
            speakBtn.onclick = (e) => {
                e.stopPropagation();
                playJapaneseAudio(data.message);
            };
            contentDiv.appendChild(speakBtn);
        }
    }

    // Image
    if (data.image) {
        const imgEl = document.createElement("img");
        imgEl.src = data.image;
        imgEl.className = "chat-image-attachment";
        imgEl.style.width = "100%";
        imgEl.style.maxWidth = "240px";
        imgEl.style.borderRadius = "8px";
        imgEl.style.marginTop = data.message ? "8px" : "0";
        imgEl.style.cursor = "zoom-in";
        imgEl.style.border = "1px solid rgba(255,255,255,0.1)";
        imgEl.onclick = () => openLightbox(data.image);
        contentDiv.appendChild(imgEl);
    }

    // Audio Voice Note
    if (data.audio) {
        const audioEl = document.createElement("audio");
        audioEl.controls = true;
        audioEl.src = data.audio;
        audioEl.style.marginTop = data.message ? "8px" : "0";
        audioEl.style.width = "220px";
        audioEl.style.height = "36px";
        contentDiv.appendChild(audioEl);
    }

    // Timestamp
    const timeEl = document.createElement("div");
    timeEl.className = "msg-time";
    timeEl.textContent = timeString;
    contentDiv.appendChild(timeEl);

    msgDiv.append(headerDiv, contentDiv);
    chatBox.appendChild(msgDiv);
    
    if (typingIndicatorContainer.parentNode === chatBox) chatBox.appendChild(typingIndicatorContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
    localStorage.setItem("lastRead_" + currentRoom, Date.now());

    // Gestur Swipe to Reply
    let startX = 0; let startY = 0; let isSwiping = false;

    msgDiv.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX; startY = e.touches[0].clientY;
        isSwiping = true; msgDiv.style.transition = 'none'; 
    }, {passive: true});

    msgDiv.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        let currentX = e.touches[0].clientX; let currentY = e.touches[0].clientY;
        let diffX = currentX - startX; let diffY = Math.abs(currentY - startY);
        if (diffY > Math.abs(diffX) && diffX < 15) {
            isSwiping = false; msgDiv.style.transform = `translateX(0px)`; return;
        }
        if (diffX > 0 && diffX < 60) { msgDiv.style.transform = `translateX(${diffX}px)`; }
    }, {passive: true});

    msgDiv.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        let endX = e.changedTouches[0].clientX; let diffX = endX - startX;
        msgDiv.style.transition = 'transform 0.2s ease-out';
        msgDiv.style.transform = `translateX(0px)`; 
        if (diffX > 40) { 
            let repText = data.image ? "📷 Foto" : (data.audio ? "🎤 Voice Note" : data.message);
            triggerReply(displayName, repText);
        }
        isSwiping = false;
    });

    msgDiv.addEventListener('dblclick', () => {
        let repText = data.image ? "📷 Foto" : (data.audio ? "🎤 Voice Note" : data.message);
        triggerReply(displayName, repText);
    });
}

function sendMessage() {
    if (!chatInput || !currentRoom) return;
    const text = chatInput.value.trim();
    if (text === "" || !currentUser) return;

    if (currentRoom === "sensei") {
        sendSenseiMessage(text);
        chatInput.value = "";
        cancelReply();
        return;
    }

    const dbRefName = currentRoom === "core" ? "messages" : "messages_public";
    const chatRef = ref(db, dbRefName);
    let payload = { name: currentUser, message: text, timestamp: Date.now() };
    if (activeReplyData) payload.replyTo = activeReplyData;
    
    push(chatRef, payload);
    chatInput.value = ""; 
    cancelReply(); 
    
    set(ref(db, `typing_${currentRoom}/${currentUser}`), null);
}

function setLoginState(user) {
    if (user) {
        if(chatInput) chatInput.disabled = false;
        if(sendBtn) sendBtn.disabled = false;
    } else {
        if(chatInput) chatInput.disabled = true;
        if(sendBtn) sendBtn.disabled = true;
    }
}

setLoginState(currentUser);

if(chatInput) {
    chatInput.addEventListener("input", () => {
        if (!currentRoom || !currentUser || currentRoom === "sensei") return;
        const typingRef = ref(db, `typing_${currentRoom}/${currentUser}`);
        
        if (chatInput.value.trim().length > 0) {
            set(typingRef, true); 
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => { set(typingRef, null); }, 3000);
        } else {
            set(typingRef, null); 
        }
    });

    chatInput.addEventListener("keypress", (e) => { 
        if (e.key === "Enter") sendMessage(); 
    });
}

if(sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
}

// Presence online indicator
if (currentUser) {
    const myPresenceRef = ref(db, 'online_users/' + currentUser);
    const connectedRef = ref(db, '.info/connected');
    onValue(connectedRef, (snap) => {
        if (snap.val() === true) { set(myPresenceRef, true); onDisconnect(myPresenceRef).remove(); }
    });
}

onValue(ref(db, 'online_users'), (snapshot) => {
    if (snapshot.exists()) currentOnlineUsers = Object.keys(snapshot.val());
    else currentOnlineUsers = [];
    if (currentRoom && currentRoom !== "sensei") renderOnlineUsers(); 
});

function renderOnlineUsers() {
    const onlineCountText = document.getElementById("onlineCountText");
    if (!onlineCountText || !currentRoom || currentRoom === "sensei") return;

    let visibleUsers = currentOnlineUsers;
    if (currentRoom === "core") visibleUsers = currentOnlineUsers.filter(name => coreMembers.includes(name.toLowerCase()));

    if (visibleUsers.length === 0) { onlineCountText.innerHTML = `Tidak ada yang online`; return; }

    const displayNames = visibleUsers.map(name => {
        if (name.toLowerCase() === currentUser.toLowerCase()) return "Kamu";
        const profile = window.userProfiles ? window.userProfiles[name] : null;
        return profile && profile.displayName ? profile.displayName : name;
    });
    
    onlineCountText.innerHTML = `${visibleUsers.length} Online: <span style="color: #D4AF37; font-weight: 600;">${displayNames.join(', ')}</span>`;
}

window.addEventListener('profilesUpdated', () => {
    if(chatBox && currentRoom && currentRoom !== "sensei") {
        chatBox.replaceChildren(); 
        unreadDividerAdded = false;
        lastRenderedDateString = "";
        pendingMessages.forEach(item => renderMessage(item.data, item.key)); 
    }
    if (currentRoom !== "sensei") renderOnlineUsers(); 
});