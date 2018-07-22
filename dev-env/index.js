import css from './main.css';
import other from './other.css';

const cssEl = document.createElement('div');
const otherEl = document.createElement('div');
const br = document.createElement('br');
cssEl.innerHTML = `<div><strong>${css.id}</strong></div> ${css.styles}`;
otherEl.innerHTML = `<div><strong>${other.id}</strong></div> ${other.styles}`;
document.body.appendChild(cssEl);
document.body.appendChild(br);
document.body.appendChild(otherEl);
