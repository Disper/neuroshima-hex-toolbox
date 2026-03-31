#!/usr/bin/env node

import { mkdir, readdir, readFile, rm, writeFile, copyFile } from 'fs/promises';
import path from 'path';
import ts from 'typescript';

const ROOT = '/Users/i316752/Private/Dev/NeuroshimaHexRandomizer';
const SRC = path.join(ROOT, 'src');
const ARMY_DIR = path.join(SRC, 'data', 'armies');
const OUT_SHARED = path.join(ROOT, 'mobile-shared', 'generated');
const OUT_ANDROID_ASSETS = path.join(ROOT, 'android', 'app', 'src', 'main', 'assets', 'generated');
const OUT_ANDROID_IMAGES = path.join(ROOT, 'android', 'app', 'src', 'main', 'assets', 'images');
const OUT_ANDROID_VALUES = path.join(ROOT, 'android', 'app', 'src', 'main', 'res', 'values');
const OUT_ANDROID_VALUES_PL = path.join(ROOT, 'android', 'app', 'src', 'main', 'res', 'values-pl');
const OUT_IOS_GENERATED = path.join(ROOT, 'ios', 'NeuroshimaHexNative', 'Resources', 'Generated');
const OUT_IOS_IMAGES = path.join(ROOT, 'ios', 'NeuroshimaHexNative', 'Resources', 'Images');
const OUT_IOS_XCSTRINGS = path.join(
  ROOT,
  'ios',
  'NeuroshimaHexNative',
  'Resources',
  'Localizable.xcstrings'
);

const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ_';
const BASE = ALPHABET.length;
const CODE_LEN = 6;
const IRON_GANG_ARMY_ID = 'iron-gang';
const MERCHANTS_GUILD_ARMY_ID = 'merchants-guild';
const MG_SQUAD_LEADER_TILE_ID = 'mg-squad-leader';
const SALT_RESPAWN_1 = 0x52e571;
const SALT_RESPAWN_2 = 0x52e572;

/**
 * Mobile-friendly mirror of the web tile category palette.
 * Values are exported as concrete colors so native clients can render the same
 * category chips/badges without depending on Tailwind tokens.
 */
const CATEGORY_THEME = {
  hq: {
    cardBorder: 'rgba(245, 158, 11, 0.5)',
    cardChipBackground: 'rgba(69, 26, 3, 0.6)',
    cardChipBorder: 'rgba(245, 158, 11, 0.3)',
    cardChipText: '#fbbf24',
    badgeBackground: '#f59e0b',
    badgeText: '#451a03',
    fallbackBackground: 'rgba(69, 26, 3, 0.6)',
  },
  instant: {
    cardBorder: 'rgba(239, 68, 68, 0.4)',
    cardChipBackground: 'rgba(69, 10, 10, 0.6)',
    cardChipBorder: 'rgba(239, 68, 68, 0.3)',
    cardChipText: '#f87171',
    badgeBackground: '#ef4444',
    badgeText: '#450a0a',
    fallbackBackground: 'rgba(69, 10, 10, 0.5)',
  },
  soldier: {
    cardBorder: 'rgba(59, 130, 246, 0.4)',
    cardChipBackground: 'rgba(23, 37, 84, 0.6)',
    cardChipBorder: 'rgba(59, 130, 246, 0.3)',
    cardChipText: '#60a5fa',
    badgeBackground: '#3b82f6',
    badgeText: '#172554',
    fallbackBackground: 'rgba(23, 37, 84, 0.5)',
  },
  implant: {
    cardBorder: 'rgba(139, 92, 246, 0.4)',
    cardChipBackground: 'rgba(46, 16, 101, 0.6)',
    cardChipBorder: 'rgba(139, 92, 246, 0.3)',
    cardChipText: '#a78bfa',
    badgeBackground: '#8b5cf6',
    badgeText: '#2e1065',
    fallbackBackground: 'rgba(46, 16, 101, 0.5)',
  },
  foundation: {
    cardBorder: 'rgba(100, 116, 139, 0.4)',
    cardChipBackground: 'rgba(2, 6, 23, 0.6)',
    cardChipBorder: 'rgba(100, 116, 139, 0.3)',
    cardChipText: '#94a3b8',
    badgeBackground: '#64748b',
    badgeText: '#020617',
    fallbackBackground: 'rgba(2, 6, 23, 0.5)',
  },
  module: {
    cardBorder: 'rgba(16, 185, 129, 0.4)',
    cardChipBackground: 'rgba(2, 44, 34, 0.6)',
    cardChipBorder: 'rgba(16, 185, 129, 0.3)',
    cardChipText: '#34d399',
    badgeBackground: '#10b981',
    badgeText: '#022c22',
    fallbackBackground: 'rgba(2, 44, 34, 0.5)',
  },
};

