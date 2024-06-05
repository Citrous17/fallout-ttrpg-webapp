const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'Kyle Stallings',
    email: 'citrous@tamu.edu',
    password: 'password',
    role: 'admin',
    image_url: '/users/kyle-stallings.png',
  }
];

const players = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a', //Note: This is the same as the user id
    image_url: '/players/MissingImage.png ',
    owner: 'Kyle',
    name: 'THE Database',
    maxHP: 14,
    hp: 12,
    rads: 0,
    xp: 40,
    level: 1,
    caps: 140,
    origin: 'Doctor',
    special: [4, 10, 4, 1, 10, 1, 10],
    defense: 1,
    weapons: ['001'],
    items: {
      stimpacks: 20,
      medX: 20,
      noodles: 2,
    },
    perks: ['Chem Reliant']
  },
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442d', //Note: This is the same as the user id
    image_url: '/players/MissingImage.png ',
    owner: 'Kyle',
    name: 'THE Database 2',
    maxHP: 14,
    hp: 8,
    rads: 2,
    xp: 40,
    level: 1,
    caps: 140,
    origin: 'Doctor',
    special: [4, 10, 4, 1, 10, 1, 10],
    defense: 1,
    weapons: ['001'],
    items: {
      stimpacks: 20,
      medX: 20,
      noodles: 2,
    },
    perks: ['Chem Reliant']
  },
];

const weapons = [
  {
    id: '001',
    image_url: '/weapons/10mm-pistol.png',
    type: 'Small Guns',
    attack_type: 'Ranged',
    name: '10mm Pistol',
    ammo_type: '38',
    weight: 4,
    value: 50,
    rarity: 1,
    combatDice: 4,
    DamageEffects: 'None',
    DamageType: 'Physical',
    range: 'C',
    wield: 'One-Handed',
    fire_rate: 2
  }
];

const battles = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a61233',
    title: 'Battle of Abernathy Farm',
    description: 'The raiders are attacking the Abernathy Farm. Help defend the farm and save the Abernathy family.',
    image_url: '/battles/abernathy-farm.png',
    turnOrder: ['410544b2-4001-4271-9855-fec4b6a6442b', '410544b2-4001-4271-9855-fec4b6a6442a', '410544b2-4001-4271-9855-fec4b6a6442c', '410544b2-4001-4271-9855-fec4b6a6442'],
    turn: 0,
    enemies: ['410544b2-4001-4271-9855-fec4b6a6442b', '410544b2-4001-4271-9855-fec4b6a6442c'],
    players: ['410544b2-4001-4271-9855-fec4b6a6442a', '410544b2-4001-4271-9855-fec4b6a6442d'],
  }
]

const enemies = [
  {
    id: '001',
    image_url: '/enemies/Raider.png',
    name: 'Raider',
    type: 'Normal',
    bodyStat: -1,
    mindStat: -1,
    meleeStat: -1,
    gunsStat: -1,
    otherStat: -1,
    initiative: 11,
    luckPoints: 0,
    carryWeight: 110,
    meleeBonus: 0,
    physDR: 1,
    energyDR: 1,
    radDR: 0,
    poisonDR: 0,
    maxHP: 8,
    hp: 8,
    xp: 31,
    level: 1,
    caps: 1,
    special: [6, 5, 6, 4, 5, 6, 5],
    skills: [{'Athletics': [1, false]}, {'Big_Guns': [2, false]}, {'Energy_Weapons': [3, true]}, {'Melee_Weapons': [3, false]}, {'Science': [2, false]}, {'Small_Guns': [3, true]}, {'Survival': [1, false]}],
    defense: 1,
    attacks: [{'Melee': 'Shock Baton'}, {'Ranged': 'Institute Laser'}],
    weapons: ['001'],
    lootDrops: [],
    expand: false,
    template: true
  },
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442b',
    image_url: '/enemies/Raider.png',
    name: 'Raider',
    bodyStat: -1,
    mindStat: -1,
    meleeStat: -1,
    gunsStat: -1,
    otherStat: -1,
    initiative: 11,
    luckPoints: 0,
    carryWeight: 110,
    meleeBonus: 0,
    physDR: 1,
    energyDR: 1,
    radDR: 0,
    caps: 1,
    poisonDR: 0,
    maxHP: 8,
    hp: 8,
    xp: 31,
    level: 2,
    special: [6, 5, 6, 4, 5, 6, 5],
    skills: [{'Athletics': [1, false]}, {'Big_Guns': [2, false]}, {'Energy_Weapons': [3, true]}, {'Melee_Weapons': [3, false]}, {'Science': [2, false]}, {'Small_Guns': [3, true]}, {'Survival': [1, false]}],
    defense: 1,
    attacks: [{'Melee': 'Shock Baton'}, {'Ranged': 'Institute Laser'}],
    weapons: ['001'],
    lootDrops: [],
    expand: false,
    template: false
  },
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442c',
    image_url: '/enemies/Raider.png',
    name: 'Raider',
    bodyStat: -1,
    mindStat: -1,
    meleeStat: -1,
    gunsStat: -1,
    otherStat: -1,
    initiative: 11,
    luckPoints: 0,
    carryWeight: 110,
    meleeBonus: 0,
    physDR: 1,
    energyDR: 1,
    radDR: 0,
    poisonDR: 0,
    maxHP: 11,
    hp: 11,
    xp: 31,
    level: 3,
    special: [6, 5, 6, 4, 5, 6, 5],
    skills: [{'Athletics': [1, false]}, {'Big_Guns': [2, false]}, {'Energy_Weapons': [3, true]}, {'Melee_Weapons': [3, false]}, {'Science': [2, false]}, {'Small_Guns': [3, true]}, {'Survival': [1, false]}],
    defense: 1,
    attacks: [{'Melee': 'Shock Baton'}, {'Ranged': 'Institute Laser'}],
    weapons: ['Institute Laser', 'Shock Baton'],
    lootDrops: [],
    expand: false,
    template: false,
    caps: 1
  }
];

const locations = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'Vault 13',
    description: 'The original Vault, home to the Vault Dweller',
    quests: ['Find the Water Chip', 'Rescue Tandi'],
    enemies: {
      'Radroach': 1,
    },
    lootDrops: ['Stimpack', 'Radaway'],
    xp: 100,
    caps: 100,
  }
];

const quests = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442b',
    image_url: '/enemies/Raider.png',
    name: 'Raider',
    bodyStat: -1,
    mindStat: -1,
    meleeStat: -1,
    gunsStat: -1,
    otherStat: -1,
    initiative: 11,
    physDR: 1,
    energyDR: 1,
    radDR: 0,
    poisonDR: 0,
    maxHP: 8,
    hp: 8,
    xp: 31,
    level: 4,
    caps: 10,
    special: [6, 5, 6, 4, 5, 6, 5],
    skills: [{'Athletics': [1, false]}, {'Big Guns': [2, false]}, {'Energy_Weapons': [3, true]}, {'Melee_Weapons': [3, false]}, {'Science': [2, false]}, {'Small_Guns': [3, true]}, {'Survival': [1, false]}],
    defense: 1,
    attacks: [{}],
    weapons: ['Institute Laser', 'Shock Baton'],
    lootDrops: []
  }
]



module.exports = {
  users,
  players,
  weapons,
  enemies,
  battles,
  locations
};
