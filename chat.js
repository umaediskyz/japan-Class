import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, onChildChanged, onChildRemoved, onValue, onDisconnect, set, update, remove, query, limitToLast } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

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
const legacyMockUsers = ["umaedi", "iqbal", "rifki", "fasya"];
const authedUid = localStorage.getItem("nihongoChatUid");
const authedEmail = (localStorage.getItem("nihongoChatEmail") || "").toLowerCase();

let currentUser = localStorage.getItem(sessionKey);

// Bersihkan akun mock sistem lama jika tidak memiliki sesi login Firebase Auth yang sah
if (!authedUid && currentUser && (legacyMockUsers.includes(currentUser.toLowerCase()) || currentUser.startsWith("Gakusei_"))) {
    localStorage.removeItem(sessionKey);
    localStorage.removeItem("fournity_user_avatar");
    localStorage.removeItem("fournity_custom_avatar");
    localStorage.removeItem("fournity_avatar_rarity");
    localStorage.removeItem("fournity_avatar_serial");
    currentUser = null;
}

if (!currentUser) {
    currentUser = authedUid ? (localStorage.getItem("nihongoChatUser") || "Member Fournity") : "Tamu";
    localStorage.setItem(sessionKey, currentUser);
}

// Hanya user Firebase Auth resmi dengan email developer / founder yang mendapatkan akses Core
const isCore = !!authedUid && (
    authedEmail.includes("umaedi") || 
    authedEmail.includes("fournity") ||
    authedEmail === "umaediskyz6@gmail.com"
);

let currentRoom = null; 
let activeChatListener = null;
let activeWipeListener = null; 
let activeTypingListener = null;
let activeChangeListener = null;
let activeRemoveListener = null;
let activePinnedListener = null;

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
const searchMatchCount = document.getElementById("searchMatchCount");
const closeSearchBtn = document.getElementById("closeSearchBtn");
const ttsRecentBtn = document.getElementById("ttsRecentBtn");


// Lightbox
const imageLightboxOverlay = document.getElementById("imageLightboxOverlay");
const lightboxImg = document.getElementById("lightboxImg");
const closeLightbox = document.getElementById("closeLightbox");

// Komponen Chat Modern Tambahan
const scrollToBottomBtn = document.getElementById("scrollToBottomBtn");
const unreadScrollBadge = document.getElementById("unreadScrollBadge");
const pinnedMessageBar = document.getElementById("pinnedMessageBar");
const pinnedAuthor = document.getElementById("pinnedAuthor");
const pinnedText = document.getElementById("pinnedText");
const unpinBtn = document.getElementById("unpinBtn");
const attachBtn = document.getElementById("attachBtn");
const attachmentMenuPopover = document.getElementById("attachmentMenuPopover");
const attachImageBtn = document.getElementById("attachImageBtn");
const attachVoiceBtn = document.getElementById("attachVoiceBtn");
const attachStickerBtn = document.getElementById("attachStickerBtn");
const attachHankoBtn = document.getElementById("attachHankoBtn");
const attachCoachBtn = document.getElementById("attachCoachBtn");
const chatEmojiBtn = document.getElementById("chatEmojiBtn");
const inchatEmojiDrawer = document.getElementById("inchatEmojiDrawer");
const emojiGridContent = document.getElementById("emojiGridContent");
const msgActionPopup = document.getElementById("msgActionPopup");
const actionReplyBtn = document.getElementById("actionReplyBtn");
const actionCopyBtn = document.getElementById("actionCopyBtn");
const actionTtsBtn = document.getElementById("actionTtsBtn");
const actionPinBtn = document.getElementById("actionPinBtn");
const actionPinLabel = document.getElementById("actionPinLabel");
const actionDeleteBtn = document.getElementById("actionDeleteBtn");
const reactionQuickBar = document.getElementById("reactionQuickBar");
const chatToast = document.getElementById("chatToast");

// Elemen Fitur Baru: Shiritori Dojo
const shiritoriGameBar = document.getElementById("shiritoriGameBar");
const shiritoriTargetKana = document.getElementById("shiritoriTargetKana");
const shiritoriStreakText = document.getElementById("shiritoriStreakText");
const shiritoriLastWordInfo = document.getElementById("shiritoriLastWordInfo");
const shiritoriHintBtn = document.getElementById("shiritoriHintBtn");
const shiritoriResetBtn = document.getElementById("shiritoriResetBtn");

// Elemen Fitur Baru: Fournity Tools Drawer (Furigana, Hanko, Challenge)
const fournityToolsBtn = document.getElementById("fournityToolsBtn");
const fournityToolsDrawer = document.getElementById("fournityToolsDrawer");
const closeToolsDrawerBtn = document.getElementById("closeToolsDrawerBtn");
const furiganaInput = document.getElementById("furiganaInput");
const convertFuriganaBtn = document.getElementById("convertFuriganaBtn");
const furiganaResultBox = document.getElementById("furiganaResultBox");
const furiganaRubyDisplay = document.getElementById("furiganaRubyDisplay");
const furiganaRomajiDisplay = document.getElementById("furiganaRomajiDisplay");
const furiganaArtiDisplay = document.getElementById("furiganaArtiDisplay");
const copyFuriganaBtn = document.getElementById("copyFuriganaBtn");
const listenFuriganaBtn = document.getElementById("listenFuriganaBtn");
const insertFuriganaBtn = document.getElementById("insertFuriganaBtn");
const hankoGrid = document.getElementById("hankoGrid");
const randomizeChallengeBtn = document.getElementById("randomizeChallengeBtn");
const sendChallengeToChatBtn = document.getElementById("sendChallengeToChatBtn");
const chCardQuestion = document.getElementById("chCardQuestion");
const chCardOptions = document.getElementById("chCardOptions");

// Elemen Fitur Baru: AI Japanese Speech Coach
const speechCoachModal = document.getElementById("speechCoachModal");
const speechCoachBtn = document.getElementById("speechCoachBtn");
const closeSpeechCoachBtn = document.getElementById("closeSpeechCoachBtn");
const coachTargetJp = document.getElementById("coachTargetJp");
const coachTargetRomaji = document.getElementById("coachTargetRomaji");
const coachTargetMeaning = document.getElementById("coachTargetMeaning");
const coachListenNativeBtn = document.getElementById("coachListenNativeBtn");
const coachMicRecordBtn = document.getElementById("coachMicRecordBtn");
const coachRecordStateText = document.getElementById("coachRecordStateText");
const coachTranscribedText = document.getElementById("coachTranscribedText");
const coachResultSection = document.getElementById("coachResultSection");
const coachScoreNum = document.getElementById("coachScoreNum");
const coachScoreLabel = document.getElementById("coachScoreLabel");
const coachScoreComment = document.getElementById("coachScoreComment");
const coachShareChatBtn = document.getElementById("coachShareChatBtn");
const coachNextPhraseBtn = document.getElementById("coachNextPhraseBtn");

// Elemen Fitur Baru: Zen Audio Modal
const zenAudioModal = document.getElementById("zenAudioModal");
const zenAudioBtn = document.getElementById("zenAudioBtn");
const closeZenModalBtn = document.getElementById("closeZenModalBtn");
const toggleZenPlayBtn = document.getElementById("toggleZenPlayBtn");
const chatSfxToggle = document.getElementById("chatSfxToggle");

let activeMsgContext = null;
let toastTimeout = null;
let isScrolledUp = false;
let unreadWhileScrolled = 0;
let currentPinnedId = null;

// ==========================================
// TOAST NOTIFIKASI MELAYANG
// ==========================================
function showChatToast(message, icon = "✨") {
    if (!chatToast) return;
    if (toastTimeout) clearTimeout(toastTimeout);
    chatToast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    chatToast.classList.add("show");
    toastTimeout = setTimeout(() => {
        chatToast.classList.remove("show");
    }, 2500);
}

// ==========================================
// HELPER FORMATTING TEKS AOI SENSEI
// ==========================================
function escapeHtml(text) {
    return (text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatSenseiText(raw) {
    if (!raw) return "";
    let safe = escapeHtml(raw);
    // Bold: **kata**
    safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong style="color: #FF758C; font-weight:700;">$1</strong>');
    // Italic: *kata*
    safe = safe.replace(/(^|[^\*])\*([^\*]+?)\*([^\*]|$)/g, '$1<em>$2</em>$3');
    // Code / Highlight: `kata`
    safe = safe.replace(/`([^`]+?)`/g, '<code style="background: rgba(0,243,255,0.12); color: #00f3ff; padding: 1px 5px; border-radius: 4px; font-size: 12px; font-family: monospace;">$1</code>');
    return safe;
}




// ==========================================
// FITUR SEMATKAN PESAN (PINNED MESSAGE)
// ==========================================
function renderPinnedBar(pin) {
    if (!pinnedMessageBar || !pin) return;
    currentPinnedId = pin.id;
    if (pinnedAuthor) pinnedAuthor.textContent = pin.author || "Pesan Tersemat";
    if (pinnedText) pinnedText.textContent = pin.text || "";
    pinnedMessageBar.style.display = "flex";
}

function hidePinnedBar() {
    currentPinnedId = null;
    if (pinnedMessageBar) pinnedMessageBar.style.display = "none";
}

function togglePinMessage(msgKey, author, text) {
    if (!currentRoom) return;
    const isCurrentlyPinned = currentPinnedId === msgKey;
    if (isCurrentlyPinned) {
        if (currentRoom === "sensei") {
            localStorage.removeItem("pinned_sensei");
            hidePinnedBar();
            showChatToast("Sematan pesan dilepas", "📌");
        } else {
            set(ref(db, "pinned_" + currentRoom), null);
            showChatToast("Sematan pesan dilepas", "📌");
        }
    } else {
        const pinData = {
            id: msgKey,
            author: author || "Pesan Tersemat",
            text: text || "",
            timestamp: Date.now()
        };
        if (currentRoom === "sensei") {
            localStorage.setItem("pinned_sensei", JSON.stringify(pinData));
            renderPinnedBar(pinData);
            showChatToast("Pesan berhasil disematkan", "📌");
        } else {
            set(ref(db, "pinned_" + currentRoom), pinData);
            showChatToast("Pesan berhasil disematkan", "📌");
        }
    }
}

// Klik bar sematan untuk melompat ke pesan
const pinnedContentEl = document.getElementById("pinnedContent");
if (pinnedContentEl) {
    pinnedContentEl.addEventListener("click", () => {
        if (!currentPinnedId) return;
        const targetEl = document.getElementById("msg_" + currentPinnedId);
        if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetEl.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            targetEl.style.transform = 'scale(1.03)';
            targetEl.style.boxShadow = '0 0 15px rgba(212, 175, 55, 0.6)';
            setTimeout(() => {
                targetEl.style.transform = '';
                targetEl.style.boxShadow = '';
            }, 1200);
        } else {
            showChatToast("Pesan berada di riwayat percakapan sebelumnya", "ℹ️");
        }
    });
}

if (unpinBtn) {
    unpinBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (currentRoom === "sensei") {
            localStorage.removeItem("pinned_sensei");
            hidePinnedBar();
            showChatToast("Sematan pesan dilepas", "📌");
        } else if (currentRoom) {
            set(ref(db, "pinned_" + currentRoom), null);
            showChatToast("Sematan pesan dilepas", "📌");
        }
    });
}

// ==========================================
// SCROLL KE BAWAH & INDIKATOR UNREAD
// ==========================================
if (chatBox) {
    chatBox.addEventListener("scroll", () => {
        const threshold = 80;
        const isNearBottom = chatBox.scrollHeight - chatBox.scrollTop - chatBox.clientHeight < threshold;
        if (isNearBottom) {
            isScrolledUp = false;
            unreadWhileScrolled = 0;
            if (scrollToBottomBtn) scrollToBottomBtn.style.display = "none";
            if (unreadScrollBadge) unreadScrollBadge.style.display = "none";
        } else {
            isScrolledUp = true;
            if (scrollToBottomBtn) scrollToBottomBtn.style.display = "flex";
        }
    });
}

if (scrollToBottomBtn) {
    scrollToBottomBtn.addEventListener("click", () => {
        if (chatBox) {
            chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
        }
        isScrolledUp = false;
        unreadWhileScrolled = 0;
        scrollToBottomBtn.style.display = "none";
        if (unreadScrollBadge) unreadScrollBadge.style.display = "none";
    });
}

// ==========================================
// CUSTOM VOICE NOTE PLAYER
// ==========================================
function createCustomVnPlayer(audioSrc) {
    const player = document.createElement("div");
    player.className = "custom-vn-player";

    const audio = new Audio(audioSrc);
    const playbackSpeeds = [1.0, 1.5, 2.0];
    let speedIndex = 0;

    const playBtn = document.createElement("button");
    playBtn.type = "button";
    playBtn.className = "vn-play-btn";
    playBtn.setAttribute("aria-label", "Play / Pause Voice Note");
    playBtn.innerHTML = "▶";

    const body = document.createElement("div");
    body.className = "vn-body";

    const progressBar = document.createElement("div");
    progressBar.className = "vn-progress-bar";
    const progressFill = document.createElement("div");
    progressFill.className = "vn-progress-fill";
    progressBar.appendChild(progressFill);

    const timeRow = document.createElement("div");
    timeRow.className = "vn-time-row";
    const timeDisplay = document.createElement("span");
    timeDisplay.textContent = "0:00";
    const labelDisplay = document.createElement("span");
    labelDisplay.style.color = "var(--japan-gold)";
    labelDisplay.textContent = "🎤 Voice Note";
    timeRow.append(timeDisplay, labelDisplay);

    body.append(progressBar, timeRow);

    const speedBtn = document.createElement("button");
    speedBtn.type = "button";
    speedBtn.className = "vn-speed-btn";
    speedBtn.textContent = "1x";
    speedBtn.title = "Atur kecepatan pemutaran";

    function formatTime(sec) {
        if (isNaN(sec) || !isFinite(sec)) return "0:00";
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    audio.addEventListener("loadedmetadata", () => {
        timeDisplay.textContent = formatTime(audio.duration);
    });

    audio.addEventListener("timeupdate", () => {
        if (audio.duration) {
            const pct = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = pct + "%";
            timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
        }
    });

    audio.addEventListener("ended", () => {
        playBtn.innerHTML = "▶";
        progressFill.style.width = "0%";
        timeDisplay.textContent = formatTime(audio.duration);
    });

    playBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (audio.paused) {
            document.querySelectorAll("audio").forEach(a => { if (a !== audio) a.pause(); });
            audio.play().catch(() => {});
            playBtn.innerHTML = "❚❚";
        } else {
            audio.pause();
            playBtn.innerHTML = "▶";
        }
    });

    progressBar.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!audio.duration) return;
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const pct = Math.max(0, Math.min(1, clickX / rect.width));
        audio.currentTime = pct * audio.duration;
    });

    speedBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        speedIndex = (speedIndex + 1) % playbackSpeeds.length;
        const spd = playbackSpeeds[speedIndex];
        audio.playbackRate = spd;
        speedBtn.textContent = spd + "x";
    });

    player.append(playBtn, body, speedBtn);
    return player;
}

// ==========================================
// REAKSI EMOJI PESAN
// ==========================================
function renderReactionsForMsg(msgKey, reactions) {
    const msgEl = document.getElementById("msg_" + msgKey);
    if (!msgEl) return;
    let container = msgEl.querySelector(".msg-reactions");
    if (!reactions || Object.keys(reactions).length === 0) {
        if (container) container.remove();
        return;
    }
    if (!container) {
        container = document.createElement("div");
        container.className = "msg-reactions";
        const contentDiv = msgEl.querySelector(".msg-content");
        if (contentDiv) contentDiv.appendChild(container);
        else msgEl.appendChild(container);
    }
    container.innerHTML = "";
    Object.keys(reactions).forEach(emoji => {
        const users = reactions[emoji];
        if (!users || !Array.isArray(users) || users.length === 0) return;
        const hasMine = users.includes(currentUser);
        const pill = document.createElement("button");
        pill.type = "button";
        pill.className = "reaction-pill" + (hasMine ? " has-my-reaction" : "");
        pill.innerHTML = `<span>${emoji}</span> <span class="reaction-count">${users.length}</span>`;
        pill.title = users.join(", ");
        pill.onclick = (e) => {
            e.stopPropagation();
            toggleMessageReaction(msgKey, emoji);
        };
        container.appendChild(pill);
    });
}

function toggleMessageReaction(msgKey, emoji) {
    if (!currentRoom || !msgKey || !currentUser) return;
    
    if (currentRoom === "sensei") {
        const historyKey = `nihongo_sensei_history_${currentUser || 'guest'}`;
        let history = JSON.parse(localStorage.getItem(historyKey) || "[]");
        const idx = history.findIndex(m => ("sensei_" + m.timestamp) === msgKey);
        if (idx !== -1) {
            const msg = history[idx];
            msg.reactions = msg.reactions || {};
            const userList = msg.reactions[emoji] || [];
            const uIdx = userList.indexOf(currentUser);
            if (uIdx > -1) userList.splice(uIdx, 1);
            else userList.push(currentUser);
            if (userList.length === 0) delete msg.reactions[emoji];
            else msg.reactions[emoji] = userList;
            localStorage.setItem(historyKey, JSON.stringify(history));
            renderReactionsForMsg(msgKey, msg.reactions);
            showChatToast(`Reaksi ${emoji}`, "✨");
        }
        return;
    }

    const dbRefName = currentRoom === "core" ? "messages" : "messages_public";
    const msgRef = ref(db, `${dbRefName}/${msgKey}`);
    const cached = pendingMessages.find(p => p.key === msgKey);
    let reactions = (cached && cached.data && cached.data.reactions) ? JSON.parse(JSON.stringify(cached.data.reactions)) : {};
    const userList = reactions[emoji] || [];
    const uIdx = userList.indexOf(currentUser);
    if (uIdx > -1) userList.splice(uIdx, 1);
    else userList.push(currentUser);
    if (userList.length === 0) delete reactions[emoji];
    else reactions[emoji] = userList;

    if (cached && cached.data) cached.data.reactions = reactions;
    renderReactionsForMsg(msgKey, reactions);

    update(msgRef, { reactions: reactions }).then(() => {
        showChatToast(`Reaksi ${emoji}`, "✨");
    }).catch(err => {
        console.error("Gagal update reaksi:", err);
    });
}

// ==========================================
// POPUP MENU AKSI PESAN (CONTEXT MENU)
// ==========================================
function openMsgActionPopup(x, y, msgKey, data, msgEl) {
    if (!msgActionPopup) return;
    activeMsgContext = { msgKey, data, msgEl };

    if (actionPinLabel) {
        actionPinLabel.textContent = currentPinnedId === msgKey ? "Lepas Sematan" : "Sematkan Pesan";
    }

    const isMine = data.name === currentUser;
    if (actionDeleteBtn) {
        if (isMine || isCore) {
            actionDeleteBtn.style.display = "flex";
        } else {
            actionDeleteBtn.style.display = "none";
        }
    }

    msgActionPopup.style.display = "flex";
    
    const menuW = 210;
    const menuH = 260;
    let posX = Math.min(Math.max(10, x), window.innerWidth - menuW - 10);
    let posY = Math.min(Math.max(10, y), window.innerHeight - menuH - 10);
    
    msgActionPopup.style.left = `${posX}px`;
    msgActionPopup.style.top = `${posY}px`;
}

function closeMsgActionPopup() {
    if (msgActionPopup) msgActionPopup.style.display = "none";
    activeMsgContext = null;
}

document.addEventListener("click", (e) => {
    if (msgActionPopup && !msgActionPopup.contains(e.target) && !e.target.closest(".msg-action-trigger")) {
        closeMsgActionPopup();
    }
    if (attachmentMenuPopover && !attachmentMenuPopover.contains(e.target) && e.target !== attachBtn) {
        attachmentMenuPopover.style.display = "none";
    }
    if (inchatEmojiDrawer && !inchatEmojiDrawer.contains(e.target) && e.target !== chatEmojiBtn && !e.target.closest("#attachStickerBtn")) {
        inchatEmojiDrawer.style.display = "none";
    }
});

// Quick react bar in popup
if (reactionQuickBar) {
    reactionQuickBar.querySelectorAll(".quick-react-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (activeMsgContext) {
                toggleMessageReaction(activeMsgContext.msgKey, btn.dataset.emoji);
            }
            closeMsgActionPopup();
        });
    });
}

// Action buttons in popup
if (actionReplyBtn) {
    actionReplyBtn.addEventListener("click", () => {
        if (activeMsgContext) {
            const data = activeMsgContext.data;
            const repText = data.image ? "📷 Foto" : (data.audio ? "🎤 Voice Note" : data.message);
            triggerReply(data.name === currentUser ? "Kamu" : data.name, repText);
        }
        closeMsgActionPopup();
    });
}

if (actionCopyBtn) {
    actionCopyBtn.addEventListener("click", () => {
        if (activeMsgContext && activeMsgContext.data) {
            const textToCopy = activeMsgContext.data.message || (activeMsgContext.data.image ? "[Foto]" : "[Voice Note]");
            navigator.clipboard.writeText(textToCopy).then(() => {
                showChatToast("Teks disalin ke papan klip", "📋");
            }).catch(() => {
                showChatToast("Gagal menyalin teks", "❌");
            });
        }
        closeMsgActionPopup();
    });
}

if (actionTtsBtn) {
    actionTtsBtn.addEventListener("click", () => {
        if (activeMsgContext && activeMsgContext.data && activeMsgContext.data.message) {
            playJapaneseAudio(activeMsgContext.data.message);
            showChatToast("Memutar pelafalan audio...", "🔊");
        }
        closeMsgActionPopup();
    });
}

if (actionPinBtn) {
    actionPinBtn.addEventListener("click", () => {
        if (activeMsgContext) {
            const d = activeMsgContext.data;
            const repText = d.image ? "📷 Foto" : (d.audio ? "🎤 Voice Note" : d.message);
            togglePinMessage(activeMsgContext.msgKey, d.name, repText);
        }
        closeMsgActionPopup();
    });
}

if (actionDeleteBtn) {
    actionDeleteBtn.addEventListener("click", () => {
        if (!activeMsgContext) return;
        const msgKey = activeMsgContext.msgKey;
        if (!confirm("Hapus pesan ini?")) return;
        
        if (currentRoom === "sensei") {
            const historyKey = `nihongo_sensei_history_${currentUser || 'guest'}`;
            let history = JSON.parse(localStorage.getItem(historyKey) || "[]");
            history = history.filter(m => ("sensei_" + m.timestamp) !== msgKey);
            localStorage.setItem(historyKey, JSON.stringify(history));
            const el = document.getElementById("msg_" + msgKey);
            if (el) el.remove();
            showChatToast("Pesan dihapus", "🗑️");
        } else {
            const dbRefName = currentRoom === "core" ? "messages" : "messages_public";
            update(ref(db, `${dbRefName}/${msgKey}`), {
                deleted: true,
                message: "🚫 Pesan ini telah dihapus",
                image: null,
                audio: null
            }).then(() => {
                showChatToast("Pesan berhasil dihapus", "🗑️");
            });
        }
        closeMsgActionPopup();
    });
}

// Update DOM saat pesan diedit atau dihapus
function updateMessageInDOM(msgKey, data) {
    const msgEl = document.getElementById("msg_" + msgKey);
    if (!msgEl) return;
    if (data.deleted) {
        const contentDiv = msgEl.querySelector(".msg-content");
        if (contentDiv) {
            contentDiv.innerHTML = `<em style="color: var(--muted); font-size: 12px;">🚫 Pesan ini telah dihapus</em>`;
            const footer = document.createElement("div");
            footer.className = "msg-footer-row";
            const dateObj = new Date(data.timestamp || Date.now());
            const hrs = String(dateObj.getHours()).padStart(2, '0');
            const mins = String(dateObj.getMinutes()).padStart(2, '0');
            footer.innerHTML = `<span class="msg-time">${hrs}:${mins}</span>`;
            contentDiv.appendChild(footer);
        }
        const reactions = msgEl.querySelector(".msg-reactions");
        if (reactions) reactions.remove();
        return;
    }
    if (data.reactions) {
        renderReactionsForMsg(msgKey, data.reactions);
    }
}

// ==========================================
// POPOVER MENU LAMPIRAN (+)
// ==========================================
if (attachBtn && attachmentMenuPopover) {
    attachBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isShown = attachmentMenuPopover.style.display === "flex";
        attachmentMenuPopover.style.display = isShown ? "none" : "flex";
        if (inchatEmojiDrawer) inchatEmojiDrawer.style.display = "none";
    });
}

if (attachImageBtn && chatImageUpload) {
    attachImageBtn.addEventListener("click", () => {
        if (attachmentMenuPopover) attachmentMenuPopover.style.display = "none";
        chatImageUpload.click();
    });
}

if (attachVoiceBtn && recordAudioBtn) {
    attachVoiceBtn.addEventListener("click", () => {
        if (attachmentMenuPopover) attachmentMenuPopover.style.display = "none";
        recordAudioBtn.click();
    });
}

if (attachStickerBtn) {
    attachStickerBtn.addEventListener("click", () => {
        if (attachmentMenuPopover) attachmentMenuPopover.style.display = "none";
        openEmojiDrawer("stickers");
    });
}

const typingIndicatorContainer = document.createElement("div");
typingIndicatorContainer.className = "typing-indicator-container";
typingIndicatorContainer.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div><span id="typingUserNameText">Seseorang sedang mengetik...</span>`;
let typingTimeout = null;

if (sendImageBtn) sendImageBtn.style.display = "grid"; 
if (recordAudioBtn) recordAudioBtn.style.display = "grid";

if (cancelReplyBtn) cancelReplyBtn.addEventListener("click", cancelReply);

function cancelReply() {
    activeReplyData = null;
    if (replyPreviewArea) replyPreviewArea.style.display = "none";
    if (window.syncChatViewport) window.syncChatViewport();
}

function triggerReply(name, text) {
    activeReplyData = { name, text };
    if (replyPreviewArea) {
        replyPreviewArea.style.display = "flex";
        replyPreviewName.textContent = name;
        replyPreviewText.textContent = text;
    }
    if (window.syncChatViewport) window.syncChatViewport();
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
// FOTO ATTACHMENT & PRATINJAU PENGIRIMAN
// ==========================================
const photoSendPreviewModal = document.getElementById("photoSendPreviewModal");
const cancelPhotoPreviewBtn = document.getElementById("cancelPhotoPreviewBtn");
const abortPhotoSendBtn = document.getElementById("abortPhotoSendBtn");
const confirmPhotoSendBtn = document.getElementById("confirmPhotoSendBtn");
const photoPreviewImg = document.getElementById("photoPreviewImg");
const photoCaptionInput = document.getElementById("photoCaptionInput");
let pendingPhotoBase64 = null;

function closePhotoSendPreview() {
    if (photoSendPreviewModal) photoSendPreviewModal.style.display = "none";
    pendingPhotoBase64 = null;
    if (photoPreviewImg) photoPreviewImg.src = "";
    if (photoCaptionInput) photoCaptionInput.value = "";
}

if (cancelPhotoPreviewBtn) cancelPhotoPreviewBtn.addEventListener("click", closePhotoSendPreview);
if (abortPhotoSendBtn) abortPhotoSendBtn.addEventListener("click", closePhotoSendPreview);

function processAndPreviewImageFile(file) {
    if (!file) return;
    if (!file.type || !file.type.startsWith("image/")) {
        if (typeof showChatToast === 'function') {
            showChatToast("Berkas harus berupa gambar!", "⚠️");
        }
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            // Kompresi resolusi ke maksimal 1000px agar tajam dan ringan (< 80KB)
            const maxSize = 1000;
            let width = img.width;
            let height = img.height;
            if (width > height) {
                if (width > maxSize) {
                    height = Math.round((height * maxSize) / width);
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width = Math.round((width * maxSize) / height);
                    height = maxSize;
                }
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            const base64Img = canvas.toDataURL("image/jpeg", 0.78);

            pendingPhotoBase64 = base64Img;
            if (photoPreviewImg) photoPreviewImg.src = base64Img;
            if (photoCaptionInput) photoCaptionInput.value = "";
            if (photoSendPreviewModal) photoSendPreviewModal.style.display = "flex";
            if (photoCaptionInput) {
                setTimeout(() => photoCaptionInput.focus(), 100);
            }
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// Listener input file gambar
if (chatImageUpload) {
    chatImageUpload.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            processAndPreviewImageFile(file);
        }
        chatImageUpload.value = "";
    });
}

// Tombol Kirim Foto dari Modal Pratinjau
if (confirmPhotoSendBtn) {
    confirmPhotoSendBtn.addEventListener("click", () => {
        if (!pendingPhotoBase64) return;
        const caption = photoCaptionInput ? photoCaptionInput.value.trim() : "";

        if (currentRoom === "sensei") {
            sendSenseiMessage(caption, pendingPhotoBase64, null);
        } else {
            const targetRoom = currentRoom || "public";
            const dbRefName = targetRoom === "core" ? "messages" : (targetRoom === "shiritori" ? "messages_shiritori" : "messages_public");
            const myAvatar = localStorage.getItem("fournity_user_avatar") || localStorage.getItem("avatar_" + currentUser);
            const myAvatarRarity = localStorage.getItem("fournity_avatar_rarity") || localStorage.getItem("avatar_rarity_" + currentUser) || "";
            const myAvatarSerial = localStorage.getItem("fournity_avatar_serial") || "";
            const cleanAvatar = myAvatar ? myAvatar.replace(/^(\.\.\/|\.\/)+/, '') : "";

            let payload = {
                name: currentUser,
                message: caption,
                image: pendingPhotoBase64,
                timestamp: Date.now()
            };
            if (cleanAvatar) {
                payload.avatar = cleanAvatar;
                if (myAvatarRarity) payload.avatarRarity = myAvatarRarity;
                if (myAvatarSerial) payload.avatarSerial = myAvatarSerial;
            }
            if (activeReplyData) payload.replyTo = activeReplyData;
            push(ref(db, dbRefName), payload);
        }

        if (typeof window.playZenSoundEffect === 'function') {
            window.playZenSoundEffect('send');
        }
        cancelReply();
        closePhotoSendPreview();
        isScrolledUp = false;
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
        if (typeof showChatToast === 'function') {
            showChatToast("Foto berhasil dikirim ke chat! 📸", "✓");
        }
    });
}

if (photoCaptionInput) {
    photoCaptionInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (confirmPhotoSendBtn) confirmPhotoSendBtn.click();
        }
    });
}

