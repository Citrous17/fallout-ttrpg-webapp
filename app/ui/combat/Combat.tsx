'use client';
import React from 'react';
import { useState } from 'react';
import Dice from 'react-dice-roll';
import { Player, Enemy, Battle, Weapon } from '@/app/lib/definitions';
import { PlayerCard, EnemyCard } from '@/app/ui/combat/cards';
import { wrapInBlue, wrapInGreen, wrapInRed, wrapInYellow } from '@/app/lib/utils';
import { useEffect } from 'react';
interface CombatProps {
    UserWeapons: Weapon;
    BattleInfo: Battle;
    enemyCards: Enemy[];
    playerCards: Player[]
    actions: String[];
}
import Image from 'next/image';
import { ChevronDoubleDownIcon, ChevronDoubleUpIcon } from '@heroicons/react/24/solid'; // Importing a Heroicon
import { fetchBattleProgress } from '@/app/lib/data';
import { populateEnemyCards, populatePlayerCards } from '@/app/lib/data';

export const dynamic = "force-dynamic"
export const fetchCache = 'force-no-store';

const Combat = ({ UserWeapons, BattleInfo, enemyCards, playerCards, actions }: CombatProps) => {
  const [showActions, setShowActions] = useState(false);
  const [enemies, setEnemies] = useState<Enemy[]>(enemyCards);
  const [players, setPlayers] = useState<Player[]>(playerCards);
  const [turn, setTurn] = useState<number>(BattleInfo.turn);
  const [turnOrder, setTurnOrder] = useState<string[]>(BattleInfo.turnOrder);
  const [recentActions, setRecentActions] = useState<string[]>([]);
  const [actionsList, setActionsList] = useState(true);
 
  useEffect(() => {
    if (recentActions.length > 0) {
      const timer = setTimeout(() => {
        setRecentActions((prevActions) => prevActions.slice(1));
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [recentActions]);

  async function updateCards() {
      const response = await fetch('/api/battle', {
        method: 'GET',
        cache:"no-cache",
      });
      const data = await response.json();

      console.log(data);
      setEnemies(data.enemyCards);
      setPlayers(data.playerCards);
  }

  async function increaseTurn() {
    const newTurnOrder = [...turnOrder];
    newTurnOrder.push(newTurnOrder.shift() as string);
    setTurnOrder(newTurnOrder);

    const response2 = await fetch('/api/battle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Post-Type': 'newTurn',
      },
      body: JSON.stringify({ id: BattleInfo.id, turnOrder: newTurnOrder}),
      cache:"no-cache"
    });

    setTurn(turn + 1);
  }

  function playAudio(audio: string) {
    const audioElement = new Audio(audio);
    audioElement.play();
  }

  async function getStats(id: string, type: string) {
    const data = await fetch('/api/battle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Post-Type': 'getStats',
      },
      body: JSON.stringify({ id, type }),
      cache:"no-cache"
    });
    const stats = await data.json();
    return stats;
  }

  function rolld20() {
    return Math.floor(Math.random() * 20) + 1;
  }

  function rollCombatDice() {
    const num = Math.floor(Math.random() * 6) + 1;
    switch(num) {
      case 1: 
        return ['Hit: 1 damage', 1, false];
      case 2:
        return ['Hit: 2 damage', 2, false];
      case 3:
        return ['Miss', 0, false];
      case 4:
        return ['Miss', 0, false];
      case 5:
        return ['Hit: 1 damage + Damage Effect', 1, true];
      case 6:
        return ['Hit: 2 damage + Damage Effect', 2, true];
    }
  }

  function handleCardToggle(id: string) {
    const newEnemies = enemies.map((enemy) => {
      console.log(enemy.id, id)
      if (enemy.id === id) {
        console.log('Toggling Card')
        return { ...enemy, expand: !enemy.expand };
      }
      return enemy;
    });
    setEnemies(newEnemies);
  }

  function isPlayer(id: string) {
    return Boolean(playerCards.find(card => card.id === id));
  }

  function test(rolls: number, tag: boolean, target : number, difficulty: number) {
    let successes = 0;
    for(let i = 0; i < rolls; i++) {
      const roll = rolld20();
      if(roll == 20) {
        successes++;
        successes++;
      } else if(roll == 1) {
        // Currently does not do anything, but could be used to apply a negative effect
      }
      else if(roll <= target) {
        // Check for Tag, which gives two successes if true
        if(tag) {
          successes++;
        }
        successes++;
      }
    }
    if(successes > difficulty) {
      return true;
    } else {
      return false;
    }
  }

  async function handleAttack(weaponID: string, attacker: Enemy | Player, defender: Enemy | Player) {
    // 1. Attempt a Test
    // 2. Inflict Damage
    // 3. Reduce Ammuniton

    // Play Audio
    playAudio('/audio/weapons/10mm Pistol.ogg');

    const defenderType = isPlayer(defender.id) ? 'player' : 'enemy';

    await getStats(defender.id, defenderType).then((stats) => {
      defender = stats.stats;
    });

    const weapon = await getWeaponFromId(weaponID)

    let hit = false
    console.log(weapon);
    let damage = 0;

    switch(weapon.attack_type) {
      case 'Ranged':
        console.log('Melee Attack');
        const difficulty = defender.defense;
        let attackBonus = [0, false]
        
          // Ensure attacker.skills is defined and has the property 'Melee_Weapons'
          if (attacker.skills && attacker.skills['Melee_Weapons']) {
            attackBonus = [attacker.skills['Melee_Weapons'][0], attacker.skills['Melee_Weapons'][1]];
          }

        const target = attacker.special[0] + (+attackBonus[0]); // Special[0] is Strength, Melee_Weapons[0] is Melee Weapons Skill
        
        hit = test(2, Boolean(attackBonus[1]), target, difficulty);
        if(hit) {
          for(let i = 0; i < weapon.combatdice; i++) {
            const [message, value, effect] = rollCombatDice() as [string, number, boolean];
            setRecentActions([...recentActions, message ]);
            damage += value;
            if(effect) {
              console.log('Damage Effect!');
            }
          }
          console.log('Damage:', damage);
        } 
        break;
      case 'Melee':
        console.log('Ranged Attack');
        break;
      case 'Thrown':
        console.log('Thrown Attack');
        break;
      case 'Unarmed':
        console.log('Unarmed Attack');
        break;
    }

    if(hit) {
      const currentTime = new Date().toLocaleTimeString();
      const message = `[${wrapInBlue(currentTime)}] ${wrapInGreen(attacker.name)} attacked ${wrapInRed(defender.name)} with ${wrapInYellow(weapon.name)} and hit for ${wrapInRed(String(damage))} damage!`;
      setRecentActions([...recentActions, message]);
      console.log('Defender Health:', defender.hp)
      const newHealth = defender.hp - damage;
      console.log('New Health:', newHealth)

      const data = await fetch('/api/battle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Post-Type': 'updateHP',
        },
        body: JSON.stringify({ player: isPlayer(defender.id), id: defender.id, hp: newHealth}),
      });

      console.log('Updating Cards...')
      console.log("damage: ", damage)
      await updateCards();
      console.log('Cards Updated!')
    }

    if(!hit) {
      const currentTime = new Date().toLocaleTimeString();
      const message = `[${wrapInBlue(currentTime)}] ${wrapInGreen(attacker.name)} tried to attack ${wrapInRed(defender.name)} with ${wrapInYellow(weapon.name)} and missed!`;
      setRecentActions([...recentActions, message]);
    }

    const response = await fetch('/api/battle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Post-Type': 'attack',
      },
      body: JSON.stringify({ weapon, attacker, defender }),
      cache:"no-cache"
    });
    
  }
  
  const handleToggleActions = () => {
    setShowActions(!showActions);
  };

  function getTurnCardImage(id: string) {
    const playerCard = playerCards.find(card => card.id === id);
    const enemyCard = enemyCards.find(card => card.id === id);
    return (playerCard?.image_url ?? enemyCard?.image_url) ?? '/enemies/MissingImage.png';
  }

  function getTurnCardColor(id: string) {
    if(playerCards.find(card => card.id === id)){
      if(id === turnOrder[0]) {
        return "bg-blue-400"
      }
      return "bg-blue-300"
    } else {
      if(id === turnOrder[0]) {
        return "bg-red-400"
      }
      return "bg-red-300"
    }
  }

  function getCardColor(id: string) {
    if(playerCards.find(card => card.id === id)){
      if(id === turnOrder[0]) {
        return "bg-blue-300"
      }
      return "bg-blue-100"
    } else {
      if(id === turnOrder[0]) {
        return "bg-red-300"
      }
      return "bg-red-100"
    }
  }

  function getCurrentPlayer() {
    const currentPlayer = playerCards.find(card => card.id === turnOrder[0]);
    return currentPlayer;
  }

  async function getCurrentWeapon() {
    const currentPlayer = playerCards.find(card => card.id === turnOrder[0]);
    if(currentPlayer) {
      const weaponID= currentPlayer.weapons[0];
      let weapon = await getWeaponFromId(weaponID);
      if(!weapon) {
        throw new Error('Weapon not found');
      }
      return weapon;
    }  
    throw new Error('Player not found')
  }

  async function getWeaponFromId(id: string) {
    const data = await fetch('/api/battle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Post-Type': 'getWeapon',
      },
      body: JSON.stringify({ id: id }),
      cache:"no-cache"
    });

    const weaponData = await data.json();
    const weapon: Weapon = weaponData.weapon;

    if (!weapon) {
      throw new Error('Weapon not found');
    }

    return weapon;
  }

  const currentWeapon = getCurrentWeapon();
  const displayActions = actions.slice(-10);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center relative">
      <div className="absolute top-0 left-0 m-4">
        {/* Turn Order Cards */}
        <div className="flex flex-wrap justify-center">
            <div className="bg-white text-center shadow-md rounded-lg my-4 py-2 px-4">
              <h1 className="text-2xl font-bold text-gray-900">Turn Order</h1>
              <h2 className="text-xl font-bold text-gray-900">Turn: {turn}</h2>
              {
                turnOrder.map((turn, index) => (                  
                  <div key={index} className={`p-2 m-2 rounded-lg shadow-md ${getTurnCardColor(turn)} ${index == 0 ? 'border-amber-300 border-4' : ''}`}>
                    <Image src={getTurnCardImage(turn)} alt="Card Image" className="w-16 h-16 mx-auto rounded-full" width={100} height={100}/>
                  </div>
                ))
              }
            </div>
        </div>
      </div>
      <div className="bg-white text-center shadow-md rounded-lg my-4 py-2 px-4">
        <h1 className="text-2xl font-bold text-gray-900">{BattleInfo.title}</h1>
      </div>

      {/* Enemy Cards */}
      <div className="flex flex-wrap justify-center">
        {enemies.map((enemy, index) => (
          <div key={index} className={`${getCardColor(enemy.id)} p-4 m-2 rounded-lg text-center shadow-md min-w-[200px]`}>
            <EnemyCard key={enemy.id} enemy={enemy} expand={enemy.expand} />
            <button
              onClick={async (e: any) => handleAttack(getCurrentPlayer()?.weapons[0] || '', getCurrentPlayer()!, enemy)}
              className="bg-red-500 text-black py-2 px-8 rounded-md hover:bg-darkred-600 focus:outline-none focus:ring-2 focus:ring-darkred-500"
            >
              Attack
            </button>
          </div>
        ))}
      </div>

      {/* ActionList in the Middle of the Screen */}
      <div className="flex flex-col items-center py-8">
        {recentActions.slice(-3).map((action, index) => (
          <b key={index} dangerouslySetInnerHTML={{ __html: action }}></b>
        ))}
      </div>

      {/* Heroicon for toggling actions */}
      <div className="absolute top-0 right-0 m-4">
        <button onClick={handleToggleActions} className="text-gray-500 hover:text-gray-700">
          <ChevronDoubleDownIcon className="h-8 w-8" />
        </button>
        {showActions && (
          <div className="bg-white shadow-md rounded-lg p-4 max-w-xs mt-2">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Action Log</h2>
            <ul className="list-disc pl-5">
            {displayActions.map((action, index) => (
                <li key={index} className="mb-1" dangerouslySetInnerHTML={{ __html: action }}></li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Character Options */}
      <div className="absolute bottom-16 left-0 m-4">
        <button
          onClick={() => alert('Character Options')}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Character Options
        </button>
      </div>

      {/* Next Turn Button */}
      <div className="absolute bottom-32 right-0 m-4">
        <button
          onClick={increaseTurn}
          className="bg-yellow-400 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Next Turn
        </button>
      </div>

      {/* Display the current weapon the player is using */}
      <div className="absolute bottom-0 right-0 m-4">
        <div className="bg-white text-center shadow-md rounded-lg my-4 py-2 px-4">
          <h1 className="text-2xl font-bold text-gray-900">Current Weapon</h1>
          <h2 className="text-xl font-bold text-gray-900">{UserWeapons.name}</h2>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-grow"></div>

      {/* Player Cards */}
      <div className="flex flex-wrap justify-center">
        {players.map((player, index) => (
          <div key={index} className={`${getCardColor(player.id)} p-4 m-2 rounded-lg text-center shadow-md min-w-[200px]`}>
            <PlayerCard key={index} player={player} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Combat;
