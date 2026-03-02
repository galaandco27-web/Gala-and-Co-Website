const fs = require('fs');
let code = fs.readFileSync('css/styles.css', 'utf8');

// We need to add styling for .hero-h1-support and .hero-h1-primary
// .hero-h1 is currently:
// .hero-h1 {
//   font-family: var(--font-heading);
//   font-size: clamp(2.5rem, 8vw, 5.5rem);
//   font-weight: 400;
//   letter-spacing: 0.08em;
//   line-height: 1.1;
//   color: var(--color-primary-fg);
//   ...
// }

// Let's modify the CSS file
const newHeroClasses = `
.hero-h1-support {
  font-size: 0.75em; /* relative to parent h1 */
  font-weight: 300;
  color: color-mix(in srgb, var(--color-primary-fg) 85%, transparent);
}

.hero-h1-primary {
  display: block;
  font-size: 1.25em; /* 25% larger */
  font-weight: 400;
  margin-top: 0.1em;
}
`;

// Insert the new classes right after .hero-h1 block
if (!code.includes('.hero-h1-support')) {
  code = code.replace(/(\.hero-h1 \{[\s\S]*?\n\s*\})/, "$1\n" + newHeroClasses);
  fs.writeFileSync('css/styles.css', code);
  console.log('patched styles.css with typography hierarchy');
} else {
  console.log('typography classes already exist');
}