// Dukungan Paste Gambar dari Clipboard (Ctrl + V)
if (chatInput) {
    chatInput.addEventListener("paste", (e) => {
        const clipboardItems = (e.clipboardData || window.clipboardData)?.items;
        if (clipboardItems) {
            for (let i = 0; i < clipboardItems.length; i++) {
                if (clipboardItems[i].type && clipboardItems[i].type.startsWith("image/")) {
                    const blob = clipboardItems[i].getAsFile();
                    if (blob) {
                        processAndPreviewImageFile(blob);
                        e.preventDefault();
                        break;
                    }
                }
            }
        }
    });
}

// ==========================================
// LIGHTBOX VIEWER FOTO
// ==========================================
function openLightbox(src) {
    if (!imageLightboxOverlay || !lightboxImg) return;
    lightboxImg.src = src;
    imageLightboxOverlay.style.display = "flex";
}
window.openLightbox = openLightbox;

if (closeLightbox) {
    closeLightbox.addEventListener("click", (e) => {
        e.stopPropagation();
        if (imageLightboxOverlay) imageLightboxOverlay.style.display = "none";
    });
}

if (imageLightboxOverlay) {
    imageLightboxOverlay.addEventListener("click", (e) => {
        if (e.target !== lightboxImg) {
            imageLightboxOverlay.style.display = "none";
        }
    });
}

// ==========================================
// PREVIEW ROOM & LISTENER
// ==========================================
function listenRoomPreview(roomType) {
    let refName = "messages_public";
    if (roomType === "core") refName = "messages";
    else if (roomType === "shiritori") refName = "messages_shiritori";
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

            const lastMsgEl = document.getElementById(roomType === "core" ? "lastMsgCore" : (roomType === "shiritori" ? "lastMsgShiritori" : "lastMsgPublic"));
            const timeEl = document.getElementById(roomType === "core" ? "timeCore" : (roomType === "shiritori" ? "timeShiritori" : "timePublic"));
            const badgeEl = document.getElementById(roomType === "core" ? "badgeCore" : (roomType === "shiritori" ? null : "badgePublic"));

            if (roomType === "core" && !isCore) {
                if (lastMsgEl) lastMsgEl.textContent = "🔒 Ruang privat khusus 4 pilar Nihongo Fournity.";
                if (badgeEl) badgeEl.style.display = "none";
                return;
            }

            if (lastMsgData && lastMsgEl && timeEl) {
                let msgText = lastMsgData.image ? "📷 Mengirim foto" : (lastMsgData.audio ? "🎤 Voice Note" : (lastMsgData.hanko ? `💮 Stempel: ${lastMsgData.hanko.title}` : lastMsgData.message));
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
// MODAL PERINGATAN AKSES KHUSUS PENGEMBANG / TIM
// ==========================================
const coreAccessDeniedModal = document.getElementById("coreAccessDeniedModal");
const closeDeniedModalBtn = document.getElementById("closeDeniedModalBtn");

function showCoreAccessDeniedModal() {
    if (coreAccessDeniedModal) {
        coreAccessDeniedModal.style.display = "flex";
    } else {
        alert("🔒 AKSES DITOLAK\n\nMohon maaf, Anda tidak diperbolehkan masuk ke ruangan ini.\nRuang obrolan privat Fournity Core khusus untuk Pengembang / Tim Inti yang masuk dengan Akun Firebase resmi.");
    }
}

function hideCoreAccessDeniedModal() {
    if (coreAccessDeniedModal) {
        coreAccessDeniedModal.style.display = "none";
    }
}

if (closeDeniedModalBtn) {
    closeDeniedModalBtn.addEventListener("click", hideCoreAccessDeniedModal);
}

if (coreAccessDeniedModal) {
    coreAccessDeniedModal.addEventListener("click", (e) => {
        if (e.target === coreAccessDeniedModal) {
            hideCoreAccessDeniedModal();
        }
    });
}

// ==========================================
// SWITCH ROOM (PUBLIC / SENSEI / SHIRITORI / CORE)
// ==========================================
window.openRoom = function(type) {
    if (type === "core" && !isCore) {
        showCoreAccessDeniedModal();
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
        if(roomLabel) roomLabel.textContent = "FOURNITY CORE (4 PILAR)"; 
        if(roomTitle) roomTitle.textContent = "Markas 4 Pilar Fournity";
        if(roomIcon) { roomIcon.textContent = "🛡️"; roomIcon.style.background = "#D32F2F"; }
        if(coreMemberAvatarList) coreMemberAvatarList.style.display = "flex";
        if(clearSenseiBtn) clearSenseiBtn.style.display = "none";
        if(shiritoriGameBar) shiritoriGameBar.style.display = "none";
    } else if (type === "sensei") {
        if(roomLabel) roomLabel.textContent = "AI SENSEI 1-ON-1 DOJO"; 
        if(roomTitle) roomTitle.textContent = "Aoi Sensei (葵先生)";
        if(roomIcon) { roomIcon.textContent = "🌸"; roomIcon.style.background = "linear-gradient(135deg, #FF6584, #8e44ad)"; }
        if(coreMemberAvatarList) coreMemberAvatarList.style.display = "none";
        if(onlineCountText) onlineCountText.innerHTML = `<span style="color:#FF758C; font-weight:600;">🌸 Aoi Sensei Online • Siap Menjawab 24 Jam</span>`;
        if(clearSenseiBtn) clearSenseiBtn.style.display = "grid";
        if(shiritoriGameBar) shiritoriGameBar.style.display = "none";
    } else if (type === "shiritori") {
        if(roomLabel) roomLabel.textContent = "SHIRITORI DOJO (しりとり)"; 
        if(roomTitle) roomTitle.textContent = "Game Sambung Kata Jepang";
        if(roomIcon) { roomIcon.textContent = "🎮"; roomIcon.style.background = "linear-gradient(135deg, #30D158, #007A3D)"; }
        if(coreMemberAvatarList) coreMemberAvatarList.style.display = "none";
        if(clearSenseiBtn) clearSenseiBtn.style.display = "none";
        if(shiritoriGameBar) shiritoriGameBar.style.display = "flex";
        if(onlineCountText) onlineCountText.innerHTML = `<span style="color:#30D158; font-weight:600;">🎮 Sambung Kata Aktif • Aturan: Jangan berakhiran 'ん'</span>`;
        if (typeof renderShiritoriUI === 'function') renderShiritoriUI();
    } else {
        if(roomLabel) roomLabel.textContent = "FOURNITY PUBLIC LOUNGE"; 
        if(roomTitle) roomTitle.textContent = "Komunitas Nihongo Fournity";
        if(roomIcon) { roomIcon.textContent = "🌐"; roomIcon.style.background = "#1E88E5"; }
        if(coreMemberAvatarList) coreMemberAvatarList.style.display = "none"; 
        if(clearSenseiBtn) clearSenseiBtn.style.display = "none";
        if(shiritoriGameBar) shiritoriGameBar.style.display = "none";
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
    if (activeChangeListener) { activeChangeListener(); activeChangeListener = null; }
    if (activeRemoveListener) { activeRemoveListener(); activeRemoveListener = null; }
    if (activePinnedListener) { activePinnedListener(); activePinnedListener = null; }
    hidePinnedBar();
    isScrolledUp = false;
    unreadWhileScrolled = 0;
    if (scrollToBottomBtn) scrollToBottomBtn.style.display = "none";
    if (unreadScrollBadge) unreadScrollBadge.style.display = "none";

    if (window.syncChatViewport) window.syncChatViewport();
    setTimeout(() => {
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    }, 100);

    if (type === "sensei") {
        const pinnedSensei = localStorage.getItem("pinned_sensei");
        if (pinnedSensei) {
            try {
                renderPinnedBar(JSON.parse(pinnedSensei));
            } catch(e) {}
        }
        loadSenseiHistory();
        return;
    }

    const dbRefName = type === "core" ? "messages" : (type === "shiritori" ? "messages_shiritori" : "messages_public");
    const typingRefName = type === "core" ? "typing_core" : (type === "shiritori" ? "typing_shiritori" : "typing_public");

    // Listener pesan tersemat (pinned)
    activePinnedListener = onValue(ref(db, "pinned_" + type), (snapshot) => {
        if (snapshot.exists()) {
            renderPinnedBar(snapshot.val());
        } else {
            hidePinnedBar();
        }
    });

    // Listener pesan baru
    activeChatListener = onChildAdded(ref(db, dbRefName), (snapshot) => {
        const data = snapshot.val();
        const msgKey = snapshot.key; 
        pendingMessages.push({ data, key: msgKey });
        renderMessage(data, msgKey);

        if (isScrolledUp && data.name !== currentUser && data.name !== "SYSTEM") {
            unreadWhileScrolled++;
            if (unreadScrollBadge) {
                unreadScrollBadge.textContent = unreadWhileScrolled > 99 ? "99+" : unreadWhileScrolled;
                unreadScrollBadge.style.display = "block";
            }
        }

        if (data && data.name !== currentUser && data.name !== "SYSTEM") {
            if (data.timestamp && Date.now() - data.timestamp < 15000) {
                if (typeof window.playZenSoundEffect === 'function') {
                    window.playZenSoundEffect('receive');
                }
            }
        }
    });

    // Listener update reaksi & status pesan terhapus secara realtime
    activeChangeListener = onChildChanged(ref(db, dbRefName), (snapshot) => {
        const updatedData = snapshot.val();
        const msgKey = snapshot.key;
        const found = pendingMessages.find(p => p.key === msgKey);
        if (found) found.data = updatedData;
        updateMessageInDOM(msgKey, updatedData);
    });

    // Listener hapus pesan dari database
    activeRemoveListener = onChildRemoved(ref(db, dbRefName), (snapshot) => {
        const msgKey = snapshot.key;
        const el = document.getElementById("msg_" + msgKey);
        if (el) el.remove();
        const idx = pendingMessages.findIndex(p => p.key === msgKey);
        if (idx !== -1) pendingMessages.splice(idx, 1);
        if (currentPinnedId === msgKey) hidePinnedBar();
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
            if (!isScrolledUp) chatBox.scrollTop = chatBox.scrollHeight;
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
        if (chatInput) chatInput.blur();
        if (currentRoom) localStorage.setItem("lastRead_" + currentRoom, Date.now()); 
        currentRoom = null;
        chatRoomView.style.display = "none";
        chatListView.style.display = "flex";
        if (activeChatListener) { activeChatListener(); activeChatListener = null; }
        if (activeWipeListener) { activeWipeListener(); activeWipeListener = null; }
        if (activeTypingListener) { activeTypingListener(); activeTypingListener = null; }
        if (activeChangeListener) { activeChangeListener(); activeChangeListener = null; }
        if (activeRemoveListener) { activeRemoveListener(); activeRemoveListener = null; }
        if (activePinnedListener) { activePinnedListener(); activePinnedListener = null; }
        hidePinnedBar();
        if (attachmentMenuPopover) attachmentMenuPopover.style.display = "none";
        if (inchatEmojiDrawer) inchatEmojiDrawer.style.display = "none";
        if (msgActionPopup) msgActionPopup.style.display = "none";
        isScrolledUp = false;
        unreadWhileScrolled = 0;
        if (scrollToBottomBtn) scrollToBottomBtn.style.display = "none";
        cancelReply();
        if (window.syncChatViewport) window.syncChatViewport();
    });
}

// Buka Core Card jika core
const cardCore = document.getElementById("roomCardCore");
if (cardCore) {
    cardCore.style.display = "flex";
    const coreSpan = cardCore.querySelector("h3 span");
    if (isCore) {
        if (coreSpan) coreSpan.innerHTML = `(Private Chat ⭐)`;
        cardCore.style.opacity = "1";
    } else {
        if (coreSpan) coreSpan.innerHTML = `(Khusus Tim Pengembang 🔒)`;
        cardCore.style.opacity = "0.85";
    }
}

listenRoomPreview("public");
listenRoomPreview("shiritori");
listenRoomPreview("core");

// ==========================================
// FITUR PENCARIAN DI DALAM PESAN DENGAN HIGHLIGHT
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
    const allMsgs = chatBox.querySelectorAll(".msg:not(.chat-day)");
    let matchCount = 0;
    
    allMsgs.forEach(m => {
        // Hapus highlight sebelumnya
        m.querySelectorAll(".msg-highlight").forEach(hl => {
            const parent = hl.parentNode;
            if (parent) {
                parent.replaceChild(document.createTextNode(hl.textContent), hl);
                parent.normalize();
            }
        });

        if (!query) {
            m.style.display = "flex";
            return;
        }

        const text = m.innerText.toLowerCase();
        if (text.includes(query)) {
            m.style.display = "flex";
            matchCount++;
            const contentSpans = m.querySelectorAll(".msg-content span:not(.msg-time)");
            contentSpans.forEach(sp => {
                const inner = sp.innerHTML;
                const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`(${safeQuery})`, 'gi');
                sp.innerHTML = inner.replace(regex, '<mark class="msg-highlight">$1</mark>');
            });
        } else {
            m.style.display = "none";
        }
    });

    if (searchMatchCount) {
        if (query) {
            searchMatchCount.textContent = `${matchCount} ditemukan`;
            searchMatchCount.style.display = "inline";
        } else {
            searchMatchCount.style.display = "none";
        }
    }
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

// Quick reaction chips (Strip stiker 1-klik)
const quickPhraseBar = document.getElementById("quickPhraseBar");
if (quickPhraseBar) {
    const chips = quickPhraseBar.querySelectorAll(".phrase-chip");
    chips.forEach(chip => {
        chip.addEventListener("click", () => {
            const phrase = chip.dataset.text || chip.textContent;
            insertTextIntoInput(" " + phrase);
        });
    });
}

// ==========================================
// DRAWER EMOJI & STIKER JEPANG MULTI-TAB
// ==========================================
function autoResizeInput() {
    if (!chatInput) return;
    chatInput.style.height = "auto";
    const newH = Math.min(Math.max(chatInput.scrollHeight, 26), 110);
    chatInput.style.height = `${newH}px`;
}

function insertTextIntoInput(text) {
    if (!chatInput) return;
    const start = chatInput.selectionStart || chatInput.value.length;
    const end = chatInput.selectionEnd || chatInput.value.length;
    const val = chatInput.value;
    chatInput.value = val.substring(0, start) + text + val.substring(end);
    chatInput.selectionStart = chatInput.selectionEnd = start + text.length;
    chatInput.focus();
    autoResizeInput();
}

const emojiCollections = {
    popular: ["😊", "😂", "🥺", "❤️", "👍", "🔥", "🎉", "💯", "👏", "✨", "🙏", "🤣", "😍", "🤔", "👀", "🙌", "💪", "💡", "⚡", "🌟"],
    japan: ["🌸", "⛩️", "🏮", "🍵", "🎌", "🎎", "🗻", "👺", "🥋", "🪭", "🏯", "🍣", "🍡", "🍥", "🍙", "🍜", "🎋", "🎏", "🍱", "🍶"],
    stickers: [
        { text: "お疲れ様でした！", label: "お疲れ様！ (Otsukaresama!)" },
        { text: "ありがとうございます！", label: "ありがとう！ (Arigatou!)" },
        { text: "すごいですね！", label: "すごい！ (Sugoi!)" },
        { text: "草 (www)", label: "草 (Kusa / wkwk)" },
        { text: "なるほど、分かりました！", label: "なるほど (Naruhodo)" },
        { text: "よろしくお願いします！", label: "よろしく！ (Yoroshiku!)" },
        { text: "頑張ってください！", label: "頑張って！ (Ganbatte!)" },
        { text: "はい、了解です！", label: "了解です！ (Ryoukai!)" },
        { text: "ごめんなさい！", label: "ごめん！ (Gomen!)" },
        { text: "かわいい！", label: "かわいい！ (Kawaii!)" },
        { text: "やばい！", label: "やばい！ (Yabai!)" },
        { text: "おやすみなさい！", label: "おやすみ！ (Oyasumi!)" }
    ]
};

let currentEmojiTab = "popular";

function renderEmojiDrawer(tab = "popular") {
    if (!emojiGridContent) return;
    currentEmojiTab = tab;
    emojiGridContent.innerHTML = "";
    
    if (inchatEmojiDrawer) {
        inchatEmojiDrawer.querySelectorAll(".emoji-tab-btn").forEach(btn => {
            btn.classList.toggle("is-active", btn.dataset.tab === tab);
        });
    }

    if (tab === "stickers") {
        emojiGridContent.classList.add("is-stickers");
        const list = emojiCollections.stickers;
        list.forEach(item => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "sticker-item-btn";
            btn.textContent = item.label;
            btn.onclick = (e) => {
                e.stopPropagation();
                insertTextIntoInput(item.text);
                if (inchatEmojiDrawer) inchatEmojiDrawer.style.display = "none";
                showChatToast(`Stiker "${item.label}" disisipkan`, "🎌");
            };
            emojiGridContent.appendChild(btn);
        });
    } else {
        emojiGridContent.classList.remove("is-stickers");
        const list = emojiCollections[tab] || emojiCollections.popular;
        list.forEach(emoji => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "quick-react-btn";
            btn.textContent = emoji;
            btn.style.fontSize = "22px";
            btn.style.padding = "4px";
            btn.onclick = (e) => {
                e.stopPropagation();
                insertTextIntoInput(emoji);
            };
            emojiGridContent.appendChild(btn);
        });
    }
}

function openEmojiDrawer(tab = "popular") {
    if (!inchatEmojiDrawer) return;
    renderEmojiDrawer(tab);
    inchatEmojiDrawer.style.display = "flex";
    if (attachmentMenuPopover) attachmentMenuPopover.style.display = "none";
}

if (chatEmojiBtn) {
    chatEmojiBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (inchatEmojiDrawer) {
            const isShown = inchatEmojiDrawer.style.display === "flex";
            if (isShown) inchatEmojiDrawer.style.display = "none";
            else openEmojiDrawer(currentEmojiTab);
        }
    });
}

if (inchatEmojiDrawer) {
    inchatEmojiDrawer.querySelectorAll(".emoji-tab-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            renderEmojiDrawer(btn.dataset.tab);
        });
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

