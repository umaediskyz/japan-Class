/**
 * KAIWA LIVE - SIMULASI TELPON PERCAKAPAN JEPANG REALISTIS (iOS THEME)
 * Nihongo Fournity Japan Class (日本語会話シミュレーション)
 */

// 1. DATABASE KONTAK LAWAN BICARA (CEWEK & TUTOR JEPANG)
const KAIWA_CONTACTS = [
    {
        id: "sakura",
        name: "Sakura-chan",
        kanjiName: "さくら",
        category: "cewek",
        city: "Shibuya, Tokyo",
        level: "JLPT N5 - N4",
        role: "Mahasiswi Shibuya (Tokyo)",
        topic: "Hobi, Anime & Jalan-jalan di Harajuku",
        avatar: "../gambar/kaiwa_sakura.jpg",
        videoFile: "../assets/video_kaiwa/sakura.mp4",
        dialogues: [
            {
                speakerJp: "「もしもし！こんにちは！電話くれて嬉しいな。今日はお休み？」",
                romaji: "Moshimoshi! Konnichiwa! Denwa kurete ureshii na. Kyou wa oyasumi?",
                meaningId: "Halo! Halo! Senang sekali kamu meneleponku. Apakah hari ini kamu sedang libur?",
                userResponses: [
                    { jp: "「こんにちは！うん、今日はお休みだよ。」", romaji: "Konnichiwa! Un, kyou wa oyasumi da yo.", id: "Halo! Iya, hari ini aku libur kok." },
                    { jp: "「さくらちゃん、はじめまして！日本語を練習したいです。」", romaji: "Sakura-chan, hajimemashite! Nihongo o renshuu shitai desu.", id: "Sakura-chan, salam kenal! Aku ingin latihan bahasa Jepang." }
                ]
            },
            {
                speakerJp: "「そうなんだ！最近どんなアニメや音楽にハマってるの？」",
                romaji: "Sou nan da! Saikin donna anime ya ongaku ni hamatteru no?",
                meaningId: "Begitu ya! Akhir-akhir ini kamu lagi suka anime atau musik apa?",
                userResponses: [
                    { jp: "「日本のシティポップやJ-POPをよく聴いてるよ。」", romaji: "Nihon no shiti poppu ya J-POP o yoku kiiteru yo.", id: "Aku sering mendengarkan City Pop dan J-Pop Jepang." },
                    { jp: "「アニメを見るのが大好きだよ！さくらちゃんのおすすめは？」", romaji: "Anime o miru no ga daisuki da yo! Sakura-chan no osusume wa?", id: "Aku suka sekali nonton anime! Rekomendasi Sakura-chan apa?" }
                ]
            },
            {
                speakerJp: "「いいね！渋谷や原宿には面白いカフェがたくさんあるから、今度紹介するね！」",
                romaji: "Ii ne! Shibuya ya Harajuku ni wa omoshiroi kafe ga takusan aru kara, kondo shoukai suru ne!",
                meaningId: "Keren! Di Shibuya dan Harajuku ada banyak kafe menarik, nanti kapan-kapan aku rekomendasikan ya!",
                userResponses: [
                    { jp: "「ありがとう！楽しみに待ってるね。」", romaji: "Arigatou! Tanoshimi ni matteru ne.", id: "Terima kasih! Aku tunggu ya." },
                    { jp: "「ぜひ行ってみたいです！また電話するね。」", romaji: "Zehi itte mitai desu! Nanti aku telepon lagi ya." }
                ]
            }
        ]
    },
    {
        id: "aoi",
        name: "Aoi Sensei",
        kanjiName: "葵 先生",
        category: "cewek",
        city: "Chiyoda, Tokyo",
        level: "JLPT N5 (Pemula)",
        role: "Tutor Resmi Fournity",
        topic: "Salam Harian & Perkenalan Diri (自己紹介)",
        avatar: "../gambar/aoi_sensei.jpg",
        videoFile: "../assets/video_kaiwa/aoi.mp4",
        dialogues: [
            {
                speakerJp: "「はい、葵です！お電話ありがとうございます。お元気ですか？」",
                romaji: "Hai, Aoi desu! Odenwa arigatou gozaimasu. Ogenki desu ka?",
                meaningId: "Ya, ini Aoi! Terima kasih telah menelepon. Bagaimana kabarmu hari ini?",
                userResponses: [
                    { jp: "「はい、とても元気です！先生もお元気ですか？」", romaji: "Hai, totemo genki desu! Sensei mo ogenki desu ka?", id: "Ya, saya sangat sehat! Apakah Sensei juga sehat?" },
                    { jp: "「先生、こんにちは！今日も日本語を頑張ります。」", romaji: "Sensei, konnichiwa! Kyou mo nihongo o gambarimasu.", id: "Halo Sensei! Hari ini saya akan semangat belajar bahasa Jepang lagi." }
                ]
            },
            {
                speakerJp: "「素晴らしいですね！発音もとても綺麗ですよ。今日はどんな単語を覚えましたか？」",
                romaji: "Subarashii desu ne! Hatsuon mo totemo kirei desu yo. Kyou wa donna tango o oboemashita ka?",
                meaningId: "Bagus sekali! Pelafalanmu juga sangat bagus lho. Hari ini kosakata apa yang sudah kamu pelajari?",
                userResponses: [
                    { jp: "「朝の挨拶や家族の言葉を勉強しました。」", romaji: "Asa no aisatsu ya kazoku no kotoba o benkyou shimashita.", id: "Saya belajar salam pagi dan kosakata keluarga." },
                    { jp: "「漢字の書き順を練習しました！」", romaji: "Kanji no kakijun o renshuu shimashita!", id: "Saya berlatih urutan goresan kanji!" }
                ]
            },
            {
                speakerJp: "「その調子で毎日少しずつ続けましょうね。『継続は力なり』ですよ！」",
                romaji: "Sono choushi de mainichi sukoshizutsu tsuzukemashou ne. 'Keizoku wa chikara nari' desu yo!",
                meaningId: "Terus pertahankan semangat itu sedikit demi sedikit setiap hari ya. 'Konsistensi adalah kunci kekuatan'!",
                userResponses: [
                    { jp: "「はい、先生！アドバイスありがとうございます。」", romaji: "Hai, Sensei! Adobaisu arigatou gozaimasu.", id: "Baik Sensei! Terima kasih atas nasihatnya." },
                    { jp: "「頑張ります！またレッスンお願いします。」", romaji: "Gambarimasu! Mata ressun onegaishimasu.", id: "Saya akan berusaha! Mohon bimbingannya lagi nanti." }
                ]
            }
        ]
    },
    {
        id: "yuna",
        name: "Yuna-san",
        kanjiName: "優奈",
        category: "kafe",
        city: "Gion, Kyoto",
        level: "JLPT N4 - N3",
        role: "Pramuniaga Kafe Tradisional Kyoto",
        topic: "Memesan Minuman & Tata Krama Kafe (丁寧語)",
        avatar: "../gambar/kaiwa_yuna.jpg",
        videoFile: "../assets/video_kaiwa/yuna.mp4",
        dialogues: [
            {
                speakerJp: "「いらっしゃいませ、京都町家カフェの優奈です。ご注文はお決まりですか？」",
                romaji: "Irasshaimase, Kyouto machiya kafe no Yuna desu. Gochuumon wa okimari desu ka?",
                meaningId: "Selamat datang, saya Yuna dari Kafe Machiya Kyoto. Apakah pesanannya sudah ditentukan?",
                userResponses: [
                    { jp: "「抹茶ラテとわらび餅を一つずつお願いします。」", romaji: "Matcha rate to warabimochi o hitotsu zutsu onegaishimasu.", id: "Tolong Matcha Latte dan Warabimochi masing-masing satu ya." },
                    { jp: "「すみません、おすすめのメニューは何ですか？」", romaji: "Sumimasen, osusume no menyuu wa nan desu ka?", id: "Permisi, menu rekomendasi di sini apa ya?" }
                ]
            },
            {
                speakerJp: "「宇治抹茶を使った特製パフェが一番人気ですよ。甘さ控えめでとても美味しいです。」",
                romaji: "Uji matcha o tsukatta tokusei pafe ga ichiban ninki desu yo. Amasa hikaeme de totemo oishii desu.",
                meaningId: "Parfait spesial berbahan matcha Uji adalah yang paling populer lho. Manisnya pas dan sangat lezat.",
                userResponses: [
                    { jp: "「では、その特製パフェをお願いします！」", romaji: "Dewa, sono tokusei pafe o onegaishimasu!", id: "Kalau begitu, tolong parfait spesial itu satu ya!" },
                    { jp: "「温かい緑茶も一緒にもらえますか？」", romaji: "Atatakai ryokucha mo issho ni moraemasu ka?", id: "Bisakah sekalian minta teh hijau hangat?" }
                ]
            },
            {
                speakerJp: "「かしこまりました。京都の庭園を眺めながら、ごゆっくりお過ごしくださいませ。」",
                romaji: "Kashikomarimashita. Kyouto no teien o nagamenagara, goyukkuri osugoshi kudasaimase.",
                meaningId: "Baik, dimengerti. Silakan bersantai menikmati pemandangan taman khas Kyoto ya.",
                userResponses: [
                    { jp: "「ありがとうございます、楽しみです。」", romaji: "Arigatou gozaimasu, tanoshimi desu.", id: "Terima kasih banyak, tidak sabar mencicipinya." },
                    { jp: "「京都の庭園、とても綺麗ですね！」", romaji: "Kyouto no teien, totemo kirei desu ne!", id: "Taman Kyoto-nya indah sekali ya!" }
                ]
            }
        ]
    },
    {
        id: "hana",
        name: "Hana-senpai",
        kanjiName: "花先輩",
        category: "travel",
        city: "Asakusa, Tokyo",
        level: "JLPT N4 - N3",
        role: "Pemandu Wisata Asakusa",
        topic: "Bertanya Arah, Tiket Kereta & Suvenir (浅草観光)",
        avatar: "../gambar/kaiwa_hana.jpg",
        videoFile: "../assets/video_kaiwa/hana.mp4",
        dialogues: [
            {
                speakerJp: "「こんにちは！浅草寺の雷門前にいるよ！どこか道に迷っちゃった？」",
                romaji: "Konnichiwa! Sensouji no Kaminarimon mae ni iru yo! Dokoka michi ni mayocchatta?",
                meaningId: "Halo! Aku lagi di depan gerbang Kaminarimon Kuil Sensoji nih! Apakah kamu tersesat di suatu tempat?",
                userResponses: [
                    { jp: "「浅草駅から雷門までは歩いてどのくらいかかりますか？」", romaji: "Asakusa eki kara Kaminarimon made wa aruite dono kurai kakarimasu ka?", id: "Dari Stasiun Asakusa ke Kaminarimon jalan kaki butuh berapa lama?" },
                    { jp: "「花先輩！美味しい人形焼きのお店はどこにありますか？」", romaji: "Hana-senpai! Oishii ningyouyaki no omise wa doko ni arimasu ka?", id: "Hana-senpai! Toko Ningyoyaki yang enak ada di mana ya?" }
                ]
            },
            {
                speakerJp: "「仲見世通りをまっすぐ歩くと、焼き立てを売っている有名なお店があるよ！」",
                romaji: "Nakamise doori o massugu aruku to, yakitate o utte iru yuumei na omise ga aru yo!",
                meaningId: "Kalau jalan lurus lewat jalan Nakamise, ada toko terkenal yang menjual kue yang baru selesai dipanggang lho!",
                userResponses: [
                    { jp: "「お土産に買っていきたいです！」", romaji: "Omiyage ni katte ikitai desu!", id: "Aku ingin membelinya untuk oleh-oleh!" },
                    { jp: "「おみくじも引いてみたいです。」", romaji: "Omikuji mo hiite mitai desu.", id: "Aku juga ingin mencoba menarik ramalan Omikuji." }
                ]
            },
            {
                speakerJp: "「案内するから一緒に行こう！浅草の歴史もたくさん教えるね！」",
                romaji: "Annai suru kara issho ni ikou! Asakusa no rekishi mo takusan oshieru ne!",
                meaningId: "Ayo kita pergi bareng, nanti aku pandu! Aku juga akan ceritakan banyak sejarah Asakusa kepadamu!",
                userResponses: [
                    { jp: "「心強いです！よろしくお願いします。」", romaji: "Kokorozuyoi desu! Yoroshiku onegaishimasu.", id: "Menenangkan sekali! Mohon bantuannya ya." },
                    { jp: "「花先輩、ありがとう！」", romaji: "Hana-senpai, arigatou!", id: "Hana-senpai, terima kasih!" }
                ]
            }
        ]
    }
];

