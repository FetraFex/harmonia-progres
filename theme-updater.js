const fs = require('fs');
const path = require('path');

const files = [
  'src/app/candidater/page.tsx',
  'src/app/candidater/eligibilite/page.tsx',
  'src/app/candidater/profil/page.tsx',
  'src/app/candidater/informations/page.tsx',
  'src/app/candidater/motivation/page.tsx',
  'src/app/candidater/projet/page.tsx',
  'src/app/candidater/documents/page.tsx',
  'src/app/candidater/verification/page.tsx',
  'src/app/candidater/confirmation/page.tsx',
  'src/app/candidater/suivi/page.tsx',
  'src/components/candidate/ReviewSection.tsx',
  'src/components/candidate/FileUploader.tsx',
  'src/components/candidate/CandidateHeader.tsx'
];

for (const file of files) {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) continue;
  
  let content = fs.readFileSync(fullPath, 'utf8');

  // Page specific wrappers
  content = content.replace(/className="min-h-screen bg-white text-gray-900"/g, 'className="min-h-screen bg-void text-text-primary"');
  content = content.replace(/style=\{\{[\s\S]*?\} as React\.CSSProperties\}/g, '');
  
  // Colors
  content = content.replace(/var\(--black\)/g, 'text-primary'); // but often it's text-[var(--black)] -> text-text-primary
  content = content.replace(/text-\[var\(--black\)\]/g, 'text-text-primary');
  content = content.replace(/var\(--lime\)/g, 'teal');
  content = content.replace(/bg-\[var\(--lime\)\]/g, 'bg-teal');
  content = content.replace(/border-\[var\(--lime\)\]/g, 'border-teal');
  content = content.replace(/text-\[var\(--lime\)\]/g, 'text-teal');
  content = content.replace(/ring-\[var\(--lime\)\]/g, 'ring-teal');
  
  content = content.replace(/text-\[var\(--text-muted\)\]/g, 'text-text-muted');
  
  // borders and backgrounds
  content = content.replace(/border-\[var\(--border\)\]/g, 'border-glass-border');
  content = content.replace(/bg-white/g, 'bg-void-2'); // default to void-2 for cards
  content = content.replace(/bg-gray-50/g, 'bg-glass-bg-strong');
  content = content.replace(/hover:bg-gray-50/g, 'hover:bg-glass-bg-strong');
  content = content.replace(/bg-gray-100/g, 'bg-glass-bg-strong');
  content = content.replace(/bg-gray-200/g, 'bg-glass-border-strong');
  content = content.replace(/text-gray-900/g, 'text-text-primary');
  content = content.replace(/text-gray-600/g, 'text-text-secondary');
  content = content.replace(/text-gray-400/g, 'text-text-muted');
  content = content.replace(/hover:border-gray-300/g, 'hover:border-glass-border-strong');
  
  // Common input/card patterns
  content = content.replace(/border-2/g, 'border'); // too thick
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Updated ' + file);
}