const HOOK_REPLACEMENT_SPECS = [
  { suffix: '1', replacedTileId: 'ig-mountain', label: 'Mountain', weight: 1 },
  { suffix: '2', replacedTileId: 'ig-boss', label: 'Boss', weight: 1 },
  { suffix: '3', replacedTileId: 'ig-officer', label: 'Officer', weight: 2 },
  { suffix: '4', replacedTileId: 'ig-order', label: 'Order', weight: 2 },
  { suffix: '5', replacedTileId: 'ig-motorcyclist', label: 'Biker', weight: 2 },
  { suffix: '6', replacedTileId: 'ig-double-move', label: 'Doubled Move', weight: 1 },
  { suffix: '7', replacedTileId: 'ig-fanatic', label: 'Fanatic', weight: 1 },
  { suffix: '8', replacedTileId: 'ig-ranged-netter', label: 'Ranged Net Fighter', weight: 1 },
  { suffix: '9', replacedTileId: 'ig-lumberjack', label: 'Lumberjack', weight: 1 },
];

const WIREMEN_TECH_BONUS_ORDER = ['ini0', 'iniPlus1', 'matka', 'meleePlus1', 'rangedPlus1'];
const BONUS_BY_TILE_ID = {
  'wiremen-sniper': { ini0: 1 },
  'wiremen-castling-ini': { iniPlus1: 1 },
  'wiremen-castling-matka': { matka: 1 },
  'wiremen-push-cios': { meleePlus1: 1 },
  'wiremen-push-matka': { matka: 1 },
  'wiremen-push-strzal': { rangedPlus1: 1 },
  'wiremen-move-cios': { meleePlus1: 1 },
  'wiremen-move-ini': { iniPlus1: 1 },
  'wiremen-move-matka': { matka: 1 },
  'wiremen-move-strzal': { rangedPlus1: 1 },
  'wiremen-battle-cios-ini': { iniPlus1: 1, meleePlus1: 1 },
  'wiremen-battle-matka-cios': { matka: 1, meleePlus1: 1 },
  'wiremen-battle-matka-strzal': { matka: 1, rangedPlus1: 1 },
  'wiremen-battle-strzal-ini': { iniPlus1: 1, rangedPlus1: 1 },
  'wiremen-battle-zero-ini': { iniPlus1: 1, ini0: 1 },
};

function normalizePosix(p) {
  return p.split(path.sep).join('/');
}

function decodeHtmlEntities(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'");
}

function xmlEscape(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '\\"')
    .replaceAll("'", "\\'");
}

function objcStringEscape(value) {
  return value.replaceAll('\\', '\\\\').replaceAll('"', '\\"').replaceAll('\n', '\\n');
}

function ensureUInt32(n) {
  return n >>> 0;
}

function mulberry32(seed) {
  let s = ensureUInt32(seed);
  return () => {
    s = ensureUInt32(s + 0x6d2b79f5);
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ensureUInt32(t ^ (t >>> 14)) / 4294967296;
  };
}

function seedToCode(seed) {
  let n = ensureUInt32(seed);
  let code = '';
  for (let i = 0; i < CODE_LEN; i += 1) {
    code = ALPHABET[n % BASE] + code;
    n = Math.floor(n / BASE);
  }
  return code;
}

function codeToSeed(code) {
  const upper = code.toUpperCase().trim();
  if (upper.length < CODE_LEN) return null;
  let n = 0;
  for (const char of upper.slice(0, CODE_LEN)) {
    const idx = ALPHABET.indexOf(char);
    if (idx === -1) return null;
    n = n * BASE + idx;
  }
  return ensureUInt32(n);
}