// 2. DATABASE STATUS / STORIES LAWAN BICARA JEPANG (iOS STORIES)
const KAIWA_STORIES = [
    {
        id: "sakura",
        name: "Sakura-chan",
        kanjiName: "さくら",
        avatar: "../gambar/kaiwa_sakura.jpg",
        image: "../gambar/kaiwa_sakura.jpg",
        time: "15 menit yang lalu",
        tag: "Cafe · Shibuya",
        textJp: "「渋谷のカフェで新しい抹茶ラテを飲んでるよ！甘くて美味しい～🍵」",
        romaji: "Shibuya no kafe de atarashii matcha rate o nonderu yo! Amakute oishii~",
        meaning: "Lagi minum matcha latte baru di kafe Shibuya nih! Manis dan enak banget~"
    },
    {
        id: "aoi",
        name: "Aoi Sensei",
        kanjiName: "葵 先生",
        avatar: "../gambar/aoi_sensei.jpg",
        image: "../gambar/aoi_sensei.jpg",
        time: "42 menit yang lalu",
        tag: "Sensei Tips · Tokyo",
        textJp: "「今日のワンポイント日本語：『雨降って地固まる』困難の後は良いことがあるよ！」",
        romaji: "Kyou no wan pointo nihongo: 'Ame futte ji katamaru'. Konnan no ato wa yoi koto ga aru yo!",
        meaning: "Poin bahasa Jepang hari ini: 'Setelah hujan, tanah mengeras' (Setelah kesulitan pasti ada hal baik yang menanti)!"
    },
    {
        id: "hana",
        name: "Hana-senpai",
        kanjiName: "花先輩",
        avatar: "../gambar/kaiwa_hana.jpg",
        image: "../gambar/kaiwa_hana.jpg",
        time: "2 jam yang lalu",
        tag: "Wisata Asakusa · Tokyo",
        textJp: "「浅草寺の雷門前は今日も大賑わい！焼き立ての人形焼きが最高です🏮」",
        romaji: "Sensouji no Kaminarimon mae wa kyou mo oo-nigiwai! Yakitate no ningyouyaki ga saikou desu.",
        meaning: "Depan gerbang Kaminarimon Asakusa hari ini ramai banget! Kue Ningyoyaki yang baru matang paling mantap."
    },
    {
        id: "yuna",
        name: "Yuna-san",
        kanjiName: "優奈",
        avatar: "../gambar/kaiwa_yuna.jpg",
        image: "../gambar/kaiwa_yuna.jpg",
        time: "5 jam yang lalu",
        tag: "Kyoto Heritage · Gion",
        textJp: "「京都の町家から見る日本庭園がとても静か。皆さんもぜひ京都へおいでやす🍃」",
        romaji: "Kyouto no machiya kara miru nihon teien ga totemo shizuka. Minasan mo zehi Kyouto e oideyasu.",
        meaning: "Pemandangan taman Jepang dari rumah tradisional Kyoto tenang sekali. Kalian semua silakan berkunjung ke Kyoto ya."
    }
];

