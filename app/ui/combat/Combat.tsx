'use client';
import React from 'react';
import { useState } from 'react';
import Dice from 'react-dice-roll';
import { Player, Enemy, Battle, Weapon } from '@/app/lib/definitions';
import { PlayerCard, EnemyCard } from '@/app/ui/combat/cards';
import { wrapInBlue, wrapInGreen, wrapInRed, wrapInYellow } from '@/app/lib/utils';
import { useEffect } from 'react';
interface CombatProps {
    admin: boolean;
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
import { set } from 'zod';
import { get } from 'http';

export const dynamic = "force-dynamic"
export const fetchCache = 'force-no-store';

const Combat = ({ admin, UserWeapons, BattleInfo, enemyCards, playerCards, actions }: CombatProps) => {
  const [showActions, setShowActions] = useState(false);
  const [enemies, setEnemies] = useState<Enemy[]>(enemyCards);
  const [players, setPlayers] = useState<Player[]>(playerCards);
  const [turn, setTurn] = useState<number>(BattleInfo.turn);
  const [turnOrder, setTurnOrder] = useState<string[]>(BattleInfo.turnOrder);
  const [recentActions, setRecentActions] = useState<string[]>([]);
  const [actionsList, setActionsList] = useState(true);
  const [displayActions, setDisplayActions] = useState<String[]>(actions.slice(-5));
 
  useEffect(() => {
    if (recentActions.length > 0) {
      const timer = setTimeout(() => {
        setRecentActions((prevActions) => prevActions.slice(1));
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [recentActions]);


  //@remove This isn't working as intended
  async function updateCards() {
      const response = await fetch('/api/battle', {
        method: 'GET',
        cache:"no-cache",
      });
      const data = await response.json();

      console.log("UPDATING CARDS", data)
      if (enemyCards) {
        console.log("Cleaning Enemy Cards", enemyCards)
        // Filter out empty items (undefined or null)
        const cleanedEnemyCards = enemyCards.filter(card => card !== undefined && card !== null);
      
        console.log('Cleaned Enemy Cards:', cleanedEnemyCards);
      
        // Continue with your existing logic
        const filteredEnemies = enemies.filter((enemy) => cleanedEnemyCards.find((card) => card.id === enemy.id));
        setEnemies(filteredEnemies);
      }
    
      if (playerCards) {
        console.log("Cleaning Player Cards", playerCards)
        // Filter out empty items (undefined or null)
        const cleanedPlayerCards = playerCards.filter(card => card !== undefined && card !== null);
      
        console.log('Cleaned Player Cards:', cleanedPlayerCards);
      
        // Continue with your existing logic
        const filteredPlayers = players.filter((player) => cleanedPlayerCards.find((card) => card.id === player.id));
        setPlayers(filteredPlayers);
      }

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

    const currentTime = new Date().toLocaleTimeString();

    if(isPlayer(getCurrentPlayer()?.id)) {
      let message = `[${wrapInBlue(currentTime)}] ${wrapInGreen(getCurrentPlayer()?.name)} has ended their turn!` 
      setRecentActions([...recentActions, message]);
      setDisplayActions(([...displayActions, message]).slice(-5));
    } else {
      let message = `[${wrapInBlue(currentTime)}] ${wrapInRed(getCurrentPlayer()?.name)} has ended their turn!` 
      setRecentActions([...recentActions, message]);
      setDisplayActions(([...displayActions, message]).slice(-5));
    }

    setTurn(turn + 1);
  }

  function playAudio(audio: string) {
    const audioElement = new Audio(audio);
    audioElement.play();
  }

  async function sendActionMessage(message: string) {
    const currentTime = new Date().toLocaleTimeString();
    const data = await fetch('/api/battle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Post-Type': 'actionMessage',
      },
      body: JSON.stringify({ id: BattleInfo.id, message }),
      cache:"no-cache"
    });
    setRecentActions([...recentActions, `[${wrapInBlue(currentTime)}] ${message}`]);
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

    const defenderType = isPlayer(defender.id) ? 'player' : 'enemy';

    await getStats(defender.id, defenderType).then((stats) => {
      defender = stats.stats;
    });

    const weapon = await getWeaponFromId(weaponID)
    if (!weapon) {
      throw new Error('Weapon not found');
    }
    // Play Audio
    playAudio('/audio/weapons/' + weapon.name + '.ogg')

    let hit = false
    let message;
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
    let died = false;
    const newHealth = defender.hp - damage;
    if(newHealth <= 0) {
      died = true;
    } 

    if(hit) {
      const currentTime = new Date().toLocaleTimeString();
      if(died) {
        if(isPlayer(attacker.id)) {
          message = `[${wrapInBlue(currentTime)}] ${wrapInGreen(attacker.name)} killed ${wrapInRed(defender.name)} with ${wrapInYellow(weapon.name)} and hit for ${wrapInRed(String(damage))} damage!`;
          } else {
          message = `[${wrapInBlue(currentTime)}] ${wrapInRed(attacker.name)} killed ${wrapInGreen(defender.name)} with ${wrapInYellow(weapon.name)} and hit for ${wrapInRed(String(damage))} damage!!!`;
          }
      } else {
        if(isPlayer(attacker.id)) {
        message = `[${wrapInBlue(currentTime)}] ${wrapInGreen(attacker.name)} attacked ${wrapInRed(defender.name)} with ${wrapInYellow(weapon.name)} and hit for ${wrapInRed(String(damage))} damage!`;
        } else {
        message = `[${wrapInBlue(currentTime)}] ${wrapInRed(attacker.name)} attacked ${wrapInGreen(defender.name)} with ${wrapInYellow(weapon.name)} and hit for ${wrapInRed(String(damage))} damage!`;
        }
        const data = await fetch('/api/battle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Post-Type': 'updateHP',
          },
          body: JSON.stringify({ player: isPlayer(defender.id), id: defender.id, hp: newHealth}),
        });
      }
      setDisplayActions(([...displayActions, message]).slice(-5));
      setRecentActions([...recentActions, message]);
    }

    if(!hit) {
      const currentTime = new Date().toLocaleTimeString();
      if(isPlayer(attacker.id)) {
      message = `[${wrapInBlue(currentTime)}] ${wrapInGreen(attacker.name)} tried to attack ${wrapInRed(defender.name)} with ${wrapInYellow(weapon.name)} and missed!`;
      } else {
      message = `[${wrapInBlue(currentTime)}] ${wrapInRed(attacker.name)} tried to attack ${wrapInGreen(defender.name)} with ${wrapInYellow(weapon.name)} and missed!`;
      }
      setRecentActions([...recentActions, message]);
    }

    await updateCards();


    const response = await fetch('/api/battle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Post-Type': 'attack',
      },
      body: JSON.stringify({ id: BattleInfo.id, weapon, attacker, defender, died, turnOrder, message }),
      cache:"no-cache"
    });