function seededShuffle(arr, seed) {
  const copy = [...arr];
  const rand = mulberry32(seed);
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildDeck(army) {
  const instances = [];
  for (const tile of army.tiles) {
    if (tile.excludeFromDeck) continue;
    for (let i = 0; i < tile.count; i += 1) {
      instances.push({
        instanceId: `${tile.id}-${i}`,
        tile,
        armyId: army.id,
      });
    }
  }
  return instances;
}

function parseIronGangDeckCode(code) {
  const upper = code.toUpperCase().trim();
  if (upper.length !== 7) {
    return { mode: null, error: { kind: 'wrong-length' } };
  }
  if (codeToSeed(upper) === null) {
    return { mode: null, error: { kind: 'invalid-seed' } };
  }
  const suffix = upper[6];
  if (suffix === '0') return { mode: 'no-hook', error: null };
  const spec = HOOK_REPLACEMENT_SPECS.find((item) => item.suffix === suffix);
  if (!spec) return { mode: null, error: { kind: 'invalid-suffix' } };
  return { mode: `replace:${spec.replacedTileId}`, error: null };
}

function applyIronGangHookMode(deck, mode) {
  if (mode === 'no-hook') {
    return deck.filter((entry) => entry.tile.id !== 'ig-hook');
  }
  const replacedTileId = mode.slice('replace:'.length);
  const idx = deck.findIndex((entry) => entry.tile.id === replacedTileId);
  if (idx === -1) return [...deck];
  return [...deck.slice(0, idx), ...deck.slice(idx + 1)];
}

function createMerchantsGuildRespawnInstance(which, armyId, imageUrl) {
  return {
    instanceId: `mg-respawn-${which}-0`,
    tile: {
      id: `mg-respawn-${which}`,
      name: which === 1 ? 'Reconnaissance 1' : 'Reconnaissance 2',
      category: 'instant',
      count: 1,
      description:
        'Random mode only - tap Shuffle Reconnaissance after the required Scout Leader(s) are drawn.',
      imageUrl,
      imageOverlayLabel: which === 1 ? 'RC1' : 'RC2',
    },
    armyId,
  };
}

function insertIntoRemainingDeck(deck, firstRemainingIndex, insert, seed, salt) {
  const remaining = deck.length - firstRemainingIndex;
  const rand = seed !== null ? mulberry32(ensureUInt32(seed ^ salt)) : () => Math.random();
  const offset = remaining === 0 ? 0 : Math.floor(rand() * (remaining + 1));
  const pos = firstRemainingIndex + offset;
  const copy = [...deck];
  copy.splice(pos, 0, insert);
  return copy;
}

function insertMerchantsGuildReconnaissance(deck, firstRemainingIndex, which, armyId, seed, imageUrl) {
  if (armyId !== MERCHANTS_GUILD_ARMY_ID) return deck;
  return insertIntoRemainingDeck(
    deck,
    firstRemainingIndex,
    createMerchantsGuildRespawnInstance(which, armyId, imageUrl),
    seed,
    which === 1 ? SALT_RESPAWN_1 : SALT_RESPAWN_2
  );
}

function emptyBonuses() {
  return {
    ini0: 0,
    iniPlus1: 0,
    matka: 0,
    meleePlus1: 0,
    rangedPlus1: 0,
  };
}

function wiremenTechBonusesRemaining(remaining) {
  const out = emptyBonuses();
  for (const inst of remaining) {
    if (inst.tile.category !== 'instant') continue;
    const add = BONUS_BY_TILE_ID[inst.tile.id];
    if (!add) continue;
    for (const key of WIREMEN_TECH_BONUS_ORDER) {
      const n = add[key];
      if (n) out[key] += n;
    }
  }
  return out;
}

function wiremenTechBonusesFullDeck() {
  const out = emptyBonuses();
  for (const add of Object.values(BONUS_BY_TILE_ID)) {
    for (const key of WIREMEN_TECH_BONUS_ORDER) {
      const n = add[key];
      if (n) out[key] += n;
    }
  }
  return out;
}

function readSourceFile(filePath) {
  return ts.createSourceFile(
    filePath,
    ts.sys.readFile(filePath) ?? '',
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );
}

function evaluateExpression(node, context) {
  if (!node) return undefined;
  if (ts.isAsExpression(node) || ts.isTypeAssertionExpression(node)) {
    return evaluateExpression(node.expression, context);
  }
  if (ts.isParenthesizedExpression(node)) {
    return evaluateExpression(node.expression, context);
  }
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  if (ts.isNumericLiteral(node)) {
    return Number(node.text);
  }
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken) {
    return -Number(evaluateExpression(node.operand, context));
  }
  if (ts.isIdentifier(node)) {
    if (node.text in context) return context[node.text];
    return undefined;
  }
  if (ts.isObjectLiteralExpression(node)) {
    const out = {};
    for (const prop of node.properties) {
      if (ts.isPropertyAssignment(prop)) {
        const key = getPropertyName(prop.name);
        out[key] = evaluateExpression(prop.initializer, context);
      } else if (ts.isShorthandPropertyAssignment(prop)) {
        out[prop.name.text] = context[prop.name.text];
      }
    }
    return out;
  }
  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map((element) => evaluateExpression(element, context));
  }
  return undefined;
}