// STATE MANAGEMENT
let _activeContact = null;
let _ringingTimer = null;
let _callTimerInterval = null;
let _callDurationSeconds = 0;
let _currentDialogueIndex = 0;
let _dialogueAutoTimer = null;
let _audioCtx = null;
let _ringToneLoopTimer = null;
let _isMuted = false;
let _volumeBoostLevel = 1; // 1 = 100%, 1.5 = Boost, 0.5 = Low
let _currentFilter = "all";
let _currentSearchQuery = "";
let _activeIosTab = "chats";

// SVG ICONS (REAL VECTOR ASSETS - NO EMOJIS)
const SVG_ICONS = {
    phoneCall: `<svg class="ios-btn-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
    mapPin: `<svg class="ios-inline-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
    dice: `<svg class="ios-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4" ry="4"></rect><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"></circle><circle cx="15.5" cy="8.5" r="1.5" fill="currentColor"></circle><circle cx="12" cy="12" r="1.5" fill="currentColor"></circle><circle cx="8.5" cy="15.5" r="1.5" fill="currentColor"></circle><circle cx="15.5" cy="15.5" r="1.5" fill="currentColor"></circle></svg>`,
    spinDice: `<svg class="ios-svg-icon spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>`,
    speakerOn: `<svg class="ios-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`,
    speakerMuted: `<svg class="ios-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`,
    volumeSliders: `<svg class="ios-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>`,
    volumeBoost: `<svg class="ios-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path><line x1="18" y1="2" x2="18" y2="6"></line><line x1="16" y1="4" x2="20" y2="4"></line></svg>`,
    volumeLow: `<svg class="ios-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`,
    phoneRinging: `<svg class="ios-svg-icon pulse-call" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>`
};

// 3. INISIALISASI APLIKASI KOMUNIKASI iOS TERPADU
document.addEventListener("DOMContentLoaded", () => {
    initUnifiedIosCommunication();
});

