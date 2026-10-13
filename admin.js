import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, query, limitToLast, onValue, set, get, child, remove, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    updateProfile 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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
const auth = getAuth(app);
const announceRef = ref(db, "announcements");

// Ekspos global helper untuk System Health & Diagnostics Radar & Card Gifts
window.db = db;
window.firebaseAuth = auth;
window.auth = auth;
window.firebaseDb = db;
window.firebaseRef = ref;
window.firebaseGet = get;
window.firebaseSet = set;
window.firebaseUpdate = update;
window.firebasePush = push;
window.firebaseRemove = remove;
window.firebaseChild = child;
window.firebaseOnValue = onValue;
window.firebaseConfig = firebaseConfig;

let currentUid = localStorage.getItem("nihongoChatUid");
let currentEmail = localStorage.getItem("nihongoChatEmail");
let currentUser = localStorage.getItem("nihongoChatUser");

// Auto-reset akun sistem lama (Iqbal, Fasya, Rifki, Umaedi) jika tidak memiliki sesi Firebase Auth yang sah
const legacyMockUsers = ["umaedi", "iqbal", "rifki", "fasya"];
if (!currentUid && currentUser && (legacyMockUsers.includes(currentUser.toLowerCase()) || currentUser.startsWith("Gakusei_"))) {
    clearUserSessionData();
    currentUser = null;
    currentUid = null;
    currentEmail = null;
}

// ==========================================
// 1. HELPER SINKRONISASI DATA PER-AKUN (ISOLASI USER)
// ==========================================

function clearUserSessionData() {
    localStorage.removeItem("nihongoChatUid");
    localStorage.removeItem("nihongoChatEmail");
    localStorage.removeItem("nihongoChatUser");
    localStorage.removeItem("fournity_card_instances_v3");
    localStorage.removeItem("fournity_unlocked_cards");
    localStorage.removeItem("fournity_user_avatar");
    localStorage.removeItem("fournity_avatar_rarity");
    localStorage.removeItem("fournity_avatar_serial");
    localStorage.removeItem("fournity_checkin_v2");
    localStorage.removeItem("trinity_exp");
    localStorage.removeItem("fournity_quest_bonus_exp");
    localStorage.removeItem("fournity_checkin_exp");
    localStorage.removeItem("fournity_chat_wallpaper");
}

async function initNewUserInCloud(uid, displayName, email) {
    const initialUserData = {
        profile: {
            displayName: displayName,
            email: email,
            avatar: "",
            avatarRarity: "",
            avatarSerial: "",
            photoBase64: "",
            createdAt: Date.now()
        },
        inventory: {
            card_instances: [],
            unlocked_cards: []
        },
        progress: {
            exp: 80,
            quest_bonus_exp: 0,
            checkin_exp: 0,
            memorized_kanji: []
        },
        checkin: {
            streak: 0,
            lastDate: "",
            total: 0
        },
        settings: {
            chat_wallpaper: null
        }
    };

    await set(ref(db, `users/${uid}`), initialUserData);
    await set(ref(db, `user_profiles/${displayName}`), {
        displayName: displayName,
        photoBase64: "",
        uid: uid
    });

    localStorage.setItem("fournity_card_instances_v3", "[]");
    localStorage.setItem("fournity_unlocked_cards", "[]");
    localStorage.setItem("trinity_exp", "80");
    localStorage.setItem("fournity_quest_bonus_exp", "0");
    localStorage.setItem("fournity_checkin_exp", "0");
    localStorage.setItem("fournity_checkin_v2", JSON.stringify({ streak: 0, lastDate: "", total: 0 }));
    localStorage.removeItem("fournity_user_avatar");
    localStorage.removeItem("fournity_avatar_rarity");
    localStorage.removeItem("fournity_avatar_serial");
}

