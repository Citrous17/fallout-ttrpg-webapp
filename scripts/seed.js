const { sql } = require('@vercel/postgres');
const db = require('../app/lib/db.js');
const {
  users,
  players,
  weapons,
  enemies,
  battles,
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedWeapons(client) {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "weapons" table if it doesn't exist
    const createTable = await sql`
      CREATE TABLE IF NOT EXISTS weapons (
        id NUMERIC PRIMARY KEY,
        image_url TEXT NOT NULL,
        type TEXT NOT NULL,
        attack_type TEXT NOT NULL,
        name TEXT NOT NULL,
        ammo_type TEXT NOT NULL,
        weight NUMERIC NOT NULL,
        value NUMERIC NOT NULL,
        combatDice NUMERIC NOT NULL,
        DamageEffects TEXT NOT NULL,
        DamageType TEXT NOT NULL,
        range TEXT NOT NULL,
        wield TEXT NOT NULL,
        fireRate NUMERIC NOT NULL
      );`

    console.log(`Created "weapons" table`);
    console.log('weapons:', weapons)

    // Insert data into the "weapons" table
    const insertedWeapons = await Promise.all(
      weapons.map(
        (weapon) => sql`
        INSERT INTO weapons (id, image_url, type, attack_type, name, ammo_type, weight, value, combatDice, DamageEffects, DamageType, range, wield, fireRate)
        VALUES (${weapon.id}, ${weapon.image_url}, ${weapon.type}, ${weapon.attack_type}, ${weapon.name}, ${weapon.ammo_type}, ${weapon.weight}, ${weapon.value}, ${weapon.combatDice}, ${weapon.DamageEffects}, ${weapon.DamageType}, ${weapon.range}, ${weapon.wield}, ${weapon.fire_rate})
        ON CONFLICT (id) DO NOTHING;
      `),
    );

    console.log(`Seeded ${insertedWeapons.length} weapons`);

    return {
      createTable,
      weapons: insertedWeapons,
    };

  } catch (error) {
    console.error('Error seeding weapons:', error);
    throw error;
  }
}

