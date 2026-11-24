import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const data = JSON.parse(readFileSync(new URL('../gamedata.json', import.meta.url), 'utf8'));

function moduleFromBundle(name) {
  const marker = source.indexOf('root.' + name + ' =');
  const begin = source.lastIndexOf('(function (root) {', marker);
  const tail = "})(typeof window !== 'undefined' ? window : globalThis);";
  const end = source.indexOf(tail, marker) + tail.length;
  assert.ok(begin < marker && marker < end);
  return runInNewContext(source.slice(begin, end) + '\n' + name, {});
}

const S = moduleFromBundle('BOSim');
const fromLadder = moduleFromBundle('BOLadderChar');
const boss = { enemyLevel: 84, enemyRarity: 'boss', ruptureLevel: 200 };
const fit = (a, b) => assert.ok(Math.abs(a - b) <= Math.max(1e-8, Math.abs(b) * 1e-10), a + ' != ' + b);

function character(classId, skills, supports = {}) {
  return {
    classId, level: 100, passives: [], items: [], hotbar: skills, gems: skills,
    mainSkill: skills[0], gemLevels: Object.fromEntries(skills.map(id => [id, 20])),
    sockets: skills.map(skill => ({ skill, supports: supports[skill] || [], conduit: '' })),
  };
}

test('a mana-positive skill still needs enough unreserved mana to start', () => {
  const spell = 'storm_brand';
  const reservations = Object.values(data.blessings).filter(b => b.Skill && b.ReservePct).map(b => b.Skill);
  const p = character('Mage', [spell, ...reservations]);
  const m = S.calcSkill(data, p, spell, boss).mana;
  assert.equal(m.pool, 0);
  assert.ok(m.listed > 0 && m.gain >= m.spend);
  assert.equal(m.canStart, false);
  assert.equal(m.sustained, false);
  assert.equal(m.ok, false);
});

test('Clarity refunds on kills up to the per-cast cap', () => {
  const spell = 'storm_brand';
  const p = character('Mage', [spell]);
  const lone = S.calcSkill(data, p, spell, boss).mana;
  const one = S.calcSkill(data, p, spell, { ...boss, manaKillsPerCast: 1 }).mana;
  const cap = data.scaling.Hero.ClarityKillsPerCast || 3;
  const many = S.calcSkill(data, p, spell, { ...boss, manaKillsPerCast: cap + 2 }).mana;
  assert.equal(lone.refund, 0);
  assert.ok(one.refund > 0);
  assert.equal(many.refund, one.refund * cap);
  assert.equal(many.listed, lone.listed);
  fit(many.cost, lone.listed * (1 - many.refund / 100));
});

test('minion boss DPS accounts for armor and resistance while panel DPS stays fixed', () => {
  const id = 'summon_skeletal_mage';
  const p = character('Necromancer', [id], { [id]: ['venom_support', 'added_poison'] });
  const resist = n => Object.fromEntries(S.DT.map(t => [t, n]));
  const r = S.calcSkill(data, p, id, { ...boss, enemyArmour: 0, enemyRes: resist(0) });
  const half = S.calcSkill(data, p, id, { ...boss, enemyArmour: 0, enemyRes: resist(50) });
  assert.ok(r.hitDps > 0 && r.poisonDps > 0);
  fit(half.hitDps, r.hitDps / 2);
  fit(half.poisonDps, r.poisonDps / 2);
  fit(half.panelDps, r.panelDps);
  const physical = 'summon_zombie';
  const z = character('Necromancer', [physical]);
  const noArmor = S.calcSkill(data, z, physical, { ...boss, enemyArmour: 0, enemyRes: resist(0) });
  const armour = 10000;
  const armoured = S.calcSkill(data, z, physical, { ...boss, enemyArmour: armour, enemyRes: resist(0) });
  const H = data.scaling.Hero;
  const hit = noArmor.hit.Physical.avg * noArmor.crit.factor;
  const reduction = Math.min(H.ArmourMaxReduction / 100, armour / (armour + H.ArmourFactor * hit));
  fit(armoured.hitDps, noArmor.hitDps * (1 - reduction));
});

test('trial supports apply to the selected summon, with each other summon keeping its own links', () => {
  const mage = 'summon_skeletal_mage', zombie = 'summon_zombie';
  const linked = ['venom_support', 'added_poison'];
  const p = character('Necromancer', [mage, zombie], { [mage]: linked, [zombie]: linked });
  const one = S.calcSkill(data, p, mage, boss);
  const two = S.calcSkill(data, p, mage, { ...boss, supportsOverride: [...linked, 'minion_speed'] });
  const others = r => r.ailments.poison.army.rate - r.minion.poisonRow.lay;
  assert.ok(others(one) > 0);
  fit(others(one), others(two));
  const z = S.calcSkill(data, p, zombie, { ...boss, armyProbe: true });
  fit(others(one), z.minion.poisonRow.lay);
});

test('ladder import preserves published base grade and socket count', () => {
  const p = fromLadder({ class: 'Mage', hero: 'fixture', build: {
    items: [{ slot: 'MainHand', base: 'wand_7', grade: 92, sockets: 4, runes: ['ber'] },
      { slot: 'OffHand', base: 'tome_5' }],
  } });
  assert.equal(p.items[0].grade, 92);
  assert.equal(p.items[0].sockets, 4);
  assert.equal(p.items[0].runes.length, 1);
  assert.equal(p.items[1].grade, undefined);
  assert.equal(p.items[1].sockets, undefined);
});

test('bundled Patch 88 mastery values use the game data modifiers', () => {
  const cases = {
    oath_long_fight: [6, 12], oath_crushing_blow: [30], oath_high_sun: [30],
    oath_dawn_guard: [12, 6], oath_settled_blade: [19],
  };
  for (const [id, expected] of Object.entries(cases)) {
    assert.deepEqual(data.oaths[id].Mods.map(m => m.Value), expected, id);
  }
});