async function loadUserDataFromCloud(user) {
    if (!user) return;
    const uid = user.uid;
    const displayName = user.displayName || user.email.split("@")[0];

    try {
        const snap = await get(child(ref(db), `users/${uid}`));
        if (snap.exists()) {
            const data = snap.val();

            // Reset awal bersih agar kartu awal 0 (belum memiliki fotocard)
            const isUserResetClean = localStorage.getItem("fournity_cloud_reset_" + uid);
            if (!isUserResetClean) {
                await update(ref(db), {
                    [`users/${uid}/inventory/card_instances`]: [],
                    [`users/${uid}/inventory/unlocked_cards`]: [],
                    [`users/${uid}/profile/avatar`]: "",
                    [`users/${uid}/profile/avatarRarity`]: "",
                    [`users/${uid}/profile/avatarSerial`]: "",
                    [`user_profiles/${displayName}/avatarRarity`]: ""
                });
                localStorage.setItem("fournity_cloud_reset_" + uid, "true");
                localStorage.setItem("fournity_card_instances_v3", "[]");
                localStorage.setItem("fournity_unlocked_cards", "[]");
                localStorage.removeItem("fournity_user_avatar");
                localStorage.removeItem("fournity_avatar_rarity");
                localStorage.removeItem("fournity_avatar_serial");
                localStorage.removeItem(`avatar_${displayName}`);
                localStorage.removeItem(`avatar_rarity_${displayName}`);
                localStorage.removeItem(`avatar_serial_${displayName}`);
                return;
            }

            // 1. Inventory Fotocard (ISOLATED PER USER)
            if (data.inventory?.card_instances && Array.isArray(data.inventory.card_instances)) {
                localStorage.setItem("fournity_card_instances_v3", JSON.stringify(data.inventory.card_instances));
                localStorage.setItem("fournity_unlocked_cards", JSON.stringify(data.inventory.unlocked_cards || []));
            } else {
                localStorage.setItem("fournity_card_instances_v3", "[]");
                localStorage.setItem("fournity_unlocked_cards", "[]");
            }

            // 2. Avatar & Efek Profil
            if (data.profile?.avatar) {
                localStorage.setItem("fournity_user_avatar", data.profile.avatar);
                localStorage.setItem("fournity_avatar_rarity", data.profile.avatarRarity || "");
                localStorage.setItem("fournity_avatar_serial", data.profile.avatarSerial || "");
                localStorage.setItem(`avatar_${displayName}`, data.profile.avatar);
                localStorage.setItem(`avatar_rarity_${displayName}`, data.profile.avatarRarity || "");
                localStorage.setItem(`avatar_serial_${displayName}`, data.profile.avatarSerial || "");
            } else {
                localStorage.removeItem("fournity_user_avatar");
                localStorage.removeItem("fournity_avatar_rarity");
                localStorage.removeItem("fournity_avatar_serial");
            }

            // 3. Progres EXP & Misi
            if (data.progress) {
                localStorage.setItem("trinity_exp", typeof data.progress.exp !== 'undefined' ? data.progress.exp : 80);
                localStorage.setItem("fournity_quest_bonus_exp", data.progress.quest_bonus_exp || 0);

                // Pertahankan checkin_exp lokal jika pengguna baru saja klaim checkin hari ini
                const localCheckinExp = Number(localStorage.getItem("fournity_checkin_exp") || 0);
                const cloudCheckinExp = Number(data.progress.checkin_exp || 0);
                localStorage.setItem("fournity_checkin_exp", Math.max(localCheckinExp, cloudCheckinExp));

                if (data.progress.memorized_kanji) {
                    localStorage.setItem("trinity_memorized_kanji", JSON.stringify(data.progress.memorized_kanji));
                }
            }

            // 4. Checkin Streak (Proteksi Anti-Overwrite Saat Refresh)
            if (data.checkin) {
                const localCheckin = JSON.parse(localStorage.getItem("fournity_checkin_v2") || "{}");
                const todayStr = (typeof window.getLocalDateString === 'function')
                    ? window.getLocalDateString()
                    : (() => {
                        const d = new Date();
                        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                    })();

                if (localCheckin.lastDate === todayStr && data.checkin.lastDate !== todayStr) {
                    if (typeof window.syncUserDataToCloud === 'function') {
                        window.syncUserDataToCloud('checkin');
                        window.syncUserDataToCloud('progress');
                    }
                } else {
                    localStorage.setItem("fournity_checkin_v2", JSON.stringify(data.checkin));
                }
            }

            // 5. Chat Wallpaper
            if (data.settings?.chat_wallpaper) {
                localStorage.setItem("fournity_chat_wallpaper", JSON.stringify(data.settings.chat_wallpaper));
            } else {
                localStorage.removeItem("fournity_chat_wallpaper");
            }
        } else {
            // Belum ada data di users/${uid} -> inisialisasi starter pack baru
            await initNewUserInCloud(uid, displayName, user.email);
        }
    } catch(err) {
        console.warn("Gagal membaca profil cloud user:", err);
    }
}

