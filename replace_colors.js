const fs = require('fs');

function replaceColors(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  const replacements = {
    'indigo-950': 'slate-900',
    'indigo-900': 'slate-800',
    'indigo-800': 'slate-700',
    'indigo-600': 'blue-600',
    'indigo-500': 'blue-500',
    'indigo-300': 'slate-400',
    'indigo-200': 'slate-300',
    'indigo-100': 'slate-200',
    'indigo-50': 'slate-50',
    'purple-950': 'slate-900',
    'purple-900': 'slate-800',
    'purple-500': 'blue-500',
    'fuchsia-900': 'slate-800',
    'pink-600': 'blue-600',
    'pink-500': 'blue-500',
    'pink-400': 'blue-400',
    'pink-300': 'blue-300',
    'pink-100': 'blue-100',
    'pink-50': 'blue-50',
    'orange-600': 'cyan-600',
    'orange-500': 'cyan-500',
    'orange-400': 'cyan-400',
    'orange-100': 'cyan-100',
    'orange-50': 'cyan-50'
  };

  for (const [oldClass, newClass] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${oldClass}\\b`, 'g');
    content = content.replace(regex, newClass);
  }

  fs.writeFileSync(filePath, content);
  console.log(`Updated colors in ${filePath}`);
}

replaceColors('src/App.tsx');
replaceColors('src/Admin.tsx');
