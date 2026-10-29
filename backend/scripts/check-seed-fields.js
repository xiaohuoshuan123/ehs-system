// 静态预检：找出 seed.js 里与 Prisma 模型不匹配的字段
// 用法：node check-seed-fields.js（在 backend 目录下）
const fs = require('fs');
const { Prisma } = require('@prisma/client');

const src = fs.readFileSync('prisma/seed.js', 'utf8');
const models = Object.fromEntries(
  Prisma.dmmf.datamodel.models.map((m) => [m.name, new Set(m.fields.map((f) => f.name))])
);

const camelToPascal = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// 从 index 开始做括号平衡，返回 [参数文本数组]
function splitArgs(text, start) {
  const args = [];
  let depth = 0;
  let cur = '';
  let quote = null;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (quote) {
      cur += c;
      if (c === '\\') { cur += text[++i]; continue; }
      if (c === quote) quote = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') { quote = c; cur += c; continue; }
    if (c === '(' || c === '{' || c === '[') { depth++; cur += c; continue; }
    if (c === ')' || c === '}' || c === ']') {
      depth--;
      if (depth < 0) { args.push(cur); return args; }
      cur += c;
      continue;
    }
    if (c === ',' && depth === 0) { args.push(cur); cur = ''; continue; }
    cur += c;
  }
  args.push(cur);
  return args;
}

// 取对象字面量的顶层键名（跳过字符串与嵌套）
function topLevelKeys(objText) {
  const t = objText.trim();
  if (!t.startsWith('{')) return null;
  const keys = [];
  let depth = 0;
  let quote = null;
  let buf = '';
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (quote) {
      if (c === '\\') { i++; continue; }
      if (c === quote) quote = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') { quote = c; continue; }
    if (c === '{' || c === '(' || c === '[') { depth++; if (depth > 1) { buf = ''; } continue; }
    if (c === '}' || c === ')' || c === ']') { depth--; if (depth > 1) buf = ''; continue; }
    if (depth === 1) {
      if (c === ',' || c === ':' || c === '\n') {
        const k = buf.trim().replace(/^\.\.\./, '');
        if (k && /^[A-Za-z_$][\w$]*$/.test(k) && c === ':') keys.push(k);
        buf = '';
        continue;
      }
      buf += c;
    }
  }
  return keys;
}

const problems = [];
const skipped = [];
const re = /ensureOne\(\s*prisma\.(\w+)\s*,/g;
let m;
let count = 0;
while ((m = re.exec(src))) {
  const modelKey = m[1];
  const modelName = camelToPascal(modelKey);
  const fields = models[modelName];
  if (!fields) { skipped.push(`${modelName}（模型不存在）`); continue; }
  const args = splitArgs(src, m.index + m[0].length - 1);
  const line = src.slice(0, m.index).split('\n').length;
  count++;

  for (const [idx, label] of [[1, 'where'], [2, 'data']]) {
    const raw = args[idx];
    if (raw === undefined) continue;
    const keys = topLevelKeys(raw);
    if (!keys) { if (raw.trim()) skipped.push(`L${line} ${modelName}.${label}（非字面量，无法静态检查）`); continue; }
    const bad = keys.filter((k) => !fields.has(k));
    if (bad.length) problems.push(`L${line} ${modelName}.${label}: 模型无此字段 -> ${bad.join(', ')}`);
  }
}

console.log(`检查 ${count} 处 ensureOne 调用，覆盖 ${Object.keys(models).length} 个模型`);
if (problems.length) {
  console.log('\n❌ 字段冲突:');
  problems.forEach((p) => console.log('  ' + p));
} else {
  console.log('\n✅ 未发现字段冲突');
}
if (skipped.length) {
  console.log('\n⚠️ 跳过（需人工确认）:');
  [...new Set(skipped)].slice(0, 10).forEach((s) => console.log('  ' + s));
}