function initUnifiedIosCommunication() {
    renderContactsGrid("all", "");
    renderStatusStories("");
    setupFilterTabs();
    setupSearchBar();
    setupStatusView();
    setupRandomCallButton();
    setupCallingScreenButtons();
    setupConnectedScreenControls();
    setupBottomTabBar();
    setupChatRoomObserver();

    // Deteksi tab dari parameter URL atau hash
    const urlParams = new URLSearchParams(window.location.search);
    const hash = (window.location.hash || "").toLowerCase();
    if (urlParams.get("tab") === "calls" || hash.includes("calls") || hash.includes("kaiwa")) {
        switchIosTab("calls");
    } else if (urlParams.get("tab") === "status" || hash.includes("status")) {
        switchIosTab("status");
    } else if (urlParams.get("tab") === "favorites" || hash.includes("favorites")) {
        switchIosTab("favorites");
    } else {
        if (document.getElementById("chatListView")) {
            switchIosTab("chats");
        } else {
            switchIosTab("calls");
        }
    }
}

// ==========================================================================
// 4. SISTEM TAB NAVIGASI iOS (PESAN, PANGGILAN KAIWA, STATUS, FAVORIT)
// ==========================================================================
function switchIosTab(tabId) {
    _activeIosTab = tabId;
    const tabFav = document.getElementById("tabNavFavorites");
    const tabCalls = document.getElementById("tabNavContacts");
    const tabStatus = document.getElementById("tabNavStatus");
    const tabChats = document.getElementById("tabNavChats");

    const chatListView = document.getElementById("chatListView");
    const kaiwaLobbyView = document.getElementById("kaiwaLobbyView");
    const statusView = document.getElementById("statusView");

    const tabs = [tabFav, tabCalls, tabStatus, tabChats].filter(Boolean);
    tabs.forEach(t => t.classList.remove("is-active"));

    // Reset visibility
    if (chatListView) chatListView.style.display = "none";
    if (kaiwaLobbyView) kaiwaLobbyView.style.display = "none";
    if (statusView) statusView.style.display = "none";

    const kaiwaLobbyTitle = document.getElementById("kaiwaLobbyTitle");
    const kaiwaNavCenterTitle = document.getElementById("kaiwaNavCenterTitle");
    const kaiwaUserBadge = document.getElementById("kaiwaUserBadge");

    if (tabId === "calls") {
        if (tabCalls) tabCalls.classList.add("is-active");
        if (kaiwaLobbyView) kaiwaLobbyView.style.display = "flex";
        if (kaiwaLobbyTitle) kaiwaLobbyTitle.textContent = "Panggilan";
        if (kaiwaNavCenterTitle) kaiwaNavCenterTitle.textContent = "Panggilan Kaiwa";
        if (kaiwaUserBadge) kaiwaUserBadge.textContent = "日本語会話";
        renderContactsGrid("all", _currentSearchQuery);
        try { history.replaceState(null, "", "?tab=calls"); } catch(e){}
    } else if (tabId === "status") {
        if (tabStatus) tabStatus.classList.add("is-active");
        if (statusView) statusView.style.display = "flex";
        renderStatusStories("");
        try { history.replaceState(null, "", "?tab=status"); } catch(e){}
    } else if (tabId === "favorites") {
        if (tabFav) tabFav.classList.add("is-active");
        if (kaiwaLobbyView) kaiwaLobbyView.style.display = "flex";
        if (kaiwaLobbyTitle) kaiwaLobbyTitle.textContent = "Favorit";
        if (kaiwaNavCenterTitle) kaiwaNavCenterTitle.textContent = "Kontak Favorit";
        if (kaiwaUserBadge) kaiwaUserBadge.textContent = "お気に入り";
        renderContactsGrid("favorites", _currentSearchQuery);
        try { history.replaceState(null, "", "?tab=favorites"); } catch(e){}
    } else {
        // Default: chats
        if (tabChats) tabChats.classList.add("is-active");
        if (chatListView) chatListView.style.display = "flex";
        try { history.replaceState(null, "", "?tab=chats"); } catch(e){}
    }
}
window.switchIosTab = switchIosTab;

function setupBottomTabBar() {
    const tabFav = document.getElementById("tabNavFavorites");
    const tabCalls = document.getElementById("tabNavContacts");
    const tabStatus = document.getElementById("tabNavStatus");
    const tabChats = document.getElementById("tabNavChats");

    tabFav?.addEventListener("click", () => switchIosTab("favorites"));
    tabCalls?.addEventListener("click", () => switchIosTab("calls"));
    tabStatus?.addEventListener("click", () => switchIosTab("status"));
    tabChats?.addEventListener("click", () => switchIosTab("chats"));

    // Quick switch from chat header button
    document.getElementById("btnHeaderSwitchKaiwa")?.addEventListener("click", () => {
        switchIosTab("calls");
    });
}

function setupChatRoomObserver() {
    const chatRoomViewEl = document.getElementById("chatRoomView");
    const mainIosTabBarEl = document.getElementById("mainIosTabBar");
    const btnQuickCallSensei = document.getElementById("btnQuickCallSensei");

    if (chatRoomViewEl) {
        const roomObserver = new MutationObserver(() => {
            const isRoomOpen = chatRoomViewEl.style.display === "flex";
            if (mainIosTabBarEl) {
                mainIosTabBarEl.style.display = isRoomOpen ? "none" : "flex";
            }
            if (btnQuickCallSensei) {
                const roomTitleEl = document.getElementById("roomTitle");
                const isSensei = roomTitleEl && roomTitleEl.textContent.includes("Aoi");
                btnQuickCallSensei.style.display = (isRoomOpen && isSensei) ? "grid" : "none";
            }
        });
        roomObserver.observe(chatRoomViewEl, { attributes: true, attributeFilter: ["style"] });
    }

    btnQuickCallSensei?.addEventListener("click", () => {
        const aoiContact = KAIWA_CONTACTS.find(c => c.id === "aoi");
        if (aoiContact) startOutgoingCallSimulation(aoiContact);
    });
}

// ==========================================================================
// 5. FITUR STATUS & STORIES iOS (PEMBARUAN STATUS NYATA)
// ==========================================================================
let _currentStoryIndex = 0;
let _storyTimer = null;
let _storyProgressInterval = null;

