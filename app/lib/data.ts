// @ts-nocheck
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import db from './db';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoice,
  Profile,
  User,
  Revenue,
  Enemy,
  Battle,
} from './definitions';
import { formatCurrency } from './utils';

export async function populateEnemyCards(battleProgress: any): Promise<Enemy[]> {
  console.log('Battle Progress:', battleProgress)
  const enemyCards = [];
  for (const enemyID of battleProgress.enemies) {
    const data: Enemy = await fetchEnemyById(enemyID);
    enemyCards.push(data);
  }
  console.log('Enemy Cards:', enemyCards)
  return enemyCards;
}

export async function populatePlayerCards(battleProgress: any): Promise<Player[]> {
  console.log('Battle Progress:', battleProgress)
  const playerCards = [];
  for (const playerID of battleProgress.players) {
    const data: Player = await fetchPlayerById(playerID);
    playerCards.push(data);
  }
  console.log('Player Cards:', playerCards)
  return playerCards;
}

export async function fetchBattleProgress(): Promise<{ battleProgress: Battle[]}> {
  console.log('Fetching battle progress...');
  try {
    console.log('Fetching battle progress...');
    const data = await sql`SELECT * FROM BATTLES;`;
    
    const battleProgress = data.rows.map((row: Battle) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      image_url: row.image_url,
      turnOrder: row.turnorder,
      turn: row.turn,
      enemies: row.enemies,
      players: row.players,
    }));

    console.log('Battle Progress:', battleProgress);

    return { battleProgress }; // Ensure it returns an object with battleProgress key

  }
  catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch battle progress.');
  }
}

export async function fetchPlayerById(id: string) {
  try {
    const data = await sql`SELECT * FROM PLAYERS WHERE id=${id};`;

    const player = data.rows.map((row: any) => ({
      id: row.id,
      image_url: row.image_url,
      name: row.name,
      level: row.level,
      maxHP: row.maxhp,
      hp: row.hp,
      rads: row.rads,
      xp: row.xp,
      caps: row.caps,
      origin: row.origin,
      special: row.special,
      defense: row.defense,
      weapons: row.weapons,
      skills: row.skills
    }));

    return player[0]; // Ensure it returns an object with player key
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch player data.');
  }
}

export async function fetchEnemyById(id: string) {
  try {
    const data = await sql`SELECT * FROM ENEMIES WHERE id=${id};`;

    console.log('Data fetch completed.');
    console.log('Enemy:', data.rows);

    const enemy = data.rows.map((row: any) => ({
      id: row.id,
      image_url: row.image_url,
      name: row.name,
      bodyStat: row.bodystat,
      mindStat: row.mindstat,
      meleeStat: row.meleestat,
      gunsStat: row.gunsstat,
      otherStat: row.otherstat,
      initiative: row.initiative,
      luckPoints: row.luckpoints,
      physDR: row.physdr,
      energyDR: row.energydr,
      radDR: row.raddr,
      poisonDR: row.poisondr,
      maxHP: row.maxhp,
      carryWeight: row.carryweight,
      meleeBonus: row.meleebonus,
      hp: row.hp,
      xp: row.xp,
      level: row.level,
      special: row.special,
      skills: row.skills,
      defense: row.defense,
      attacks: row.attacks,
      weapons: row.weapons,
      lootDrops: row.lootdrops,
      expand: false
    }));

    return enemy[0]; // Ensure it returns an object with enemy key
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch enemy data.');
  }
}

export async function fetchPlayerData(): Promise<{ profiles: Profile[] }> {
  try {
    console.log('Fetching player data...');
    const data = await sql`SELECT * FROM PLAYERS;`;

    console.log('Data fetch completed.');
    console.log('Data:', data);
    const playerData = data.rows.map((row: any) => ({
      id: row.id,
      image_url: row.image_url,
      name: row.name,
      level: row.level,
      maxHP: row.maxhp,
      hp: row.hp,
      rads: row.rads,
      xp: row.xp,
      caps: row.caps,
      origin: row.origin,
      special: row.special,
      defense: row.defense,
      weapons: row.weapons,
      skills: row.skills
    }));
    console.log('Player Data:', playerData);

    return { profiles: playerData }; // Ensure it returns an object with profiles key
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch player data.');
  }
}

export async function getUser(email: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