let pendingSyncSections = new Set();
let syncDebounceTimer = null;
window.syncUserDataToCloud = async function(section = 'all') {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;
    const displayName = auth.currentUser.displayName || localStorage.getItem("nihongoChatUser") || "Gakusei";
    const email = auth.currentUser.email || "";

    if (section === 'all') {
        pendingSyncSections.add('all');
    } else {
        pendingSyncSections.add(section);
    }

    const doSync = async () => {
        const sectionsToSync = new Set(pendingSyncSections);
        pendingSyncSections.clear();
        try {
            const updates = {};
            const syncAll = sectionsToSync.has('all');
            if (syncAll || sectionsToSync.has('inventory')) {
                const instances = JSON.parse(localStorage.getItem("fournity_card_instances_v3") || "[]");
                const unlocked = JSON.parse(localStorage.getItem("fournity_unlocked_cards") || "[]");
                updates[`users/${uid}/inventory`] = {
                    card_instances: instances,
                    unlocked_cards: unlocked,
                    updatedAt: Date.now()
                };
            }
            if (syncAll || sectionsToSync.has('profile') || sectionsToSync.has('avatar')) {
                const avatar = localStorage.getItem("fournity_user_avatar") || "";
                const avatarRarity = localStorage.getItem("fournity_avatar_rarity") || "";
                const avatarSerial = localStorage.getItem("fournity_avatar_serial") || "";
                const cleanAvatar = avatar ? avatar.replace(/^(\.\.\/|\.\/)+/, '') : "";

                updates[`users/${uid}/profile/avatar`] = cleanAvatar;
                updates[`users/${uid}/profile/photoBase64`] = cleanAvatar;
                updates[`users/${uid}/profile/avatarRarity`] = avatarRarity;
                updates[`users/${uid}/profile/avatarSerial`] = avatarSerial;
                updates[`users/${uid}/profile/displayName`] = displayName;
                updates[`users/${uid}/profile/email`] = email;
                updates[`users/${uid}/profile/updatedAt`] = Date.now();

                // Sinkronkan juga ke user_profiles publik
                updates[`user_profiles/${displayName}/displayName`] = displayName;
                updates[`user_profiles/${displayName}/avatarRarity`] = avatarRarity;
                updates[`user_profiles/${displayName}/avatarSerial`] = avatarSerial;
                updates[`user_profiles/${displayName}/photoBase64`] = cleanAvatar;

                if (window.userProfiles && window.userProfiles[displayName]) {
                    window.userProfiles[displayName].photoBase64 = cleanAvatar;
                    window.userProfiles[displayName].avatarRarity = avatarRarity;
                    window.userProfiles[displayName].avatarSerial = avatarSerial;
                }
            }

            if (syncAll || sectionsToSync.has('checkin')) {
                const checkin = JSON.parse(localStorage.getItem("fournity_checkin_v2") || "{}");
                updates[`users/${uid}/checkin`] = checkin;
            }

            if (syncAll || sectionsToSync.has('progress')) {
                updates[`users/${uid}/progress`] = {
                    exp: Number(localStorage.getItem("trinity_exp") || 80),
                    quest_bonus_exp: Number(localStorage.getItem("fournity_quest_bonus_exp") || 0),
                    checkin_exp: Number(localStorage.getItem("fournity_checkin_exp") || 0),
                    memorized_kanji: JSON.parse(localStorage.getItem("trinity_memorized_kanji") || "[]"),
                    updatedAt: Date.now()
                };
            }

            if (syncAll || sectionsToSync.has('wallpaper')) {
                const wp = JSON.parse(localStorage.getItem("fournity_chat_wallpaper") || "null");
                updates[`users/${uid}/settings/chat_wallpaper`] = wp;
            }

            await update(ref(db), updates);
        } catch(e) {
            console.warn("Gagal sinkronisasi cloud:", e);
        }
    };

    clearTimeout(syncDebounceTimer);
    syncDebounceTimer = setTimeout(doSync, 250);
};