function getPropertyName(node) {
  if (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) {
    return node.text;
  }
  return node.getText();
}

function getConstInitializer(sourceFile, constName) {
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const decl of statement.declarationList.declarations) {
      if (ts.isIdentifier(decl.name) && decl.name.text === constName) {
        return decl.initializer;
      }
    }
  }
  throw new Error(`Missing const ${constName} in ${sourceFile.fileName}`);
}

function parseImports(sourceFile) {
  const imports = {};
  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    const spec = statement.moduleSpecifier.text;
    const bindings = statement.importClause?.namedBindings;
    const defaultImport = statement.importClause?.name;
    if (defaultImport) {
      imports[defaultImport.text] = spec;
    }
    if (bindings && ts.isNamedImports(bindings)) {
      for (const element of bindings.elements) {
        imports[element.name.text] = spec;
      }
    }
  }
  return imports;
}

function parseArmyOrder() {
  const filePath = path.join(ARMY_DIR, 'index.ts');
  const sourceFile = readSourceFile(filePath);
  const importMap = parseImports(sourceFile);
  const initializer = getConstInitializer(sourceFile, 'armies');
  if (!ts.isArrayLiteralExpression(initializer)) {
    throw new Error('Expected armies export to be an array literal');
  }
  return initializer.elements.map((element) => {
    if (!ts.isIdentifier(element)) {
      throw new Error('Expected armies array to contain identifiers only');
    }
    return importMap[element.text];
  });
}

function parseArmyFile(relativeImportPath) {
  const filePath = path.resolve(ARMY_DIR, `${relativeImportPath}.ts`);
  const sourceFile = readSourceFile(filePath);
  const imports = parseImports(sourceFile);
  const assetContext = {};
  for (const [name, spec] of Object.entries(imports)) {
    if (spec.startsWith('.')) {
      const normalized = normalizePosix(path.relative(ROOT, path.resolve(path.dirname(filePath), spec)));
      assetContext[name] = normalized;
    }
  }
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    const isExported = statement.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    if (!isExported) continue;
    for (const decl of statement.declarationList.declarations) {
      if (!decl.initializer || !ts.isObjectLiteralExpression(decl.initializer)) continue;
      return evaluateExpression(decl.initializer, assetContext);
    }
  }
  throw new Error(`No exported army object found in ${filePath}`);
}

async function parseJsonLikeExport(filePath, constName) {
  const sourceFile = readSourceFile(filePath);
  const initializer = getConstInitializer(sourceFile, constName);
  return evaluateExpression(initializer, {});
}

async function loadContent() {
  const armyImports = parseArmyOrder();
  const armies = armyImports.map((spec) => parseArmyFile(spec));
  const uiStrings = await parseJsonLikeExport(path.join(SRC, 'i18n', 'ui.ts'), 'UI_STRINGS');
  const armyDisplayNamePl = await parseJsonLikeExport(
    path.join(SRC, 'i18n', 'armyPl.ts'),
    'ARMY_DISPLAY_NAME_PL'
  );
  const armyDescriptionPl = await parseJsonLikeExport(
    path.join(SRC, 'i18n', 'armyPl.ts'),
    'ARMY_DESCRIPTION_PL'
  );
  const armyHqAbilityPl = await parseJsonLikeExport(
    path.join(SRC, 'i18n', 'armyPl.ts'),
    'ARMY_HQ_ABILITY_PL'
  );
  const polishTileNameOverrides = await parseJsonLikeExport(
    path.join(SRC, 'i18n', 'display.ts'),
    'POLISH_TILE_NAME_OVERRIDES'
  );
  const enToPlTileNames = await parseJsonLikeExport(
    path.join(SRC, 'i18n', 'enToPlTileNames.ts'),
    'EN_TO_PL_TILE_NAME'
  );
  const appVersion = await parseJsonLikeExport(path.join(SRC, 'version.ts'), 'APP_VERSION');
  const appVersionDate = await parseJsonLikeExport(path.join(SRC, 'version.ts'), 'APP_VERSION_DATE');

  return {
    armies,
    uiStrings,
    version: {
      appVersion,
      appVersionDate,
      appVersionFull: `${appVersion}-${appVersionDate}`,
    },
    display: {
      armyDisplayNamePl,
      armyDescriptionPl,
      armyHqAbilityPl,
      polishTileNameOverrides,
      enToPlTileNames,
    },
  };
}

