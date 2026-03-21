/**
 * Unambiguous alphabet (no 0/O, 1/I/L confusion).
 * 32 chars → 6-char codes give 32^6 ≈ 1 billion unique deck orderings.
 */
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ_';
const BASE = ALPHABET.length; // 32
const CODE_LEN = 6;

/** Mulberry32 — fast, high-quality 32-bit seeded PRNG */
export function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateCode(): string {
  const seed = (Math.random() * 0xffffffff) >>> 0;
  return seedToCode(seed);
}

export function seedToCode(seed: number): string {
  let n = seed >>> 0;
  let code = '';
  for (let i = 0; i < CODE_LEN; i++) {
    code = ALPHABET[n % BASE] + code;
    n = Math.floor(n / BASE);
  }
  return code;
}

/**
 * Decode the first 6 characters as the deck seed (used for shuffle order).
 * Longer codes (e.g. Iron Gang 7-char with Hook suffix) use only the prefix.
 */
export function codeToSeed(code: string): number | null {
  const upper = code.toUpperCase().trim();
  if (upper.length < CODE_LEN) return null;
  const slice = upper.slice(0, CODE_LEN);
  let n = 0;
  for (const char of slice) {
    const idx = ALPHABET.indexOf(char);
    if (idx === -1) return null;
    n = n * BASE + idx;
  }
  return n >>> 0;
}

export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  const rand = mulberry32(seed);
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
