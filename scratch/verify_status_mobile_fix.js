const fs = require('fs');

const html = fs.readFileSync('pages/pesan.html', 'utf8');

const requiredIds = [
    'chatListView',
    'kaiwaLobbyView',
    'statusView',
    'chatRoomView',
    'tabNavFavorites',
    'tabNavContacts',
    'tabNavStatus',
    'tabNavChats',
    'contactsGrid',
    'recentStatusList',
    'contactSearchInput',
    'statusFilterInput',
    'btnClearSearch',
    'btnTriggerRandomCall',
    'myStatusRow',
    'myStatusAvatar',
    'myStatusSubtext',
    'btnStatusCamera',
    'btnStatusPencil',
    'mainIosTabBar',
    'btnStoryReaction'
];

let missing = [];
for (const id of requiredIds) {
    if (!html.includes(`id="${id}"`)) {
        missing.push(id);
    }
}

console.log('Missing IDs:', missing);

// Check div open/close tags
const openDivs = (html.match(/<div(\s|>)/g) || []).length;
const closeDivs = (html.match(/<\/div>/g) || []).length;
console.log('Open divs:', openDivs, 'Close divs:', closeDivs);

// Check section open/close tags
const openSections = (html.match(/<section(\s|>)/g) || []).length;
const closeSections = (html.match(/<\/section>/g) || []).length;
console.log('Open sections:', openSections, 'Close sections:', closeSections);

// Check classes for chatListView, kaiwaLobbyView, statusView
const clMatch = html.match(/id="chatListView"[^>]*class="([^"]*)"/);
const klMatch = html.match(/id="kaiwaLobbyView"[^>]*class="([^"]*)"/);
const svMatch = html.match(/id="statusView"[^>]*class="([^"]*)"/);

console.log('chatListView classes:', clMatch ? clMatch[1] : 'NOT FOUND');
console.log('kaiwaLobbyView classes:', klMatch ? klMatch[1] : 'NOT FOUND');
console.log('statusView classes:', svMatch ? svMatch[1] : 'NOT FOUND');