function buildAssetManifest(armies) {
  const manifest = {
    generatedAt: new Date().toISOString(),
    armies: {},
    tileImages: {},
  };

  for (const army of armies) {
    manifest.armies[army.id] = {
      hqImageUrl: army.hqImageUrl ?? null,
      tileCount: army.tiles.length,
    };
    for (const tile of army.tiles) {
      manifest.tileImages[tile.id] = tile.imageUrl ?? null;
    }
  }

  return manifest;
}

function buildThemePayload() {
  return {
    generatedAt: new Date().toISOString(),
    tileCategories: CATEGORY_THEME,
  };
}

function buildParityFixtures(armies) {
  const armyById = Object.fromEntries(armies.map((army) => [army.id, army]));
  const merchantsGuild = armyById[MERCHANTS_GUILD_ARMY_ID];
  const ironGang = armyById[IRON_GANG_ARMY_ID];
  const wiremen = armyById.wiremen;
  const mgScoutLeader = merchantsGuild.tiles.find((tile) => tile.id === MG_SQUAD_LEADER_TILE_ID);
  const mgRespawnImage = mgScoutLeader?.imageUrl ?? null;

  const seedFixtures = [0, 1, 42, 1024, 123456789, 0xffffffff].map((seed) => ({
    seed,
    code: seedToCode(seed),
    roundTripSeed: codeToSeed(seedToCode(seed)),
  }));

  const standardDeckCode = 'K7M3PX';
  const standardSeed = codeToSeed(standardDeckCode);
  const standardDeck = seededShuffle(buildDeck(armyById.moloch), standardSeed).map((item) => item.tile.id);

  const ironGangFixtures = ['0', ...HOOK_REPLACEMENT_SPECS.map((spec) => spec.suffix)].map((suffix) => {
    const deckCode = `K7M3PX${suffix}`;
    const parsed = parseIronGangDeckCode(deckCode);
    const mode = parsed.mode;
    const base = buildDeck(ironGang);
    const adjusted = mode ? applyIronGangHookMode(base, mode) : base;
    const shuffled = seededShuffle(adjusted, codeToSeed(deckCode)).map((item) => item.tile.id);
    return {
      deckCode,
      mode,
      firstTen: shuffled.slice(0, 10),
      total: shuffled.length,
    };
  });

  const merchantsBaseCode = '9Z7H2Q';
  const merchantsSeed = codeToSeed(merchantsBaseCode);
  const merchantsBaseDeck = seededShuffle(buildDeck(merchantsGuild), merchantsSeed);
  const afterRecon1 = insertMerchantsGuildReconnaissance(
    merchantsBaseDeck,
    4,
    1,
    merchantsGuild.id,
    merchantsSeed,
    mgRespawnImage
  );
  const afterRecon2 = insertMerchantsGuildReconnaissance(
    afterRecon1,
    11,
    2,
    merchantsGuild.id,
    merchantsSeed,
    mgRespawnImage
  );

  const wiremenDeck = buildDeck(wiremen);
  const wiremenRemainingAfterDrawnIds = wiremenDeck.filter(
    (entry) =>
      ![
        'wiremen-sniper-0',
        'wiremen-battle-cios-ini-0',
        'wiremen-push-matka-0',
        'wiremen-wireman-0',
      ].includes(entry.instanceId)
  );

  return {
    generatedAt: new Date().toISOString(),
    seedFixtures,
    standardDeckFixture: {
      armyId: 'moloch',
      deckCode: standardDeckCode,
      firstTen: standardDeck.slice(0, 10),
      total: standardDeck.length,
    },
    ironGangFixtures,
    merchantsGuildFixture: {
      deckCode: merchantsBaseCode,
      insertedRecon1Index: afterRecon1.findIndex((entry) => entry.tile.id === 'mg-respawn-1'),
      insertedRecon2Index: afterRecon2.findIndex((entry) => entry.tile.id === 'mg-respawn-2'),
      firstTwelveAfterRecon2: afterRecon2.slice(0, 12).map((entry) => entry.tile.id),
      totalAfterRecon2: afterRecon2.length,
    },
    wiremenFixture: {
      fullDeck: wiremenTechBonusesFullDeck(),
      remainingAfterSampleDraws: wiremenTechBonusesRemaining(wiremenRemainingAfterDrawnIds),
    },
  };
}