// ==========================================
// 2. SISTEM LOGIN & REGISTER (FIREBASE AUTH)
// ==========================================
const globalLoginOverlay = document.getElementById("globalLoginOverlay");
if (globalLoginOverlay) {
    const guestPromptPopup = document.getElementById("guestPromptPopup");
    const topLoginToggle = document.getElementById("topLoginToggle");
    const closeLoginModal = document.getElementById("closeLoginModal");
    
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const showRegisterBtn = document.getElementById("showRegisterBtn");
    const showLoginBtn = document.getElementById("showLoginBtn");
    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");

    if (showRegisterBtn && showLoginBtn) {
        showRegisterBtn.addEventListener("click", () => {
            loginForm.style.display = "none";
            registerForm.style.display = "block";
            modalTitle.textContent = "Buat Akun Baru";
            modalDesc.textContent = "Daftarkan dirimu dengan email untuk bergabung dengan Nihongo Fournity.";
        });
        showLoginBtn.addEventListener("click", () => {
            registerForm.style.display = "none";
            loginForm.style.display = "block";
            modalTitle.textContent = "Identifikasi Member";
            modalDesc.textContent = "Silakan masuk menggunakan email untuk mengakses pusat kontrol.";
        });
    }

    const isGuestPromptDismissed = localStorage.getItem("guestPromptDismissed"); 
    if (!currentUser && !isGuestPromptDismissed && guestPromptPopup) guestPromptPopup.style.display = "flex";

    const btnPromptNanti = document.getElementById("btnPromptNanti");
    if (btnPromptNanti) btnPromptNanti.addEventListener("click", () => {
        guestPromptPopup.style.display = "none";
        localStorage.setItem("guestPromptDismissed", "true"); 
    });

    const btnPromptLogin = document.getElementById("btnPromptLogin");
    if (btnPromptLogin) btnPromptLogin.addEventListener("click", () => {
        guestPromptPopup.style.display = "none";
        globalLoginOverlay.style.display = "flex"; 
        localStorage.setItem("guestPromptDismissed", "true"); 
    });

    if (topLoginToggle) {
        topLoginToggle.addEventListener("click", () => {
            if (auth.currentUser || currentUser) document.getElementById("profileModalOverlay").style.display = "flex";
            else {
                globalLoginOverlay.style.display = "flex";
                if(guestPromptPopup) guestPromptPopup.style.display = "none";
            }
        });
    }

    if (closeLoginModal) closeLoginModal.addEventListener("click", () => globalLoginOverlay.style.display = "none");

    // PROSES REGISTER FIREBASE AUTH
    const mainRegBtn = document.getElementById("mainRegBtn");
    if (mainRegBtn) {
        const processReg = async () => {
            const userRaw = document.getElementById("regUsername")?.value.trim() || "";
            const email = document.getElementById("regEmail")?.value.trim() || "";
            const pass = document.getElementById("regPassword")?.value.trim() || "";
            const regError = document.getElementById("regError");
            if (regError) regError.textContent = "";
            
            if (!userRaw || !email || !pass) {
                if (regError) regError.textContent = "Semua kolom wajib diisi!";
                return;
            }
            if (userRaw.length < 3) {
                if (regError) regError.textContent = "Nama minimal 3 karakter!";
                return;
            }
            if (pass.length < 6) {
                if (regError) regError.textContent = "Kata sandi minimal 6 karakter (ketentuan Firebase Auth)!";
                return;
            }
            if (!email.includes("@") || !email.includes(".")) {
                if (regError) regError.textContent = "Format email tidak valid!";
                return;
            }
            
            mainRegBtn.textContent = "MEMBUAT AKUN...";
            mainRegBtn.disabled = true;

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
                const user = userCredential.user;
                await updateProfile(user, { displayName: userRaw });
                await initNewUserInCloud(user.uid, userRaw, email);
                
                if (globalLoginOverlay) globalLoginOverlay.style.display = "none";
                if (typeof window.showToast === 'function') window.showToast(`🌸 Akun berhasil didaftarkan! Selamat datang, ${userRaw}!`);
                window.location.reload();
            } catch(err) {
                mainRegBtn.textContent = "DAFTAR AKUN BARU";
                mainRegBtn.disabled = false;
                let msg = "Gagal mendaftar: " + err.message;
                if (err.code === "auth/email-already-in-use") {
                    msg = "Email ini sudah terdaftar! Silakan login di tab Masuk.";
                } else if (err.code === "auth/invalid-email") {
                    msg = "Format email tidak valid!";
                } else if (err.code === "auth/weak-password") {
                    msg = "Kata sandi terlalu pendek (minimal 6 karakter)!";
                } else if (err.code === "auth/operation-not-allowed") {
                    msg = "Layanan Email/Password belum diaktifkan di Firebase Console!";
                }
                if (regError) regError.textContent = msg;
            }
        };
        mainRegBtn.addEventListener("click", processReg);
        document.getElementById("regPassword")?.addEventListener("keypress", (e) => { if (e.key === "Enter") processReg(); });
    }

    // PROSES LOGIN FIREBASE AUTH
    const mainLoginBtn = document.getElementById("mainLoginBtn");
    if (mainLoginBtn) {
        const processLogin = async () => {
            const emailInput = document.getElementById("loginEmail") || document.getElementById("loginUsername");
            const emailOrUser = emailInput ? emailInput.value.trim() : "";
            const pass = document.getElementById("loginPassword")?.value.trim() || "";
            const loginError = document.getElementById("loginError");
            if (loginError) loginError.textContent = "";
            
            if (!emailOrUser || !pass) {
                if (loginError) loginError.textContent = "Isi alamat email dan kata sandi Anda.";
                return;
            }

            mainLoginBtn.textContent = "MEMERIKSA...";
            mainLoginBtn.disabled = true;

            let targetEmail = emailOrUser;
            if (!targetEmail.includes("@")) {
                if (loginError) loginError.textContent = "Silakan gunakan alamat email terdaftar Anda (contoh: nama@gmail.com).";
                mainLoginBtn.textContent = "MASUK DENGAN EMAIL";
                mainLoginBtn.disabled = false;
                return;
            }

            try {
                await signInWithEmailAndPassword(auth, targetEmail, pass);
                if (globalLoginOverlay) globalLoginOverlay.style.display = "none";
                if (typeof window.showToast === 'function') window.showToast("🌸 Berhasil masuk!");
                window.location.reload();
            } catch(err) {
                mainLoginBtn.textContent = "MASUK DENGAN EMAIL";
                mainLoginBtn.disabled = false;
                let msg = "Gagal masuk: " + err.message;
                if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
                    msg = "Alamat email atau kata sandi salah!";
                } else if (err.code === "auth/invalid-email") {
                    msg = "Format email tidak valid!";
                } else if (err.code === "auth/too-many-requests") {
                    msg = "Terlalu banyak percobaan gagal. Silakan tunggu beberapa saat.";
                } else if (err.code === "auth/operation-not-allowed") {
                    msg = "Layanan Email/Password belum diaktifkan di Firebase Console!";
                }
                if (loginError) loginError.textContent = msg;
            }
        };
        mainLoginBtn.addEventListener("click", processLogin);
        document.getElementById("loginPassword")?.addEventListener("keypress", (e) => { if (e.key === "Enter") processLogin(); });
    }
}

// ==========================================
// 3. OBSERVER AUTENTIKASI AKTIF & PROFIL GLOBAL
// ==========================================
window.userProfiles = {}; 
const profilesRef = ref(db, 'user_profiles');

onValue(profilesRef, (snapshot) => {
    if(snapshot.exists()) {
        window.userProfiles = snapshot.val();
        if(currentUid && currentUser) {
            const myProfile = window.userProfiles[currentUser] || {};
            const topText = document.getElementById("topLoginText");
            const topAvatar = document.getElementById("topAvatar");
            const topIcon = document.getElementById("topIcon");
            
            const isPages = window.location.pathname.includes('/pages/');
            const defaultIcon = isPages ? '../gambar/icon.png' : 'gambar/icon.png';
            const cardAvatar = localStorage.getItem("fournity_user_avatar") || localStorage.getItem(`avatar_${currentUser}`);
            const finalPhoto = cardAvatar || myProfile.photoBase64 || defaultIcon;

            if(topText) topText.textContent = myProfile.displayName || currentUser;
            if(topAvatar && topIcon) {
                topAvatar.src = finalPhoto;
                topAvatar.style.display = "block";
                topIcon.style.display = "none";
            }

            if (typeof window.syncMainTopHeaderProfile === 'function') {
                window.syncMainTopHeaderProfile();
            }

            const profilePreviewImg = document.getElementById("profilePreviewImg");
            const profileNameInput = document.getElementById("profileNameInput");
            if(profilePreviewImg && !window.newPhotoBase64) profilePreviewImg.src = finalPhoto;
            if(profileNameInput && !profileNameInput.value) profileNameInput.value = myProfile.displayName || currentUser;
        }
        window.dispatchEvent(new Event('profilesUpdated'));
    }
});