function renderStatusStories(filterQuery = "") {
    const list = document.getElementById("recentStatusList");
    if (!list) return;

    let stories = KAIWA_STORIES;
    if (filterQuery) {
        const q = filterQuery.toLowerCase();
        stories = stories.filter(s => 
            s.name.toLowerCase().includes(q) ||
            s.kanjiName.toLowerCase().includes(q) ||
            s.textJp.toLowerCase().includes(q) ||
            s.meaning.toLowerCase().includes(q)
        );
    }

    list.innerHTML = "";
    if (stories.length === 0) {
        list.innerHTML = `
            <div style="padding: 24px; text-align: center; color: #8E8E93; font-size: 13px;">
                Tidak ada pembaruan status ditemukan.
            </div>
        `;
        return;
    }

    stories.forEach((story, idx) => {
        const row = document.createElement("div");
        row.className = "status-story-row";
        row.innerHTML = `
            <div class="status-ring-gradient">
                <img src="${story.avatar}" alt="${story.name}" class="status-ring-avatar" onerror="this.src='../gambar/icon.png'">
            </div>
            <div class="status-info-col">
                <div class="status-title-row">
                    <strong class="status-title-name">${story.name}</strong>
                    <span class="status-title-kanji">(${story.kanjiName})</span>
                </div>
                <p class="status-subtitle-text">${story.time} · ${story.meaning}</p>
            </div>
            <span class="status-story-tag">${story.tag}</span>
        `;
        row.addEventListener("click", () => {
            openStatusStory(idx);
        });
        list.appendChild(row);
    });
}

function setupStatusView() {
    const searchInput = document.getElementById("statusFilterInput");
    searchInput?.addEventListener("input", () => {
        renderStatusStories(searchInput.value.trim());
    });

    const myStatusRow = document.getElementById("myStatusRow");
    myStatusRow?.addEventListener("click", () => {
        showIosToast("Buka kamera / buat pembaruan status...");
    });

    const btnCamera = document.getElementById("btnStatusCamera");
    btnCamera?.addEventListener("click", (e) => {
        e.stopPropagation();
        showIosToast("Kamera siap mengambil foto status");
    });

    const btnPencil = document.getElementById("btnStatusPencil");
    btnPencil?.addEventListener("click", (e) => {
        e.stopPropagation();
        showIosToast("Tulis teks status baru...");
    });

    // Close Story modal button
    document.getElementById("btnCloseStory")?.addEventListener("click", () => {
        closeStatusStory();
    });

    // Reaction quick button in story modal
    document.getElementById("btnStoryReaction")?.addEventListener("click", () => {
        showIosToast("Reaksi terkirim! ❤️");
        setTimeout(closeStatusStory, 800);
    });

    // Reply form submission
    document.getElementById("storyReplyInput")?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const text = e.target.value.trim();
            if (text) {
                showIosToast(`Balasan terkirim ke cerita: "${text}"`);
                e.target.value = "";
                setTimeout(closeStatusStory, 1000);
            }
        }
    });
}

function openStatusStory(index) {
    _currentStoryIndex = index;
    const modal = document.getElementById("statusStoryModal");
    if (!modal) return;

    const story = KAIWA_STORIES[_currentStoryIndex];
    if (!story) return;

    const authorImg = document.getElementById("storyAuthorImg");
    const authorName = document.getElementById("storyAuthorName");
    const authorTime = document.getElementById("storyAuthorTime");
    const backdropMedia = document.getElementById("storyBackdropMedia");
    const captionJp = document.getElementById("storyCaptionJp");
    const captionRomaji = document.getElementById("storyCaptionRomaji");
    const captionId = document.getElementById("storyCaptionId");
    const progressFill = document.getElementById("storyProgressFill");

    if (authorImg) authorImg.src = story.avatar;
    if (authorName) authorName.textContent = `${story.name} (${story.kanjiName})`;
    if (authorTime) authorTime.textContent = story.time;
    if (backdropMedia) backdropMedia.src = story.image;
    if (captionJp) captionJp.textContent = story.textJp;
    if (captionRomaji) captionRomaji.textContent = story.romaji;
    if (captionId) captionId.textContent = story.meaning;

    modal.style.display = "flex";

    // Progress Bar Animation (5 Detik)
    if (_storyTimer) clearTimeout(_storyTimer);
    if (_storyProgressInterval) clearInterval(_storyProgressInterval);

    let progress = 0;
    if (progressFill) progressFill.style.width = "0%";

    const intervalStep = 50;
    const totalDuration = 5000;
    const stepIncrement = (intervalStep / totalDuration) * 100;

    _storyProgressInterval = setInterval(() => {
        progress += stepIncrement;
        if (progressFill) progressFill.style.width = Math.min(progress, 100) + "%";
        if (progress >= 100) {
            clearInterval(_storyProgressInterval);
            _storyProgressInterval = null;
            if (_currentStoryIndex < KAIWA_STORIES.length - 1) {
                openStatusStory(_currentStoryIndex + 1);
            } else {
                closeStatusStory();
            }
        }
    }, intervalStep);
}

function closeStatusStory() {
    if (_storyTimer) clearTimeout(_storyTimer);
    if (_storyProgressInterval) clearInterval(_storyProgressInterval);
    const modal = document.getElementById("statusStoryModal");
    if (modal) modal.style.display = "none";
}

