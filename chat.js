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
let currentUser = localStorage.getItem(sessionKey);
if (!currentUser) {
    currentUser = "Gakusei_" + Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem(sessionKey, currentUser);
}

const coreMembers = ["umaedi", "iqbal", "rifki", "fasya"];
const isCore = currentUser && coreMembers.includes(currentUser.toLowerCase());

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

            if (roomType === "core" && !isCore) {
                if (lastMsgEl) lastMsgEl.textContent = "🔒 Ruang privat khusus tim pengembang & founder.";
                if (badgeEl) badgeEl.style.display = "none";
                return;
            }

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
// MODAL PERINGATAN AKSES KHUSUS PENGEMBANG / TIM
// ==========================================
const coreAccessDeniedModal = document.getElementById("coreAccessDeniedModal");
const closeDeniedModalBtn = document.getElementById("closeDeniedModalBtn");

function showCoreAccessDeniedModal() {
    if (coreAccessDeniedModal) {
        coreAccessDeniedModal.style.display = "flex";
    } else {
        alert("🔒 AKSES DITOLAK\n\nMohon maaf, Anda tidak diperbolehkan masuk ke ruangan ini.\nRuang obrolan privat ini dibatasi secara ketat khusus untuk Founders & Tim Pengembang (Developers) Nihongo Trinity.");
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
// SWITCH ROOM (PUBLIC / SENSEI / CORE)
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
        if(onlineCountText) onlineCountText.innerHTML = `<span style="color:#FF758C; font-weight:600;">🌸 Aoi Sensei Online • Siap Menjawab 24 Jam</span>`;
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

    const dbRefName = type === "core" ? "messages" : "messages_public";
    const typingRefName = type === "core" ? "typing_core" : "typing_public";

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
        return `Watashi wa Aoi Sensei desu (私は葵先生です 🌸).\n\nSaya adalah asisten tutor bahasa Jepang pribadi untuk sahabat-sahabat pelajar di **Nihongo Trinity**!\n\nSaya siap membimbingmu belajar:\n1. Huruf **Hiragana & Katakana**\n2. Bedah **Kanji** (arti, guratan, on'yomi & kun'yomi)\n3. Tata bahasa (**Bunpou**) & rahasia partikel\n4. Kosakata percakapan sehari-hari & anime\n\nDouzo yoroshiku onegaishimasu! (Mohon bantuannya ya!) ✨`;
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
    msgDiv.id = "msg_" + msgKey;
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
    msgDiv.appendChild(menuContainer);

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

    msgDiv.append(headerDiv, contentDiv);
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
        chatInput.value = "";
        autoResizeInput();
        cancelReply();
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
        return;
    }

    const dbRefName = currentRoom === "core" ? "messages" : "messages_public";
    const chatRef = ref(db, dbRefName);
    let payload = { name: currentUser, message: text, timestamp: Date.now() };
    if (activeReplyData) payload.replyTo = activeReplyData;
    
    push(chatRef, payload);
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
    updateHeaderUserDisplay();
});

// Update status user & switcher
function updateHeaderUserDisplay() {
    const statusEl = document.getElementById("chatUserStatusText");
    const labelEl = document.getElementById("switchUserBtnLabel");
    if (!currentUser) return;
    
    const profile = window.userProfiles ? (window.userProfiles[currentUser] || {}) : {};
    const dName = profile.displayName || currentUser;
    const isCoreUser = coreMembers.includes(currentUser.toLowerCase());
    
    if (statusEl) {
        if (currentUser.toLowerCase() === "umaedi") {
            statusEl.innerHTML = `Login: <strong style="color: #FF6584;">${dName} (👑 Founder)</strong>`;
        } else if (isCoreUser) {
            statusEl.innerHTML = `Login: <strong style="color: #D4AF37;">${dName} (⭐ Core)</strong>`;
        } else {
            statusEl.innerHTML = `Login: <strong style="color: #4CAF50;">${dName}</strong>`;
        }
    }
    if (labelEl) {
        labelEl.textContent = dName.length > 10 ? dName.slice(0, 8) + '..' : dName;
    }
}

const switchUserBtn = document.getElementById("switchUserBtn");
if (switchUserBtn) {
    switchUserBtn.addEventListener("click", () => {
        const action = prompt(
            `👤 PENGATURAN IDENTITAS / LOGIN\n\nSaat ini Anda login sebagai: "${currentUser}"\n\n` +
            `• Masukkan nama baru untuk mengganti nama tampilan\n` +
            `• Atau masukkan kode akses Core (UMAEDI2026, IQBAL2026, RIFKI2026, FASYA2026) untuk login sebagai tim inti / founder:\n`
        );
        if (!action || !action.trim()) return;
        const val = action.trim();
        const accountCodes = { "Umaedi": "UMAEDI2026", "Iqbal": "IQBAL2026", "Rifki": "RIFKI2026", "Fasya": "FASYA2026" };
        const found = Object.keys(accountCodes).find(k => accountCodes[k] === val.toUpperCase() || k.toLowerCase() === val.toLowerCase());
        if (found) {
            localStorage.setItem(sessionKey, found);
            alert(`✨ Berhasil login sebagai ${found}!`);
        } else {
            localStorage.setItem(sessionKey, val);
            alert(`✨ Nama berhasil diubah menjadi "${val}".`);
        }
        window.location.reload();
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