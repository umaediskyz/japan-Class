const fs = require('fs');

const css = fs.readFileSync('css/kaiwa.css', 'utf8');

const openBraces = (css.match(/\{/g) || []).length;
const closeBraces = (css.match(/\}/g) || []).length;
console.log('Open braces in kaiwa.css:', openBraces, 'Close braces:', closeBraces);

const pesanCss = fs.readFileSync('css/pesan.css', 'utf8');
const pOpen = (pesanCss.match(/\{/g) || []).length;
const pClose = (pesanCss.match(/\}/g) || []).length;
console.log('Open braces in pesan.css:', pOpen, 'Close braces:', pClose);