    const responseData = await response.json();

    if(responseData.message === 'Enemy defeated') {
      setEnemies(responseData.enemies);
      setTurnOrder(responseData.turnOrder);
    }
    setDisplayActions((responseData.actions).slice(-5))
    actions = responseData.actions;
    
  }
  
  const handleToggleActions = () => {
    setShowActions(!showActions);
  };

  function getTurnCardImage(id: string) {
    console.log("TESTING STRING: " + id)
    let playerCard;
    let enemyCard;
    try {
    playerCard = playerCards.find(card => card.id === id);
    } catch(e) {
      try {
      enemyCard = enemyCards.find(card => card.id === id);
      } catch(e) {
        console.log("No card found")
      }
    }
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
    let currentPlayer: Player | Enemy | undefined = playerCards.find(card => card.id === turnOrder[0]);
    if(!currentPlayer) {
      currentPlayer = enemyCards.find(card => card.id === turnOrder[0]) as Enemy;
    }
    return currentPlayer;
  }

  async function getCurrentWeapon() {
    const currentPlayer = playerCards.find(card => card.id === turnOrder[0]);
    if (!currentPlayer) {
      const enemyCard = enemyCards.find(card => card.id === turnOrder[0]);
      if (enemyCard) {
        const weaponID = enemyCard.weapons[0];
        let weapon = await getWeaponFromId(weaponID);
        if (!weapon) {
          throw new Error('Weapon not found');
        }
        return weapon;
      }
      throw new Error('Weapon not found');
    }

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
  
  if (BattleInfo.enemies.length === 0) {
    return (
      <>
      <div className="text-2xl font-bold text-green-500">
        Battle Won!
      </div>
      {admin && (
        <button
          onClick={async (e: any) => {
            const response = await fetch('/api/battle', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Post-Type': 'endBattle',
              },
              body: JSON.stringify({ id: BattleInfo.id }),
            });
            const data = await response.json();
            console.log(data);
          }}
          className="bg-red-500 text-black py-2 px-8 rounded-md hover:bg-darkred-600 focus:outline-none focus:ring-2 focus:ring-darkred-500"
        >
          End Battle
        </button>
      )
      }
      </>
    );
  }
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
          End Turn
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
            {admin && (
              <button
                onClick={async (e: any) => handleAttack(getCurrentPlayer()?.weapons[0] || '', getCurrentPlayer(), player)}
                className="bg-red-500 text-black py-2 px-8 rounded-md hover:bg-darkred-600 focus:outline-none focus:ring-2 focus:ring-darkred-500"
              >
                Attack
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Combat;