// ==========================================================================
// 6. RENDER KARTU-KARTU KONTAK LAWAN BICARA (iOS GROUPED TABLE)
// ==========================================================================
function renderContactsGrid(filter = "all", searchQuery = "") {
    _currentFilter = filter;
    _currentSearchQuery = searchQuery;

    const grid = document.getElementById("contactsGrid");
    if (!grid) return;

    let filtered = KAIWA_CONTACTS;

    if (filter === "cewek") {
        filtered = filtered.filter(c => c.category === "cewek");
    } else if (filter === "favorites") {
        filtered = filtered.filter(c => c.id === "sakura" || c.id === "aoi");
    } else if (filter !== "all") {
        filtered = filtered.filter(c => c.category === filter);
    }

    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(c => 
            c.name.toLowerCase().includes(q) ||
            c.kanjiName.toLowerCase().includes(q) ||
            c.city.toLowerCase().includes(q) ||
            c.role.toLowerCase().includes(q) ||
            c.topic.toLowerCase().includes(q) ||
            c.level.toLowerCase().includes(q)
        );
    }

    grid.innerHTML = "";

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="ios-no-contacts-found">
                <svg class="ios-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:36px;height:36px;color:#8E8E93;margin:0 auto 10px;">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <div class="empty-title">Tidak Ada Kontak Ditemukan</div>
                <div class="empty-sub">Coba kata kunci pencarian lain atau pilih tab kategori berbeda.</div>
            </div>
        `;
        return;
    }

    const groups = {};
    const sorted = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    
    sorted.forEach(contact => {
        const initial = (contact.name[0] || "#").toUpperCase();
        if (!groups[initial]) groups[initial] = [];
        groups[initial].push(contact);
    });

    Object.keys(groups).sort().forEach(letter => {
        const letterHeader = document.createElement("div");
        letterHeader.className = "ios-alphabet-header";
        letterHeader.textContent = letter;
        grid.appendChild(letterHeader);

        const groupCard = document.createElement("div");
        groupCard.className = "ios-inset-grouped-card";

        groups[letter].forEach(contact => {
            const row = document.createElement("div");
            row.className = "ios-contact-table-row";
            row.setAttribute("data-contact-id", contact.id);
            row.innerHTML = `
                <div class="contact-row-avatar-box">
                    <img src="${contact.avatar}" alt="${contact.name}" class="contact-row-avatar-img" onerror="this.src='../gambar/icon.png'">
                    <span class="contact-row-online-dot"></span>
                </div>
                <div class="contact-row-info">
                    <div class="contact-row-name-line">
                        <span class="contact-row-name">${contact.name}</span>
                        <span class="contact-row-kanji">(${contact.kanjiName})</span>
                    </div>
                    <div class="contact-row-sub-line">
                        <span>${contact.city}</span>
                        <span class="contact-row-dot">·</span>
                        <span>${contact.role}</span>
                    </div>
                    <div class="contact-row-topic-line">
                        Topik: ${contact.topic}
                    </div>
                </div>
                <div class="contact-row-right">
                    <span class="contact-row-level">${contact.level}</span>
                    <button type="button" class="btn-ios-circle-call" aria-label="Telpon ${contact.name}" title="Telpon ${contact.name}">
                        ${SVG_ICONS.phoneCall}
                    </button>
                </div>
            `;

            row.querySelector(".btn-ios-circle-call")?.addEventListener("click", (e) => {
                e.stopPropagation();
                startOutgoingCallSimulation(contact);
            });

            row.addEventListener("click", () => {
                startOutgoingCallSimulation(contact);
            });

            groupCard.appendChild(row);
        });

        grid.appendChild(groupCard);
    });
}

function setupSearchBar() {
    const input = document.getElementById("contactSearchInput");
    const clearBtn = document.getElementById("btnClearSearch");
    if (!input) return;

    input.addEventListener("input", () => {
        const query = input.value.trim();
        if (clearBtn) {
            clearBtn.style.display = query.length > 0 ? "grid" : "none";
        }
        renderContactsGrid(_currentFilter, query);
    });

    clearBtn?.addEventListener("click", () => {
        input.value = "";
        clearBtn.style.display = "none";
        input.focus();
        renderContactsGrid(_currentFilter, "");
    });
}

function setupFilterTabs() {
    const tabs = document.querySelectorAll(".kaiwa-tab-btn");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("is-active"));
            tab.classList.add("is-active");
            renderContactsGrid(tab.dataset.filter, _currentSearchQuery);
        });
    });
}

function setupRandomCallButton() {
    const btn = document.getElementById("btnTriggerRandomCall");
    if (!btn) return;

    btn.addEventListener("click", () => {
        triggerRandomContactCall();
    });

    btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            triggerRandomContactCall();
        }
    });
}

function triggerRandomContactCall() {
    const btn = document.getElementById("btnTriggerRandomCall");
    const pill = btn?.querySelector(".btn-facetime-call-pill");
    if (btn) btn.style.pointerEvents = "none";
    if (pill) pill.innerHTML = `${SVG_ICONS.spinDice} <span>Mengacak...</span>`;

    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * KAIWA_CONTACTS.length);
        const pickedContact = KAIWA_CONTACTS[randomIndex];
        if (btn) btn.style.pointerEvents = "auto";
        if (pill) {
            pill.innerHTML = `
                <svg class="ios-btn-svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                <span>Acak</span>
            `;
        }
        startOutgoingCallSimulation(pickedContact);
    }, 600);
}

// ==========================================================================
// 4. SIMULASI NADA DERING WEB AUDIO API (AUTHENTIC TELEPHONE RING)
// ==========================================================================
function startAuthenticRingtone() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        if (!_audioCtx) _audioCtx = new AudioContext();
        if (_audioCtx.state === "suspended") _audioCtx.resume();

        // Putar pola nada dering telpon: 1.5 detik nada (400Hz + 450Hz), 3.5 detik jeda
        function playRingPulse() {
            if (!_audioCtx || _audioCtx.state === "closed") return;

            const now = _audioCtx.currentTime;
            const osc1 = _audioCtx.createOscillator();
            const osc2 = _audioCtx.createOscillator();
            const gainNode = _audioCtx.createGain();

            osc1.type = "sine";
            osc1.frequency.setValueAtTime(400, now);

            osc2.type = "sine";
            osc2.frequency.setValueAtTime(450, now);

            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.06, now + 0.1);
            gainNode.gain.setValueAtTime(0.06, now + 1.4);
            gainNode.gain.linearRampToValueAtTime(0.0001, now + 1.5);

            osc1.connect(gainNode);
            osc2.connect(gainNode);
            gainNode.connect(_audioCtx.destination);

            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 1.55);
            osc2.stop(now + 1.55);
        }

        playRingPulse();
        _ringToneLoopTimer = setInterval(playRingPulse, 3500);
    } catch (e) {
        console.warn("AudioContext error on ringtone:", e);
    }
}

function stopAuthenticRingtone() {
    if (_ringToneLoopTimer) {
        clearInterval(_ringToneLoopTimer);
        _ringToneLoopTimer = null;
    }
}

function playConnectedChime() {
    try {
        if (!_audioCtx) return;
        const now = _audioCtx.currentTime;
        const osc = _audioCtx.createOscillator();
        const gain = _audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.2);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(_audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
    } catch (e) {}
}

function playHangupChime() {
    try {
        if (!_audioCtx) return;
        const now = _audioCtx.currentTime;
        const osc = _audioCtx.createOscillator();
        const gain = _audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.25);

        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(_audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
    } catch (e) {}
}

// ==========================================================================
// 5. SIMULASI PANGGILAN KELUAR BERDERING (OUTGOING CALL SCREEN - 6 DETIK)
// ==========================================================================
function startOutgoingCallSimulation(contact) {
    _activeContact = contact;

    const callingModal = document.getElementById("callingOverlayModal");
    const avatarImg = document.getElementById("callingAvatarImg");
    const targetName = document.getElementById("callingTargetName");
    const targetJp = document.getElementById("callingTargetJp");
    const statusText = document.getElementById("callingStatusText");

    if (!callingModal) return;

    if (avatarImg) avatarImg.src = contact.avatar;
    if (targetName) targetName.textContent = contact.name;
    if (targetJp) targetJp.textContent = `${contact.kanjiName} · ${contact.city}`;
    if (statusText) statusText.innerHTML = `${SVG_ICONS.phoneRinging} <span>Berdering... (呼び出し中)</span>`;

    callingModal.style.display = "flex";

    // Mulai nada dering realistis
    startAuthenticRingtone();

    // Berlangsung tepat 6 detik (sesuai instruksi: "simulasi berdering 6 detik atau lebih dan saat sudah di angkat...")
    let ringCountdown = 6;
    if (_ringingTimer) clearInterval(_ringingTimer);

    _ringingTimer = setInterval(() => {
        ringCountdown--;
        if (ringCountdown <= 2 && statusText) {
            statusText.innerHTML = `<span class="connected-green-pulse"></span> <span>Menghubungkan... (接続中)</span>`;
        }

        if (ringCountdown <= 0) {
            clearInterval(_ringingTimer);
            _ringingTimer = null;
            stopAuthenticRingtone();
            playConnectedChime();
            callingModal.style.display = "none";
            startConnectedCall(contact);
        }
    }, 1000);
}

function setupCallingScreenButtons() {
    const cancelBtn = document.getElementById("btnCancelCalling");
    cancelBtn?.addEventListener("click", () => {
        if (_ringingTimer) {
            clearInterval(_ringingTimer);
            _ringingTimer = null;
        }
        stopAuthenticRingtone();
        playHangupChime();
        const callingModal = document.getElementById("callingOverlayModal");
        if (callingModal) callingModal.style.display = "none";
    });
}

// ==========================================================================
// 6. SIMULASI LAYAR PANGGILAN TERHUBUNG (IN-CALL REALISTIC SCREEN)
// ==========================================================================
function startConnectedCall(contact) {
    _activeContact = contact;
    _currentDialogueIndex = 0;
    _callDurationSeconds = 0;
    _isMuted = false;
    _volumeBoostLevel = 1;

    const connectedOverlay = document.getElementById("connectedCallOverlay");
    const avatarImg = document.getElementById("connectedAvatarImg");
    const callerName = document.getElementById("connectedCallerName");
    const videoEl = document.getElementById("kaiwaVideoElement");
    const fallbackStudio = document.getElementById("videoFallbackStudio");
    const studioAvatarImg = document.getElementById("studioAvatarImg");
    const timerDisplay = document.getElementById("callDurationText");

    if (!connectedOverlay) return;

    if (avatarImg) avatarImg.src = contact.avatar;
    if (callerName) callerName.textContent = `${contact.name} (${contact.kanjiName})`;
    if (timerDisplay) timerDisplay.textContent = "00:00";

    connectedOverlay.style.display = "flex";

    // Start Realtime Call Timer (Detik hijau tepat di paling atas layar)
    if (_callTimerInterval) clearInterval(_callTimerInterval);
    _callTimerInterval = setInterval(() => {
        _callDurationSeconds++;
        const mins = Math.floor(_callDurationSeconds / 60);
        const secs = _callDurationSeconds % 60;
        const timeFormatted = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
        if (timerDisplay) timerDisplay.textContent = timeFormatted;
    }, 1000);

    // Setup Video Horizontal
    if (videoEl) {
        videoEl.style.display = "block";
        videoEl.muted = false; // Suara aktif
        videoEl.volume = 1;
        videoEl.src = contact.videoFile;

        if (fallbackStudio) fallbackStudio.style.display = "none";

        // Autoplay video
        const playPromise = videoEl.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Autoplay blocked by browser policy: play muted
                videoEl.muted = true;
                videoEl.play();
                updateSpeakerBadge(true);
            });
        }

        // Fallback natural FaceTime jika video belum dimasukkan
        videoEl.onerror = () => {
            videoEl.style.display = "none";
            if (fallbackStudio) {
                fallbackStudio.style.display = "flex";
                if (studioAvatarImg) studioAvatarImg.src = contact.avatar;
            }
        };
    }

    updateSpeakerBadge(false);
    updateVolumeButtonState();

    // Simulasi audio percakapan natural (tanpa teks subtitle di layar)
    playCurrentDialogueAudio();

    // Percakapan mengalir otomatis bergulir setiap 7 detik secara alami
    if (_dialogueAutoTimer) clearInterval(_dialogueAutoTimer);
    _dialogueAutoTimer = setInterval(() => {
        advanceDialogueNaturally();
    }, 7000);

    // Rekam aktivitas belajar ke tracker profil jika tersedia
    if (typeof window.recordStudyActivity === 'function') {
        window.recordStudyActivity('chat', 1);
    }
}

// Simulasi Suara Percakapan Alami (Tanpa Subtitle di Layar)
function playCurrentDialogueAudio() {
    if (!_activeContact) return;
    const dialogues = _activeContact.dialogues || [];
    const currentDialogue = dialogues[_currentDialogueIndex] || dialogues[0];

    // Pelafalan suara bahasa Jepang alami jika video belum memiliki audio
    const cleanJp = currentDialogue.speakerJp.replace(/[「」]/g, '');
    speakJapaneseText(cleanJp);
}

// Aliran Obrolan Otomatis (Berjalan Natural di Belakang Layar)
function advanceDialogueNaturally() {
    if (!_activeContact) return;
    const dialogues = _activeContact.dialogues || [];
    if (!dialogues.length) return;

    if (_currentDialogueIndex < dialogues.length - 1) {
        _currentDialogueIndex++;
    } else {
        // Obrolan berulang secara halus
        _currentDialogueIndex = 0;
    }
    playCurrentDialogueAudio();
}

// ==========================================================================
// 7. TOMBOL KONTROL PANGGILAN iOS REALISTIS (REAL VECTOR SVG ICONS)
// (Kiri: Speaker Mute | Tengah: Akhiri Merah | Kanan: Volume Level)
// ==========================================================================
function setupConnectedScreenControls() {
    const btnMute = document.getElementById("btnKaiwaSpeakerMute");
    const btnEndCall = document.getElementById("btnKaiwaEndCall");
    const btnVolume = document.getElementById("btnKaiwaVolumeControl");

    // 1. Kiri: Tombol Logo Speaker (Membisukan / Mengaktifkan Suara Video)
    btnMute?.addEventListener("click", () => {
        const videoEl = document.getElementById("kaiwaVideoElement");
        _isMuted = !_isMuted;
        if (videoEl) videoEl.muted = _isMuted;
        updateSpeakerBadge(_isMuted);
    });

    // 2. Tengah: Tombol Akhiri Panggilan Merah
    btnEndCall?.addEventListener("click", () => {
        endConnectedCall();
    });

    // 3. Kanan: Tombol Volume Level
    btnVolume?.addEventListener("click", () => {
        const videoEl = document.getElementById("kaiwaVideoElement");
        if (_volumeBoostLevel === 1) {
            _volumeBoostLevel = 1.5;
            if (videoEl) videoEl.volume = 1;
            showIosToast("Volume: Boost 150%");
        } else if (_volumeBoostLevel === 1.5) {
            _volumeBoostLevel = 0.5;
            if (videoEl) videoEl.volume = 0.5;
            showIosToast("Volume: Rendah 50%");
        } else {
            _volumeBoostLevel = 1;
            if (videoEl) videoEl.volume = 1;
            showIosToast("Volume: Normal 100%");
        }
        updateVolumeButtonState();
    });
}

function updateSpeakerBadge(isMuted) {
    const btnMute = document.getElementById("btnKaiwaSpeakerMute");
    const iconSlot = document.getElementById("speakerIconSlot");
    const label = document.getElementById("labelSpeakerMute");

    if (btnMute) {
        btnMute.classList.toggle("is-muted", isMuted);
    }
    if (iconSlot) {
        iconSlot.innerHTML = isMuted ? SVG_ICONS.speakerMuted : SVG_ICONS.speakerOn;
    }
    if (label) {
        label.textContent = isMuted ? "Bisu" : "Speaker";
    }
}

function updateVolumeButtonState() {
    const btnVolume = document.getElementById("btnKaiwaVolumeControl");
    const label = document.getElementById("labelVolumeControl");
    if (!btnVolume) return;

    if (_volumeBoostLevel === 1.5) {
        btnVolume.innerHTML = SVG_ICONS.volumeBoost;
        btnVolume.classList.add("is-boosted");
        if (label) label.textContent = "150%";
    } else if (_volumeBoostLevel === 0.5) {
        btnVolume.innerHTML = SVG_ICONS.volumeLow;
        btnVolume.classList.remove("is-boosted");
        if (label) label.textContent = "50%";
    } else {
        btnVolume.innerHTML = SVG_ICONS.volumeSliders;
        btnVolume.classList.remove("is-boosted");
        if (label) label.textContent = "Volume";
    }
}

function endConnectedCall() {
    if (_callTimerInterval) {
        clearInterval(_callTimerInterval);
        _callTimerInterval = null;
    }
    if (_dialogueAutoTimer) {
        clearInterval(_dialogueAutoTimer);
        _dialogueAutoTimer = null;
    }

    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }

    const videoEl = document.getElementById("kaiwaVideoElement");
    if (videoEl) {
        videoEl.pause();
        videoEl.src = "";
    }

    playHangupChime();

    const connectedOverlay = document.getElementById("connectedCallOverlay");
    if (connectedOverlay) connectedOverlay.style.display = "none";

    // Berikan reward EXP belajar Kaiwa
    const currentExp = Number(localStorage.getItem("fournity_checkin_exp") || 0);
    localStorage.setItem("fournity_checkin_exp", currentExp + 45);

    const mins = Math.floor(_callDurationSeconds / 60);
    const secs = _callDurationSeconds % 60;
    const durStr = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;

    showIosToast(`Panggilan Selesai (${durStr}) · +45 EXP`);
}

// Pelafalan Suara Jepang
function speakJapaneseText(text) {
    if (!('speechSynthesis' in window)) return;
    try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "ja-JP";
        utterance.rate = 0.95;

        const voices = window.speechSynthesis.getVoices();
        const jaVoice = voices.find(v => v.lang === "ja-JP" || v.lang.startsWith("ja"));
        if (jaVoice) utterance.voice = jaVoice;

        window.speechSynthesis.speak(utterance);
    } catch (e) {
        console.warn("TTS unavailable:", e);
    }
}

// iOS Toast Banner (Dynamic Island Notification)
function showIosToast(message) {
    let toast = document.getElementById("iosToastBanner");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "iosToastBanner";
        toast.className = "ios-toast-banner";
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="connected-green-pulse"></span> <span>${message}</span>`;
    toast.classList.add("is-visible");

    setTimeout(() => {
        toast.classList.remove("is-visible");
    }, 2800);
}

