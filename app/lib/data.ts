// @ts-nocheck
import { sql } from '@vercel/postgres';
import {
  Profile,
  User,
  Enemy,
  Battle,
  Weapon,
  EnemyTableType
} from './definitions';

export async function populateEnemyCards(battleProgress: any): Promise<Enemy[]> {
  const enemyCards = [];
  for (const enemyID of battleProgress.enemies) {
    console.log('Enemy ID:', enemyID)
    const data: Enemy = await fetchEnemyById(enemyID);
    enemyCards.push(data);
  }
  console.log('Enemy Cards:', enemyCards)
  return enemyCards;
}

export async function populatePlayerCards(battleProgress: any): Promise<Player[]> {
  const playerCards = [];
  for (const playerID of battleProgress.players) {
    const data: Player = await fetchPlayerById(playerID);
    playerCards.push(data);
  }
  console.log('Player Cards:', playerCards)
  return playerCards;
}

export async function fetchUserWeapons(email: string) {
  try {
    const data = await sql`SELECT id FROM users WHERE email=${email};`;
    console.log('Data:', data.rows[0].id)
    const data2 = await sql`SELECT weapons FROM players WHERE id=${data.rows[0].id};`
    console.log('Data2:', data2.rows[0].weapons)
    let weapons = [];
    for(const weapon of data2.rows[0].weapons){
      const data3 = await sql`SELECT * FROM weapons WHERE id=${weapon};`
      weapons.push(data3.rows[0]);
    }
    console.log('Weapons:', weapons)
    
    const weaponList = weapons.map((weapon: any) => ({
      id: weapon.id,
      name: weapon.name,
      damage: weapon.damage,
      type: weapon.type,
      value: weapon.value,
      weight: weapon.weight,
    }));

    return weaponList;
    return weapons
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch weapons.');
  }
}

export async function fetchPlayers() : Promise<Player[]>{
  try {
    const data = await sql`SELECT * FROM PLAYERS;`;

    const players = data.rows.map((row: any) => ({
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

    return players; // Ensure it returns an object with players key
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch player data.');
  }
}

export async function fetchBattleProgress(): Promise<{ battleProgress: Battle[]}> {
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

export async function fetchFilteredEnemies(query: string) {
  console.log('Query:', query)
  try {
    const data = await sql<EnemyTableType>`
		SELECT
      enemy.id,
		  enemy.name,
		  enemy.image_url,
      enemy.maxhp,
      enemy.special
		FROM enemies enemy
		WHERE
		  enemy.name ILIKE ${`%${query}%`} AND
      enemy.template = true
		GROUP BY enemy.id, enemy.name, enemy.maxhp, enemy.image_url, enemy.special
		ORDER BY enemy.name ASC
	  `;

    console.log('Data:', data.rows)

    const enemies = data.rows.map((enemy) => ({
      ...enemy
    }));

    return enemies;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch enemy table.');
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

export async function fetchEnemyDatabase(): Promise<Enemy[]> {
  try {
    const data = await sql`SELECT * FROM enemies WHERE template = false;`;
    const enemyData = data.rows.map((row: any) => ({
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
      expand: false,
      template: true
    }));

    console.log('Enemy Data:', enemyData);

    return enemyData; // Ensure it returns an object with enemies key
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch enemy data.');
  }
}

export async function fetchActions(battleProgress: any) {
  try {
    const data = await sql`SELECT actions FROM battles WHERE id=${battleProgress.id};`;
    console.log('Data:', data.rows)

    return data.rows[0].actions;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch actions.');
  }
}

//@remove This is a duplicate of fetchPlayers
export async function fetchPlayerData(): Promise<Profile[]> {
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

    return playerData; // Ensure it returns an object with profiles key
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

export async function fetchLocations(query: string) {
  console.log('Query:', query)
  console.log('Fetching locations...')
  try {
    const data = await sql<EnemyTableType>`
		SELECT
      location.id,
		  location.name,
      location.description,
		  location.image_url,
      location.quests
		FROM locations location
		WHERE
		  location.name ILIKE ${`%${query}%`} OR
      location.template = true
		GROUP BY location.id, location.name, location.description, location.image_url, location.quests
		ORDER BY location.name ASC
	  `;

    console.log('Data:', data.rows)

    const enemies = data.rows.map((enemy) => ({
      ...enemy
    }));

    return enemies;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch location table.');
  }
}