// Listener status login Firebase Auth
onAuthStateChanged(auth, async (user) => {
    const adminToggleBtn = document.getElementById("adminToggleBtn");
    const topText = document.getElementById("topLoginText");
    const topAvatar = document.getElementById("topAvatar");
    const topIcon = document.getElementById("topIcon");
    const profileEmailDisplay = document.getElementById("profileEmailDisplay");
    const profileNameInput = document.getElementById("profileNameInput");
    const profilePreviewImg = document.getElementById("profilePreviewImg");

    if (user) {
        currentUser = user.displayName || user.email.split("@")[0];
        currentUid = user.uid;
        currentEmail = user.email;
        localStorage.setItem("nihongoChatUser", currentUser);
        localStorage.setItem("nihongoChatUid", currentUid);
        localStorage.setItem("nihongoChatEmail", currentEmail);

        // Ambil data milik akun ini dari Firebase Realtime Database
        await loadUserDataFromCloud(user);

        // Update UI Header
        if (topText) topText.textContent = currentUser;
        
        const cardAvatar = localStorage.getItem("fournity_user_avatar");
        const myProfile = window.userProfiles ? (window.userProfiles[currentUser] || {}) : {};
        const finalPhoto = cardAvatar || myProfile.photoBase64 || "gambar/icon.png";

        if (topAvatar && topIcon) {
            topAvatar.src = finalPhoto;
            topAvatar.style.display = "block";
            topIcon.style.display = "none";
        }

        if (profileEmailDisplay) profileEmailDisplay.textContent = `📧 ${user.email}`;
        if (profileNameInput && !profileNameInput.value) profileNameInput.value = currentUser;
        if (profilePreviewImg && !window.newPhotoBase64) profilePreviewImg.src = finalPhoto;

        // Cek Admin System Override
        const isLeadDev = (user.email && user.email.toLowerCase().includes("umaedi")) || (currentUser.toLowerCase() === "umaedi");
        if (isLeadDev && adminToggleBtn) adminToggleBtn.style.display = "block";
        else if (adminToggleBtn) adminToggleBtn.style.display = "none";

        if (typeof window.syncMainTopHeaderProfile === 'function') window.syncMainTopHeaderProfile();
        if (typeof window.refreshPass === 'function') window.refreshPass();
        if (typeof window.renderCheckinUI === 'function') window.renderCheckinUI();
        if (typeof window.checkAndUpdateDailyQuests === 'function') window.checkAndUpdateDailyQuests();
        if (typeof window.renderShowcaseSlider === 'function') window.renderShowcaseSlider();
    } else {
        // Mode Guest (Belum Login)
        currentUser = null;
        currentUid = null;
        currentEmail = null;
        localStorage.removeItem("nihongoChatUid");
        localStorage.removeItem("nihongoChatEmail");
        const storedUser = (localStorage.getItem("nihongoChatUser") || "").toLowerCase();
        if (["umaedi", "iqbal", "rifki", "fasya"].includes(storedUser) || storedUser.startsWith("gakusei_")) {
            localStorage.removeItem("nihongoChatUser");
            localStorage.removeItem("fournity_user_avatar");
            localStorage.removeItem("fournity_custom_avatar");
        }

        if (topText) topText.textContent = "Login";
        if (topAvatar) {
            topAvatar.style.display = "none";
            topAvatar.src = "gambar/icon.png";
        }
        if (topIcon) topIcon.style.display = "block";
        if (adminToggleBtn) adminToggleBtn.style.display = "none";
        if (profileEmailDisplay) profileEmailDisplay.textContent = "";

        if (typeof window.syncMainTopHeaderProfile === 'function') window.syncMainTopHeaderProfile();
        if (typeof window.refreshPass === 'function') window.refreshPass();
        if (typeof window.renderShowcaseSlider === 'function') window.renderShowcaseSlider();
    }

    window.dispatchEvent(new Event('profilesUpdated'));
    window.dispatchEvent(new Event('studyProgressUpdated'));
    window.dispatchEvent(new Event('storage'));
});

