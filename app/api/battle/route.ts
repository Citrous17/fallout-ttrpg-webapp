import type { NextApiRequest, NextApiResponse } from 'next'
import { Weapon, Enemy, Player } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';

export async function GET(request: Request) {
   const res = await sql`SELECT * FROM battles`;

   async function populateEnemyCards(battleProgress: any): Promise<Enemy[]> {
    const enemyCards = [];
    for (const enemyID of battleProgress.enemies) {
      const data: Enemy = await fetchEnemyById(enemyID);
      enemyCards.push(data);
    }
    return enemyCards;
  }
  
  async function populatePlayerCards(battleProgress: any): Promise<Player[]> {
    const playerCards = [];
    for (const playerID of battleProgress.players) {
      const data: Player = await fetchPlayerById(playerID);
      playerCards.push(data);
    }
    return playerCards;
  }
  
  async function fetchPlayerById(id: string) {
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
  
  async function fetchEnemyById(id: string) {
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

  async function populateActions(battleProgress: any) {
    const actions: string[] = [];
    const wrapInGreen = (text: string) => `<span class="text-green-500">${text}</span>`;
    const wrapInRed = (text: string) => `<span class="text-red-500">${text}</span>`;
    const action1 = `${wrapInGreen('Player 1')} attacks Enemy 1 for 2 damage`;
    const action2 = `${wrapInGreen('Player 1')} attacks Enemy 1 for 2 damage`;
    const action3 = `Enemy 1 attacks ${wrapInGreen('Player 1')} for 3 damage`;
  
    actions.push(action1);
    actions.push(action2);
    actions.push(action3);
    return actions;
  }
   
   const playerCards = await populatePlayerCards(res.rows[0]);
   const enemyCards = await populateEnemyCards(res.rows[0]);
   const actions = await populateActions(res.rows[0]);

    return Response.json({ playerCards, enemyCards, actions})
}

export async function POST(request: Request) {
  if(request.body === null) {
    return Response.json({ message: 'No body provided' })
  }

  if(request.headers.get('Post-Type') == 'newTurn') {
  const requestBody = JSON.parse(await request.text())
  const res = await sql`UPDATE battles SET turn = turn + 1 WHERE id = ${requestBody.id}`
  const res2 = await sql`UPDATE battles SET turnOrder = ${requestBody.turnOrder} WHERE id = ${requestBody.id}`;
  return Response.json({ message: 'Turn incremented' })
  } 
  else if(request.headers.get('Post-Type') == 'attack') {
    const requestBody = JSON.parse(await request.text());

    const res = await sql`UPDATE battles SET turn = turn + 1 WHERE id = ${requestBody.id}`;


    return Response.json({ message: 'Turn incremented' });
  }
  else if(request.headers.get('Post-Type') == 'getWeapon') {
    const requestBody = JSON.parse(await request.text())

    const res = await sql`SELECT * FROM weapons WHERE id = ${requestBody.id}`

    return Response.json({ message: 'Weapon fetched', weapon: res.rows[0] })
  } else if(request.headers.get('Post-Type') == 'updateHP') {
    const requestBody = JSON.parse(await request.text())

    const player = requestBody.player

    console.log('HEALTH:', requestBody.hp)

    if(player) {
    const res = await sql`UPDATE players SET hp = ${requestBody.hp} WHERE id = ${requestBody.id}`
    } else {
    const res = await sql`UPDATE enemies SET hp = ${requestBody.hp} WHERE id = ${requestBody.id}`
    }

    return Response.json({ message: 'HP updated' })
  } else if(request.headers.get('Post-Type') == 'enemyAction') {
    const requestBody = JSON.parse(await request.text())

    const res = await sql`SELECT battles SET turn = turn + 1 WHERE id = ${requestBody.id}`

    
  } else if(request.headers.get('Post-Type') == 'getStats') {
    const requestBody = JSON.parse(await request.text())

    const id = requestBody.id
    const type = requestBody.type
    if(type == 'player') {
      const res = await sql`SELECT * FROM players WHERE id = ${id}`
      return Response.json({ message: 'Stats fetched', stats: res.rows[0] })
    } else if(type == 'enemy') {
      const res = await sql`SELECT * FROM enemies WHERE id = ${id}`
      return Response.json({ message: 'Stats fetched', stats: res.rows[0] })
    }
    return Response.json({ message: 'No stats found' })

  }
}