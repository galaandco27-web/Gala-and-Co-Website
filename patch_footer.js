const fs = require('fs');
let code = fs.readFileSync('css/styles.css', 'utf8');

const oldLinksBlock = /\.footer-links-group\s*\{[\s\S]*?\.footer-cta\s*a:hover\s*\{[\s\S]*?\}/;

const newLinksBlock = `.footer-col-nav nav,
.footer-col-social nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.footer-col-nav a,
.footer-col-social a {
  font-family: var(--font-body);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: color-mix(in srgb, var(--color-bg) 65%, transparent);
  transition: color 0.4s var(--ease-luxury);
  text-decoration: none;
}

.footer-col-nav a:hover,
.footer-col-social a:hover {
  color: var(--color-primary);
}

/* Base grid on mobile: 1 column */
.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-48);
}
`;

code = code.replace(oldLinksBlock, newLinksBlock);

// Remove old .footer-grid base rule which was just: .footer-grid { display: grid; gap: 3rem; }
code = code.replace(/\.footer-grid\s*\{\s*display:\s*grid;\s*gap:\s*3rem;\s*\}/, "");

// Modify the old .footer-contact-col styling
const oldContactCol = /\.footer-contact-col\s*\{[\s\S]*?\.footer-contact-col\s*address\s*\{[\s\S]*?\}/;
const newContactCol = `.footer-col-contact address,
.footer-col-address address {
  display: flex;
  flex-direction: column;
  gap: var(--space-24);
  font-style: normal;
}`;
code = code.replace(oldContactCol, newContactCol);

// 1024px media query modification for 5 column
const mq1024 = /@media \(\s*min-width:\s*1024px\s*\)\s*\{/;
const newMQ1024 = `@media (min-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr;
    gap: var(--space-32);
  }
`;
code = code.replace(mq1024, newMQ1024);

// Tablet media query repair (768px might have .footer-grid { grid-template-columns: 1fr 1fr 1fr; align-items: start; })
code = code.replace(/(\.footer-grid\s*\{\s*grid-template-columns:)\s*1fr 1fr 1fr;/, "$1 1fr 1fr;");

fs.writeFileSync('css/styles.css', code);
console.log('patched styles.css for footer grid');
