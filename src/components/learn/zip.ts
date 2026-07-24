/**
 * 아주 작은 ZIP 만들기 (압축 없이 담기만 하는 store 방식).
 *
 * 학습 결과물을 내려받아 깃허브에 올리려면 폴더 구조가 살아 있는 zip 이 필요하다.
 * 파일이 십수 개짜리 텍스트뿐이라 압축까지 할 이유가 없어서
 * jszip 같은 라이브러리를 추가하지 않고 store 방식으로 직접 만든다.
 */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pushU16(out: number[], v: number) {
  out.push(v & 0xff, (v >>> 8) & 0xff);
}

function pushU32(out: number[], v: number) {
  out.push(v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff);
}

/**
 * @param files 경로 → 내용. 경로 앞의 "/" 는 떼고 담는다.
 */
export function makeZip(files: Record<string, string>): Blob {
  const encoder = new TextEncoder();
  const local: number[] = [];
  const central: number[] = [];
  const entries: { nameBytes: Uint8Array; crc: number; size: number; offset: number }[] =
    [];

  for (const [rawPath, content] of Object.entries(files)) {
    const name = rawPath.replace(/^\/+/, "");
    const nameBytes = encoder.encode(name);
    const data = encoder.encode(content);
    const crc = crc32(data);
    const offset = local.length;

    // Local file header
    pushU32(local, 0x04034b50);
    pushU16(local, 20); // version needed
    pushU16(local, 0x0800); // UTF-8 파일명 플래그
    pushU16(local, 0); // 압축 없음 (store)
    pushU16(local, 0); // mod time
    pushU16(local, 0); // mod date
    pushU32(local, crc);
    pushU32(local, data.length);
    pushU32(local, data.length);
    pushU16(local, nameBytes.length);
    pushU16(local, 0); // extra
    local.push(...nameBytes, ...data);

    entries.push({ nameBytes, crc, size: data.length, offset });
  }

  for (const e of entries) {
    pushU32(central, 0x02014b50);
    pushU16(central, 20); // version made by
    pushU16(central, 20); // version needed
    pushU16(central, 0x0800);
    pushU16(central, 0);
    pushU16(central, 0);
    pushU16(central, 0);
    pushU32(central, e.crc);
    pushU32(central, e.size);
    pushU32(central, e.size);
    pushU16(central, e.nameBytes.length);
    pushU16(central, 0); // extra
    pushU16(central, 0); // comment
    pushU16(central, 0); // disk number
    pushU16(central, 0); // internal attrs
    pushU32(central, 0); // external attrs
    pushU32(central, e.offset);
    central.push(...e.nameBytes);
  }

  const end: number[] = [];
  pushU32(end, 0x06054b50);
  pushU16(end, 0);
  pushU16(end, 0);
  pushU16(end, entries.length);
  pushU16(end, entries.length);
  pushU32(end, central.length);
  pushU32(end, local.length);
  pushU16(end, 0);

  return new Blob([new Uint8Array(local), new Uint8Array(central), new Uint8Array(end)], {
    type: "application/zip",
  });
}

export function downloadZip(files: Record<string, string>, filename: string) {
  const blob = makeZip(files);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