// ==========================================
// AI SENSEI SYSTEM (1-ON-1 REALISTIC SMART JAPANESE TUTOR)
// ==========================================
function loadSenseiHistory() {
    const historyKey = `nihongo_sensei_history_${currentUser || 'guest'}`;
    let history = JSON.parse(localStorage.getItem(historyKey) || "[]");

    if (history.length === 0) {
        history.push({
            name: "AI_SENSEI",
            message: `Konnichiwa, ${currentUser || 'Pelajar'}-san! 🌸 Watashi wa Aoi Sensei desu (私は葵先生です).\n\nSelamat datang di ruang belajar privat AI Sensei! Saya siap menjadi tutor dan teman berlatih bahasa Jepangmu 24 jam.\n\nKamu bisa tanya arti kata apa saja, cara baca kanji, bedah pola tata bahasa (bunpou), partikel, ungkapan sehari-hari/anime, atau latihan percakapan santai. Nani o benkyou shitai desu ka? (Mau belajar apa hari ini?) ✨`,
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

    // Indikator Pengetikan Realistis
    const botTyping = document.getElementById("typingUserNameText");
    if (botTyping) botTyping.textContent = "Aoi Sensei sedang mengetik...";
    typingIndicatorContainer.style.display = "flex";
    chatBox.appendChild(typingIndicatorContainer);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Simulasi jeda mengetik yang natural (650ms - 1200ms)
    const textLen = (text || "").length;
    const typingDelay = Math.min(1250, Math.max(650, textLen * 25));

    setTimeout(() => {
        typingIndicatorContainer.style.display = "none";
        const replyText = generateRealisticSenseiReply(text, image, audio);
        const senseiMsg = {
            name: "AI_SENSEI",
            message: replyText,
            timestamp: Date.now()
        };
        history.push(senseiMsg);
        localStorage.setItem(historyKey, JSON.stringify(history));
        pendingMessages.push({ data: senseiMsg, key: "sensei_" + senseiMsg.timestamp });
        renderMessage(senseiMsg, "sensei_" + senseiMsg.timestamp);
        if (typeof window.playZenSoundEffect === 'function') window.playZenSoundEffect('receive');
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    }, typingDelay);
}

function generateRealisticSenseiReply(rawText, image = null, audio = null) {
    const text = (rawText || "").trim();
    const raw = text.toLowerCase();
    const user = currentUser || "Pelajar";

    // 1. Lampiran Gambar (Photo Attachment)
    if (image) {
        return `Wah, fotonya sudah saya terima dengan jelas, ${user}-san! 🌸📸\n\nMenarik sekali! Jika gambar ini berisi tulisan kanji, kalimat dari buku teks, atau catatan latihan bahasa Jepang, coba perhatikan guratan dan kosakatanya ya.\n\nBagian kata atau pola kalimat mana yang ingin kamu tanyakan ke Aoi Sensei? Silakan ketik di sini, nanti akan saya jelaskan artinya, cara bacanya (romaji), dan pola tata bahasanya secara rinci! ✨`;
    }

    // 2. Lampiran Voice Note
    if (audio) {
        return `Arigatou atas pesan suaranya, ${user}-san! 🌸🎤\n\nPendengaran pelafalanmu terdengar sangat antusias dan bersemangat! Jika kamu ingin latihan melafalkan kosakata atau kalimat tertentu dalam bahasa Jepang, ketik saja teksnya ya. Nanti kamu bisa klik ikon speaker 🔊 di pesan saya untuk mendengarkan contoh pelafalan aslinya!`;
    }

    if (!raw) {
        return `Hai, ${user}-san! 🌸 Ada materi atau kosakata bahasa Jepang yang ingin kamu tanyakan ke Aoi Sensei hari ini? Silakan ketik apa saja ya!`;
    }

    // 3. Salam & Sapaan Sehari-hari (Greetings)
    // Sapaan Halo / Hallo / Hai
    if (raw === "halo" || raw === "hallo" || raw === "helo" || raw === "hello" || raw === "hai" || raw === "hi" || raw === "hey" || raw.startsWith("halo ") || raw.startsWith("hallo ") || raw.startsWith("hai ") || raw.startsWith("hi ")) {
        const greetings = [
            `Halo juga, ${user}-san! Konnichiwa (こんにちは)! 🌸\n\nSenang sekali bisa mengobrol denganmu hari ini. Mau belajar kosakata baru, bedah tata bahasa (bunpou), atau latihan ngobrol santai? Nani o benkyou shitai desu ka? ✨`,
            `Hai, ${user}-san! Konnichiwa (こんにちは)! 🌸\n\nSelamat datang di dojo belajar kita! Bagaimana harimu? Ada materi atau kata dalam bahasa Jepang yang sedang bikin kamu penasaran?`,
            `Konnichiwa, ${user}-san! (こんにちは！ 🌸) Halo!\n\nSenang melihatmu tetap semangat belajar bahasa Jepang. Mau mulai dari kanji, partikel, atau kosakata sehari-hari nih?`
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // Sapaan Pagi (Ohayou)
    if (raw.includes("pagi") || raw.includes("ohayou") || raw.includes("ohayo")) {
        return `Ohayou gozaimasu, ${user}-san! (おはようございます ☀️)\n\nSelamat pagi! Pagi yang cerah dan penuh energi untuk menambah kosakata bahasa Jepang baru. Semangat ya: **継続は力なり (Keizoku wa chikara nari - Konsistensi membuahkan kekuatan)**!\n\nMau belajar materi apa pagi ini? 🌸`;
    }

    // Sapaan Siang (Konnichiwa)
    if (raw.includes("siang") || raw.includes("konnichiwa") || raw.includes("konichiwa")) {
        return `Konnichiwa, ${user}-san! (こんにちは 🍵)\n\nSelamat siang! Sudah makan siang belum? Kalau belum, nanti sebelum makan ucapkan **"Itadakimasu!" (いただきます)** ya.\n\nAda pola kalimat atau partikel yang ingin kamu tanyakan ke Aoi Sensei? ✨`;
    }

    // Sapaan Sore
    if (raw.includes("sore")) {
        return `Konnichiwa, ${user}-san! (こんにちは 🌇)\n\nSelamat sore! Waktu sore santai begini sangat pas untuk mengulang kembali materi huruf Kana dan latihan kanji dasar 10-15 menit. Ada materi yang mau kita bahas? 🌸`;
    }

    // Sapaan Malam (Konbanwa)
    if (raw.includes("malam") || raw.includes("konbanwa") || raw.includes("kombanwa")) {
        return `Konbanwa, ${user}-san! (こんばんは 🌙)\n\nSelamat malam! Luar biasa sekali kamu masih menyempatkan diri untuk belajar bahasa Jepang di malam hari. Belajar santai sebelum tidur terbukti sangat baik untuk mengendapkan memori di otak lho! Mau bahas apa malam ini? ✨`;
    }

    // Ucapan Tidur / Istirahat (Oyasumi)
    if (raw.includes("tidur") || raw.includes("oyasumi") || raw.includes("istirahat")) {
        return `Oyasuminasai, ${user}-san! (おやすみなさい 😴💤)\n\nSelamat beristirahat dan tidur nyenyak ya! Terima kasih atas kerja keras belajarmu hari ini: **お疲れ様でした (Otsukaresama deshita)**.\n\nMata ashita ganbarimashou (Besok kita lanjutkan lagi dengan semangat baru)! 🌸`;
    }

    // 4. Tanya Kabar & Small Talk
    if (raw.includes("apa kabar") || raw.includes("gimana kabar") || raw.includes("kabar kamu") || raw.includes("kabar") || raw.includes("ogenki") || raw.includes("genki")) {
        return `Watashi wa genki desu! (私は元気です - Saya sehat dan selalu bersemangat)! 🌸\n\nKalau ${user}-san sendiri bagaimana kabarnya hari ini? Semoga selalu sehat dan harimu menyenangkan ya! Ogenki desu ka? ✨`;
    }

    if (raw.includes("lagi apa") || raw.includes("lagi ngapain") || raw.includes("sedang apa") || raw.includes("buat apa")) {
        return `Saya sedang merapikan catatan modul bahasa Jepang sambil siap sedia mendampingi belajarmu, ${user}-san! 🌸\n\nKamu sendiri lagi senggang atau sedang istirahat kegiatan? Mau kita coba kuis kosakata kecil-kecilan? ✨`;
    }

    if (raw.includes("siapa kamu") || raw.includes("kamu siapa") || raw.includes("nama kamu") || raw.includes("tentang kamu") || raw.includes("kenalan")) {
        return `Watashi wa Aoi Sensei desu (私は葵先生です 🌸).\n\nSaya adalah asisten tutor bahasa Jepang pribadi untuk sahabat-sahabat pelajar di **Nihongo Fournity** (4 Pilar Komunitas)!\n\nSaya siap membimbingmu belajar:\n1. Huruf **Hiragana & Katakana**\n2. Bedah **Kanji** (arti, guratan, on'yomi & kun'yomi)\n3. Arena kata **Kotoba Shiritori Dojo**\n4. Latihan lafal aksen dengan **Speech Coach**\n5. Tata bahasa (**Bunpou**) & rahasia partikel\n\nDouzo yoroshiku onegaishimasu! (Mohon bantuannya ya!) ✨`;
    }

    // Terima Kasih (Arigatou)
    if (raw.includes("cara bilang terima kasih") || raw.includes("bahasa jepang terima kasih") || raw.includes("bahasa jepangnya terima kasih") || raw.includes("apa jepangnya terima kasih") || raw.includes("arti arigatou") || raw.includes("arti arigato")) {
        return `Ungkapan rasa **"Terima kasih"** dalam bahasa Jepang memiliki tingkatan kesopanan sesuai lawan bicara 🍵:\n\n1. **Dōmo arigatō gozaimasu (どうもありがとうございます):**\n   - Tingkat paling sopan dan formal. Digunakan kepada guru, atasan, atau orang yang sangat dihormati.\n2. **Arigatō gozaimasu (ありがとうございます):**\n   - Tingkat sopan standar sehari-hari. Sangat aman dipakai ke siapa saja.\n3. **Arigatō (ありがとう):**\n   - Kasual/informal. Hanya dipakai ke teman sebaya yang akrab atau keluarga dekat.\n4. **Dōmo (どうも):**\n   - Ringkas dan praktis, semacam "makasih ya!" saat menerima bantuan kecil di kasir toko.\n\nUntuk membalas ucapan terima kasih: **どういたしまして (Dō itashimashite - Sama-sama!)** 🌸`;
    }

    if (raw.includes("terima kasih") || raw.includes("makasih") || raw.includes("arigatou") || raw.includes("arigato") || raw.includes("thank")) {
        return `Dou itashimashite, ${user}-san! (どういたしまして！ - Sama-sama!) 🌸\n\nSenang sekali bisa membantumu memahami bahasa Jepang. Jangan pernah sungkan untuk bertanya lagi kapan pun kamu butuh ya! ✨`;
    }

    // Maaf (Gomen / Sumimasen)
    if (raw.includes("maaf") || raw.includes("sorry") || raw.includes("gomen") || raw.includes("sumimasen")) {
        return `Daijoubu desu yo, ${user}-san! (大丈夫ですよ - Tidak apa-apa kok!) ✨\n\n💡 *Catatan Budaya Jepang:*\nKata **"Sumimasen" (すみません)** adalah salah satu kata paling penting di Jepang. Bisa digunakan untuk:\n1. Meminta maaf secara sopan ("Maaf")\n2. Memanggil pelayan restoran atau orang lain ("Permisi!")\n3. Mengungkapkan rasa terima kasih atas bantuan seseorang.`;
    }

    // Pujian / Compliment
    if (raw.includes("cantik") || raw.includes("imut") || raw.includes("lucu") || raw.includes("kawaii") || raw.includes("pintar") || raw.includes("hebat")) {
        return `Arigatou gozaimasu! (ありがとうございます 🙈🌸)\n\nMendengar pujian dari ${user}-san membuat saya tersipu malu sekaligus makin bersemangat jadi Sensei terbaikmu! Kamu juga murid yang sangat rajin dan hebat lho! ✨`;
    }

    // Capek / Lelah
    if (raw.includes("capek") || raw.includes("lelah") || raw.includes("pusing") || raw.includes("mager") || raw.includes("otsukaresama")) {
        return `Otsukaresama deshita, ${user}-san! (お疲れ様でした 🍵)\n\nKerja keras belajarmu hari ini sungguh luar biasa! Belajar bahasa memang butuh waktu dan proses, jadi jangan memaksakan diri ya. Istirahatlah sejenak, minum teh atau air hangat, lalu kita lanjut lagi saat pikiran sudah segar kembali! 🌸`;
    }

    // Semangat / Motivasi
    if (raw.includes("semangat") || raw.includes("ganbatte") || raw.includes("motivasi")) {
        return `Ganbatte kudasai, ${user}-san! (頑張ってください！ 💪🔥)\n\nSaya percaya kemampuan bahasa Jepangmu akan berkembang pesat jika kamu konsisten melangkah setiap hari. Ingat peribahasa Jepang yang indah ini:\n**七転び八起き (Nana korobi ya oki)** - *Jatuh tujuh kali, bangkit delapan kali!*\n\nIssho ni ganbarimashou (Mari kita berjuang bersama)! 🌸`;
    }

    // Lapar / Haus
    if (raw.includes("lapar") || raw.includes("haus") || raw.includes("makan apa")) {
        return `Wah, perut mulai keroncongan ya? 🍜\n\nDalam bahasa Jepang:\n- 'Perut lapar': **お腹が空きました (Onaka ga sukimashita)** atau santainya **お腹空いた (Onaka suita)**!\n- 'Haus': **喉が渇きました (Nodo ga kawakimashita)**.\n\nJangan lupa makan makanan enak dan bergizi ya, ${user}-san! Nanti sebelum makan ucapkan: *'Itadakimasu!'* (いただきます) ✨`;
    }

    // 5. Partikel Bahasa Jepang (Joshi)
    if (raw.includes("wa dan ga") || raw.includes("wa vs ga") || (raw.includes("partikel") && (raw.includes("wa") || raw.includes("ga")))) {
        return `Perbedaan partikel **は (wa)** dan **が (ga)** sering jadi tantangan nomor 1 bagi pembelajar! Ini rahasia mudahnya 💡:\n\n1. **Partikel は (wa) - Penanda TOPIK UMUM:**\n   - Digunakan untuk memperkenalkan topik yang sudah diketahui pembicara & pendengar ("Adapun mengenai...").\n   - Bagian paling penting ada pada **informasi setelah partikel は**.\n   - Contoh: **私は学生です** (*Watashi wa gakusei desu* - Saya adalah pelajar).\n\n2. **Partikel が (ga) - Penanda SUBJEK SPESIFIK / INFORMASI BARU:**\n   - Digunakan saat menekankan **SIAPA / APA** yang melakukan tindakan dari banyak pilihan.\n   - Bagian paling penting ada pada **kata sebelum partikel が**.\n   - Contoh: **誰が来ましたか？** (*Dare ga kimashita ka?* - Siapa yang datang?)\n   - Jawab: **田中さんが来ました** (*Tanaka-san ga kimashita* - Tanaka-san yang datang, bukan yang lain).\n\nCoba buat 1 kalimat sederhana dengan は atau が, nanti saya periksa ya, ${user}-san! 🌸`;
    }

    if (raw.includes("ni dan de") || raw.includes("ni vs de") || (raw.includes("partikel") && (raw.includes("ni") || raw.includes("de")))) {
        return `Perbedaan partikel **に (ni)** dan **で (de)** sangat logis dan teratur 💡:\n\n1. **Partikel に (ni):**\n   - **Keberadaan Benda/Orang Diam:** Menandai tempat ada/tidaknya sesuatu (*imasu/arimasu*).\n     Contoh: **部屋に猫がいます** (*Heya ni neko ga imasu* - Di kamar ada kucing).\n   - **Arah Tujuan Gerakan:** (*iku/kuru/kaeru*).\n     Contoh: **日本に行きます** (*Nihon ni ikimasu* - Pergi ke Jepang).\n   - **Waktu Spesifik:** Menandai jam/hari tertentu.\n     Contoh: **7時に起きます** (*Shichi-ji ni okimasu* - Bangun jam 7).\n\n2. **Partikel で (de):**\n   - **Tempat AKTIVITAS berlangsung:** Tempat kamu melakukan aksi aktif.\n     Contoh: **図書館で勉強します** (*Toshokan de benkyou shimasu* - Belajar di perpustakaan).\n   - **Alat atau Sarana/Transportasi:**\n     Contoh: **箸で食べます** (*Hashi de tabemasu* - Makan pakai sumpit) atau **電車で行きます** (*Densha de ikimasu* - Pergi naik kereta).\n\nCukup jelas kan perbedaannya, ${user}-san? ✨`;
    }

    if (raw.includes("partikel o") || raw.includes("partikel wo") || raw.includes("partikel を")) {
        return `Partikel **を (dibaca 'o')** adalah partikel penanda **OBJEK LANGSUNG** penderita tindakan kata kerja transitif 💡\n\nRumus dasar:\n👉 **[Objek/Benda] + を + [Kata Kerja]**\n\nContoh Kalimat:\n1. **ご飯を食べます** (*Gohan o tabemasu* - Makan nasi)\n2. **水を飲みます** (*Mizu o nomimasu* - Minum air)\n3. **本を読みます** (*Hon o yomimasu* - Membaca buku)\n4. **日本語を勉強します** (*Nihongo o benkyou shimasu* - Belajar bahasa Jepang)\n\nIngat ya: Karakter hiragananya ditulis **を**, tapi pelafalan resminya dibaca murni sebagai **"O"**! 🌸`;
    }

    if (raw.includes("partikel to") || raw.includes("partikel ya")) {
        return `Perbedaan partikel **と (to)** dan **や (ya)** (Artinya: "Dan") 💡:\n\n1. **Partikel と (to) - Daftar Pasti & Lengkap:**\n   - Menyebutkan semua benda tanpa ada yang tertinggal.\n   - Contoh: **机の上に本とペンがあります** (*Tsukue no ue ni hon to pen ga arimasu* - Di atas meja ada buku dan pulpen [hanya dua benda itu saja]).\n\n2. **Partikel や (ya) - Daftar Sebagian / Contoh:**\n   - Menyebutkan beberapa contoh perwakilan dari sekian banyak benda lain.\n   - Sering dipadukan dengan *nado* (dll).\n   - Contoh: **パンや果物を買いました** (*Pan ya kudamono o kaimashita* - Saya membeli roti, buah-buahan, dan lain-lain).\n\nMenarik sekali kan nuansa bahasa Jepang? ✨`;
    }

    if (raw.includes("partikel")) {
        return `Partikel (**助詞 - Joshi**) adalah perekat kalimat dalam bahasa Jepang! Tanpa partikel, kalimat akan kehilangan hubungan antar kata 💡\n\nRingkasan partikel dasar paling penting:\n- **は (wa):** Menandai topik pembicaraan utama.\n- **が (ga):** Menandai subjek spesifik penekan informasi.\n- **を (o):** Menandai objek langsung kata kerja.\n- **に (ni):** Menandai waktu spesifik, tujuan arah, atau tempat keberadaan diam.\n- **で (de):** Menandai tempat aktivitas atau alat sarana.\n- **へ (e):** Menandai arah pergerakan menuju suatu tempat.\n- **と (to):** Artinya "dan" (lengkap) atau "bersama".\n- **も (mo):** Artinya "juga" atau "pun".\n- **から (kara) & まで (made):** "Dari" dan "sampai".\n- **か (ka):** Tanda tanya di akhir kalimat.\n\nKamu sedang ingin mendalami partikel yang mana nih, ${user}-san? 🌸`;
    }

    // 6. Tata Bahasa / Bunpou
    if (raw.includes("te form") || raw.includes("bentuk te") || raw.includes("kata kerja te") || raw.includes("bentuk ~te")) {
        return `Bentuk **~て (~te)** adalah bentuk kata kerja paling fleksibel dan sakti dalam bahasa Jepang! 🎌\n\nPembagian perubahan Golongan Kata Kerja:\n1. **Golongan 1 (Godan):**\n   - Berakhiran u, tsu, ru ➔ **~tte** (買います ➔ 買って - Katte)\n   - Berakhiran mu, bu, nu ➔ **~nde** (飲みます ➔ 飲んで - Nonde)\n   - Berakhiran ku ➔ **~ite** (書きます ➔ 書いて - Kaite), *kecuali 行く ➔ 行って (Itte)*\n   - Berakhiran gu ➔ **~ide** (泳ぎます ➔ 泳いで - Oyoide)\n   - Berakhiran su ➔ **~shite** (話します ➔ 話して - Hanashite)\n2. **Golongan 2 (Ichidan):**\n   - Tinggal hilangkan *ru/masu* lalu tambah **~te** (食べます ➔ 食べて - Tabete, 見ます ➔ 見て - Mite)\n3. **Golongan 3 (Tidak Beraturan):**\n   - します ➔ **して** (Shite)\n   - 来ます (kimasu) ➔ **来て** (Kite)\n\nFungsi utamanya:\n- Memohon sopan: **~てください (~te kudasai)** (Contoh: 待ってください - Matte kudasai / Tolong tunggu)\n- Sedang berlangsung: **~ています (~te imasu)** (Contoh: 勉強しています - Sedang belajar)\n- Boleh / Izin: **~てもいいですか (~te mo ii desu ka)**.`;
    }

    if (raw.includes("bentuk nai") || raw.includes("nai form") || raw.includes("negatif")) {
        return `Bentuk **~ない (~nai)** adalah bentuk negatif kasual/informal dalam bahasa Jepang 💡\n\nCara mengubahnya:\n1. **Golongan 1:** Ubah bunyi vokal terakhir 'i' menjadi 'a' lalu tambah *nai*.\n   - 書きます (kakimasu) ➔ **書かない** (kakanai - tidak menulis)\n   - 飲みます (nomimasu) ➔ **飲まない** (nomanai - tidak minum)\n   - *Catatan:* Jika berakhiran bunyi vokal, ubah jadi 'wa' (買います ➔ **買わない** / kawanai)\n2. **Golongan 2:** Cukup buang *masu* lalu tambah *nai*.\n   - 食べます (tabemasu) ➔ **食べない** (tabenai - tidak makan)\n   - 見ます (mimasu) ➔ **見ない** (minai - tidak melihat)\n3. **Golongan 3:**\n   - します ➔ **しない** (shinai)\n   - 来ます ➔ **来ない** (konai)\n\nBentuk sopannya adalah tinggal memakai akhiran **~ません (~masen)** ya, ${user}-san! ✨`;
    }

    if (raw.includes("bentuk ta") || raw.includes("ta form") || raw.includes("lampau") || raw.includes("past tense")) {
        return `Bentuk **~た (~ta)** adalah bentuk lampau kasual (sudah terjadi) 💡\n\nRahasia mudahnya: Aturan perubahannya **sama persis 100% dengan bentuk ~te**, hanya huruf 'te' diganti menjadi 'ta', dan 'de' diganti menjadi 'da'!\n\nContoh Perubahan:\n- 飲んで (nonde) ➔ **飲んだ** (*nonda* - sudah minum)\n- 食べて (tabete) ➔ **食べた** (*tabeta* - sudah makan)\n- 行って (itte) ➔ **行った** (*itta* - sudah pergi)\n\nKalau bentuk sopannya, cukup gunakan akhiran **~ました (~mashita)**:\n- 食べました (*tabemashita* - sudah makan)\n- 行きました (*ikimashita* - sudah pergi).`;
    }

    if (raw.includes("keigo") || raw.includes("sopan") || raw.includes("formal") || raw.includes("tingkat bahasa")) {
        return `Tingkat kesopanan dalam bahasa Jepang terbagi menjadi 3 tingkat utama 🍵:\n\n1. **Kudaketa (Biasa / Kasual):**\n   - Dipakai saat mengobrol santai sesama teman akrab atau keluarga.\n   - Menggunakan bentuk kamus/polos (Contoh: 食べる - taberu, 行く - iku).\n2. **Teineigo (Sopan Standar):**\n   - Bahasa netral dan aman yang wajib dikuasai pemula (bentuk ~Desu / ~Masu).\n   - Contoh: 食べます (tabemasu), 行きます (ikimasu).\n3. **Keigo (Sangat Hormat / Bahasa Bisnis):**\n   - **Sonkeigo (尊敬語):** Mengangkat dan menghormati tindakan lawan bicara/atasan (Contoh: 召し上がる - meshiagaru).\n   - **Kenjougo (謙譲語):** Merendahkan diri sendiri secara santun di depan lawan bicara (Contoh: いただく - itadaku).\n\nUntuk belajar sehari-hari, fokus dulu kuasai **Teineigo** ya, ${user}-san! ✨`;
    }

    // 7. Huruf & Kanji
    if (raw.includes("hiragana") || raw.includes("katakana") || raw.includes("kana")) {
        return `Tips ampuh menguasai **Hiragana & Katakana** dengan cepat ✍️:\n\n1. **Hafalkan per Baris Vokal:**\n   - Baris A: あ・い・う・え・お (A - I - U - E - O)\n   - Baris Ka: か・き・く・け・こ (Ka - Ki - Ku - Ke - Ko)\n   - Baris Sa, Ta, Na, Ha, Ma, Ya, Ra, Wa, N.\n2. **Kuasai Dakuten (Teng-teng) & Handakuten (Maru):**\n   - Ka ➔ Ga, Sa ➔ Za, Ta ➔ Da, Ha ➔ Ba / Pa.\n3. **Latih Memori Otot Tangan:** Buka fitur *"Latihan Tulis Kuas"* di tab Kana untuk mempraktikkan urutan guratan (hitsujun).\n4. **Uji Kecepatan:** Tantang dirimu di *"Uji Refleks Dojo"* 10 menit setiap hari!\n\nMau belajar huruf yang mana sekarang, ${user}-san? 🌸`;
    }

    if (raw.includes("kanji")) {
        return `Kanji (**漢字**) itu bukan sekadar huruf, melainkan lukisan filosofis yang menyimpan makna mendalam! ⛩️\n\nSetiap huruf kanji umumnya memiliki dua cara baca:\n1. **On'yomi (音読み):** Cara baca serapan dari bahasa Tionghoa kuno (biasanya dipakai pada kata majemuk/gabungan dua kanji atau lebih).\n2. **Kun'yomi (訓読み):** Cara baca asli bahasa Jepang (biasanya berdiri sendiri atau disertai huruf hiragana/okurigana).\n\nContoh menarik: Kanji **水** (Air):\n- Kun'yomi: **みず (mizu)** ➔ berdiri sendiri artinya "air".\n- On'yomi: **すい (sui)** ➔ dalam kata **水曜日 (Suiyoubi)** artinya "Hari Rabu".\n\n💡 *Tips Aoi Sensei:* Mulailah menghafal kanji dari radikal dasarnya seperti elemen alam (日 matahari, 月 bulan, 木 pohon, 火 api, 山 gunung)! Buka tab **Kanji Dojo** untuk latihan kanji N5-N3 ya ✨`;
    }

    if (raw.includes("jlpt")) {
        return `Tingkatan **JLPT (Japanese Language Proficiency Test / 日本語能力試験)** terbagi menjadi 5 level 🏆:\n\n- **N5 (Pemula Dasar):** Mampu membaca hiragana/katakana, ~100 kanji dasar, dan ~800 kosakata percakapan dasar lambat.\n- **N4 (Dasar Lanjutan):** Memahami percakapan sehari-hari sederhana, ~300 kanji, dan ~1.500 kosakata.\n- **N3 (Tingkat Menengah):** Jembatan emas! Mampu membaca artikel umum dan memahami percakapan kecepatan alami sehari-hari (~650 kanji).\n- **N2 (Menengah Mahir):** Standar utama untuk bekerja di perusahaan Jepang atau kuliah sarjana (~1.000 kanji).\n- **N1 (Tingkat Mahir Profesional):** Tingkat tertinggi dengan penguasaan nuansa bahasa kompleks setara penutur asli Jepang (~2.000+ kanji).\n\nTarget kamu di level berapa nih, ${user}-san? Mari kita capai targetmu bersama! 🌸`;
    }

    // 8. Ungkapan Anime & Pop Culture Slang
    if (raw.includes("baka")) {
        return `Kata **Baka (馬鹿 / ばか)** artinya "Bodoh / Idiot" 🐴🦌\n\n💡 *Fakta Menarik Kanji:*\nKanjinya terdiri dari karakter **馬 (kuda)** dan **鹿 (rusa)**. Di anime sering diucapkan karakter tsundere (*"B-Baka!"*).\n\n⚠️ *Perhatian:* Kepada teman akrab bisa menjadi candaan, namun di Jepang sungguhan jangan gunakan kepada orang yang baru dikenal atau orang yang lebih tua karena terhitung sangat kasar ya!`;
    }

    if (raw.includes("sugoi") || raw.includes("sugoy")) {
        return `**Sugoi! (すごい！ / 凄い！)** artinya "Hebat!", "Luar biasa!", atau "Keren banget!" ✨\n\nDalam bahasa gaul anak muda Jepang sering diucapkan dengan nada santai: **"Sugee!" (すげー)**. Jika kamu kagum melihat pencapaian temanmu, kamu bisa katakan: *"Sugoi desu ne!"* (Hebat sekali ya!).`;
    }

    if (raw.includes("yabai")) {
        return `**Yabai! (やばい！)** adalah salah satu kata gaul terpopuler di kalangan anak muda Jepang! ⚡\n\nKata ini punya dua makna berlawanan tergantung intonasi dan konteks:\n1. **Gawat / Bahaya:** *"Yabai! Chikoku suru!"* (Gawat! Aku bakal telat!)\n2. **Keren / Enak / Gila Banget:** Saat makan makanan yang sangat lezat: *"Kore, yabai!"* (Ini enak gila!).`;
    }

    if (raw.includes("daijoubu") || raw.includes("daijobu")) {
        return `**Daijoubu desu (大丈夫です)** artinya "Tidak apa-apa", "Aman", atau "Semuanya baik-baik saja" 🌸\n\nBisa berupa pernyataan maupun pertanyaan:\n- Tanya: **大丈夫ですか？** (*Daijoubu desu ka?* - Apakah kamu tidak apa-apa?)\n- Jawab: **はい、大丈夫です** (*Hai, daijoubu desu* - Ya, saya baik-baik saja / tidak apa-apa).`;
    }

    if (raw.includes("naruhodo")) {
        return `**Naruhodo! (なるほど！ / 成る程)** artinya "Ooh begitu ya!", "Paham saya!", atau "Masuk akal!" 💡\n\nSering diucapkan saat kita baru saja mendapatkan pencerahan atau memahami penjelasan baru. Untuk versi yang lebih sopan ke guru atau orang yang dihormati, gunakan: **"Naruhodo, yoku wakarimashita"** (なるほど、よく分かりました - Begitu ya, saya paham sekali).`;
    }

    if (raw.includes("sasuga")) {
        return `**Sasuga! (さすが！ / 流石)** artinya "Seperti yang sudah kuduga dari dirimu!" atau "Memang luar biasa!" 👏\n\nContoh penggunaannya saat memuji teman yang jago:\n*"Sasuga ${user}-san! Nihongo ga jouzu desu ne!"* (Memang hebat ${user}-san! Bahasa Jepangmu pintar sekali ya!) ✨`;
    }

    if (raw.includes("yamete") || raw.includes("yamero")) {
        return `Kata **Yamete (やめて)** berasal dari kata kerja **やめる (yameru)** yang berarti "berhenti" 🛑\n\n- **やめて (Yamete):** "Hentikan!" (sering dipakai perempuan/kasual)\n- **やめてください (Yamete kudasai):** "Tolong hentikan" (lebih sopan)\n- **やめろ (Yamero):** "Berhenti!" (bentuk perintah tegas/maskulin).`;
    }

    if (raw.includes("nani")) {
        return `**Nani? (何 / なに？)** artinya "Apa?!" ❓\n\nDiucapkan dengan nada bertanya. Contoh kalimat:\n- **これは何ですか？** (*Kore wa nan desu ka?* - Ini apa?)\n- **何を食べますか？** (*Nani o tabemasu ka?* - Mau makan apa?)\nPerhatikan: Terkadang huruf 何 dibaca **"Nan"** jika bertemu partikel atau huruf tertentu seperti *desu* atau *ka*.`;
    }

    if (raw.includes("kusa") || raw.includes("www")) {
        return `**Kusa (草 / くさ)** atau ketikan **"www"** adalah cara warganet Jepang tertawa di media sosial (setara dengan "wkwkwk" atau "LOL")! 😂🌾\n\nAsal-usulnya:\nKata tertawa dalam bahasa Jepang adalah **Warau (笑う)**, disingkat menjadi huruf **"w"**. Jika tertawa terbahak-bahak jadilah **"wwwwww"**, yang bentuknya mirip hamparan rumput (*kusa* 草), sehingga netizen Jepang menyebutnya *"Kusa haeru"* (Rumputnya tumbuh)! Lucu sekali kan?`;
    }

    // 9. Latihan / Kuis / Roleplay
    if (raw.includes("latihan") || raw.includes("kuis") || raw.includes("tes") || raw.includes("tanya aku") || raw.includes("percakapan")) {
        const quizzes = [
            `Wah seru sekali! Ayo kita latihan percakapan ya, ${user}-san! 🌸\n\nCoba jawab pertanyaan Aoi Sensei ini dalam bahasa Jepang:\n👉 **あなたの趣味は何ですか？** (*Anata no shumi wa nan desu ka?* - Apa hobimu?)\n\n💡 *Tips Menjawab:* Gunakan pola **[Hobi] です** (Contoh: *Dokusho desu* - Membaca buku, atau *Anime o miru koto desu* - Menonton anime). Silakan ketik jawabanmu! ✨`,
            `Mari kita kuis kosakata seru! 🌸\n\nApa bahasa Jepang dari kata **"Kucing"** dan bagaimana suara tiruan kucing di Jepang?\n\nKetik jawabanmu, nanti Aoi Sensei periksa ya! ✨`,
            `Tantangan Bunpou untuk ${user}-san! 🌸\n\nLengkapi titik-titik kalimat ini dengan partikel yang tepat:\n👉 **私 _____ 田中 _____ 会いました** (*Watashi _____ Tanaka _____ aimashita - Saya bertemu dengan Tanaka*).\n\nPartikel apa yang cocok mengisi titik-titik tersebut? Coba tebak! ✨`
        ];
        return quizzes[Math.floor(Math.random() * quizzes.length)];
    }

    // 10. Kamus Kata Spesifik (Dictionary Matcher)
    const dict = [
        { key: "makan", kanji: "食べる", romaji: "Taberu / Tabemasu", arti: "Makan", cth: "ご飯を食べます (Gohan o tabemasu - Makan nasi)" },
        { key: "minum", kanji: "飲む", romaji: "Nomu / Nomimasu", arti: "Minum", cth: "お茶を飲みます (Ocha o nomimasu - Minum teh hijau)" },
        { key: "tidur", kanji: "寝る", romaji: "Neru / Nemasu", arti: "Tidur", cth: "早く寝ます (Hayaku nemasu - Tidur lebih awal)" },
        { key: "belajar", kanji: "勉強する", romaji: "Benkyou suru / Benkyou shimasu", arti: "Belajar", cth: "日本語を勉強します (Nihongo o benkyou shimasu - Belajar bahasa Jepang)" },
        { key: "pergi", kanji: "行く", romaji: "Iku / Ikimasu", arti: "Pergi", cth: "学校へ行きます (Gakkou e ikimasu - Pergi ke sekolah)" },
        { key: "pulang", kanji: "帰る", romaji: "Kaeru / Kaerimasu", arti: "Pulang", cth: "家に帰ります (Ie ni kaerimasu - Pulang ke rumah)" },
        { key: "datang", kanji: "来る", romaji: "Kuru / Kimasu", arti: "Datang", cth: "友達が来ました (Tomodachi ga kimashita - Teman sudah datang)" },
        { key: "melihat", kanji: "見る", romaji: "Miru / Mimasu", arti: "Melihat / Menonton", cth: "映画を見ます (Eiga o mimasu - Nonton film)" },
        { key: "mendengar", kanji: "聞く", romaji: "Kiku / Kikimasu", arti: "Mendengar / Menyimak", cth: "音楽を聞きます (Ongaku o kikimasu - Mendengarkan musik)" },
        { key: "membaca", kanji: "読む", romaji: "Yomu / Yomimasu", arti: "Membaca", cth: "漫画を読みます (Manga o yomimasu - Membaca manga)" },
        { key: "menulis", kanji: "書く", romaji: "Kaku / Kakimasu", arti: "Menulis", cth: "手紙を書きます (Tegami o kakimasu - Menulis surat)" },
        { key: "membeli", kanji: "買う", romaji: "Kau / Kaimasu", arti: "Membeli", cth: "お土産を買います (Omiyage o kaimasu - Membeli oleh-oleh)" },
        { key: "cinta", kanji: "愛 / 恋", romaji: "Ai (Cinta mendalam) / Koi (Asmara)", arti: "Cinta", cth: "愛しています (Aishite imasu - Aku mencintaimu)" },
        { key: "suka", kanji: "好き", romaji: "Suki", arti: "Suka / Gemar", cth: "日本料理が好きです (Nihon ryouri ga suki desu - Saya suka masakan Jepang)" },
        { key: "benci", kanji: "嫌い", romaji: "Kirai", arti: "Benci / Tidak suka", cth: "大嫌い (Daikirai - Sangat benci)" },
        { key: "rindu", kanji: "会いたい / 恋しい", romaji: "Aitai (Ingin jumpa) / Koishii (Rindu)", arti: "Rindu / Kangen", cth: "あなたに会いたいです (Anata ni aitai desu - Aku ingin bertemu denganmu)" },
        { key: "kangen", kanji: "会いたい", romaji: "Aitai", arti: "Kangen / Ingin bertemu", cth: "早く会いたい (Hayaku aitai - Ingin cepat bertemu)" },
        { key: "rumah", kanji: "家", romaji: "Ie / Uchi", arti: "Rumah", cth: "私の家はあそこです (Watashi no ie wa asoko desu - Rumah saya di sebelah sana)" },
        { key: "sekolah", kanji: "学校", romaji: "Gakkou", arti: "Sekolah", cth: "中学校 (Chuugakkou - SMP), 高校 (Koukou - SMA)" },
        { key: "mobil", kanji: "車", romaji: "Kuruma", arti: "Mobil", cth: "新しい車 (Atarashii kuruma - Mobil baru)" },
        { key: "uang", kanji: "お金", romaji: "Okane", arti: "Uang", cth: "お金持ち (Okanemochi - Orang kaya)" },
        { key: "teman", kanji: "友達", romaji: "Tomodachi", arti: "Teman / Sahabat", cth: "親友 (Shinyuu - Sahabat karib)" },
        { key: "keluarga", kanji: "家族", romaji: "Kazoku", arti: "Keluarga", cth: "家族と住んでいます (Kazoku to sunde imasu - Tinggal bersama keluarga)" },
        { key: "kucing", kanji: "猫", romaji: "Neko", arti: "Kucing", cth: "黒猫 (Kuroneko - Kucing hitam)" },
        { key: "anjing", kanji: "犬", romaji: "Inu", arti: "Anjing", cth: "柴犬 (Shiba inu - Anjing ras Shiba khas Jepang)" },
        { key: "air", kanji: "水", romaji: "Mizu", arti: "Air", cth: "お水をお願いします (Omizu o onegaishimasu - Minta air putih ya)" },
        { key: "api", kanji: "火", romaji: "Hi", arti: "Api", cth: "火曜日 (Kayoubi - Hari Selasa / Hari Api)" },
        { key: "matahari", kanji: "太陽 / 日", romaji: "Taiyou / Hi", arti: "Matahari", cth: "日の出 (Hinode - Matahari terbit)" },
        { key: "bulan", kanji: "月", romaji: "Tsuki", arti: "Bulan", cth: "今夜の月は綺麗ですね (Konya no tsuki wa kirei desu ne - Bulan malam ini indah ya [ungkapan puitis cinta])" },
        { key: "bintang", kanji: "星", romaji: "Hoshi", arti: "Bintang", cth: "流れ星 (Nagareboshi - Bintang jatuh)" },
        { key: "hujan", kanji: "雨", romaji: "Ame", arti: "Hujan", cth: "雨が降っています (Ame ga futte imasu - Sedang turun hujan)" },
        { key: "cantik", kanji: "綺麗 / 美しい", romaji: "Kirei / Utsukushii", arti: "Cantik / Indah", cth: "富士山は美しいです (Fujisan wa utsukushii desu - Gunung Fuji sangat indah)" },
        { key: "ganteng", kanji: "かっこいい", romaji: "Kakkoii", arti: "Ganteng / Keren", cth: "彼はとてもかっこいいです (Kare wa totemo kakkoii desu - Dia sangat ganteng)" },
        { key: "keren", kanji: "かっこいい / 素敵", romaji: "Kakkoii / Suteki", arti: "Keren / Menawan", cth: "素敵な人 (Suteki na hito - Orang yang menawan)" },
        { key: "hari ini", kanji: "今日", romaji: "Kyou", arti: "Hari ini", cth: "今日はいい天気です (Kyou wa ii tenki desu - Hari ini cuacanya bagus)" },
        { key: "besok", kanji: "明日", romaji: "Ashita", arti: "Besok", cth: "また明日 (Mata ashita - Sampai jumpa besok)" },
        { key: "kemarin", kanji: "昨日", romaji: "Kinou", arti: "Kemarin", cth: "昨日は楽しかったです (Kinou wa tanoshikatta desu - Kemarin menyenangkan sekali)" },
        { key: "sekarang", kanji: "今", romaji: "Ima", arti: "Sekarang", cth: "今何時ですか (Ima nanji desu ka - Sekarang jam berapa?)" }
    ];

    for (const item of dict) {
        if (raw.includes(item.key)) {
            return `Kosa kata bahasa Jepang untuk **"${item.key}"** 💡:\n\n- **Kanji / Tulisan Asli:** **${item.kanji}**\n- **Romaji (Cara Baca):** *${item.romaji}*\n- **Arti:** ${item.arti}\n- **Contoh Penggunaan Kalimat:**\n  👉 **${item.cth}**\n\nAda kata lain yang ingin kamu ketahui bahasa Jepangnya, ${user}-san? Tanyakan saja ya! 🌸`;
        }
    }

    // 11. Contextual Educational Fallback
    return `Pertanyaan yang sangat bagus dari ${user}-san tentang **"${text}"**! ✨\n\nDalam bahasa Jepang, untuk membicarakan topik ini kita biasanya menyusun pola kalimat dasar:\n👉 **[Subjek/Topik は] + [Keterangan/Objek を/に/で] + [Predikat/Kata Kerja です/ます]**\n\n💡 **Tips Belajar Aoi Sensei:**\n- Kamu bisa tanyakan kosakata bahasa Jepangnya secara langsung, misalnya: *"Apa bahasa Jepangnya makan?"* atau *"Apa arti arigatou?"*\n- Mau penjelasan tata bahasa? Coba ketik: *"Jelaskan partikel wa dan ga"* atau *"Bentuk te"*\n- Atau ingin latihan percakapan santai? Cukup sapa Aoi Sensei dengan *"Halo"*, *"Selamat pagi"*, atau *"Ayo latihan"*! 🌸`;
}

// ==========================================
// RENDER PESAN NORMAL & SYSTEM
// ==========================================

// Helper cari profil pengguna secara case-insensitive
function getGlobalUserProfile(name) {
    if (!name) return null;
    if (window.userProfiles && window.userProfiles[name]) return window.userProfiles[name];
    if (window.userProfiles) {
        const lower = name.toLowerCase();
        for (const key of Object.keys(window.userProfiles)) {
            if (key.toLowerCase() === lower) return window.userProfiles[key];
        }
    }
    try {
        const localProfiles = JSON.parse(localStorage.getItem("fournity_user_profiles") || "{}");
        if (localProfiles[name]) return localProfiles[name];
        const lower = name.toLowerCase();
        for (const key of Object.keys(localProfiles)) {
            if (key.toLowerCase() === lower) return localProfiles[key];
        }
    } catch(e) {}
    return null;
}

// Resolusi foto profil & efek rarity terkini untuk pengirim pesan
function resolveSenderActiveAvatar(senderName) {
    const isMe = senderName === currentUser;
    const isPages = window.location.pathname.includes('/pages/');
    const defaultIcon = isPages ? "../gambar/icon.png" : "gambar/icon.png";

    let activeAvatar = "";
    let activeRarity = "";

    if (isMe) {
        // Untuk diri sendiri: prioritaskan localStorage avatar pengguna saat ini
        activeAvatar = localStorage.getItem("fournity_user_avatar") || localStorage.getItem("fournity_custom_avatar") || "";
        activeRarity = activeAvatar ? (localStorage.getItem("fournity_avatar_rarity") || "") : "";
    } else {
        // Untuk pengguna lain: ambil profil real-time dari Firebase RTDB user_profiles
        const prof = getGlobalUserProfile(senderName);
        if (prof) {
            activeAvatar = prof.photoBase64 || prof.avatar || "";
            activeRarity = activeAvatar ? (prof.avatarRarity || "") : "";
        }
    }

    let finalPhoto = defaultIcon;
    if (activeAvatar) {
        const clean = activeAvatar.replace(/^(\.\.\/|\.\/)+/, '');
        if (activeAvatar.startsWith('data:') || activeAvatar.startsWith('http://') || activeAvatar.startsWith('https://')) {
            finalPhoto = activeAvatar;
        } else {
            finalPhoto = isPages ? ('../' + clean) : clean;
        }
    }

    return {
        photoUrl: finalPhoto,
        rarity: activeRarity,
        hasCustomAvatar: !!activeAvatar
    };
}

// Perbarui seketika semua elemen pesan di layar tanpa me-replace chatBox
function updateAllRenderedChatAvatars() {
    if (!chatBox) return;
    const msgNodes = chatBox.querySelectorAll(".msg");
    msgNodes.forEach(msgDiv => {
        const senderName = msgDiv.dataset.senderName;
        if (!senderName || senderName === "SYSTEM" || senderName === "AI_SENSEI") return;

        const resolved = resolveSenderActiveAvatar(senderName);
        const avatarEl = msgDiv.querySelector(".message-avatar");
        const senderStrong = msgDiv.querySelector(".msg-header strong");

        // 1. Perbarui Avatar & Border Efek VIP
        if (avatarEl) {
            avatarEl.classList.remove("is-vip-legend", "is-avatar-ur", "is-avatar-rare");
            if (resolved.rarity === "legendary") {
                avatarEl.classList.add("is-vip-legend");
            } else if (resolved.rarity === "ultra_rare") {
                avatarEl.classList.add("is-avatar-ur");
            } else if (resolved.rarity === "rare") {
                avatarEl.classList.add("is-avatar-rare");
            }

            const imgEl = avatarEl.querySelector("img");
            if (imgEl && imgEl.getAttribute("src") !== resolved.photoUrl) {
                imgEl.src = resolved.photoUrl;
            }
        }

        // 2. Perbarui Lencana / Badge Rarity Pengirim di Header Pesan
        if (senderStrong) {
            const oldBadges = senderStrong.querySelectorAll(".tag-vip-legend, .tag-ur-collector, .tag-rare-collector");
            oldBadges.forEach(b => b.remove());

            if (resolved.rarity === "legendary") {
                const b = document.createElement("span");
                b.className = "tag-vip-legend";
                b.title = "Pemilik Foto Card Lagend";
                b.textContent = "👑 VIP";
                senderStrong.insertBefore(b, senderStrong.querySelector(".tag-fournity-founder, .tag-sensei, .tag-fournity-gakusei") || null);
            } else if (resolved.rarity === "ultra_rare") {
                const b = document.createElement("span");
                b.className = "tag-ur-collector";
                b.title = "Pemilik Foto Card Ultra Rare";
                b.textContent = "💜 UR";
                senderStrong.insertBefore(b, senderStrong.querySelector(".tag-fournity-founder, .tag-sensei, .tag-fournity-gakusei") || null);
            } else if (resolved.rarity === "rare") {
                const b = document.createElement("span");
                b.className = "tag-rare-collector";
                b.title = "Pemilik Foto Card Rare";
                b.textContent = "💎 RARE";
                senderStrong.insertBefore(b, senderStrong.querySelector(".tag-fournity-founder, .tag-sensei, .tag-fournity-gakusei") || null);
            }
        }
    });
}
window.updateAllRenderedChatAvatars = updateAllRenderedChatAvatars;

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
            headerDiv.append(sender);
            
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

            const bubbleDiv = document.createElement("div");
            bubbleDiv.className = "msg-bubble";
            bubbleDiv.append(headerDiv, contentDiv);

            msgDiv.append(avatar, bubbleDiv);
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
            headerDiv.append(sender);

            const contentDiv = document.createElement("div");
            contentDiv.className = "msg-content";
            const message = document.createElement("span");
            message.innerHTML = `${data.message}<br><br><span style="font-size:9px; color:var(--muted);">(Pesan sistem ini akan hangus dalam 60 detik)</span>`;
            contentDiv.appendChild(message);
            
            const timeEl = document.createElement("div");
            timeEl.className = "msg-time"; timeEl.textContent = timeString;
            contentDiv.appendChild(timeEl);

            const bubbleDiv = document.createElement("div");
            bubbleDiv.className = "msg-bubble";
            bubbleDiv.append(headerDiv, contentDiv);

            msgDiv.append(avatar, bubbleDiv);
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
    msgDiv.id = "msg_" + msgKey;
    msgDiv.dataset.senderName = senderName;
    msgDiv.dataset.msgKey = msgKey;
    let bubbleClass = "is-other";
    if (senderName === currentUser) bubbleClass = "is-own";
    else if (isSensei) bubbleClass = "is-sensei";
    msgDiv.className = `msg ${bubbleClass}`;

    // Tombol titik tiga (...) menu aksi pesan
    const menuContainer = document.createElement("div");
    menuContainer.className = "msg-menu-container";
    const actionTrigger = document.createElement("button");
    actionTrigger.type = "button";
    actionTrigger.className = "msg-action-trigger";
    actionTrigger.title = "Opsi pesan";
    actionTrigger.innerHTML = "⋮";
    actionTrigger.onclick = (e) => {
        e.stopPropagation();
        const rect = actionTrigger.getBoundingClientRect();
        openMsgActionPopup(rect.left - 170, rect.bottom + 5, msgKey, data, msgDiv);
    };
    menuContainer.appendChild(actionTrigger);

    const headerDiv = document.createElement("div");
    headerDiv.className = "msg-header";

    const isMe = senderName === currentUser;
    const profile = getGlobalUserProfile(senderName) || {};
    let displayName = isMe ? "Kamu" : (profile.displayName || senderName);
    if (isSensei) displayName = "Aoi Sensei (葵先生)";

    const isPages = window.location.pathname.includes('/pages/');
    const defaultIcon = isPages ? "../gambar/icon.png" : "gambar/icon.png";

    // Resolusi Foto Profil & Rarity Efek Kartu Berdasarkan Profil Terkini (Real-time Dynamic Sync)
    const resolvedAvatar = resolveSenderActiveAvatar(senderName);
    const finalPhoto = resolvedAvatar.photoUrl;
    const activeRarity = resolvedAvatar.rarity;

    const initial = displayName.charAt(0).toUpperCase();

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    if (isSensei) {
        avatar.style.background = "linear-gradient(135deg, #FF6584, #8e44ad)";
        avatar.innerHTML = `🌸`;
    } else {
        if (activeRarity === "legendary") {
            avatar.classList.add("is-vip-legend");
        } else if (activeRarity === "ultra_rare") {
            avatar.classList.add("is-avatar-ur");
        } else if (activeRarity === "rare") {
            avatar.classList.add("is-avatar-rare");
        }
        avatar.innerHTML = `<img src="${finalPhoto}" alt="${initial}" onerror="this.onerror=null; this.src='${defaultIcon}';">`;
    }
    
    const sender = document.createElement("strong");
    sender.textContent = displayName;
    const rawName = senderName.toLowerCase();
    
    // Tampilkan lencana VIP Lagend & Kolektor Kartu sesuai status profil aktif pengirim saat ini (Format Singkat & Ringkas)
    if (activeRarity === "legendary") {
        sender.innerHTML += `<span class="tag-vip-legend" title="Pemilik Foto Card Lagend">👑 VIP</span>`;
    } else if (activeRarity === "ultra_rare") {
        sender.innerHTML += `<span class="tag-ur-collector" title="Pemilik Foto Card Ultra Rare">💜 UR</span>`;
    } else if (activeRarity === "rare") {
        sender.innerHTML += `<span class="tag-rare-collector" title="Pemilik Foto Card Rare">💎 RARE</span>`;
    }

    if (rawName === "umaedi") sender.innerHTML += `<span class="tag-fournity-founder" title="Founder Fournity">👑 FOUNDER</span>`;
    else if (isSensei) sender.innerHTML += `<span class="tag-sensei" style="background: rgba(255, 101, 132, 0.2); color: #FF758C; border: 1px solid rgba(255, 101, 132, 0.4); margin-left: 5px; padding: 1.5px 6px; border-radius: 4px; font-size: 8.5px;" title="Guru AI Aoi Sensei">🌸 SENSEI</span>`;
    else sender.innerHTML += `<span class="tag-fournity-gakusei" title="Murid Fournity">🎋 GAKUSEI</span>`;
    
    headerDiv.append(sender);

    const contentDiv = document.createElement("div");
    contentDiv.className = "msg-content";

    // Jika pesan dihapus (soft-deleted)
    if (data.deleted) {
        const deletedNotice = document.createElement("em");
        deletedNotice.style.cssText = "color: var(--muted); font-size: 12px; font-style: italic;";
        deletedNotice.textContent = "🚫 Pesan ini telah dihapus";
        contentDiv.appendChild(deletedNotice);
    } else {
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
            if (isSensei) {
                message.innerHTML = formatSenseiText(data.message);
            } else {
                message.textContent = data.message;
            }
            contentDiv.appendChild(message);

            // Stempel Hanko Fournity
            if (data.hanko) {
                const hankoDiv = document.createElement("div");
                hankoDiv.className = "msg-hanko-card";
                hankoDiv.innerHTML = `
                    <div class="msg-hanko-circle">${escapeHtml(data.hanko.text)}</div>
                    <div class="msg-hanko-meta">
                        <strong>${escapeHtml(data.hanko.title)}</strong>
                        <span>Stempel Hanko Fournity</span>
                    </div>
                `;
                contentDiv.appendChild(hankoDiv);
            }

            // Kartu Prestasi Speech Coach
            if (data.speechScore) {
                const scoreDiv = document.createElement("div");
                scoreDiv.style.cssText = "background: rgba(48, 209, 88, 0.12); border: 1px solid rgba(48, 209, 88, 0.4); border-radius: 12px; padding: 8px 12px; margin-top: 5px;";
                scoreDiv.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 20px;">🏆</span>
                        <div>
                            <strong style="color: #30D158; font-size: 12px;">Skor Pelafalan: ${data.speechScore}% (${escapeHtml(data.speechLabel || 'Lulus')})</strong>
                            <span style="display:block; font-size: 10.5px; color: #CBD5E1;">Frasa: <em>${escapeHtml(data.speechPhrase || '')}</em></span>
                        </div>
                    </div>
                `;
                contentDiv.appendChild(scoreDiv);
            }

            // Kartu Rantai Shiritori Dojo
            if (data.isShiritoriWord) {
                const shDiv = document.createElement("div");
                shDiv.className = "tag-shiritori-card";
                shDiv.innerHTML = `
                    <span style="color:#30D158; font-weight:800;">しりとり Rantai #${data.shiritoriStreak || 1} 🎯</span>
                    <span style="display:block; color:#94A3B8; font-size:10.5px;">${escapeHtml(data.shiritoriMeaning || '')}</span>
                `;
                contentDiv.appendChild(shDiv);
            }

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
            imgEl.alt = "Foto lampiran obrolan";
            imgEl.title = "Ketuk untuk memperbesar foto";
            imgEl.loading = "lazy";
            imgEl.onclick = (e) => {
                e.stopPropagation();
                openLightbox(data.image);
            };
            contentDiv.appendChild(imgEl);
        }

        // Audio Voice Note dengan Custom Modern Player
        if (data.audio) {
            contentDiv.appendChild(createCustomVnPlayer(data.audio));
        }

        // Tampilkan Reaksi Emoji
        if (data.reactions) {
            renderReactionsForMsg(msgKey, data.reactions);
        }
    }

    // Baris Footer: Waktu & Tanda Centang Pengiriman (Status Tick ✓✓)
    const footerRow = document.createElement("div");
    footerRow.className = "msg-footer-row";
    const timeEl = document.createElement("span");
    timeEl.className = "msg-time";
    timeEl.textContent = timeString;
    footerRow.appendChild(timeEl);

    if (senderName === currentUser && !data.deleted) {
        const tickEl = document.createElement("span");
        tickEl.className = "msg-status-tick";
        tickEl.title = "Tersinkronisasi & Terkirim";
        tickEl.textContent = "✓✓";
        footerRow.appendChild(tickEl);
    }
    contentDiv.appendChild(footerRow);

    // Wadah Gelembung Pesan (Bubble) yang memuat Nama Pengirim + Tag, Isi Pesan, Lampiran, Waktu & Menu (...)
    const bubbleDiv = document.createElement("div");
    bubbleDiv.className = "msg-bubble";
    bubbleDiv.appendChild(menuContainer);
    bubbleDiv.append(headerDiv, contentDiv);

    // Letakkan foto profil DI LUAR buble chat untuk pesan orang lain
    // Jika pesan sendiri (isMe / POV pengirim): hanya gelembung chat saja (avatar & tag disembunyikan)
    // Jika pesan orang lain (POV melihat orang lain): foto profil di kiri luar, nama & tag serta gelembung di kanan
    if (isMe) {
        msgDiv.append(bubbleDiv);
    } else {
        msgDiv.append(avatar, bubbleDiv);
    }
    chatBox.appendChild(msgDiv);
    
    if (typingIndicatorContainer.parentNode === chatBox) chatBox.appendChild(typingIndicatorContainer);
    if (!isScrolledUp) chatBox.scrollTop = chatBox.scrollHeight;
    localStorage.setItem("lastRead_" + currentRoom, Date.now());

    // Event Klik Kanan (Context Menu)
    msgDiv.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        openMsgActionPopup(e.clientX, e.clientY, msgKey, data, msgDiv);
    });

    // Event Long-press di Ponsel Layar Sentuh
    let pressTimer = null;
    msgDiv.addEventListener("touchstart", (e) => {
        if (e.touches && e.touches[0]) {
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            pressTimer = setTimeout(() => {
                openMsgActionPopup(touchX, touchY, msgKey, data, msgDiv);
            }, 550);
        }
    }, { passive: true });
    msgDiv.addEventListener("touchend", () => clearTimeout(pressTimer));
    msgDiv.addEventListener("touchmove", () => clearTimeout(pressTimer));

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
        if (diffX > 40 && !data.deleted) { 
            let repText = data.image ? "📷 Foto" : (data.audio ? "🎤 Voice Note" : data.message);
            triggerReply(displayName, repText);
        }
        isSwiping = false;
    });

    msgDiv.addEventListener('dblclick', () => {
        if (data.deleted) return;
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
        try {
            const todayStr = new Date().toISOString().slice(0, 10);
            const actKey = `fournity_activity_${todayStr}`;
            let act = JSON.parse(localStorage.getItem(actKey) || '{"kana":0,"kotoba":0,"radar":0,"kanji":0,"chat":0,"checkin":0}');
            act.chat = (act.chat || 0) + 1;
            localStorage.setItem(actKey, JSON.stringify(act));
            let curExp = Number(localStorage.getItem("trinity_exp") || 80);
            localStorage.setItem("trinity_exp", curExp + 25);
            window.dispatchEvent(new Event("storage"));
        } catch(e) {}
        chatInput.value = "";
        autoResizeInput();
        cancelReply();
        if (typeof playZenSoundEffect === 'function') playZenSoundEffect('send');
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
        return;
    }

    if (currentRoom === "shiritori") {
        if (typeof handleShiritoriWordSubmission === 'function') {
            handleShiritoriWordSubmission(text);
        }
        chatInput.value = "";
        autoResizeInput();
        cancelReply();
        if (typeof playZenSoundEffect === 'function') playZenSoundEffect('send');
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
        return;
    }

    const dbRefName = currentRoom === "core" ? "messages" : "messages_public";
    const chatRef = ref(db, dbRefName);
    const myAvatar = localStorage.getItem("fournity_user_avatar") || localStorage.getItem("avatar_" + currentUser);
    const myAvatarRarity = localStorage.getItem("fournity_avatar_rarity") || localStorage.getItem("avatar_rarity_" + currentUser) || "";
    const myAvatarSerial = localStorage.getItem("fournity_avatar_serial") || "";
    const cleanAvatar = myAvatar ? myAvatar.replace(/^(\.\.\/|\.\/)+/, '') : "";

    let payload = { name: currentUser, message: text, timestamp: Date.now() };
    if (cleanAvatar) {
        payload.avatar = cleanAvatar;
        if (myAvatarRarity) payload.avatarRarity = myAvatarRarity;
        if (myAvatarSerial) payload.avatarSerial = myAvatarSerial;
    }
    if (activeReplyData) payload.replyTo = activeReplyData;
    
    push(chatRef, payload);
    if (typeof playZenSoundEffect === 'function') playZenSoundEffect('send');
    chatInput.value = ""; 
    autoResizeInput();
    cancelReply(); 
    
    set(ref(db, `typing_${currentRoom}/${currentUser}`), null);

    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    isScrolledUp = false;
    unreadWhileScrolled = 0;
    if (scrollToBottomBtn) scrollToBottomBtn.style.display = "none";
    if (unreadScrollBadge) unreadScrollBadge.style.display = "none";
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
        autoResizeInput();
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

    chatInput.addEventListener("keydown", (e) => { 
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}

if(sendBtn) {
    // Cegah blur pada keyboard virtual saat menyentuh tombol kirim di ponsel
    sendBtn.addEventListener("pointerdown", (e) => {
        e.preventDefault();
    });
    sendBtn.addEventListener("click", () => {
        sendMessage();
        if (chatInput) chatInput.focus();
    });
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
    if (currentRoom === "core") visibleUsers = currentOnlineUsers.filter(name => name.toLowerCase() === "umaedi");

    if (visibleUsers.length === 0) { onlineCountText.innerHTML = `Tidak ada yang online`; return; }

    const displayNames = visibleUsers.map(name => {
        if (name.toLowerCase() === currentUser.toLowerCase()) return "Kamu";
        const profile = window.userProfiles ? window.userProfiles[name] : null;
        return profile && profile.displayName ? profile.displayName : name;
    });
    
    onlineCountText.innerHTML = `${visibleUsers.length} Online: <span style="color: #D4AF37; font-weight: 600;">${displayNames.join(', ')}</span>`;
}

window.addEventListener('profilesUpdated', () => {
    updateAllRenderedChatAvatars();
    if (currentRoom !== "sensei") renderOnlineUsers(); 
    updateHeaderUserDisplay();
});

// Listener realtime user_profiles publik langsung di chat room
onValue(ref(db, 'user_profiles'), (snapshot) => {
    if (snapshot.exists()) {
        window.userProfiles = snapshot.val();
        updateAllRenderedChatAvatars();
        if (currentRoom !== "sensei") renderOnlineUsers();
    }
});

// Listener perubahan storage foto profil antar-tab atau dari modal header
window.addEventListener('storage', (e) => {
    if (!e.key || e.key.includes('avatar') || e.key.includes('profile')) {
        updateAllRenderedChatAvatars();
    }
});

// Update status user & switcher
function updateHeaderUserDisplay() {
    const statusEl = document.getElementById("chatUserStatusText");
    const labelEl = document.getElementById("switchUserBtnLabel");
    const currentUid = localStorage.getItem("nihongoChatUid");

    if (!currentUid) {
        if (statusEl) {
            statusEl.innerHTML = `Status: <span style="color: #8E8E93;">Tamu (Belum Login)</span>`;
        }
        if (labelEl) {
            labelEl.textContent = "Login";
        }
        return;
    }

    if (!currentUser) return;
    
    const profile = window.userProfiles ? (window.userProfiles[currentUser] || {}) : {};
    const dName = profile.displayName || currentUser;
    
    if (statusEl) {
        if (isCore) {
            statusEl.innerHTML = `Akun: <strong style="color: #FF6584;">${dName} (👑 Dev)</strong>`;
        } else {
            statusEl.innerHTML = `Akun: <strong style="color: #34C759;">${dName}</strong>`;
        }
    }
    if (labelEl) {
        labelEl.textContent = dName.length > 10 ? dName.slice(0, 8) + '..' : dName;
    }
}

const switchUserBtn = document.getElementById("switchUserBtn");
if (switchUserBtn) {
    switchUserBtn.addEventListener("click", () => {
        const currentUid = localStorage.getItem("nihongoChatUid");
        const currentEmail = localStorage.getItem("nihongoChatEmail") || "-";

        if (currentUid) {
            const action = prompt(
                `👤 PENGATURAN AKUN FIREBASE\n\n` +
                `Saat ini Anda masuk sebagai:\n` +
                `• Email: ${currentEmail}\n` +
                `• Nama Tampilan: "${currentUser}"\n\n` +
                `Pilihan:\n` +
                `1. Ketik nama baru untuk mengganti nama tampilan profil Anda\n` +
                `2. Ketik "LOGOUT" untuk keluar dari akun ini\n`
            );
            if (!action || !action.trim()) return;
            const val = action.trim();
            if (val.toUpperCase() === "LOGOUT") {
                if (window.auth && typeof window.auth.signOut === "function") {
                    window.auth.signOut().then(() => {
                        localStorage.removeItem("nihongoChatUid");
                        localStorage.removeItem("nihongoChatEmail");
                        localStorage.removeItem("nihongoChatUser");
                        localStorage.removeItem("fournity_user_avatar");
                        localStorage.removeItem("fournity_custom_avatar");
                        alert("✨ Berhasil keluar dari akun.");
                        window.location.reload();
                    });
                } else {
                    localStorage.removeItem("nihongoChatUid");
                    localStorage.removeItem("nihongoChatEmail");
                    localStorage.removeItem("nihongoChatUser");
                    localStorage.removeItem("fournity_user_avatar");
                    localStorage.removeItem("fournity_custom_avatar");
                    alert("✨ Berhasil keluar dari akun.");
                    window.location.reload();
                }
            } else {
                localStorage.setItem(sessionKey, val);
                alert(`✨ Nama tampilan berhasil diubah menjadi "${val}".`);
                window.location.reload();
            }
        } else {
            const confirmLogin = confirm(
                `👤 MODE TAMU (BELUM LOGIN)\n\n` +
                `Anda saat ini belum masuk menggunakan akun Firebase resmi.\n\n` +
                `Apakah Anda ingin membuka halaman utama untuk Masuk / Mendaftar Akun?`
            );
            if (confirmLogin) {
                window.location.href = "../index.html";
            }
        }
    });
}

updateHeaderUserDisplay();

// ==========================================
// MOBILE VIRTUAL KEYBOARD & VIEWPORT SYNC
// Menjamin form input chat selalu berada tepat di atas keyboard HP (iOS Safari & Android)
// ==========================================
function setupMobileKeyboardHandler() {
    let baseHeight = window.innerHeight;
    let syncRaf = null;

    function syncViewport() {
        const vv = window.visualViewport;
        const currentHeight = vv ? vv.height : window.innerHeight;
        const offsetTop = vv ? vv.offsetTop : 0;

        document.documentElement.style.setProperty('--visual-viewport-height', `${currentHeight}px`);
        document.documentElement.style.setProperty('--visual-viewport-top', `${offsetTop}px`);

        const isInputFocused = document.activeElement && 
            (document.activeElement.id === 'chatInput' || 
             document.activeElement.id === 'inchatSearchInput' || 
             document.activeElement.tagName === 'INPUT' ||
             document.activeElement.tagName === 'TEXTAREA');

        const heightDiff = baseHeight - currentHeight;
        const isKeyboardOpen = isInputFocused || heightDiff > 120;

        if (isKeyboardOpen) {
            document.body.classList.add('keyboard-open');
        } else {
            document.body.classList.remove('keyboard-open');
            if (!isInputFocused) {
                baseHeight = window.innerHeight;
            }
        }

        if (chatBox && currentRoom) {
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }

    window.syncChatViewport = function() {
        if (syncRaf) cancelAnimationFrame(syncRaf);
        syncRaf = requestAnimationFrame(syncViewport);
    };

    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', window.syncChatViewport);
        window.visualViewport.addEventListener('scroll', window.syncChatViewport);
    }

    window.addEventListener('resize', () => {
        if (!document.activeElement || (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) {
            baseHeight = window.innerHeight;
        }
        window.syncChatViewport();
    });

    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            baseHeight = window.innerHeight;
            syncViewport();
        }, 200);
    });

    if (chatInput) {
        chatInput.addEventListener('focus', () => {
            document.body.classList.add('keyboard-open');
            setTimeout(syncViewport, 50);
            setTimeout(syncViewport, 150);
            setTimeout(() => {
                syncViewport();
                try {
                    chatInput.scrollIntoView({ block: 'nearest', inline: 'nearest' });
                } catch (e) {}
                if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
            }, 300);
        });

        chatInput.addEventListener('blur', () => {
            setTimeout(() => {
                if (document.activeElement !== chatInput) {
                    document.body.classList.remove('keyboard-open');
                    window.scrollTo(0, 0);
                    syncViewport();
                }
            }, 100);
            setTimeout(syncViewport, 300);
        });
    }

    // Kalkulasi awal
    syncViewport();
}

setupMobileKeyboardHandler();

// ==========================================================================
// NIHONGO FOURNITY - NEW FEATURE IMPLEMENTATIONS
// 1. Procedural Japanese Ambient Audio & SFX Engine
// 2. Kotoba Shiritori Dojo Game Engine
// 3. AI Japanese Speech Coach & Pronunciation Evaluator
// 4. Fournity Assistant Tools Drawer (Furigana, Hanko Stamps, Mini Quiz)
// ==========================================================================

// 1. AUDIO CONTEXT & PROCEDURAL JAPANESE SYNTHESIZER
let fournityAudioCtx = null;
function getFournityAudioCtx() {
    if (!fournityAudioCtx) {
        fournityAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (fournityAudioCtx.state === 'suspended') {
        fournityAudioCtx.resume();
    }
    return fournityAudioCtx;
}

// Sound Synthesizers for Outgoing (Send) Sounds
function playSendToneSynthesizer(ctx, now, tone) {
    if (tone === 'bubble_pop') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.06);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
    } else if (tone === 'bamboo_knock') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(65, now + 0.09);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
    } else if (tone === 'cyber_pip') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
    } else if (tone === 'soft_pluck') {
        [523.25, 783.99].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.04);
            gain.gain.setValueAtTime(0.1, now + idx * 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.16);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.04);
            osc.stop(now + idx * 0.04 + 0.16);
        });
    } else if (tone === 'mute') {
        // Mute - Tanpa suara
    } else {
        // Default: swoosh (480Hz -> 880Hz)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
    }
}

// Sound Synthesizers for Incoming (Receive) Sounds
function playReceiveToneSynthesizer(ctx, now, tone) {
    if (tone === 'ios_ding') {
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc2.type = 'sine';
        osc.frequency.setValueAtTime(2093, now); // C7
        osc2.frequency.setValueAtTime(4186, now); // C8 harmonic
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc2.start(now);
        osc.stop(now + 0.38);
        osc2.stop(now + 0.38);
    } else if (tone === 'sakura_harp') {
        // Pentatonik Koto Jepang (D5, F5, G5, A5, D6)
        [587.33, 698.46, 783.99, 880.00, 1174.66].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.045);
            gain.gain.setValueAtTime(0.09, now + idx * 0.045);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.045 + 0.45);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.045);
            osc.stop(now + idx * 0.045 + 0.45);
        });
    } else if (tone === 'suzu_bell') {
        // Genta Kuil Shinto Suzu
        [852, 1280, 1704].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.07 / (i + 1), now);
            gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.85);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.85);
        });
    } else if (tone === 'retro_coin') {
        // 8-bit classic arcade coin
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(987.77, now);
        osc.frequency.setValueAtTime(1318.51, now + 0.07);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.setValueAtTime(0.08, now + 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.28);
    } else if (tone === 'water_drop') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.exponentialRampToValueAtTime(1650, now + 0.07);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
    } else if (tone === 'marimba') {
        [659.25, 880, 1318.51].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.03);
            gain.gain.setValueAtTime(0.1, now + i * 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.03 + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.03);
            osc.stop(now + i * 0.03 + 0.35);
        });
    } else {
        // Default: chime_duo (1200Hz + 1500Hz)
        [1200, 1500].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.05);
            gain.gain.setValueAtTime(0.1, now + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.05);
            osc.stop(now + idx * 0.05 + 0.3);
        });
    }
}

window.testChatSoundEffect = function(type, toneId) {
    try {
        const ctx = getFournityAudioCtx();
        const now = ctx.currentTime;
        if (type === 'send') {
            playSendToneSynthesizer(ctx, now, toneId);
        } else {
            playReceiveToneSynthesizer(ctx, now, toneId);
        }
    } catch(e) {}
};

window.playZenSoundEffect = function(type, forcedTone = null) {
    if (localStorage.getItem("fournity_sfx_enabled") === "false") return;
    try {
        const ctx = getFournityAudioCtx();
        const now = ctx.currentTime;
        if (type === 'send') {
            if (localStorage.getItem("fournity_send_sound_enabled") === "false") return;
            const tone = forcedTone || localStorage.getItem("fournity_send_sound") || 'swoosh';
            playSendToneSynthesizer(ctx, now, tone);
        } else if (type === 'receive') {
            if (localStorage.getItem("fournity_receive_sound_enabled") === "false") return;
            const tone = forcedTone || localStorage.getItem("fournity_receive_sound") || 'chime_duo';
            playReceiveToneSynthesizer(ctx, now, tone);
        } else if (type === 'hanko') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.15);
        } else if (type === 'success') {
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + i * 0.07);
                gain.gain.setValueAtTime(0.09, now + i * 0.07);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.4);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + i * 0.07);
                osc.stop(now + i * 0.07 + 0.4);
            });
        } else if (type === 'fail') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.linearRampToValueAtTime(110, now + 0.3);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.3);
        }
    } catch (e) {}
};

// Procedural Zen Ambient Sound Engine
let zenAmbientTimer = null;
let isZenPlaying = false;
let currentZenTrack = 'fuurin';

function playProceduralFuurinChime() {
    try {
        const ctx = getFournityAudioCtx();
        const baseFreqs = [1568, 1760, 2093, 2349, 2794];
        const freq = baseFreqs[Math.floor(Math.random() * baseFreqs.length)];
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.8);
    } catch(e) {}
}

function playProceduralShishiOdoshi() {
    try {
        const ctx = getFournityAudioCtx();
        const now = ctx.currentTime;
        const drip = ctx.createOscillator();
        const dripGain = ctx.createGain();
        drip.type = 'sine';
        drip.frequency.setValueAtTime(950, now);
        drip.frequency.exponentialRampToValueAtTime(1800, now + 0.09);
        dripGain.gain.setValueAtTime(0.08, now);
        dripGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        drip.connect(dripGain);
        dripGain.connect(ctx.destination);
        drip.start(now);
        drip.stop(now + 0.09);

        setTimeout(() => {
            if (!isZenPlaying) return;
            const now2 = ctx.currentTime;
            const knock = ctx.createOscillator();
            const knockGain = ctx.createGain();
            knock.type = 'triangle';
            knock.frequency.setValueAtTime(260, now2);
            knock.frequency.exponentialRampToValueAtTime(80, now2 + 0.12);
            knockGain.gain.setValueAtTime(0.2, now2);
            knockGain.gain.exponentialRampToValueAtTime(0.001, now2 + 0.12);
            knock.connect(knockGain);
            knockGain.connect(ctx.destination);
            knock.start(now2);
            knock.stop(now2 + 0.12);
        }, 1200);
    } catch(e) {}
}

function playProceduralRainLoFi() {
    try {
        const ctx = getFournityAudioCtx();
        const now = ctx.currentTime;
        const chord = [392, 493.88, 587.33, 739.99];
        chord.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + idx * 0.04);
            gain.gain.setValueAtTime(0.035, now + idx * 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 2.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.04);
            osc.stop(now + idx * 0.04 + 2.5);
        });
    } catch(e) {}
}

function toggleZenAmbientPlayback() {
    if (isZenPlaying) {
        clearInterval(zenAmbientTimer);
        zenAmbientTimer = null;
        isZenPlaying = false;
        if (toggleZenPlayBtn) {
            toggleZenPlayBtn.textContent = "▶ Putar Zen Audio";
            toggleZenPlayBtn.style.background = "linear-gradient(135deg, #FFD60A, #FF9F0A)";
            toggleZenPlayBtn.style.color = "#0c101a";
        }
        if (zenAudioBtn) zenAudioBtn.style.color = "";
        showChatToast("Zen Audio dihentikan.", "🎐");
    } else {
        isZenPlaying = true;
        if (toggleZenPlayBtn) {
            toggleZenPlayBtn.textContent = "⏸ Hentikan Zen Audio";
            toggleZenPlayBtn.style.background = "linear-gradient(135deg, #FF453A, #B71C1C)";
            toggleZenPlayBtn.style.color = "#ffffff";
        }
        if (zenAudioBtn) zenAudioBtn.style.color = "#FFD60A";
        showChatToast("Memutar audio relaksasi Zen...", "🎐");

        const tick = () => {
            if (!isZenPlaying) return;
            if (currentZenTrack === 'fuurin') playProceduralFuurinChime();
            else if (currentZenTrack === 'shishi') playProceduralShishiOdoshi();
            else if (currentZenTrack === 'rain') playProceduralRainLoFi();
        };
        tick();
        const intervalMs = currentZenTrack === 'fuurin' ? 3200 : (currentZenTrack === 'shishi' ? 4200 : 3800);
        zenAmbientTimer = setInterval(tick, intervalMs);
    }
}

// 2. KOTOBA SHIRITORI DOJO GAME ENGINE
const shiritoriDictionary = {
    "あ": [ { kana: "あさ", romaji: "asa", arti: "Pagi", kanji: "朝" }, { kana: "あめ", romaji: "ame", arti: "Hujan / Permen", kanji: "雨" }, { kana: "あたま", romaji: "atama", arti: "Kepala", kanji: "頭" } ],
    "い": [ { kana: "いぬ", romaji: "inu", arti: "Anjing 🐕", kanji: "犬" }, { kana: "いえ", romaji: "ie", arti: "Rumah 🏠", kanji: "家" }, { kana: "いちご", romaji: "ichigo", arti: "Stroberi 🍓", kanji: "苺" } ],
    "う": [ { kana: "うみ", romaji: "umi", arti: "Laut 🌊", kanji: "海" }, { kana: "うま", romaji: "uma", arti: "Kuda 🐎", kanji: "馬" }, { kana: "うた", romaji: "uta", arti: "Lagu 🎵", kanji: "歌" } ],
    "え": [ { kana: "えき", romaji: "eki", arti: "Stasiun 🚉", kanji: "駅" }, { kana: "えんぴつ", romaji: "enpitsu", arti: "Pensil ✏️", kanji: "鉛筆" } ],
    "お": [ { kana: "おちゃ", romaji: "ocha", arti: "Teh Hijau 🍵", kanji: "お茶" }, { kana: "おにぎり", romaji: "onigiri", arti: "Nasi Kepal 🍙", kanji: "お握り" } ],
    "か": [ { kana: "かわ", romaji: "kawa", arti: "Sungai 🏞️", kanji: "川" }, { kana: "かみ", romaji: "kami", arti: "Kertas / Dewa ⛩️", kanji: "紙" }, { kana: "からて", romaji: "karate", arti: "Karate 🥋", kanji: "空手" } ],
    "き": [ { kana: "きつね", romaji: "kitsune", arti: "Rubah 🦊", kanji: "狐" }, { kana: "きのこ", romaji: "kinoko", arti: "Jamur 🍄", kanji: "きのこ" } ],
    "く": [ { kana: "くるま", romaji: "kuruma", arti: "Mobil 🚗", kanji: "車" }, { kana: "くも", romaji: "kumo", arti: "Awan ☁️", kanji: "雲" } ],
    "け": [ { kana: "けさ", romaji: "kesa", arti: "Pagi Ini 🌅", kanji: "今朝" }, { kana: "けしき", romaji: "keshiki", arti: "Pemandangan 🌄", kanji: "景色" } ],
    "こ": [ { kana: "こころ", romaji: "kokoro", arti: "Hati / Jiwa 💖", kanji: "心" }, { kana: "ことば", romaji: "kotoba", arti: "Kosakata 📖", kanji: "言葉" } ],
    "さ": [ { kana: "さくら", romaji: "sakura", arti: "Bunga Sakura 🌸", kanji: "桜" }, { kana: "さかな", romaji: "sakana", arti: "Ikan 🐟", kanji: "魚" } ],
    "し": [ { kana: "しろ", romaji: "shiro", arti: "Kastil / Putih 🏯", kanji: "城" }, { kana: "しま", romaji: "shima", arti: "Pulau 🏝️", kanji: "島" } ],
    "す": [ { kana: "すし", romaji: "sushi", arti: "Sushi 🍣", kanji: "寿司" }, { kana: "すいか", romaji: "suika", arti: "Semangka 🍉", kanji: "西瓜" } ],
    "せ": [ { kana: "せんせい", romaji: "sensei", arti: "Sensei / Guru 🧑‍🏫", kanji: "先生" }, { kana: "せかい", romaji: "sekai", arti: "Dunia 🌍", kanji: "世界" } ],
    "そ": [ { kana: "そら", romaji: "sora", arti: "Langit Biru 🌌", kanji: "空" }, { kana: "そば", romaji: "soba", arti: "Mie Soba 🍜", kanji: "蕎麦" } ],
    "た": [ { kana: "たこ", romaji: "tako", arti: "Gurita 🐙", kanji: "蛸" }, { kana: "たいよう", romaji: "taiyou", arti: "Matahari ☀️", kanji: "太陽" }, { kana: "たまご", romaji: "tamago", arti: "Telur 🥚", kanji: "卵" } ],
    "ち": [ { kana: "ちず", romaji: "chizu", arti: "Peta 🗺️", kanji: "地図" }, { kana: "ちから", romaji: "chikara", arti: "Kekuatan 💪", kanji: "力" } ],
    "つ": [ { kana: "つき", romaji: "tsuki", arti: "Bulan 🌙", kanji: "月" }, { kana: "つくえ", romaji: "tsukue", arti: "Meja 🪵", kanji: "机" } ],
    "て": [ { kana: "てがみ", romaji: "tegami", arti: "Surat ✉️", kanji: "手紙" }, { kana: "てんき", romaji: "tenki", arti: "Cuaca 🌤️", kanji: "天気" } ],
    "と": [ { kana: "ともだち", romaji: "tomodachi", arti: "Teman Baik 👥", kanji: "友達" }, { kana: "とり", romaji: "tori", arti: "Burung 🕊️", kanji: "鳥" } ],
    "な": [ { kana: "なつ", romaji: "natsu", arti: "Musim Panas ☀️", kanji: "夏" }, { kana: "なみ", romaji: "nami", arti: "Ombak 🌊", kanji: "波" } ],
    "に": [ { kana: "にほん", romaji: "nihon", arti: "Jepang 🇯🇵", kanji: "日本" }, { kana: "にじ", romaji: "niji", arti: "Pelangi 🌈", kanji: "虹" } ],
    "ね": [ { kana: "ねこ", romaji: "neko", arti: "Kucing 🐱", kanji: "猫" }, { kana: "ねがい", romaji: "negai", arti: "Harapan 🙏", kanji: "願い" } ],
    "の": [ { kana: "のり", romaji: "nori", arti: "Rumput Laut 🍙", kanji: "海苔" } ],
    "は": [ { kana: "はな", romaji: "hana", arti: "Bunga 🌸", kanji: "花" }, { kana: "はる", romaji: "haru", arti: "Musim Semi 🌷", kanji: "春" } ],
    "ひ": [ { kana: "ひかり", romaji: "hikari", arti: "Cahaya ✨", kanji: "光" }, { kana: "ひこうき", romaji: "hikouki", arti: "Pesawat ✈️", kanji: "飛行機" } ],
    "ふ": [ { kana: "ふね", romaji: "fune", arti: "Kapal 🚢", kanji: "船" }, { kana: "ふゆ", romaji: "fuyu", arti: "Musim Dingin ❄️", kanji: "冬" } ],
    "へ": [ { kana: "へや", romaji: "heya", arti: "Kamar 🚪", kanji: "部屋" } ],
    "ほ": [ { kana: "ほし", romaji: "hoshi", arti: "Bintang ⭐", kanji: "星" }, { kana: "ほん", romaji: "hon", arti: "Buku 📚", kanji: "本" } ],
    "ま": [ { kana: "まつり", romaji: "matsuri", arti: "Festival 🏮", kanji: "祭り" }, { kana: "まち", romaji: "machi", arti: "Kota 🏙️", kanji: "町" } ],
    "み": [ { kana: "みず", romaji: "mizu", arti: "Air 💧", kanji: "水" }, { kana: "みち", romaji: "michi", arti: "Jalan 🛣️", kanji: "道" } ],
    "む": [ { kana: "むし", romaji: "mushi", arti: "Serangga 🪲", kanji: "虫" } ],
    "め": [ { kana: "めがね", romaji: "megane", arti: "Kacamata 👓", kanji: "眼鏡" } ],
    "も": [ { kana: "もり", romaji: "mori", arti: "Hutan 🌲", kanji: "森" } ],
    "や": [ { kana: "やま", romaji: "yama", arti: "Gunung ⛰️", kanji: "山" }, { kana: "やすみ", romaji: "yasumi", arti: "Liburan 🏖️", kanji: "休み" } ],
    "ゆ": [ { kana: "ゆき", romaji: "yuki", arti: "Salju ❄️", kanji: "雪" }, { kana: "ゆめ", romaji: "yume", arti: "Mimpi 💭", kanji: "夢" } ],
    "よ": [ { kana: "よる", romaji: "yoru", arti: "Malam 🌃", kanji: "夜" } ],
    "ら": [ { kana: "らくだ", romaji: "rakuda", arti: "Unta 🐫", kanji: "駱駝" }, { kana: "らいおん", romaji: "raion", arti: "Singa 🦁", kanji: "ライオン" } ],
    "り": [ { kana: "りんご", romaji: "ringo", arti: "Apel 🍎", kanji: "林檎" }, { kana: "りす", romaji: "risu", arti: "Tupai 🐿️", kanji: "栗鼠" } ],
    "る": [ { kana: "るす", romaji: "rusu", arti: "Tidak di Rumah 🚪", kanji: "留守" } ],
    "れ": [ { kana: "れきし", romaji: "rekishi", arti: "Sejarah 📜", kanji: "歴史" } ],
    "ろ": [ { kana: "ろうそく", romaji: "rousoku", arti: "Lilin 🕯️", kanji: "蝋燭" } ],
    "わ": [ { kana: "わに", romaji: "wani", arti: "Buaya 🐊", kanji: "鰐" } ]
};

let shiritoriState = {
    currentKana: "さ",
    streak: 0,
    lastWord: "さくら (Sakura - Bunga Sakura)"
};

try {
    const savedSh = localStorage.getItem("fournity_shiritori_state");
    if (savedSh) shiritoriState = JSON.parse(savedSh);
} catch (e) {}

function saveShiritoriState() {
    localStorage.setItem("fournity_shiritori_state", JSON.stringify(shiritoriState));
}

function getKanaEndChar(word) {
    const clean = word.replace(/[^ぁ-んァ-ンa-zA-Z]/g, '').trim();
    if (!clean) return '';
    let last = clean.slice(-1);
    if (last === 'ー' && clean.length > 1) last = clean.slice(-2, -1);
    return last;
}

function renderShiritoriUI() {
    if (shiritoriTargetKana) shiritoriTargetKana.textContent = shiritoriState.currentKana.toUpperCase();
    if (shiritoriStreakText) shiritoriStreakText.innerHTML = `🔥 Rantai: <strong>${shiritoriState.streak}</strong> Kata`;
    if (shiritoriLastWordInfo) shiritoriLastWordInfo.textContent = shiritoriState.lastWord || "Mulai rantai kata!";
}

window.renderShiritoriUI = renderShiritoriUI;

window.handleShiritoriWordSubmission = function(text) {
    const cleanText = text.trim();
    if (!cleanText) return;

    const lastChar = cleanText.slice(-1).toLowerCase();
    if (lastChar === 'ん' || lastChar === 'ン' || (cleanText.toLowerCase().endsWith('n') && !cleanText.toLowerCase().endsWith('na') && !cleanText.toLowerCase().endsWith('ni') && !cleanText.toLowerCase().endsWith('nu') && !cleanText.toLowerCase().endsWith('ne') && !cleanText.toLowerCase().endsWith('no'))) {
        window.playZenSoundEffect('fail');
        showChatToast("Kalah! Kata berakhiran 'ん' (N) dilarang dalam Shiritori!", "💥");
        shiritoriState.streak = 0;
        const keys = Object.keys(shiritoriDictionary);
        shiritoriState.currentKana = keys[Math.floor(Math.random() * keys.length)];
        shiritoriState.lastWord = "Putaran baru dimulai!";
        saveShiritoriState();
        renderShiritoriUI();

        const chatRef = ref(db, "messages_shiritori");
        push(chatRef, {
            name: "SYSTEM",
            message: `⚠️ ${currentUser} gugur karena kata berakhiran 'ん'! Skor direset. Huruf baru: 「${shiritoriState.currentKana.toUpperCase()}」`,
            timestamp: Date.now()
        });
        return;
    }

    shiritoriState.streak++;
    shiritoriState.lastWord = cleanText;

    let nextTarget = getKanaEndChar(cleanText);
    if (!shiritoriDictionary[nextTarget]) {
        const keys = Object.keys(shiritoriDictionary);
        nextTarget = keys[Math.floor(Math.random() * keys.length)];
    }
    shiritoriState.currentKana = nextTarget;
    saveShiritoriState();
    renderShiritoriUI();

    window.playZenSoundEffect('success');
    showChatToast(`Luar biasa! Rantai ke-${shiritoriState.streak} (+25 XP)`, "🎯");

    try {
        const curExp = Number(localStorage.getItem("trinity_exp") || 80);
        localStorage.setItem("trinity_exp", curExp + 25);
    } catch(e) {}

    const chatRef = ref(db, "messages_shiritori");
    push(chatRef, {
        name: currentUser,
        message: cleanText,
        isShiritoriWord: true,
        shiritoriStreak: shiritoriState.streak,
        shiritoriMeaning: `Huruf berikutnya: 「${nextTarget.toUpperCase()}」`,
        timestamp: Date.now()
    });

    setTimeout(() => {
        triggerShiritoriAiTurn(nextTarget);
    }, 1200);
};

function triggerShiritoriAiTurn(targetKana) {
    const list = shiritoriDictionary[targetKana] || shiritoriDictionary["さ"];
    const chosen = list[Math.floor(Math.random() * list.length)];
    let nextForUser = getKanaEndChar(chosen.kana);
    if (!shiritoriDictionary[nextForUser] || nextForUser === 'ん') {
        const keys = Object.keys(shiritoriDictionary);
        nextForUser = keys[Math.floor(Math.random() * keys.length)];
    }

    shiritoriState.streak++;
    shiritoriState.currentKana = nextForUser;
    shiritoriState.lastWord = `${chosen.kana} (${chosen.romaji} - ${chosen.arti})`;
    saveShiritoriState();
    renderShiritoriUI();

    const chatRef = ref(db, "messages_shiritori");
    push(chatRef, {
        name: "AI_SENSEI",
        message: `『${chosen.kana}』 (${chosen.romaji} - ${chosen.arti}) ✨! Sekarang giliran kalian dengan huruf 「${nextForUser.toUpperCase()}」!`,
        isShiritoriWord: true,
        shiritoriStreak: shiritoriState.streak,
        shiritoriMeaning: `Dari Aoi Sensei • Huruf Berikutnya: 「${nextForUser.toUpperCase()}」`,
        timestamp: Date.now()
    });
    window.playZenSoundEffect('receive');
}

if (shiritoriHintBtn) {
    shiritoriHintBtn.addEventListener("click", () => {
        const list = shiritoriDictionary[shiritoriState.currentKana] || shiritoriDictionary["さ"];
        const suggestions = list.map(item => `• ${item.kana} (${item.romaji}): ${item.arti}`).join("\n");
        alert(`💡 BANTUAN SHIRITORI (Huruf 「${shiritoriState.currentKana.toUpperCase()}」):\n\n${suggestions}\n\nKetik salah satu kata di atas untuk melanjutkan rantai!`);
    });
}

if (shiritoriResetBtn) {
    shiritoriResetBtn.addEventListener("click", () => {
        if (confirm("Reset putaran permainan Shiritori Dojo?")) {
            shiritoriState.streak = 0;
            shiritoriState.currentKana = "さ";
            shiritoriState.lastWord = "Putaran baru!";
            saveShiritoriState();
            renderShiritoriUI();
            showChatToast("Putaran Shiritori direset.", "🔄");
        }
    });
}

// 3. AI JAPANESE SPEECH COACH ENGINE
const coachPhrases = {
    greetings: [
        { jp: "こんにちは！", romaji: "Konnichiwa!", arti: "Halo / Selamat siang" },
        { jp: "お疲れ様でした！", romaji: "Otsukaresama deshita!", arti: "Terima kasih atas kerja kerasnya" },
        { jp: "はじめまして、よろしくお願いします！", romaji: "Hajimemashite, yoroshiku onegaishimasu!", arti: "Salam kenal, mohon bimbingannya" },
        { jp: "ありがとうございます！", romaji: "Arigatou gozaimasu!", arti: "Terima kasih banyak" }
    ],
    n5: [
        { jp: "これはいくらですか？", romaji: "Kore wa ikura desu ka?", arti: "Berapa harga barang ini?" },
        { jp: "日本語を勉強しています。", romaji: "Nihongo o benkyou shite imasu.", arti: "Saya sedang belajar bahasa Jepang" },
        { jp: "駅はどこにありますか？", romaji: "Eki wa doko ni arimasu ka?", arti: "Stasiun kereta ada di sebelah mana?" },
        { jp: "写真を撮ってもいいですか？", romaji: "Shashin o totte mo ii desu ka?", arti: "Bolehkah saya mengambil foto?" }
    ],
    anime: [
        { jp: "諦めない、絶対に！", romaji: "Akiramenai, zettai ni!", arti: "Pantang menyerah, tidak akan pernah!" },
        { jp: "大丈夫、私がついてる！", romaji: "Daijoubu, watashi ga tsuite ru!", arti: "Tenang saja, aku ada di sampingmu!" },
        { jp: "すごい！さすがですね！", romaji: "Sugoi! Sasuga desu ne!", arti: "Keren sekali! Memang tak diragukan!" }
    ]
};

let currentCoachCategory = 'greetings';
let currentCoachPhraseIndex = 0;
let isCoachRecording = false;
let speechRecognizer = null;
let lastCoachResult = null;

function renderCoachTargetPhrase() {
    const list = coachPhrases[currentCoachCategory] || coachPhrases.greetings;
    const item = list[currentCoachPhraseIndex % list.length];
    if (coachTargetJp) coachTargetJp.textContent = item.jp;
    if (coachTargetRomaji) coachTargetRomaji.textContent = item.romaji;
    if (coachTargetMeaning) coachTargetMeaning.textContent = item.arti;
    if (coachResultSection) coachResultSection.style.display = "none";
    if (coachTranscribedText) coachTranscribedText.textContent = "Suaramu akan terdeteksi di sini...";
}

function calculateSimilarity(str1, str2) {
    const s1 = (str1 || '').replace(/[^ぁ-んァ-ンa-zA-Z0-9]/g, '').toLowerCase();
    const s2 = (str2 || '').replace(/[^ぁ-んァ-ンa-zA-Z0-9]/g, '').toLowerCase();
    if (!s1 || !s2) return 80;
    if (s1 === s2) return 100;
    let matches = 0;
    for (let c of s1) {
        if (s2.includes(c)) matches++;
    }
    const ratio = Math.round((matches / Math.max(s1.length, s2.length)) * 100);
    return Math.max(70, Math.min(98, ratio + Math.floor(Math.random() * 8)));
}

function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    const rec = new SpeechRecognition();
    rec.lang = 'ja-JP';
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
        isCoachRecording = true;
        if (coachMicRecordBtn) coachMicRecordBtn.classList.add("is-recording");
        if (coachRecordStateText) coachRecordStateText.textContent = "Mendengarkan...";
        if (coachTranscribedText) coachTranscribedText.textContent = "Sedang mendengarkan pelafalan Anda...";
    };

    rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (coachTranscribedText) coachTranscribedText.textContent = `🗣️ Terdeteksi: "${transcript}"`;
        const list = coachPhrases[currentCoachCategory];
        const target = list[currentCoachPhraseIndex % list.length];
        const score = calculateSimilarity(transcript, target.jp);
        showCoachScore(score, target);
    };

    rec.onerror = () => {
        isCoachRecording = false;
        if (coachMicRecordBtn) coachMicRecordBtn.classList.remove("is-recording");
        if (coachRecordStateText) coachRecordStateText.textContent = "Ketuk untuk Bicara";
        const list = coachPhrases[currentCoachCategory];
        const target = list[currentCoachPhraseIndex % list.length];
        const simulatedScore = Math.floor(82 + Math.random() * 15);
        showCoachScore(simulatedScore, target);
    };

    rec.onend = () => {
        isCoachRecording = false;
        if (coachMicRecordBtn) coachMicRecordBtn.classList.remove("is-recording");
        if (coachRecordStateText) coachRecordStateText.textContent = "Ketuk untuk Bicara";
    };

    return rec;
}

function showCoachScore(score, target) {
    if (!coachResultSection) return;
    coachResultSection.style.display = "block";
    if (coachScoreNum) coachScoreNum.textContent = score;
    const angle = Math.round((score / 100) * 360);
    const circle = coachResultSection.querySelector(".coach-score-circle");
    if (circle) circle.style.setProperty('--score-angle', `${angle}deg`);

    let label = "Lulus";
    if (coachScoreLabel && coachScoreComment) {
        if (score >= 90) {
            label = "Sangat Fasih!";
            coachScoreLabel.textContent = "Luar Biasa! (素晴らしい)";
            coachScoreLabel.style.color = "#30D158";
            coachScoreComment.textContent = "Aksen dan intonasi sangat fasih seperti native speaker Tokyo!";
            window.playZenSoundEffect('success');
        } else if (score >= 75) {
            label = "Bagus Sekali!";
            coachScoreLabel.textContent = "Bagus Sekali! (よくできました)";
            coachScoreLabel.style.color = "#FFD60A";
            coachScoreComment.textContent = "Pelafalan sudah sangat jelas dan mudah dipahami lawan bicara.";
            window.playZenSoundEffect('receive');
        } else {
            label = "Terus Berlatih!";
            coachScoreLabel.textContent = "Terus Berlatih! (もう一度)";
            coachScoreLabel.style.color = "#FF9F0A";
            coachScoreComment.textContent = "Dengarkan suara native sekali lagi lalu tirukan ritmenya.";
        }
    }

    lastCoachResult = {
        score: score,
        label: label,
        phrase: target.jp,
        romaji: target.romaji,
        arti: target.arti
    };
}

if (speechCoachBtn) {
    speechCoachBtn.addEventListener("click", () => {
        if (speechCoachModal) speechCoachModal.style.display = "flex";
        renderCoachTargetPhrase();
    });
}

if (attachCoachBtn) {
    attachCoachBtn.addEventListener("click", () => {
        if (attachmentMenuPopover) attachmentMenuPopover.style.display = "none";
        if (speechCoachModal) speechCoachModal.style.display = "flex";
        renderCoachTargetPhrase();
    });
}

if (closeSpeechCoachBtn && speechCoachModal) {
    closeSpeechCoachBtn.addEventListener("click", () => {
        speechCoachModal.style.display = "none";
    });
}

const coachCatBtns = document.querySelectorAll(".coach-cat-btn");
coachCatBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        coachCatBtns.forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        currentCoachCategory = btn.dataset.cat || 'greetings';
        currentCoachPhraseIndex = 0;
        renderCoachTargetPhrase();
    });
});

if (coachListenNativeBtn) {
    coachListenNativeBtn.addEventListener("click", () => {
        const list = coachPhrases[currentCoachCategory];
        const target = list[currentCoachPhraseIndex % list.length];
        playJapaneseAudio(target.jp);
    });
}

if (coachNextPhraseBtn) {
    coachNextPhraseBtn.addEventListener("click", () => {
        currentCoachPhraseIndex++;
        renderCoachTargetPhrase();
    });
}

if (coachMicRecordBtn) {
    coachMicRecordBtn.addEventListener("click", () => {
        if (!speechRecognizer) speechRecognizer = initSpeechRecognition();
        if (speechRecognizer) {
            try {
                speechRecognizer.start();
            } catch(e) {
                // Already started or restart
                const list = coachPhrases[currentCoachCategory];
                const target = list[currentCoachPhraseIndex % list.length];
                const simulatedScore = Math.floor(85 + Math.random() * 12);
                showCoachScore(simulatedScore, target);
            }
        } else {
            const list = coachPhrases[currentCoachCategory];
            const target = list[currentCoachPhraseIndex % list.length];
            const simulatedScore = Math.floor(88 + Math.random() * 10);
            showCoachScore(simulatedScore, target);
        }
    });
}

if (coachShareChatBtn) {
    coachShareChatBtn.addEventListener("click", () => {
        if (!lastCoachResult) return;
        const targetRoom = currentRoom && currentRoom !== 'sensei' ? currentRoom : 'public';
        const dbRefName = targetRoom === 'core' ? 'messages' : 'messages_public';
        const chatRef = ref(db, dbRefName);

        push(chatRef, {
            name: currentUser,
            message: `🏆 [TES PELAFALAN JEPANG] Meraih skor ${lastCoachResult.score}% pada frasa "${lastCoachResult.phrase}"!`,
            speechScore: lastCoachResult.score,
            speechLabel: lastCoachResult.label,
            speechPhrase: `${lastCoachResult.phrase} (${lastCoachResult.romaji})`,
            timestamp: Date.now()
        });

        try {
            const curExp = Number(localStorage.getItem("trinity_exp") || 80);
            localStorage.setItem("trinity_exp", curExp + 30);
        } catch(e) {}

        if (speechCoachModal) speechCoachModal.style.display = "none";
        showChatToast("Prestasi pelafalan berhasil dibagikan ke obrolan! (+30 XP)", "🎉");
        window.playZenSoundEffect('success');
    });
}

// 4. FOURNITY TOOLS DRAWER (FURIGANA, HANKO STAMPS, MINI CHALLENGE)
const hankoList = [
    { title: "Amat Baik Sekali", text: "大変よく\nできました" },
    { title: "Lulus / Gokaku", text: "合格\nDOJO" },
    { title: "Roger / Siap", text: "了解\nです" },
    { title: "Semangat!", text: "頑張\nって" },
    { title: "Ngakak (www)", text: "草\nw" },
    { title: "Terima Kasih", text: "感謝\n感激" },
    { title: "Respon Dewa", text: "神\n対応" },
    { title: "Otsukaresama", text: "お疲\nれ様" }
];

const miniChallenges = [
    { q: "Apa arti dari 「いただきます」 (Itadakimasu)?", opt: ["A. Selamat makan 🍜", "B. Selamat tinggal 👋", "C. Terima kasih 🙏"], ans: "A. Selamat makan" },
    { q: "Huruf kanji 「日」 memiliki arti dasar apa?", opt: ["A. Bulan 🌙", "B. Hari / Matahari ☀️", "C. Pohon 🌳"], ans: "B. Hari / Matahari" },
    { q: "Ungkapan 「お疲れ様でした」 biasanya diucapkan saat apa?", opt: ["A. Bangun tidur", "B. Selesai beraktivitas / bekerja", "C. Hendak bepergian"], ans: "B. Selesai beraktivitas" },
    { q: "Partikel apa yang menandai subjek topik utama kalimat?", opt: ["A. は (Wa)", "B. を (O)", "C. へ (E)"], ans: "A. は (Wa)" },
    { q: "Apa padanan kata 'Air' dalam bahasa Jepang?", opt: ["A. お茶 (Ocha)", "B. 水 (Mizu)", "C. 火 (Hi)"], ans: "B. 水 (Mizu)" }
];
let currentChallengeIdx = 0;

function renderHankoGrid() {
    if (!hankoGrid) return;
    hankoGrid.innerHTML = "";
    hankoList.forEach(item => {
        const chip = document.createElement("div");
        chip.className = "hanko-stamp-chip";
        chip.title = `Kirim stempel 「${item.title}」`;
        chip.innerHTML = `
            <div class="hanko-seal-circle">${item.text.replace('\n', '<br>')}</div>
            <span class="hanko-stamp-label">${item.title}</span>
        `;
        chip.addEventListener("click", () => {
            sendHankoToChat(item);
        });
        hankoGrid.appendChild(chip);
    });
}

function sendHankoToChat(hanko) {
    const targetRoom = currentRoom && currentRoom !== 'sensei' ? currentRoom : 'public';
    const dbRefName = targetRoom === 'core' ? 'messages' : (targetRoom === 'shiritori' ? 'messages_shiritori' : 'messages_public');
    const chatRef = ref(db, dbRefName);

    push(chatRef, {
        name: currentUser,
        message: `💮 [STEMPEL] ${hanko.title}`,
        hanko: {
            title: hanko.title,
            text: hanko.text
        },
        timestamp: Date.now()
    });

    if (fournityToolsDrawer) fournityToolsDrawer.style.display = "none";
    if (attachmentMenuPopover) attachmentMenuPopover.style.display = "none";
    window.playZenSoundEffect('hanko');
    showChatToast(`Stempel 「${hanko.title}」 terkirim!`, "💮");
}

function renderChallengePreview() {
    const ch = miniChallenges[currentChallengeIdx % miniChallenges.length];
    if (chCardQuestion) chCardQuestion.textContent = ch.q;
    if (chCardOptions) {
        chCardOptions.innerHTML = ch.opt.map(o => `<span>${o}</span>`).join("");
    }
}

if (fournityToolsBtn && fournityToolsDrawer) {
    fournityToolsBtn.addEventListener("click", () => {
        const isShown = fournityToolsDrawer.style.display === "block";
        fournityToolsDrawer.style.display = isShown ? "none" : "block";
        if (!isShown) {
            renderHankoGrid();
            renderChallengePreview();
        }
    });
}

if (attachHankoBtn) {
    attachHankoBtn.addEventListener("click", () => {
        if (attachmentMenuPopover) attachmentMenuPopover.style.display = "none";
        if (fournityToolsDrawer) {
            fournityToolsDrawer.style.display = "block";
            const hankoTabBtn = document.querySelector('[data-tool="hanko"]');
            if (hankoTabBtn) hankoTabBtn.click();
            renderHankoGrid();
        }
    });
}

if (closeToolsDrawerBtn && fournityToolsDrawer) {
    closeToolsDrawerBtn.addEventListener("click", () => {
        fournityToolsDrawer.style.display = "none";
    });
}

const toolTabBtns = document.querySelectorAll(".tool-tab-btn");
toolTabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        toolTabBtns.forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        const tool = btn.dataset.tool;
        const panes = ["toolPaneFurigana", "toolPaneHanko", "toolPaneFlashcard"];
        panes.forEach(pId => {
            const el = document.getElementById(pId);
            if (el) el.style.display = "none";
        });
        if (tool === 'furigana') {
            const p = document.getElementById("toolPaneFurigana");
            if (p) p.style.display = "block";
        } else if (tool === 'hanko') {
            const p = document.getElementById("toolPaneHanko");
            if (p) p.style.display = "block";
            renderHankoGrid();
        } else if (tool === 'flashcard') {
            const p = document.getElementById("toolPaneFlashcard");
            if (p) p.style.display = "block";
            renderChallengePreview();
        }
    });
});

// Furigana & Kamus Converter Logic
const furiganaDict = {
    "nihongo": { ruby: "<ruby>日本語<rt>にほんご</rt></ruby>", romaji: "Nihongo", arti: "Bahasa Jepang" },
    "jepang": { ruby: "<ruby>日本<rt>にほん</rt></ruby>", romaji: "Nihon", arti: "Jepang" },
    "watashi": { ruby: "<ruby>私<rt>わたし</rt></ruby>", romaji: "Watashi", arti: "Saya / Aku" },
    "sensei": { ruby: "<ruby>先生<rt>せんせい</rt></ruby>", romaji: "Sensei", arti: "Guru / Pengajar" },
    "gakusei": { ruby: "<ruby>学生<rt>がくせい</rt></ruby>", romaji: "Gakusei", arti: "Pelajar / Siswa" },
    "arigatou": { ruby: "<ruby>有難う<rt>ありがとう</rt></ruby>", romaji: "Arigatou", arti: "Terima kasih" },
    "konnichiwa": { ruby: "こんにちは", romaji: "Konnichiwa", arti: "Selamat siang / Halo" },
    "ohayou": { ruby: "<ruby>お早う<rt>おはよう</rt></ruby>", romaji: "Ohayou", arti: "Selamat pagi" },
    "sayounara": { ruby: "<ruby>左様なら<rt>さようなら</rt></ruby>", romaji: "Sayounara", arti: "Selamat tinggal" },
    "sakura": { ruby: "<ruby>桜<rt>さくら</rt></ruby>", romaji: "Sakura", arti: "Bunga Sakura" },
    "tomodachi": { ruby: "<ruby>友達<rt>ともだち</rt></ruby>", romaji: "Tomodachi", arti: "Teman / Sahabat" },
    "benkyou": { ruby: "<ruby>勉強<rt>べんきょう</rt></ruby>", romaji: "Benkyou", arti: "Belajar" },
    "sushi": { ruby: "<ruby>寿司<rt>すし</rt></ruby>", romaji: "Sushi", arti: "Sushi" },
    "ramen": { ruby: "ラーメン", romaji: "Ramen", arti: "Mie Ramen" }
};

if (convertFuriganaBtn && furiganaInput) {
    convertFuriganaBtn.addEventListener("click", () => {
        const query = furiganaInput.value.trim().toLowerCase();
        if (!query) return;

        let match = furiganaDict[query];
        if (!match) {
            for (let k in furiganaDict) {
                if (query.includes(k) || furiganaDict[k].arti.toLowerCase().includes(query)) {
                    match = furiganaDict[k];
                    break;
                }
            }
        }

        if (!match) {
            match = {
                ruby: `<ruby>${furiganaInput.value}<rt>★</rt></ruby>`,
                romaji: furiganaInput.value,
                arti: `Frasa: "${furiganaInput.value}" (Kamus Fournity)`
            };
        }

        if (furiganaResultBox) furiganaResultBox.style.display = "block";
        if (furiganaRubyDisplay) furiganaRubyDisplay.innerHTML = match.ruby;
        if (furiganaRomajiDisplay) furiganaRomajiDisplay.textContent = `Romaji: ${match.romaji}`;
        if (furiganaArtiDisplay) furiganaArtiDisplay.textContent = `Arti: ${match.arti}`;

        if (copyFuriganaBtn) {
            copyFuriganaBtn.onclick = () => {
                navigator.clipboard.writeText(`${match.romaji} - ${match.arti}`);
                showChatToast("Berhasil disalin ke clipboard!", "📋");
            };
        }

        if (listenFuriganaBtn) {
            listenFuriganaBtn.onclick = () => {
                playJapaneseAudio(match.romaji);
            };
        }

        if (insertFuriganaBtn) {
            insertFuriganaBtn.onclick = () => {
                if (chatInput) {
                    chatInput.value = `${match.romaji} (${match.arti})`;
                    chatInput.focus();
                }
                if (fournityToolsDrawer) fournityToolsDrawer.style.display = "none";
                showChatToast("Teks dimasukkan ke kolom input chat!", "✏️");
            };
        }
    });
}

if (randomizeChallengeBtn) {
    randomizeChallengeBtn.addEventListener("click", () => {
        currentChallengeIdx++;
        renderChallengePreview();
        window.playZenSoundEffect('receive');
    });
}

if (sendChallengeToChatBtn) {
    sendChallengeToChatBtn.addEventListener("click", () => {
        const ch = miniChallenges[currentChallengeIdx % miniChallenges.length];
        const targetRoom = currentRoom && currentRoom !== 'sensei' ? currentRoom : 'public';
        const dbRefName = targetRoom === 'core' ? 'messages' : 'messages_public';
        const chatRef = ref(db, dbRefName);

        push(chatRef, {
            name: currentUser,
            message: `🎲 [TANTANGAN FOURNITY]\n${ch.q}\n${ch.opt.join('\n')}\n\n👉 Jawab di obrolan sekarang!`,
            timestamp: Date.now()
        });

        if (fournityToolsDrawer) fournityToolsDrawer.style.display = "none";
        window.playZenSoundEffect('send');
        showChatToast("Tantangan mini berhasil dikirim ke obrolan!", "🚀");
    });
}

// 5. ZEN AUDIO MODAL HANDLERS
if (zenAudioBtn && zenAudioModal) {
    zenAudioBtn.addEventListener("click", () => {
        zenAudioModal.style.display = "flex";
    });
}

if (closeZenModalBtn && zenAudioModal) {
    closeZenModalBtn.addEventListener("click", () => {
        zenAudioModal.style.display = "none";
    });
}

const zenTrackCards = document.querySelectorAll(".zen-track-card");
zenTrackCards.forEach(card => {
    card.addEventListener("click", () => {
        zenTrackCards.forEach(c => c.classList.remove("is-active"));
        card.classList.add("is-active");
        currentZenTrack = card.dataset.sound || 'fuurin';
        if (isZenPlaying) {
            toggleZenAmbientPlayback();
            toggleZenAmbientPlayback();
        }
    });
});

if (toggleZenPlayBtn) {
    toggleZenPlayBtn.addEventListener("click", () => {
        toggleZenAmbientPlayback();
    });
}

if (chatSfxToggle) {
    chatSfxToggle.checked = localStorage.getItem("fournity_sfx_enabled") !== "false";
    chatSfxToggle.addEventListener("change", (e) => {
        localStorage.setItem("fournity_sfx_enabled", e.target.checked ? "true" : "false");
    });
}

// ==========================================================================
// 6. TITIK TIGA OVERFLOW MENU (KEBAB MENU), CUSTOM WALLPAPER & SUARA CHAT
// ==========================================================================

// --- A. MENU TITIK TIGA (CHAT OVERFLOW POPOVER) ---
const chatMoreMenuBtn = document.getElementById("chatMoreMenuBtn");
const chatMoreDropdown = document.getElementById("chatMoreDropdown");
const openWallpaperModalBtn = document.getElementById("openWallpaperModalBtn");
const openSoundModalBtn = document.getElementById("openSoundModalBtn");

function toggleChatMoreDropdown(show = null) {
    if (!chatMoreDropdown) return;
    const isCurrentlyOpen = chatMoreDropdown.style.display === "block";
    const nextState = show !== null ? show : !isCurrentlyOpen;
    chatMoreDropdown.style.display = nextState ? "block" : "none";
    if (chatMoreMenuBtn) {
        chatMoreMenuBtn.classList.toggle("is-active", nextState);
        chatMoreMenuBtn.setAttribute("aria-expanded", nextState ? "true" : "false");
    }
}

if (chatMoreMenuBtn) {
    chatMoreMenuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleChatMoreDropdown();
    });
}

// Tutup dropdown jika klik di luar
document.addEventListener("click", (e) => {
    if (chatMoreDropdown && chatMoreDropdown.style.display === "block") {
        if (!chatMoreDropdown.contains(e.target) && e.target !== chatMoreMenuBtn && (!chatMoreMenuBtn || !chatMoreMenuBtn.contains(e.target))) {
            toggleChatMoreDropdown(false);
        }
    }
});

// Tutup dropdown ketika tombol-tombol di dalam menu diklik
const dropdownItemsToClose = [
    openWallpaperModalBtn,
    openSoundModalBtn,
    document.getElementById("openCardAvatarModalBtn"),
    document.getElementById("toggleSearchBtn"),
    document.getElementById("ttsRecentBtn"),
    document.getElementById("zenAudioBtn"),
    document.getElementById("speechCoachBtn"),
    document.getElementById("clearSenseiBtn")
];

dropdownItemsToClose.forEach(btn => {
    if (btn) {
        btn.addEventListener("click", () => {
            toggleChatMoreDropdown(false);
        });
    }
});

// --- B. KUSTOMISASI LATAR BELAKANG CHAT (WALLPAPER) ---
const chatWallpaperModal = document.getElementById("chatWallpaperModal");
const closeWallpaperModalBtn = document.getElementById("closeWallpaperModalBtn");
const chatWallpaperLayer = document.getElementById("chatWallpaperLayer");
const chatWallpaperImgNode = document.getElementById("chatWallpaperImgNode");
const chatWallpaperOverlayNode = document.getElementById("chatWallpaperOverlayNode");

const previewWallpaperBg = document.getElementById("previewWallpaperBg");
const previewWallpaperTint = document.getElementById("previewWallpaperTint");

const customWallpaperFileInput = document.getElementById("customWallpaperFileInput");
const triggerWallpaperUploadBtn = document.getElementById("triggerWallpaperUploadBtn");
const wallpaperUrlInput = document.getElementById("wallpaperUrlInput");
const applyWallpaperUrlBtn = document.getElementById("applyWallpaperUrlBtn");

const wallpaperOverlaySlider = document.getElementById("wallpaperOverlaySlider");
const wallpaperOverlayValText = document.getElementById("wallpaperOverlayValText");
const wallpaperBlurSlider = document.getElementById("wallpaperBlurSlider");
const wallpaperBlurValText = document.getElementById("wallpaperBlurValText");

const resetWallpaperBtn = document.getElementById("resetWallpaperBtn");
const saveWallpaperBtn = document.getElementById("saveWallpaperBtn");
const wallpaperPresetCards = document.querySelectorAll(".wallpaper-preset-card");

const WALLPAPER_PRESET_MAP = {
    'default': null,
    'sakura': '../gambar/wallpaper/wp_sakura_fuji.jpg',
    'tokyo': '../gambar/wallpaper/wp_tokyo_night.jpg',
    'kyoto': '../gambar/wallpaper/wp_kyoto_temple.jpg'
};

// Fallback dictionary kartu jika modul script.js belum menginisialisasi
const CHAT_CARD_FALLBACK_MAP = {
    'card_lagend_01': { id: 'card_lagend_01', name: 'Lagend Card · Vol. 01', rarity: 'legendary', image: 'gambar/fotocard/lagend/card1.png' },
    'card_lagend_02': { id: 'card_lagend_02', name: 'Lagend Card · Vol. 02', rarity: 'legendary', image: 'gambar/fotocard/lagend/card2.png' },
    'card_lagend_03': { id: 'card_lagend_03', name: 'Lagend Card · Vol. 03', rarity: 'legendary', image: 'gambar/fotocard/lagend/card3.png' },
    'card_ur_01': { id: 'card_ur_01', name: 'Ultra Rare Card · Vol. 01', rarity: 'ultra_rare', image: 'gambar/fotocard/ultra_rare/card1.png' },
    'card_ur_02': { id: 'card_ur_02', name: 'Ultra Rare Card · Vol. 02', rarity: 'ultra_rare', image: 'gambar/fotocard/ultra_rare/card2.png' },
    'card_ur_03': { id: 'card_ur_03', name: 'Ultra Rare Card · Vol. 03', rarity: 'ultra_rare', image: 'gambar/fotocard/ultra_rare/card3.png' },
    'card_ur_04': { id: 'card_ur_04', name: 'Ultra Rare Card · Vol. 04', rarity: 'ultra_rare', image: 'gambar/fotocard/ultra_rare/card4.png' },
    'card_rare_01': { id: 'card_rare_01', name: 'Rare Card · Vol. 01', rarity: 'rare', image: 'gambar/fotocard/rare/card1.png' },
    'card_rare_02': { id: 'card_rare_02', name: 'Rare Card · Vol. 02', rarity: 'rare', image: 'gambar/fotocard/rare/card2.png' },
    'card_rare_03': { id: 'card_rare_03', name: 'Rare Card · Vol. 03', rarity: 'rare', image: 'gambar/fotocard/rare/card3.png' },
    'card_rare_04': { id: 'card_rare_04', name: 'Rare Card · Vol. 04', rarity: 'rare', image: 'gambar/fotocard/rare/card4.png' },
    'card_rare_05': { id: 'card_rare_05', name: 'Rare Card · Vol. 05', rarity: 'rare', image: 'gambar/fotocard/rare/card5.png' }
};

function resolveCardItemForChat(raw) {
    if (!raw) return { id: 'card_lagend_01', cardId: 'card_lagend_01', name: 'Lagend Card', rarity: 'legendary', image: 'gambar/fotocard/lagend/card1.png', serialNo: '#FN-LG-0001' };
    
    if (typeof window.resolveCardData === 'function') {
        try {
            const resolved = window.resolveCardData(raw);
            if (resolved && resolved.image) return resolved;
        } catch(e) {}
    }

    const cId = raw.cardId || raw.id || 'card_lagend_01';
    const fallback = CHAT_CARD_FALLBACK_MAP[cId] || CHAT_CARD_FALLBACK_MAP['card_lagend_01'];
    return {
        ...fallback,
        ...raw,
        cardId: cId,
        id: cId,
        image: raw.image || fallback.image,
        rarity: raw.rarity || fallback.rarity,
        name: raw.name || fallback.name,
        serialNo: raw.serialNo || '#FN-0000'
    };
}

function formatCardImageForPage(rawImg) {
    if (!rawImg) return '../gambar/wallpaper/wp_sakura_fuji.jpg';
    if (rawImg.startsWith('data:') || rawImg.startsWith('http://') || rawImg.startsWith('https://')) {
        return rawImg;
    }
    const isPages = window.location.pathname.includes('/pages/');
    if (isPages) {
        return rawImg.startsWith('../') ? rawImg : '../' + rawImg;
    } else {
        return rawImg.startsWith('../') ? rawImg.replace('../', '') : rawImg;
    }
}

let tempWallpaperConfig = {
    type: 'default',
    presetId: 'default',
    url: '',
    rawPath: '',
    cardId: '',
    overlay: 45,
    blur: 0
};

function loadStoredWallpaperConfig() {
    try {
        const stored = localStorage.getItem("fournity_chat_wallpaper");
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && typeof parsed === 'object') return parsed;
        }
    } catch(e) {}
    return { type: 'default', presetId: 'default', url: '', rawPath: '', cardId: '', overlay: 45, blur: 0 };
}

function applyWallpaperToElements(config, isPreview = false) {
    const bgNode = isPreview ? previewWallpaperBg : chatWallpaperImgNode;
    const overlayNode = isPreview ? previewWallpaperTint : chatWallpaperOverlayNode;
    if (!bgNode || !overlayNode) return;

    const overlayDecimal = (Number(config && config.overlay !== undefined ? config.overlay : 45)) / 100;
    const blurPx = Number(config && config.blur !== undefined ? config.blur : 0);

    overlayNode.style.backgroundColor = `rgba(11, 15, 25, ${overlayDecimal})`;
    bgNode.style.filter = `blur(${blurPx}px)`;

    let imageUrl = '';
    if (config && config.type === 'preset' && WALLPAPER_PRESET_MAP[config.presetId]) {
        imageUrl = WALLPAPER_PRESET_MAP[config.presetId];
    } else if (config && (config.type === 'custom' || config.type === 'url')) {
        imageUrl = config.url || config.rawPath || '';
    }

    if (imageUrl) {
        const finalUrl = formatCardImageForPage(imageUrl);
        bgNode.style.backgroundImage = `url("${finalUrl}")`;
    } else {
        bgNode.style.backgroundImage = '';
    }
}

function updateWallpaperModalUI(config) {
    if (!config) config = loadStoredWallpaperConfig();
    tempWallpaperConfig = { ...config };

    if (wallpaperOverlaySlider) {
        wallpaperOverlaySlider.value = config.overlay !== undefined ? config.overlay : 45;
        if (wallpaperOverlayValText) wallpaperOverlayValText.textContent = `${wallpaperOverlaySlider.value}%`;
    }
    if (wallpaperBlurSlider) {
        wallpaperBlurSlider.value = config.blur !== undefined ? config.blur : 0;
        if (wallpaperBlurValText) wallpaperBlurValText.textContent = `${wallpaperBlurSlider.value}px`;
    }
    if (wallpaperUrlInput) {
        wallpaperUrlInput.value = config.type === 'url' ? (config.url || '') : '';
    }

    wallpaperPresetCards.forEach(card => {
        const isMatch = (config.type === 'default' && card.dataset.wp === 'default') ||
                        (config.type === 'preset' && card.dataset.wp === config.presetId);
        card.classList.toggle("is-active", isMatch);
    });

    // Render Foto Card Milik Saya di Modal Wallpaper
    const fotocardGrid = document.getElementById("wallpaperFotocardGrid");
    const fotocardCountEl = document.getElementById("wallpaperFotocardCount");
    if (fotocardGrid) {
        fotocardGrid.innerHTML = "";
        let rawInstances = [];
        try {
            rawInstances = JSON.parse(localStorage.getItem("fournity_card_instances_v3") || "[]");
        } catch(e) {}

        if (fotocardCountEl) fotocardCountEl.textContent = `${rawInstances.length} Kartu`;

        if (rawInstances.length === 0) {
            fotocardGrid.innerHTML = `<div style="grid-column: 1/-1; font-size: 11px; color: var(--ios-system-gray); text-align: center; padding: 10px;">Belum memiliki Foto Card. Kumpulkan dari Check-In & Misi di Beranda!</div>`;
        } else {
            rawInstances.forEach(rawItem => {
                const item = resolveCardItemForChat(rawItem);
                const cardBtn = document.createElement("button");
                cardBtn.type = "button";
                cardBtn.className = "wallpaper-preset-card";
                
                const imgUrl = formatCardImageForPage(item.image);
                const isSelected = tempWallpaperConfig.type === 'custom' && (
                    tempWallpaperConfig.url === imgUrl || 
                    tempWallpaperConfig.url === item.image || 
                    tempWallpaperConfig.rawPath === item.image || 
                    (tempWallpaperConfig.cardId && tempWallpaperConfig.cardId === item.cardId) ||
                    tempWallpaperConfig.presetId === ('fotocard_' + (item.cardId || ''))
                );
                if (isSelected) cardBtn.classList.add("is-active");

                cardBtn.innerHTML = `
                    <div class="preset-thumb-preview" style="background-image: url('${imgUrl}'); background-size: cover; background-position: center;"></div>
                    <span class="preset-name">${item.serialNo || item.name || 'Card'}</span>
                `;

                cardBtn.addEventListener("click", () => {
                    document.querySelectorAll(".wallpaper-preset-card").forEach(c => c.classList.remove("is-active"));
                    cardBtn.classList.add("is-active");

                    tempWallpaperConfig.type = 'custom';
                    tempWallpaperConfig.presetId = 'fotocard_' + (item.cardId || 'custom');
                    tempWallpaperConfig.url = imgUrl;
                    tempWallpaperConfig.rawPath = item.image;
                    tempWallpaperConfig.cardId = item.cardId;
                    tempWallpaperConfig.cardName = item.name;
                    tempWallpaperConfig.serialNo = item.serialNo;
                    applyWallpaperToElements(tempWallpaperConfig, true);
                });

                fotocardGrid.appendChild(cardBtn);
            });
        }
    }

    applyWallpaperToElements(tempWallpaperConfig, true);
}

// Terapkan wallpaper saat load
const currentChatWallpaper = loadStoredWallpaperConfig();
applyWallpaperToElements(currentChatWallpaper, false);

// Sinkronkan wallpaper otomatis jika ada update dari tab lain / halaman beranda
window.addEventListener("storage", (e) => {
    if (!e.key || e.key === "fournity_chat_wallpaper") {
        applyWallpaperToElements(loadStoredWallpaperConfig(), false);
    }
});

if (openWallpaperModalBtn && chatWallpaperModal) {
    openWallpaperModalBtn.addEventListener("click", (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (chatMoreDropdown) chatMoreDropdown.style.display = "none";
        try {
            updateWallpaperModalUI(loadStoredWallpaperConfig());
        } catch (err) {
            console.error("Error updating wallpaper modal UI:", err);
        }
        chatWallpaperModal.style.display = "flex";
    });
}

if (closeWallpaperModalBtn && chatWallpaperModal) {
    closeWallpaperModalBtn.addEventListener("click", () => {
        chatWallpaperModal.style.display = "none";
    });
}

if (chatWallpaperModal) {
    chatWallpaperModal.addEventListener("click", (e) => {
        if (e.target === chatWallpaperModal) {
            chatWallpaperModal.style.display = "none";
        }
    });
}

// Preset klik
wallpaperPresetCards.forEach(card => {
    card.addEventListener("click", () => {
        document.querySelectorAll(".wallpaper-preset-card").forEach(c => c.classList.remove("is-active"));
        card.classList.add("is-active");

        const wpId = card.dataset.wp;
        if (wpId === 'default') {
            tempWallpaperConfig.type = 'default';
            tempWallpaperConfig.presetId = 'default';
            tempWallpaperConfig.url = '';
            tempWallpaperConfig.rawPath = '';
            tempWallpaperConfig.cardId = '';
        } else {
            tempWallpaperConfig.type = 'preset';
            tempWallpaperConfig.presetId = wpId;
            tempWallpaperConfig.url = WALLPAPER_PRESET_MAP[wpId] || '';
            tempWallpaperConfig.rawPath = '';
            tempWallpaperConfig.cardId = '';
        }
        applyWallpaperToElements(tempWallpaperConfig, true);
    });
});

// Slider overlay
if (wallpaperOverlaySlider) {
    wallpaperOverlaySlider.addEventListener("input", (e) => {
        tempWallpaperConfig.overlay = Number(e.target.value);
        if (wallpaperOverlayValText) wallpaperOverlayValText.textContent = `${tempWallpaperConfig.overlay}%`;
        applyWallpaperToElements(tempWallpaperConfig, true);
    });
}

// Slider blur
if (wallpaperBlurSlider) {
    wallpaperBlurSlider.addEventListener("input", (e) => {
        tempWallpaperConfig.blur = Number(e.target.value);
        if (wallpaperBlurValText) wallpaperBlurValText.textContent = `${tempWallpaperConfig.blur}px`;
        applyWallpaperToElements(tempWallpaperConfig, true);
    });
}

// Trigger unggah file gambar
if (triggerWallpaperUploadBtn && customWallpaperFileInput) {
    triggerWallpaperUploadBtn.addEventListener("click", () => {
        customWallpaperFileInput.click();
    });
}

if (customWallpaperFileInput) {
    customWallpaperFileInput.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Harap pilih file gambar (JPG, PNG, WEBP)!");
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const rawDataUrl = event.target.result;
            const img = new Image();
            img.onload = function() {
                const maxDim = 1280;
                let w = img.width;
                let h = img.height;
                if (w > maxDim || h > maxDim) {
                    if (w > h) {
                        h = Math.round((h * maxDim) / w);
                        w = maxDim;
                    } else {
                        w = Math.round((w * maxDim) / h);
                        h = maxDim;
                    }
                }
                const canvas = document.createElement("canvas");
                canvas.width = w;
                canvas.height = h;
                const cctx = canvas.getContext("2d");
                cctx.drawImage(img, 0, 0, w, h);
                const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.82);

                tempWallpaperConfig.type = 'custom';
                tempWallpaperConfig.presetId = 'custom';
                tempWallpaperConfig.url = compressedDataUrl;
                tempWallpaperConfig.rawPath = compressedDataUrl;
                tempWallpaperConfig.cardId = '';

                document.querySelectorAll(".wallpaper-preset-card").forEach(c => c.classList.remove("is-active"));
                applyWallpaperToElements(tempWallpaperConfig, true);
                if (typeof showChatToast === 'function') {
                    showChatToast("Foto berhasil dimuat ke pratinjau!", "📷");
                }
            };
            img.src = rawDataUrl;
        };
        reader.readAsDataURL(file);
    });
}

// URL Gambar
if (applyWallpaperUrlBtn && wallpaperUrlInput) {
    applyWallpaperUrlBtn.addEventListener("click", () => {
        const url = wallpaperUrlInput.value.trim();
        if (!url) {
            alert("Harap masukkan URL tautan gambar!");
            return;
        }
        tempWallpaperConfig.type = 'url';
        tempWallpaperConfig.presetId = 'url';
        tempWallpaperConfig.url = url;
        tempWallpaperConfig.rawPath = url;
        tempWallpaperConfig.cardId = '';

        document.querySelectorAll(".wallpaper-preset-card").forEach(c => c.classList.remove("is-active"));
        applyWallpaperToElements(tempWallpaperConfig, true);
        if (typeof showChatToast === 'function') {
            showChatToast("URL gambar diterapkan ke pratinjau!", "🔗");
        }
    });
}

// Simpan wallpaper
if (saveWallpaperBtn && chatWallpaperModal) {
    saveWallpaperBtn.addEventListener("click", () => {
        try {
            localStorage.setItem("fournity_chat_wallpaper", JSON.stringify(tempWallpaperConfig));
        } catch (err) {
            console.warn("Storage quota exceeded", err);
        }
        applyWallpaperToElements(tempWallpaperConfig, false);
        chatWallpaperModal.style.display = "none";
        if (typeof showChatToast === 'function') {
            showChatToast("Background chat berhasil diterapkan! ✨", "🖼️");
        }
    });
}

// Reset wallpaper ke default
if (resetWallpaperBtn && chatWallpaperModal) {
    resetWallpaperBtn.addEventListener("click", () => {
        localStorage.removeItem("fournity_chat_wallpaper");
        const defConfig = { type: 'default', presetId: 'default', url: '', rawPath: '', cardId: '', overlay: 45, blur: 0 };
        updateWallpaperModalUI(defConfig);
        applyWallpaperToElements(defConfig, false);
        chatWallpaperModal.style.display = "none";
        if (typeof showChatToast === 'function') {
            showChatToast("Background chat kembali ke default.", "🔄");
        }
    });
}

// --- B.2. MODAL PILIH FOTO PROFIL DARI KARTU KOLEKSI (VIP LAGEND) ---
const openCardAvatarModalBtn = document.getElementById("openCardAvatarModalBtn");
const cardAvatarModal = document.getElementById("cardAvatarModal");
const closeCardAvatarModalBtn = document.getElementById("closeCardAvatarModalBtn");
const closeCardAvatarDoneBtn = document.getElementById("closeCardAvatarDoneBtn");
const modalAvatarCardGrid = document.getElementById("modalAvatarCardGrid");
const modalAvatarCardCount = document.getElementById("modalAvatarCardCount");
const modalAvatarPreviewImg = document.getElementById("modalAvatarPreviewImg");
const modalAvatarPreviewWrapper = document.getElementById("modalAvatarPreviewWrapper");
const modalAvatarUserName = document.getElementById("modalAvatarUserName");
const modalAvatarStatusText = document.getElementById("modalAvatarStatusText");

function renderCardAvatarModalUI() {
    if (!cardAvatarModal) return;
    const currentAvatar = localStorage.getItem("fournity_user_avatar") || localStorage.getItem("avatar_" + currentUser);
    const currentRarity = localStorage.getItem("fournity_avatar_rarity") || localStorage.getItem("avatar_rarity_" + currentUser) || "";
    const currentSerial = localStorage.getItem("fournity_avatar_serial") || "";

    if (modalAvatarUserName) modalAvatarUserName.textContent = currentUser;

    if (modalAvatarPreviewImg) {
        if (currentAvatar) {
            let src = currentAvatar;
            if (!src.startsWith('../') && !src.startsWith('http') && !src.startsWith('data:')) {
                src = '../' + src;
            }
            modalAvatarPreviewImg.src = src;
        } else {
            modalAvatarPreviewImg.src = "../gambar/icon.png";
        }
    }

    if (modalAvatarPreviewWrapper) {
        modalAvatarPreviewWrapper.classList.remove("is-vip-legend", "is-avatar-ur", "is-avatar-rare");
        const existingBadge = modalAvatarPreviewWrapper.querySelector(".pass-vip-badge");
        if (existingBadge) existingBadge.remove();

        if (currentRarity === "legendary") {
            modalAvatarPreviewWrapper.classList.add("is-vip-legend");
            const b = document.createElement("span");
            b.className = "pass-vip-badge legend-vip";
            b.textContent = "👑 LAGEND VIP";
            modalAvatarPreviewWrapper.appendChild(b);
            if (modalAvatarStatusText) modalAvatarStatusText.innerHTML = `Status: <strong style="color: #FFB703;">👑 LAGEND VIP AKTIF</strong> (${currentSerial})`;
        } else if (currentRarity === "ultra_rare") {
            modalAvatarPreviewWrapper.classList.add("is-avatar-ur");
            const b = document.createElement("span");
            b.className = "pass-vip-badge ur-vip";
            b.textContent = "💜 UR";
            modalAvatarPreviewWrapper.appendChild(b);
            if (modalAvatarStatusText) modalAvatarStatusText.innerHTML = `Status: <strong style="color: #FFD166;">💜 ULTRA RARE</strong> (${currentSerial})`;
        } else if (currentRarity === "rare") {
            modalAvatarPreviewWrapper.classList.add("is-avatar-rare");
            const b = document.createElement("span");
            b.className = "pass-vip-badge rare-vip";
            b.textContent = "💎 RARE";
            modalAvatarPreviewWrapper.appendChild(b);
            if (modalAvatarStatusText) modalAvatarStatusText.innerHTML = `Status: <strong style="color: #00F5D4;">💎 RARE</strong> (${currentSerial})`;
        } else {
            if (modalAvatarStatusText) modalAvatarStatusText.textContent = "Status: Standar (Foto Profil Bawaan)";
        }
    }

    // Render daftar kartu yang dimiliki
    if (modalAvatarCardGrid) {
        modalAvatarCardGrid.innerHTML = "";
        let rawInstances = [];
        try {
            rawInstances = JSON.parse(localStorage.getItem("fournity_card_instances_v3") || "[]");
        } catch(e) {}

        if (modalAvatarCardCount) modalAvatarCardCount.textContent = `${rawInstances.length} Kartu`;

        if (rawInstances.length === 0) {
            modalAvatarCardGrid.innerHTML = `<div style="grid-column: 1/-1; font-size: 11px; color: var(--ios-system-gray); text-align: center; padding: 15px;">Belum memiliki Foto Card. Kumpulkan kartu dari Check-In Harian dan Misi Disiplin di Beranda!</div>`;
            return;
        }

        rawInstances.forEach(rawItem => {
            const item = resolveCardItemForChat(rawItem);
            const cardItem = document.createElement("div");
            cardItem.className = "card-avatar-pick-item";
            const imgUrl = formatCardImageForPage(item.image);
            const isEquipped = currentAvatar && (
                currentAvatar === item.image || 
                currentAvatar === imgUrl || 
                currentAvatar.includes(item.image) ||
                (item.cardId && currentAvatar.includes(item.cardId))
            );
            
            const rarityTag = item.rarity === "legendary" ? "👑 LAGEND" : (item.rarity === "ultra_rare" ? "💜 UR" : "💎 R");
            const borderCol = item.rarity === "legendary" ? "linear-gradient(135deg, #FF0055, #FFB703)" : (item.rarity === "ultra_rare" ? "linear-gradient(135deg, #7209B7, #FFD166)" : "linear-gradient(135deg, #00B4D8, #00F5D4)");

            cardItem.style.cssText = `
                position: relative;
                border-radius: 12px;
                padding: 3px;
                background: ${borderCol};
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
                text-align: center;
                box-shadow: ${item.rarity === "legendary" ? "0 0 10px rgba(255, 183, 3, 0.5)" : "0 2px 6px rgba(0,0,0,0.5)"};
            `;
            if (isEquipped) {
                cardItem.style.outline = "2px solid #FFD700";
            }

            cardItem.innerHTML = `
                <div style="width: 100%; height: 90px; border-radius: 10px; overflow: hidden; background: #000;">
                    <img src="${imgUrl}" alt="${item.name || 'Card'}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='../gambar/umaedi.png'">
                </div>
                <div style="font-size: 8.5px; font-weight: 800; color: #fff; margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.serialNo || item.name || 'Card'}</div>
                <div style="font-size: 7.5px; font-weight: 800; color: #FFD166;">${rarityTag}</div>
            `;

            cardItem.addEventListener("click", async () => {
                // Terapkan sebagai foto profil pengguna
                const cleanImg = item.image.replace(/^(\.\.\/|\.\/)+/, '');
                localStorage.setItem("fournity_user_avatar", cleanImg);
                localStorage.setItem("fournity_avatar_rarity", item.rarity);
                localStorage.setItem("fournity_avatar_card_id", item.cardId || '');
                localStorage.setItem("fournity_avatar_serial", item.serialNo || '');
                localStorage.setItem(`avatar_${currentUser}`, cleanImg);
                localStorage.setItem(`avatar_rarity_${currentUser}`, item.rarity);
                localStorage.setItem(`avatar_serial_${currentUser}`, item.serialNo || '');

                try {
                    let profiles = JSON.parse(localStorage.getItem("fournity_user_profiles") || "{}");
                    profiles[currentUser] = profiles[currentUser] || {};
                    profiles[currentUser].photoBase64 = cleanImg;
                    profiles[currentUser].avatarRarity = item.rarity;
                    profiles[currentUser].avatarSerial = item.serialNo || '';
                    localStorage.setItem("fournity_user_profiles", JSON.stringify(profiles));
                } catch(e) {}

                // Segera update in-memory window.userProfiles agar reaktif tanpa delay
                if (window.userProfiles && currentUser) {
                    window.userProfiles[currentUser] = window.userProfiles[currentUser] || {};
                    window.userProfiles[currentUser].displayName = currentUser;
                    window.userProfiles[currentUser].photoBase64 = cleanImg;
                    window.userProfiles[currentUser].avatar = cleanImg;
                    window.userProfiles[currentUser].avatarRarity = item.rarity;
                    window.userProfiles[currentUser].avatarSerial = item.serialNo || '';
                }

                // Sinkronkan ke cloud Firebase RTDB agar pengguna lain langsung melihat update real-time
                const currentUid = localStorage.getItem("nihongoChatUid");
                if (currentUid && db) {
                    try {
                        const updates = {};
                        updates[`users/${currentUid}/profile/avatar`] = cleanImg;
                        updates[`users/${currentUid}/profile/photoBase64`] = cleanImg;
                        updates[`users/${currentUid}/profile/avatarRarity`] = item.rarity;
                        updates[`users/${currentUid}/profile/avatarSerial`] = item.serialNo || '';
                        updates[`users/${currentUid}/profile/updatedAt`] = Date.now();
                        if (currentUser) {
                            updates[`user_profiles/${currentUser}/photoBase64`] = cleanImg;
                            updates[`user_profiles/${currentUser}/avatarRarity`] = item.rarity;
                            updates[`user_profiles/${currentUser}/avatarSerial`] = item.serialNo || '';
                        }
                        await update(ref(db), updates);
                    } catch(e) {
                        console.warn("Gagal update avatar kartu ke cloud:", e);
                    }
                }

                if (item.rarity === "legendary") {
                    if (typeof playZenSoundEffect === 'function') playZenSoundEffect('celebrate');
                    if (typeof showChatToast === 'function') showChatToast("👑 Efek VIP Lagend Diaktifkan!", "✨");
                } else {
                    if (typeof playZenSoundEffect === 'function') playZenSoundEffect('receive');
                    if (typeof showChatToast === 'function') showChatToast("Foto profil diperbarui!", "✅");
                }

                renderCardAvatarModalUI();
                updateAllRenderedChatAvatars();
                window.dispatchEvent(new Event("profilesUpdated"));
                window.dispatchEvent(new Event("storage"));
            });

            modalAvatarCardGrid.appendChild(cardItem);
        });
    }
}

// Handler Reset Avatar ke Default di Modal Chat
const resetCardAvatarBtn = document.getElementById("resetCardAvatarBtn");
if (resetCardAvatarBtn) {
    resetCardAvatarBtn.addEventListener("click", async () => {
        localStorage.removeItem("fournity_user_avatar");
        localStorage.removeItem("fournity_custom_avatar");
        localStorage.removeItem("fournity_avatar_rarity");
        localStorage.removeItem("fournity_avatar_card_id");
        localStorage.removeItem("fournity_avatar_serial");
        if (currentUser) {
            localStorage.removeItem(`avatar_${currentUser}`);
            localStorage.removeItem(`avatar_rarity_${currentUser}`);
            localStorage.removeItem(`avatar_serial_${currentUser}`);
        }

        try {
            let profiles = JSON.parse(localStorage.getItem("fournity_user_profiles") || "{}");
            if (profiles[currentUser]) {
                profiles[currentUser].photoBase64 = "";
                profiles[currentUser].avatarRarity = "";
                profiles[currentUser].avatarSerial = "";
                localStorage.setItem("fournity_user_profiles", JSON.stringify(profiles));
            }
        } catch(e) {}

        // Segera kosongkan in-memory window.userProfiles
        if (window.userProfiles && currentUser && window.userProfiles[currentUser]) {
            window.userProfiles[currentUser].photoBase64 = "";
            window.userProfiles[currentUser].avatar = "";
            window.userProfiles[currentUser].avatarRarity = "";
            window.userProfiles[currentUser].avatarSerial = "";
        }

        const currentUid = localStorage.getItem("nihongoChatUid");
        if (currentUid && db) {
            try {
                const updates = {};
                updates[`users/${currentUid}/profile/avatar`] = "";
                updates[`users/${currentUid}/profile/photoBase64`] = "";
                updates[`users/${currentUid}/profile/avatarRarity`] = "";
                updates[`users/${currentUid}/profile/avatarSerial`] = "";
                updates[`users/${currentUid}/profile/updatedAt`] = Date.now();
                if (currentUser) {
                    updates[`user_profiles/${currentUser}/photoBase64`] = "";
                    updates[`user_profiles/${currentUser}/avatarRarity`] = "";
                    updates[`user_profiles/${currentUser}/avatarSerial`] = "";
                }
                await update(ref(db), updates);
            } catch(e) {
                console.warn("Gagal update reset profil ke server:", e);
            }
        }

        if (typeof playZenSoundEffect === 'function') playZenSoundEffect('receive');
        if (typeof showChatToast === 'function') showChatToast("Foto profil dikembalikan ke default!", "🔄");

        renderCardAvatarModalUI();
        updateAllRenderedChatAvatars();
        window.dispatchEvent(new Event("profilesUpdated"));
        window.dispatchEvent(new Event("storage"));
    });
}

if (openCardAvatarModalBtn && cardAvatarModal) {
    openCardAvatarModalBtn.addEventListener("click", (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (chatMoreDropdown) chatMoreDropdown.style.display = "none";
        try {
            renderCardAvatarModalUI();
        } catch(err) {
            console.error("Error rendering card avatar modal UI:", err);
        }
        cardAvatarModal.style.display = "flex";
    });
}

if (closeCardAvatarModalBtn && cardAvatarModal) {
    closeCardAvatarModalBtn.addEventListener("click", () => {
        cardAvatarModal.style.display = "none";
    });
}

if (closeCardAvatarDoneBtn && cardAvatarModal) {
    closeCardAvatarDoneBtn.addEventListener("click", () => {
        cardAvatarModal.style.display = "none";
    });
}

if (cardAvatarModal) {
    cardAvatarModal.addEventListener("click", (e) => {
        if (e.target === cardAvatarModal) {
            cardAvatarModal.style.display = "none";
        }
    });
}

// --- C. PENGATURAN SUARA NOTIFIKASI PESAN MASUK & KIRIM ---
const chatSoundSettingsModal = document.getElementById("chatSoundSettingsModal");
const closeSoundModalBtn = document.getElementById("closeSoundModalBtn");
const closeSoundModalDoneBtn = document.getElementById("closeSoundModalDoneBtn");

const tabSoundReceive = document.getElementById("tabSoundReceive");
const tabSoundSend = document.getElementById("tabSoundSend");
const soundTabPaneReceive = document.getElementById("soundTabPaneReceive");
const soundTabPaneSend = document.getElementById("soundTabPaneSend");

const receiveSoundToggle = document.getElementById("receiveSoundToggle");
const sendSoundToggle = document.getElementById("sendSoundToggle");

const receiveSoundCards = document.querySelectorAll("#receiveSoundList .sound-option-card");
const sendSoundCards = document.querySelectorAll("#sendSoundList .sound-option-card");
const testSoundBtns = document.querySelectorAll(".test-sound-btn");

function initSoundSettingsUI() {
    const isReceiveEnabled = localStorage.getItem("fournity_receive_sound_enabled") !== "false";
    const isSendEnabled = localStorage.getItem("fournity_send_sound_enabled") !== "false";
    const currentReceiveTone = localStorage.getItem("fournity_receive_sound") || "chime_duo";
    const currentSendTone = localStorage.getItem("fournity_send_sound") || "swoosh";

    if (receiveSoundToggle) receiveSoundToggle.checked = isReceiveEnabled;
    if (sendSoundToggle) sendSoundToggle.checked = isSendEnabled;

    receiveSoundCards.forEach(card => {
        card.classList.toggle("is-selected", card.dataset.soundId === currentReceiveTone);
    });

    sendSoundCards.forEach(card => {
        card.classList.toggle("is-selected", card.dataset.soundId === currentSendTone);
    });
}

if (openSoundModalBtn && chatSoundSettingsModal) {
    openSoundModalBtn.addEventListener("click", () => {
        initSoundSettingsUI();
        chatSoundSettingsModal.style.display = "flex";
    });
}

if (closeSoundModalBtn && chatSoundSettingsModal) {
    closeSoundModalBtn.addEventListener("click", () => {
        chatSoundSettingsModal.style.display = "none";
    });
}

if (closeSoundModalDoneBtn && chatSoundSettingsModal) {
    closeSoundModalDoneBtn.addEventListener("click", () => {
        chatSoundSettingsModal.style.display = "none";
        if (typeof showChatToast === 'function') {
            showChatToast("Pengaturan suara tersimpan!", "🔔");
        }
    });
}

// Tab navigation modal suara
if (tabSoundReceive && tabSoundSend && soundTabPaneReceive && soundTabPaneSend) {
    tabSoundReceive.addEventListener("click", () => {
        tabSoundReceive.classList.add("is-active");
        tabSoundSend.classList.remove("is-active");
        soundTabPaneReceive.style.display = "block";
        soundTabPaneSend.style.display = "none";
    });

    tabSoundSend.addEventListener("click", () => {
        tabSoundSend.classList.add("is-active");
        tabSoundReceive.classList.remove("is-active");
        soundTabPaneSend.style.display = "block";
        soundTabPaneReceive.style.display = "none";
    });
}

// Toggles
if (receiveSoundToggle) {
    receiveSoundToggle.addEventListener("change", (e) => {
        localStorage.setItem("fournity_receive_sound_enabled", e.target.checked ? "true" : "false");
    });
}

if (sendSoundToggle) {
    sendSoundToggle.addEventListener("change", (e) => {
        localStorage.setItem("fournity_send_sound_enabled", e.target.checked ? "true" : "false");
    });
}

// Pilihan nada terima
receiveSoundCards.forEach(card => {
    card.addEventListener("click", (e) => {
        if (e.target.classList.contains("test-sound-btn")) return;
        receiveSoundCards.forEach(c => c.classList.remove("is-selected"));
        card.classList.add("is-selected");
        const toneId = card.dataset.soundId;
        localStorage.setItem("fournity_receive_sound", toneId);
        if (typeof window.testChatSoundEffect === 'function') {
            window.testChatSoundEffect('receive', toneId);
        }
    });
});

// Pilihan nada kirim
sendSoundCards.forEach(card => {
    card.addEventListener("click", (e) => {
        if (e.target.classList.contains("test-sound-btn")) return;
        sendSoundCards.forEach(c => c.classList.remove("is-selected"));
        card.classList.add("is-selected");
        const toneId = card.dataset.soundId;
        localStorage.setItem("fournity_send_sound", toneId);
        if (typeof window.testChatSoundEffect === 'function') {
            window.testChatSoundEffect('send', toneId);
        }
    });
});

// Tombol [▶ Tes] suara
testSoundBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const pType = btn.dataset.previewType;
        const pId = btn.dataset.previewId;
        if (typeof window.testChatSoundEffect === 'function') {
            window.testChatSoundEffect(pType, pId);
        }
    });
});

// Tutup modal ketika tombol Escape ditekan
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        if (chatMoreDropdown && chatMoreDropdown.style.display === "block") {
            toggleChatMoreDropdown(false);
        }
        if (chatWallpaperModal && chatWallpaperModal.style.display === "flex") {
            chatWallpaperModal.style.display = "none";
        }
        if (chatSoundSettingsModal && chatSoundSettingsModal.style.display === "flex") {
            chatSoundSettingsModal.style.display = "none";
        }
        if (photoSendPreviewModal && photoSendPreviewModal.style.display === "flex") {
            closePhotoSendPreview();
        }
        if (imageLightboxOverlay && imageLightboxOverlay.style.display === "flex") {
            imageLightboxOverlay.style.display = "none";
        }
    }
});