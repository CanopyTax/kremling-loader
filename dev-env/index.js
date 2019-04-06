import css from './main.css';
import other from './other.css';
import krem from './krem';
console.log('kremling-loader', css)

let red, blue;

const cssEl = document.createElement('div');
const otherEl = document.createElement('div');
const br = document.createElement('br');
cssEl.innerHTML = `<div><strong>${css.id}</strong></div> ${css.styles}`;
otherEl.innerHTML = `<div><strong>${other.id}</strong></div> ${other.styles}`;
document.body.appendChild(cssEl);
document.body.appendChild(br);
document.body.appendChild(otherEl);

const styles = krem`
  .test {
    text-align: right;
    background-color: red;
    other-things: ${red ? 'red' : `test and ${blue ? 'red' : 'blue'} things`};
  }
  a:link {
    color: gray;
  }
  
  a:visited {
    color: green;
  }
  
  a:hover {
    color: rebeccapurple;
  }
  
  a:active {
    color: teal;
  }
  
  a:link, a:visited, a:hover, a:active {
    background-color: green;
    color: white;
    padding: 10px 25px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
  }  
`;

console.log('kremling-inline-loader', styles)