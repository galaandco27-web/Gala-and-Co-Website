const fs = require('fs');
let code = fs.readFileSync('css/styles.css', 'utf8');

const newCSS = `/* ============================================================
   CTA BLOCK SECTION — Premium White Card
   ============================================================ */
.cta-block-section {
  background-color: var(--color-bg); /* Match body background */
  padding-block: var(--space-80) calc(var(--space-80) + 16px);
  padding-inline: var(--px-mobile);
  text-align: center;
  position: relative;
}

.cta-card {
  background-color: #ffffff;
  max-width: 900px;
  margin-inline: auto;
  border-radius: 24px;
  padding-block: var(--space-80);
  padding-inline: var(--space-32);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-24);
}

.cta-card-eyebrow {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 300;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--color-muted-fg);
}

.cta-card-h2 {
  font-family: var(--font-heading);
  font-size: clamp(2.6rem, 6vw, 4.2rem);
  font-weight: 400;
  letter-spacing: 0.04em;
  line-height: 1.1;
  color: var(--color-fg);
}

.cta-card-accent {
  font-style: italic;
  font-weight: 500;
  color: var(--color-fg);
}

.cta-card-sub {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 300;
  color: var(--color-muted-fg);
  letter-spacing: 0.03em;
  max-width: 30rem;
}

.cta-card-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: var(--space-16);
  padding: 1rem 2.5rem;
  background-color: var(--color-primary);
  color: #ffffff;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  border-radius: 40px; /* pill shape */
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.cta-card-btn:hover {
  background-color: hsl(359, 95%, 20%);
  transform: translateY(-2px);
}
`;

// Remove old CTA CSS
code = code.replace(/\/\* ============================================================\s+CTA BLOCK SECTION[\s\S]*?(?=\/\* ============================================================\s+FOOTER — CONTACT DETAILS COLUMN)/, newCSS + "\n");

// Fix any media query issues
code = code.replace(/\.cta-block-h2\s*\{[\s\S]*?\}/g, "");
code = code.replace(/\.cta-block-inner\s*\{[\s\S]*?\}/g, "");

fs.writeFileSync('css/styles.css', code);
console.log('patched cta block css');
