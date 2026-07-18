const fs = require('fs');
const a = fs.readFileSync('data/champions.json', 'utf8');
const b = fs.readFileSync('src/data/champions.json', 'utf8');
console.log('champions same:', a === b, 'len1:', a.length, 'len2:', b.length);

const c = fs.readFileSync('data/spells.json', 'utf8');
const d = fs.readFileSync('src/data/spells.json', 'utf8');
console.log('spells same:', c === d, 'len1:', c.length, 'len2:', d.length);