async function writeJson(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function copyDirRecursive(sourceDir, destDir) {
  await rm(destDir, { recursive: true, force: true });
  await mkdir(destDir, { recursive: true });
  const entries = await readdir(sourceDir, { withFileTypes: true });
  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      await copyDirRecursive(sourcePath, destPath);
    } else if (entry.isFile()) {
      await mkdir(path.dirname(destPath), { recursive: true });
      await copyFile(sourcePath, destPath);
    }
  }
}

function buildAndroidStringsXml(strings) {
  const lines = ['<?xml version="1.0" encoding="utf-8"?>', '<resources>'];
  for (const [key, rawValue] of Object.entries(strings)) {
    const value = xmlEscape(rawValue);
    lines.push(`  <string name="${key}">${value}</string>`);
  }
  lines.push('</resources>', '');
  return lines.join('\n');
}

function buildXcstrings(uiStrings) {
  const strings = {};
  const keys = Object.keys(uiStrings.en);
  for (const key of keys) {
    strings[key] = {
      localizations: {
        en: { stringUnit: { state: 'translated', value: uiStrings.en[key] } },
        pl: { stringUnit: { state: 'translated', value: uiStrings.pl[key] } },
      },
    };
  }
  return {
    sourceLanguage: 'en',
    strings,
    version: '1.0',
  };
}

async function main() {
  const { armies, uiStrings, display, version } = await loadContent();
  const assetManifest = buildAssetManifest(armies);
  const parityFixtures = buildParityFixtures(armies);
  const theme = buildThemePayload();

  const payloads = {
    'armies.json': armies,
    'ui-strings.json': uiStrings,
    'display.json': display,
    'version.json': version,
    'theme.json': theme,
    'asset-manifest.json': assetManifest,
    'parity-fixtures.json': parityFixtures,
  };

  for (const [filename, payload] of Object.entries(payloads)) {
    await writeJson(path.join(OUT_SHARED, filename), payload);
    await writeJson(path.join(OUT_ANDROID_ASSETS, filename), payload);
    await writeJson(path.join(OUT_IOS_GENERATED, filename), payload);
  }

  await copyDirRecursive(path.join(SRC, 'assets'), OUT_ANDROID_IMAGES);
  await copyDirRecursive(path.join(SRC, 'assets'), OUT_IOS_IMAGES);

  await mkdir(OUT_ANDROID_VALUES, { recursive: true });
  await mkdir(OUT_ANDROID_VALUES_PL, { recursive: true });
  await writeFile(path.join(OUT_ANDROID_VALUES, 'strings.xml'), buildAndroidStringsXml(uiStrings.en));
  await writeFile(
    path.join(OUT_ANDROID_VALUES_PL, 'strings.xml'),
    buildAndroidStringsXml(uiStrings.pl)
  );
  await writeFile(OUT_IOS_XCSTRINGS, `${JSON.stringify(buildXcstrings(uiStrings), null, 2)}\n`);

  const checksum = {
    armies: armies.length,
    androidStringKeys: Object.keys(uiStrings.en).length,
    iosStringKeys: Object.keys(uiStrings.en).length,
    generatedAt: new Date().toISOString(),
  };
  await writeJson(path.join(OUT_SHARED, 'summary.json'), checksum);
  await writeJson(path.join(OUT_ANDROID_ASSETS, 'summary.json'), checksum);
  await writeJson(path.join(OUT_IOS_GENERATED, 'summary.json'), checksum);

  console.log(`Generated mobile shared content for ${armies.length} armies.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