window.newPhotoBase64 = null;
const profileImageUpload = document.getElementById("profileImageUpload");
if(profileImageUpload) {
    profileImageUpload.addEventListener("change", function(e) {
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                const size = 150; 
                canvas.width = size; canvas.height = size;
                const minRatio = Math.min(img.width, img.height);
                const sx = (img.width - minRatio) / 2;
                const sy = (img.height - minRatio) / 2;
                ctx.drawImage(img, sx, sy, minRatio, minRatio, 0, 0, size, size);
                
                window.newPhotoBase64 = canvas.toDataURL("image/jpeg", 0.7);
                document.getElementById("profilePreviewImg").src = window.newPhotoBase64;
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
}

const saveProfileBtn = document.getElementById("saveProfileBtn");
if(saveProfileBtn) {
    saveProfileBtn.addEventListener("click", async () => {
        saveProfileBtn.textContent = "MENYIMPAN...";
        const newName = document.getElementById("profileNameInput")?.value.trim() || currentUser || "Gakusei";
        const currentAvatar = localStorage.getItem("fournity_user_avatar") || localStorage.getItem("fournity_custom_avatar") || "";
        const rawPhoto = window.newPhotoBase64 || currentAvatar || (window.userProfiles && window.userProfiles[currentUser]?.photoBase64 || "");
        const finalPhoto = rawPhoto ? rawPhoto.replace(/^(\.\.\/|\.\/)+/, '') : "";
        const currentRarity = localStorage.getItem("fournity_avatar_rarity") || "";
        const currentSerial = localStorage.getItem("fournity_avatar_serial") || "";
        
        const profileData = {
            displayName: newName,
            photoBase64: finalPhoto,
            avatarRarity: currentRarity,
            avatarSerial: currentSerial
        };
        
        try {
            if (currentUser) {
                await update(ref(db, 'user_profiles/' + newName), profileData);
                if (currentUser !== newName) {
                    try {
                        await remove(ref(db, 'user_profiles/' + currentUser));
                    } catch(e) {}
                }
            }
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { displayName: newName });
                await update(ref(db, `users/${auth.currentUser.uid}/profile`), {
                    displayName: newName,
                    photoBase64: finalPhoto,
                    avatar: finalPhoto,
                    avatarRarity: currentRarity,
                    avatarSerial: currentSerial,
                    updatedAt: Date.now()
                });
            }
            currentUser = newName;
            localStorage.setItem("nihongoChatUser", newName);
            
            if (finalPhoto) {
                localStorage.setItem("fournity_user_avatar", finalPhoto);
                localStorage.setItem("fournity_custom_avatar", finalPhoto);
                localStorage.setItem(`avatar_${newName}`, finalPhoto);
            } else {
                localStorage.removeItem("fournity_user_avatar");
                localStorage.removeItem("fournity_custom_avatar");
                localStorage.removeItem("fournity_avatar_rarity");
                localStorage.removeItem(`avatar_${newName}`);
                localStorage.removeItem(`avatar_rarity_${newName}`);
            }

            if (window.userProfiles) {
                window.userProfiles[newName] = window.userProfiles[newName] || {};
                window.userProfiles[newName].displayName = newName;
                window.userProfiles[newName].photoBase64 = finalPhoto;
                window.userProfiles[newName].avatarRarity = currentRarity;
                window.userProfiles[newName].avatarSerial = currentSerial;
            }

            // Langsung perbarui avatar di pojok kanan atas dan hero pass seketika
            const topAvatarEl = document.getElementById("topAvatar");
            const topIconEl = document.getElementById("topIcon");
            const topTextEl = document.getElementById("topLoginText");
            if (topTextEl) topTextEl.textContent = newName;
            if (topAvatarEl) {
                if (finalPhoto) {
                    topAvatarEl.src = finalPhoto;
                    topAvatarEl.style.display = "block";
                    if (topIconEl) topIconEl.style.display = "none";
                } else {
                    topAvatarEl.style.display = "none";
                    if (topIconEl) topIconEl.style.display = "inline-block";
                }
            }
            const heroPassAvatarEl = document.getElementById("heroPassAvatar");
            if (heroPassAvatarEl && finalPhoto) {
                heroPassAvatarEl.src = finalPhoto;
            }

            window.newPhotoBase64 = null;
            saveProfileBtn.textContent = "SIMPAN PERUBAHAN";
            const profileModal = document.getElementById("profileModalOverlay");
            if (profileModal) profileModal.style.display = "none";
            
            if (typeof window.syncMainTopHeaderProfile === 'function') window.syncMainTopHeaderProfile();
            if (typeof window.refreshPass === 'function') window.refreshPass();
            if (typeof window.updateAllRenderedChatAvatars === 'function') window.updateAllRenderedChatAvatars();
            window.dispatchEvent(new Event('profilesUpdated'));
            window.dispatchEvent(new Event('storage'));
            if (typeof window.showToast === 'function') window.showToast("✓ Foto profil berhasil disimpan!");
        } catch(err) {
            saveProfileBtn.textContent = "SIMPAN PERUBAHAN";
            alert("Gagal menyimpan profil: " + err.message);
        }
    });
}

