// xlsx 后处理器: 给指定 sheet 的指定列加「自动换行 + 顶端对齐」单元格样式。
//
// 为什么需要它: SheetJS (xlsx@0.18 社区版) 写出的 styles.xml 里 cellXfs 恒为 count="1",
// 无论给单元格赋什么 .s 都不落盘, 于是考评内容里的换行符在 Excel 里显示成一个空格,
// 整条 "2.2.1 履行下列主要职责:(1)...(2)..." 挤成一坨。
// 这里在 xlsx 写完之后解包 -> 注入一个 wrap 样式 + 给单元格打 s 索引 -> 重新按 ZIP 打包。
// 仅用 Node 标准库 zlib + Buffer, 不引第三方 zip 包, 也不依赖镜像里有 python3。

const zlib = require('zlib');

const u16 = (n) => { const b = Buffer.alloc(2); b.writeUInt16LE(n >>> 0); return b; };
const u32 = (n) => { const b = Buffer.alloc(4); b.writeUInt32LE(n >>> 0); return b; };
const SIG_EOCD = [0x50, 0x4b, 0x05, 0x06];

// CRC-32 (IEEE 802.3), ZIP 规范要求
const CRC_T = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_T[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

const DOS_DATE = 0x0021, DOS_TIME = 0x0000;      // 1980-01-01 00:00:00
const METHOD = 0x0008;                           // Deflate

function buildZip(parts) {
  const locals = [], centrals = [];
  let offset = 0;
  for (const { name, data } of parts) {
    // 直接 STORE(方式0) 不压缩: xlsx 内部是 XML, 再压缩收益很低,
    // 不压缩可以完全避开 deflate/deflateRaw 的行为差异, 结构最可控。
    const crc = crc32(data);
    const nm = Buffer.from(name, 'utf8');
    locals.push(Buffer.concat([
      Buffer.from([0x50, 0x4b, 0x03, 0x04]), u16(20), u16(0), u16(0),
      u16(DOS_TIME), u16(DOS_DATE),
      u32(crc), u32(data.length), u32(data.length), u16(nm.length), u16(0), nm, data
    ]));
    // central directory 头固定 46 字节: sig4 verMade2 verNeed2 flags2 method2 time2 date2
    // crc4 comp4 raw4 nameLen2 extLen2 comLen2 diskNo2 intAttr2 extAttr4 fileOffset4
    // 然后依次是 name、extra、comment(均为 0 长度)
    const cd = Buffer.concat([
      Buffer.from([0x50, 0x4b, 0x01, 0x02]), u16(20), u16(20), u16(0), u16(0),
      u16(DOS_TIME), u16(DOS_DATE),
      u32(crc), u32(data.length), u32(data.length),
      u16(nm.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset >>> 0),
      nm
    ]);
    centrals.push(cd);
    offset += locals[locals.length - 1].length;
  }
  const cdSize = centrals.reduce((n, b) => n + b.length, 0);
  const eocd = Buffer.concat([
    Buffer.from(SIG_EOCD), u16(0), u16(0), u16(parts.length), u16(parts.length),
    u32(cdSize), u32(offset), u16(0)
  ]);
  return Buffer.concat([...locals, ...centrals, eocd]);
}

// 顺序扫描 local header 解包
function unzip(buf) {
  const out = [];
  let i = 0;
  while (i + 30 <= buf.length && buf.readUInt32LE(i) === 0x04034b50) {
    const method = buf.readUInt16LE(i + 8);
    const compSize = buf.readUInt32LE(i + 18);
    const nLen = buf.readUInt16LE(i + 26);
    const xLen = buf.readUInt16LE(i + 28);
    const start = i + 30 + nLen + xLen;
    const name = buf.toString('utf8', i + 30, i + 30 + nLen);
    const comp = buf.subarray(start, start + compSize);
    out.push({ name, data: method === 8 ? zlib.inflateRawSync(comp) : Buffer.from(comp) });
    i = start + compSize;
  }
  return out;
}

function colLetter(idx) {
  let s = '', i = idx;
  for (;;) { s = String.fromCharCode(65 + (i % 26)) + s; i = Math.floor(i / 26) - 1; if (i < 0) break; }
  return s;
}

// 给某列数据行补 s="xfIdx" 样式索引 (已有 s 的不覆盖)
function markCol(xml, col, headerRows, xfIdx) {
  const letter = colLetter(col);
  const first = headerRows + 1;                     // 0-based 行号, 表头之后的第一行
  return xml.replace(/<c r="([A-Z]+)(\d+)"((?:\s+[a-zA-Z:]+="[^"]*")*)\s*(\/?)>/g, (m, c, r, attrs, self) => {
    if (c !== letter || parseInt(r, 10) < first) return m;
    if (/s="/.test(attrs)) return m;
    return `<c r="${c}${r}" s="${xfIdx}"${attrs}${self ? ' /' : ''}>`;
  });
}

// buf: SheetJS 生成的 xlsx Buffer
// sheetIdx: 0-based sheet 序号; headerRows: 表头行数; cols: 0-based 列号数组
// 返回: 注入 wrap 样式后的新 Buffer; 任一步失败返回 null (调用方回退到原文件)
function applyWrap(buf, sheetIdx, headerRows, cols) {
  let parts;
  try { parts = unzip(buf); } catch { return null; }
  const sx = 'xl/styles.xml';
  const sheetName = `xl/worksheets/sheet${sheetIdx + 1}.xml`;

  const styles = parts.find(p => p.name === sx);
  const sheet = parts.find(p => p.name === sheetName);
  if (!styles || !sheet) return null;

  // 1) styles.xml: cellXfs 末尾追加一个只带 alignment 的 xf
  const xml = styles.data.toString('utf8');
  const m = xml.match(/<cellXfs count="(\d+)"[^>]*>([\s\S]*?)<\/cellXfs>/);
  if (!m) return null;
  const xfIdx = parseInt(m[1], 10);
  const wrapXf = '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1">' +
    '<alignment wrapText="1" vertical="top"/></xf>';
  styles.data = Buffer.from(xml.replace(m[0], `<cellXfs count="${xfIdx + 1}">${m[2]}${wrapXf}</cellXfs>`), 'utf8');

  // 2) 目标 sheet: 逐列打样式索引
  let sxml = sheet.data.toString('utf8');
  for (const c of cols) sxml = markCol(sxml, c, headerRows, xfIdx);
  sheet.data = Buffer.from(sxml, 'utf8');

  // 3) 按原顺序重新打包
  let out;
  try { out = buildZip(parts); } catch { return null; }
  // 自检: 自己写的 zip 必须能被自己解出来, 否则返回 null 让调用方回退到原文件
  try {
    const chk = unzip(out);
    if (chk.length !== parts.length) return null;
    for (let i = 0; i < parts.length; i++) {
      if (chk[i].name !== parts[i].name || !chk[i].data.equals(parts[i].data)) return null;
    }
  } catch { return null; }
  return out;
}

module.exports = { applyWrap };
