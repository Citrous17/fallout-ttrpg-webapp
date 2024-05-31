'use client';
import React from 'react';
import { useState } from 'react';
import Dice from 'react-dice-roll';
import { Player, Enemy, Battle, Weapon } from '@/app/lib/definitions';
import { PlayerCard, EnemyCard } from '@/app/ui/combat/cards';
import { wrapInBlue, wrapInGreen, wrapInRed, wrapInYellow } from '@/app/lib/utils';
import { useEffect } from 'react';
interface CombatProps {
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

const Combat = ({ BattleInfo, enemyCards, playerCards, actions }: CombatProps) => {
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
      body: JSON.stringify({ id: BattleInfo.id }),
    });

    setTurn(turn + 1);
  }

  function playAudio(audio: string) {
    const audioElement = new Audio(audio);
    audioElement.play();
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
      console.log("Roll:", roll)
      console.log("Target:", target)
      if(roll == 20) {
        console.log('Critical Success!');
        successes++;
        successes++;
      } else if(roll == 1) {
        console.log('Critical Failure!');
      }
      else if(roll <= target) {
        console.log('Test Success!');
        // Check for Tag, which gives two successes if true
        if(tag) {
          successes++;
        }
        successes++;
      }
      else {
        console.log('Test Failure!');
      }
    }
    if(successes > difficulty) {
      console.log('Test Passed!');
      return true;
    } else {
      console.log('Test Failed!');
      return false;
    }
  }

  async function handleAttack(weaponID: String, attacker: Enemy | Player, defender: Enemy | Player) {
    // 1. Attempt a Test
    // 2. Inflict Damage
    // 3. Reduce Ammuniton

    // Play Audio
    playAudio('/audio/weapons/10mm Pistol.ogg');

    await updateCards();

    const data = await fetch('/api/battle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Post-Type': 'getWeapon',
      },
      body: JSON.stringify({ id: weaponID }),
    });

    const weaponData = await data.json();
    const weapon: Weapon = weaponData.weapon;
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
    });
    
  }
  
  const handleToggleActions = () => {
    setShowActions(!showActions);
  };

  const displayActions = actions.slice(-10);

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
                    <Image src={playerCards.find(card => card.id === turn)?.image_url ?? '/players/MissingImage.png'} alt="Card Image" className="w-16 h-16 mx-auto rounded-full" />
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
              onClick={(e: any) => handleCardToggle(enemy.id)}
              className="bg-blue-300 text-black py-2 px-4 rounded-md hover:bg-darkred-600 focus:outline-none focus:ring-2 focus:ring-darkred-500"
            >
              {enemy.expand ? 'Collapse' : 'Info'}
            </button>
            <button
              onClick={(e: any) => handleAttack(playerCards[0].weapons[0], enemy, playerCards[0])}
              className="bg-red-500 text-black py-2 px-4 rounded-md hover:bg-darkred-600 focus:outline-none focus:ring-2 focus:ring-darkred-500"
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
      <div className="absolute bottom-16 right-0 m-4">
        <button
          onClick={increaseTurn}
          className="bg-yellow-400 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Next Turn
        </button>
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