// Handler Reset Foto Profil ke Default Bawaan di Modal Profil Utama
const resetProfilePhotoBtn = document.getElementById("resetProfilePhotoBtn");
if (resetProfilePhotoBtn) {
    resetProfilePhotoBtn.addEventListener("click", async () => {
        if (!confirm("Kembalikan foto profil ke default bawaan sistem?")) return;
        window.newPhotoBase64 = null;
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

        const isPages = window.location.pathname.includes('/pages/');
        const defaultIcon = isPages ? '../gambar/icon.png' : 'gambar/icon.png';
        const profilePreviewImg = document.getElementById("profilePreviewImg");
        if (profilePreviewImg) profilePreviewImg.src = defaultIcon;

        if (window.userProfiles && currentUser && window.userProfiles[currentUser]) {
            window.userProfiles[currentUser].photoBase64 = "";
            window.userProfiles[currentUser].avatar = "";
            window.userProfiles[currentUser].avatarRarity = "";
            window.userProfiles[currentUser].avatarSerial = "";
        }

        if (auth.currentUser) {
            try {
                const uid = auth.currentUser.uid;
                const displayName = currentUser || auth.currentUser.displayName || "Gakusei";
                const updates = {};
                updates[`users/${uid}/profile/avatar`] = "";
                updates[`users/${uid}/profile/photoBase64`] = "";
                updates[`users/${uid}/profile/avatarRarity`] = "";
                updates[`users/${uid}/profile/avatarSerial`] = "";
                updates[`users/${uid}/profile/updatedAt`] = Date.now();
                updates[`user_profiles/${displayName}/photoBase64`] = "";
                updates[`user_profiles/${displayName}/avatarRarity`] = "";
                updates[`user_profiles/${displayName}/avatarSerial`] = "";
                await update(ref(db), updates);
            } catch(e) {
                console.warn("Gagal update reset profil ke server:", e);
            }
        }

        if (typeof window.syncMainTopHeaderProfile === 'function') window.syncMainTopHeaderProfile();
        if (typeof window.refreshPass === 'function') window.refreshPass();
        if (typeof window.updateAllRenderedChatAvatars === 'function') window.updateAllRenderedChatAvatars();
        window.dispatchEvent(new Event('profilesUpdated'));
        window.dispatchEvent(new Event('storage'));
        if (typeof window.showToast === 'function') window.showToast("✓ Foto profil telah direset ke default bawaan!");
    });
}

const closeProfileModal = document.getElementById("closeProfileModal");
if (closeProfileModal) closeProfileModal.addEventListener("click", () => document.getElementById("profileModalOverlay").style.display = "none");

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);
        } catch(e) {}
        clearUserSessionData();
        window.location.reload();
    });
}

// ==========================================
// 3. ADMIN COMMAND CENTER LINK & ACCESS
// ==========================================
const adminToggleBtn = document.getElementById("adminToggleBtn");

const isUmaedi = (currentUser && currentUser.toLowerCase() === "umaedi") || (currentEmail && currentEmail.toLowerCase().includes("umaedi"));
if (isUmaedi && adminToggleBtn) {
    adminToggleBtn.style.display = "inline-flex";
}

if (adminToggleBtn) {
    if (adminToggleBtn.tagName !== "A") {
        adminToggleBtn.addEventListener("click", () => {
            window.location.href = "pages/admin.html";
        });
    }
}

// ==========================================
// 3. GLOBAL POP-UP ALERT BROADCAST (APPLE iOS BANNER PUSH NOTIFICATION)
// ==========================================
function escapeHtmlAlert(text) {
    if (!text) return "";
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

const alertSound = new Audio('https://actions.google.com/sounds/v1/alarms/message_alert_sound.ogg');
const recentAnnouncements = query(announceRef, limitToLast(1));
let lastSeenId = localStorage.getItem("lastSeenAnnounce");
let hideTimeout; 

function showIosBroadcastToast(data, key) {
    let alertEl = document.getElementById("globalAlert");
    if (!alertEl) {
        alertEl = document.createElement("div");
        alertEl.id = "globalAlert";
        alertEl.className = "global-alert ios-broadcast-banner";
        alertEl.style.display = "none";
        alertEl.setAttribute("role", "alert");
        alertEl.setAttribute("aria-live", "assertive");
        document.body.appendChild(alertEl);
    } else {
        alertEl.className = "global-alert ios-broadcast-banner";
    }

    const devRawName = (data.sender || "Umaedi").trim();
    const isLeadDev = devRawName.toLowerCase() === "umaedi";
    const devBadgeText = isLeadDev ? `👑 Umaedi • Founder & Dev` : `👨‍💻 Dev: ${devRawName}`;

    alertEl.innerHTML = `
        <div class="ios-banner-header">
            <div class="ios-banner-app-icon"><span>⛩️</span></div>
            <div class="ios-banner-meta">
                <span class="ios-banner-app-name">TRINITY BROADCAST</span>
                <span class="ios-banner-dev-badge" title="Pesan Resmi dari Pengembang">${devBadgeText}</span>
            </div>
            <span class="ios-banner-time">Baru Saja</span>
            <button type="button" class="ios-banner-close" aria-label="Tutup Notifikasi" title="Tutup">✕</button>
        </div>
        <div class="ios-banner-body">
            <h4 class="ios-banner-title">${escapeHtmlAlert(data.title || "PENGUMUMAN SISTEM")}</h4>
            <p class="ios-banner-msg">${escapeHtmlAlert(data.message || "")}</p>
        </div>
        <div class="ios-banner-progress-track">
            <div class="ios-banner-progress-bar"></div>
        </div>
    `;

    alertEl.classList.remove("hide-alert");
    alertEl.style.display = "block";
    alertSound.play().catch(() => {});

    localStorage.setItem("lastSeenAnnounce", key);
    lastSeenId = key;

    const closeBtn = alertEl.querySelector(".ios-banner-close");
    if (closeBtn) {
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            dismissIosBanner(alertEl);
        };
    }

    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
        dismissIosBanner(alertEl);
    }, 6500);
}

function dismissIosBanner(alertEl) {
    if (!alertEl) return;
    clearTimeout(hideTimeout);
    alertEl.classList.add("hide-alert");
    setTimeout(() => {
        alertEl.style.display = "none";
        alertEl.classList.remove("hide-alert");
    }, 450);
}