async function seedUsers(client) {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        image_url TEXT NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return sql`
        INSERT INTO users (id, name, email, password, role, image_url)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}, ${user.role}, ${user.image_url})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedEnemies(client) {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    
    const createTable = await sql`
      CREATE TABLE IF NOT EXISTS enemies (
        id TEXT NOT NULL PRIMARY KEY,
        image_url TEXT NOT NULL,
        name TEXT NOT NULL,
        bodyStat INTEGER NOT NULL,
        mindStat INTEGER NOT NULL,
        meleeStat INTEGER NOT NULL,
        gunsStat INTEGER NOT NULL,
        otherStat INTEGER NOT NULL,
        initiative INTEGER NOT NULL,
        luckPoints INTEGER NOT NULL,
        physDR INTEGER NOT NULL,
        energyDR INTEGER NOT NULL,
        radDR INTEGER NOT NULL,
        poisonDR INTEGER NOT NULL,
        maxHP INTEGER NOT NULL,
        carryWeight INTEGER NOT NULL,
        meleeBonus INTEGER NOT NULL,
        hp INTEGER NOT NULL,
        xp INTEGER NOT NULL,
        level INTEGER NOT NULL,
        special INTEGER[] NOT NULL,
        defense INTEGER NOT NULL,
        attacks JSONB NOT NULL,
        weapons JSONB NOT NULL,
        lootDrops JSONB NOT NULL,
        expand BOOLEAN NOT NULL,
        template BOOLEAN NOT NULL,
        caps INTEGER NOT NULL
      );
    `;

    console.log(`Created "enemies" table`);

    // Insert data into the "enemies" table

    
    const insertedEnemies = await Promise.all(
      enemies.map((enemy) => {
        const attacksJSON = JSON.stringify(enemy.attacks);
        const weaponsJSON = JSON.stringify(enemy.weapons);
        const lootDropsJSON = JSON.stringify(enemy.lootDrops);

        console.log('enemy:', enemy)
        console.log(attacksJSON)

        return sql`
          INSERT INTO enemies (id, image_url, name, bodyStat, mindStat, meleeStat, gunsStat, otherStat, initiative, luckPoints, physDR, energyDR, radDR, poisonDR, maxHP, carryWeight, meleeBonus, hp, xp, level, special, defense, attacks, weapons, lootDrops, expand, template, caps)
          VALUES (${enemy.id}, ${enemy.image_url}, ${enemy.name}, ${enemy.bodyStat}, ${enemy.mindStat}, ${enemy.meleeStat}, ${enemy.gunsStat}, ${enemy.otherStat}, ${enemy.initiative}, ${enemy.luckPoints}, ${enemy.physDR}, ${enemy.energyDR}, ${enemy.radDR}, ${enemy.poisonDR}, ${enemy.maxHP}, ${enemy.carryWeight}, ${enemy.meleeBonus}, ${enemy.hp}, ${enemy.xp}, ${enemy.level}, ${enemy.special}, ${enemy.defense}, ${attacksJSON}, ${weaponsJSON}, ${lootDropsJSON}, ${enemy.expand}, ${enemy.template}, ${enemy.caps})
          ON CONFLICT (id) DO NOTHING;
        `;
      })
    );

    console.log(`Seeded ${insertedEnemies.length} enemies`);

    return {
      createTable,
      enemies: insertedEnemies,
    };

  } catch (error) {
    console.error('Error seeding enemies:', error);
    throw error;
  }
}

async function seedBattles(client) {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "battles" table if it doesn't exist
    const createTable = await sql`
      CREATE TABLE IF NOT EXISTS battles (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL,
        turnOrder TEXT[] NOT NULL,
        turn INT NOT NULL,
        enemies UUID[] NOT NULL,
        players UUID[] NOT NULL
      );
    `;

    console.log(`Created "battles" table`);

    // Insert data into the "battles" table
    console.log('battles:', battles)
    
    const insertedBattles = await Promise.all(
      battles.map(
        (battle) => sql`
        INSERT INTO battles (id, title, description, image_url, turnOrder, turn, enemies, players)
        VALUES (${battle.id}, ${battle.title}, ${battle.description}, ${battle.image_url}, ${battle.turnOrder}, ${battle.turn}, ${battle.enemies}, ${battle.players})
        ON CONFLICT (id) DO NOTHING;
      `),
    );

    console.log(`Seeded ${insertedBattles.length} battles`);

    return {
      createTable,
      battles: insertedBattles,
    };

  } catch (error) {
    console.error('Error seeding battles:', error);
    throw error;
  }
}

async function seedPlayers(client) {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "players" table if it doesn't exist
    const createTable = await sql`
      CREATE TABLE IF NOT EXISTS players (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        image_url TEXT NOT NULL,
        owner TEXT NOT NULL,
        name TEXT NOT NULL,
        maxHP INT NOT NULL,
        hp INT NOT NULL,
        xp INT NOT NULL,
        level INT NOT NULL,
        caps INT NOT NULL,
        origin TEXT NOT NULL,
        special INT[] NOT NULL,
        defense INT NOT NULL,
        weapons TEXT[] NOT NULL,
        items JSONB NOT NULL,
        perks TEXT[] NOT NULL
      );
    `;

    console.log(`Created "players" table`);

    // Insert data into the "players" table
    const insertedPlayers = await Promise.all(
      players.map(
        (player) => sql`
        INSERT INTO players (id, image_url, owner, name, maxHP, hp, xp, level, caps, origin, special, defense, weapons, items, perks)
        VALUES (${player.id}, ${player.image_url}, ${player.owner}, ${player.name}, ${player.maxHP}, ${player.hp}, ${player.xp}, ${player.level}, ${player.caps}, ${player.origin}, ${player.special}, ${player.defense}, ${player.weapons}, ${player.items}, ${player.perks})
        ON CONFLICT (id) DO NOTHING;
      `),
      );

    console.log(`Seeded ${insertedPlayers.length} players`);

    return {
      createTable,
      players: insertedPlayers,
    };

  } catch (error) {
    console.error('Error seeding players:', error);
    throw error;
  }
}

async function main() {
  await seedUsers(db);
  await seedPlayers(db);
  await seedWeapons(db);
  await seedEnemies(db);
  await seedBattles(db);
  await db.close();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
