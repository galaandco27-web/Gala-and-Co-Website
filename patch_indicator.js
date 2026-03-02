const fs = require('fs');
let code = fs.readFileSync('css/styles.css', 'utf8');

const newKeyframes = `
@keyframes scroll-breathe {
  0%, 100% {
    opacity: 0.45;
  }
  50% {
    opacity: 0.9;
  }
}

@keyframes scroll-drop {
  0% { transform: translateY(-100%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(100%); opacity: 0; }
}`;

const oldClass = `.scroll-indicator-line {
  width: 1px;
  height: 100%;
  background-color: var(--color-primary-fg);
  animation: scroll-breathe 2.5s ease-in-out infinite;
}`;

const newClass = `.scroll-indicator-line {
  width: 1px;
  height: 50%;
  background-color: var(--color-primary-fg);
  animation: scroll-drop 2s cubic-bezier(0.22, 1, 0.36, 1) infinite;
}`;

code = code.replace(/@keyframes scroll-breathe \{[\s\S]*?\}/, newKeyframes);
code = code.replace(/\.scroll-indicator-line \{[\s\S]*?\}/, newClass);

fs.writeFileSync('css/styles.css', code);
console.log('patched styles.css');