onChildAdded(recentAnnouncements, (snapshot) => {
    const data = snapshot.val();
    const key = snapshot.key;
    if (data && lastSeenId !== key) {
        showIosBroadcastToast(data, key);
    }
});

// ==========================================
// 4. LOGIKA LEADERBOARD
// ==========================================
const leaderboardRef = ref(db, "leaderboard");
const leaderboardList = document.getElementById("leaderboardList");

if (leaderboardList) {
    onValue(leaderboardRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const ranks = [];
            for (let key in data) { ranks.push({ name: key, score: data[key] }); }
            ranks.sort((a, b) => b.score - a.score);
            
            leaderboardList.innerHTML = "";
            
            ranks.forEach((user, index) => {
                const profile = window.userProfiles ? (window.userProfiles[user.name] || {}) : {};
                const rankNum = index + 1;
                const rankClass = `rank-${rankNum > 4 ? 4 : rankNum}`;
                
                const displayName = profile.displayName || (user.name === "Rifki" ? "Rifki (Swing)" : user.name);
                const isPages = window.location.pathname.includes('/pages/');
                const basePath = isPages ? `../gambar/${user.name.toLowerCase()}.png` : `gambar/${user.name.toLowerCase()}.png`;
                const finalPhoto = profile.photoBase64 || basePath;
                const initial = (displayName || "U").charAt(0).toUpperCase();

                // Position badge styling & rings
                let posBadgeHtml = `<div class="rank-pos-badge">#${rankNum}</div>`;
                let ringClass = "";
                let levelBadgeHtml = `<span class="rank-level-badge level-novice">🌱 Novice</span>`;

                if (rankNum === 1) {
                    posBadgeHtml = `<div class="rank-pos-badge gold" title="Juara 1">🥇</div>`;
                    ringClass = "gold-ring";
                    levelBadgeHtml = `<span class="rank-level-badge level-sensei">👑 Level: Sensei</span>`;
                } else if (rankNum === 2) {
                    posBadgeHtml = `<div class="rank-pos-badge silver" title="Juara 2">🥈</div>`;
                    ringClass = "silver-ring";
                    levelBadgeHtml = `<span class="rank-level-badge level-senpai">💻 Level: Senpai</span>`;
                } else if (rankNum === 3) {
                    posBadgeHtml = `<div class="rank-pos-badge bronze" title="Juara 3">🥉</div>`;
                    ringClass = "bronze-ring";
                    levelBadgeHtml = `<span class="rank-level-badge level-kouhai">📜 Level: Kouhai</span>`;
                }
                
                const li = document.createElement("li");
                li.className = `${rankClass} rank-item-row`;
                li.innerHTML = `
                    ${posBadgeHtml}
                    <div class="rank-avatar-wrapper ${ringClass}">
                        <img src="${finalPhoto}" alt="${initial}" class="rank-avatar-img"
                             onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='grid';">
                        <div class="rank-avatar-fallback" style="display: none;">${initial}</div>
                        <span class="rank-online-dot"></span>
                    </div>
                    <div class="rank-info">
                        <div class="rank-user-title-row">
                            <span class="rank-user-name">${displayName}</span>
                            ${rankNum === 1 ? '<span class="rank-crown" title="Juara Bertahan">👑</span>' : ''}
                        </div>
                        <div>${levelBadgeHtml}</div>
                    </div>
                    <div class="rank-score-container">
                        <div class="rank-score-number">
                            ${Number(user.score || 0).toLocaleString()}
                        </div>
                        <span class="rank-score-label">POIN</span>
                    </div>
                `;
                leaderboardList.appendChild(li);
            });
        }
    });

}

// ==========================================
// 5. NOTIFIKASI PESAN BELUM DIBACA
// ==========================================
const msgBadge = document.getElementById("msgBadge");

if (currentUid && currentUser && msgBadge) {
    const isCore = !!currentUid && (
        (currentEmail && currentEmail.toLowerCase().includes("umaedi")) ||
        (currentUser && currentUser.toLowerCase() === "umaedi")
    );
    
    const checkUnread = (roomName) => {
        const refName = roomName === "core" ? "messages" : "messages_public";
        const recentMessages = query(ref(db, refName), limitToLast(30));
        
        onValue(recentMessages, (snapshot) => {
            if (snapshot.exists()) {
                let unreadCount = 0;
                let lastRead = Number(localStorage.getItem("lastRead_" + roomName));
                
                if (!lastRead && roomName === "core") {
                    lastRead = Number(localStorage.getItem("lastReadMessageTime")) || Date.now();
                    localStorage.setItem("lastRead_" + roomName, lastRead);
                } else if (!lastRead) {
                    lastRead = Date.now();
                    localStorage.setItem("lastRead_" + roomName, lastRead);
                }

                snapshot.forEach((childSnap) => {
                    const msg = childSnap.val();
                    if (msg.timestamp > lastRead && msg.name !== currentUser && msg.name !== "SYSTEM") unreadCount++;
                });
                
                window["unread_" + roomName] = unreadCount;
                updateTotalBadge();
            }
        });
    };

    const updateTotalBadge = () => {
        let total = (window.unread_public || 0);
        if (isCore) total += (window.unread_core || 0); 
        
        if (total > 0) {
            msgBadge.innerText = total > 9 ? "9+" : total;
            msgBadge.style.display = "grid";
        } else msgBadge.style.display = "none";
    };

    checkUnread("public");
    if (isCore) checkUnread("core");
}