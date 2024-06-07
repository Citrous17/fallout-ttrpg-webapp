// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.

import exp from "constants";
import { UUID } from "crypto";

// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  image_url: string;
};

// @remove: This type is outdated and should be replaced with the Player type when refactoring the code
export type Profile = {
  rads: number;
  hp: number;
  maxHP: number;
  image_url: string;
  id: any;
  name: any;
  level: any;
  xp: any;
  caps: any;
  origin: any;
  special: any;
  defense: any;
  weapons: any;
}

export type SkillsType = {
  Athletics: 'STR';
  Barter: 'CHA';
  Big_Guns: 'STR';
  Energy_Weapons: 'PER';
  Explosives: 'PER';
  Lockpick: 'PER';
  Medicine: 'INT';
  Melee_Weapons: 'STR';
  Pilot: 'PER';
  Repair: 'INT';
  Science: 'INT';
  Small_Guns: 'AGI';
  Sneak: 'AGI';
  Speech: 'CHA';
  Survival: 'END';
  Unarmed: 'STR';
}

export type SPECIAL = {
  Strength: "STR";
  Perception: "PER";
  Endurance: "END";
  Charisma: "CHA";
  Intelligence: "INT";
  Agility: "AGI";
  Luck: "LCK";
}

export type Skills = {
    Athletics: [number, boolean];
    Barter: [number, boolean];
    Big_Guns: [number, boolean];
    Energy_Weapons: [number, boolean];
    Explosives: [number, boolean];
    Lockpick: [number, boolean];
    Medicine: [number, boolean];
    Melee_Weapons: [number, boolean];
    Pilot: [number, boolean];
    Repair: [number, boolean];
    Science: [number, boolean];
    Small_Guns: [number, boolean];
    Sneak: [number, boolean];
    Speech: [number, boolean];
    Survival: [number, boolean];
    Unarmed: [number, boolean];
}

export type DamageEffects = {
  None: ['None', 'No additional effects'];
  Burst: ['Burst', 'The attacks hits one additional target within [CLOSE] range of the primary target for each Effect rolled. Each additional target spends 1 attitional unit of ammuniion from the weaspon'];
  Breaking: ['Breaking', 'For each Effect Rolled, reduce the number of the targets cover by 1 permanetly. IF the target is not in cover, instead reduce the DR of the location struck by 1.'];
  Persistent: ['Persistent', 'If one or more Effects are rolled, the target suffers the weapons damage again at the end of their next and subsequent truns, for a number of rounds equal to the number of Effects rolled.'];
  Piercing: ['Piercing X', 'Ignores X points of the targets Damage Resistance.'];
  Radioactive: ['Radioactive', 'The target suffers 1 RAD for each Effect rolled.'];
  Spread: ['Spread', 'The attack hits one additional target within [CLOSE] range of the primary target for each Effect rolled. Each additional hit inflicts the rolled damage (rounded down) and hits a random location even if a specific location was targeted for the initial attack'];
  Stun: ['Stun', 'The target is Stunned for 1 round, regardless of the number of Effects rolled. A stunned creature can still spend AP to take additional actions as normal'];
  Vicious: ['Vicious', 'The target suffers 1 additional damage for each Effect rolled.'];
}

export type DamageTypes = {
  Physical: ['Physical', 'Unarmed attacks, blunt force, slashing and stabbing, ballistics'];
  Energy: ['Energy', 'Laser, plasma, and radiation'];
  Radiation: ['Radiation', 'Exposure to RADs, or nuclear weaponry']
  Poison: ['Poison', 'Toxins, Chemicals, and creatures stings and barbs'];
}

export type Battle = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  turnOrder: string[];
  turn: number;
  enemies: UUID[];
  players: UUID[];
  location: string;
}

export type Weapon = {
  id: string;
  image_url: string;
  type: 'Small Guns' | 'Big Guns' | 'Energy Weapons' | 'Explosives';
  attack_type: 'Melee' | 'Ranged' | 'Thrown' | 'Unarmed'
  name: string;
  ammo_type: string;
  weight: number;
  value: number;
  combatdice: number;
  DamageEffects: DamageEffects[];
  DamageType: DamageTypes;
  range: 'C' | 'M' | 'L';
  wield: 'One-Handed' | 'Two-Handed';
  fireRate: 0 | 1 | 2 | 3;
};

export type Player = {
  id: string;
  image_url: string;
  name: string;
  maxHP: number;
  hp: number;
  xp: number;
  level: number;
  caps: number;
  origin: string;
  special: number[];
  defense: number;
  weapons: string[];
  skills: Skills;
}

export type Loot = {
  id: string;
  name: string;
  image_url: string;
  value: number;
  weight: number;
}

export type Attack = {
  name: string;
  priority: number;
}

export type Enemy = {
  id: string;
  image_url: string;
  name: string;
  type: 'Normal' | 'Mighty' | 'Legendary';
  bodyStat: number;
  mindStat: number;
  meleeStat: number;
  gunsStat: number;
  otherStat: number;
  initiative: number;
  luckPoints: number;
  physDR: number;
  energyDR: number;
  radDR: number;
  poisonDR: number;
  maxHP: number;
  carryWeight: number;
  meleeBonus: number;
  hp: number;
  xp: number;
  level: number;
  special: number[];
  defense: number;
  attacks: Attack[];
  weapons: string[];
  lootDrops: Loot[];
  skills: Skills;
  expand: boolean;
  template: boolean;
  caps: 0 | 1 | 2 | 3 | 4 | 5; // A rating from 0-5, 5 being the most rare. Rolls a d20 * caps to determine how many caps to drop
}

export type EnemyTableType = {
  id: string;
  name: string;
  hp: number;
  image_url: string;
  special: number[];
}

export type Location = {
  id: string;
  name: string;
  image_url: string;
  description: string;
  quests: string[];
  template: boolean;
}