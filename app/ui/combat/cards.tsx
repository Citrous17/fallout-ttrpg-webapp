import {
    BanknotesIcon,
    ClockIcon,
    UserGroupIcon,
    InboxIcon,
  } from '@heroicons/react/24/outline';
  import { lusitana } from '@/app/ui/fonts';
  import { fetchPlayerData } from '@/app/lib/data';
  import ProfileCard from '@/app/ui/players/profile';
  import {
    Enemy,
  } from '@/app/lib/definitions';
  import Image from 'next/image';
  import { useState } from 'react'
  const iconMap = {
    collected: BanknotesIcon,
    customers: UserGroupIcon,
    pending: ClockIcon,
    invoices: InboxIcon,
  };

  export function PlayerCard({ player, expand }: any) {
    const [expanded, setExpanded] = useState(expand);
    const healthPercentage = (player.hp / player.maxHP) * 100;
    const radsPercentage = (player.rads / player.maxHP) * 100;

    const handleExpand = () => {
      setExpanded(!expanded);
    };

    return (
      <>
        <div className="flex justify-center">
          <Image src={player.image_url} alt={player.name} width={100} height={100} className="rounded-full" />
        </div>

        <div className="flex justify-center">
          <h2 className="text-xl font-bold text-center">{player.name}: LVL {player.level}</h2>
        </div>

        <p className="text-gray-600">Health: ({player.hp}/{player.maxHP})</p>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4 relative">
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4 flex">
            <div
              className="bg-red-500 h-4 rounded-l-full rounded-r-full"
              style={{ width: `${healthPercentage}%` }}
            ></div>
            <div
              className="bg-green-500 h-4 rounded-r-full rounded-l-full absolute right-0"
              style={{ width: `${radsPercentage}%` }}
            ></div>
          </div>
        </div>
        <ul className="mt-2">
          {!expanded && (
            <>
              <button onClick={handleExpand} className="text-blue-500 underline">
                Expand
              </button>
            </>
          )}
          {expanded && (
            <>
              <li>
                <strong>Body Stat:</strong> {player.bodyStat}
              </li>
              <li>
                <strong>Mind Stat:</strong> {player.mindStat}
              </li>
              <li>
                <strong>Melee Stat:</strong> {player.meleeStat}
              </li>
              <li>
                <strong>Guns Stat:</strong> {player.gunsStat}
              </li>
              <li>
                <strong>Other Stat:</strong> {player.otherStat}
              </li>
              <li>
                <strong>Initiative:</strong> {player.initiative}
              </li>
              <li>
                <strong>Phys DR:</strong> {player.physDR}
              </li>
              <li>
                <strong>Energy DR:</strong> {player.energyDR}
              </li>
              <li>
                <strong>Rad DR:</strong> {player.radDR}
              </li>
              <li>
                <strong>Poison DR:</strong> {player.poisonDR}
              </li>
              <li>
                <strong>Max HP:</strong> {player.maxHP}
              </li>
              <li>
                <strong>HP:</strong> {player.hp}
              </li>
              <li>
                <strong>XP:</strong> {player.xp}
              </li>
              <li>
                <strong>Level:</strong> {player.level}
              </li>
              <li>
                <strong>Special:</strong> {player.special.join(", ")}
              </li>
              <li>
                <strong>Defense:</strong> {player.defense}
              </li>
              <li>
                <strong>Attacks:</strong>{" "}
                {player.attacks.map((attack: any) => JSON.stringify(attack)).join(", ")}
              </li>
              <li>
                <strong>Weapons:</strong> {player.weapons.join(", ")}
              </li>
              <li>
                <strong>Loot Drops:</strong> {player.lootDrops.join(", ")}
              </li>
              <button onClick={handleExpand} className="text-blue-500 underline">
                Collapse
              </button>
            </>
          )}
        </ul>
    </>
    );
  }

export function EnemyCard({ enemy }: any) {
  const healthPercentage = (enemy.hp / enemy.maxHP) * 100;
  const radsPercentage = (enemy.rads / enemy.maxHP) * 100;

  return (
    <>
      <div className="flex justify-center">
          <Image src={enemy.image_url} alt={enemy.name} width={100} height={100} className="rounded-full" />
        </div>
        
        <div className='flex justify-center'>
          <h2 className="text-xl font-bold text-center">{enemy.name}: LVL {enemy.level}</h2>
        </div>

        <p>(+{enemy.xp} XP)</p>
        <p className="text-gray-600">Health: ({enemy.hp}/{enemy.maxHP})</p>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4 relative">
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4 flex">
                <div
                  className="bg-red-500 h-4 rounded-l-full rounded-r-full"
                  style={{ width: `${healthPercentage}%` }}
                ></div>
                <div
                  className="bg-green-500 h-4 rounded-r-full rounded-l-full absolute right-0"
                  style={{ width: `${radsPercentage}%` }}
                ></div>
              </div>
            </div>
        <ul className="mt-2">
          {enemy.expand && (
            <>
              <li><strong>Body Stat:</strong> {enemy.bodyStat}</li>
              <li><strong>Mind Stat:</strong> {enemy.mindStat}</li>
              <li><strong>Melee Stat:</strong> {enemy.meleeStat}</li>
              <li><strong>Guns Stat:</strong> {enemy.gunsStat}</li>
              <li><strong>Other Stat:</strong> {enemy.otherStat}</li>
              <li><strong>Initiative:</strong> {enemy.initiative}</li>
              <li><strong>Phys DR:</strong> {enemy.physDR}</li>
              <li><strong>Energy DR:</strong> {enemy.energyDR}</li>
              <li><strong>Rad DR:</strong> {enemy.radDR}</li>
              <li><strong>Poison DR:</strong> {enemy.poisonDR}</li>
              <li><strong>Max HP:</strong> {enemy.maxHP}</li>
              <li><strong>HP:</strong> {enemy.hp}</li>
              <li><strong>XP:</strong> {enemy.xp}</li>
              <li><strong>Level:</strong> {enemy.level}</li>
              <li><strong>Special:</strong> {enemy.special.join(', ')}</li>
              <li><strong>Defense:</strong> {enemy.defense}</li>
              <li><strong>Attacks:</strong> {enemy.attacks.map((attack: any) => JSON.stringify(attack)).join(', ')}</li>
              <li><strong>Weapons:</strong> {enemy.weapons.join(', ')}</li>
              <li><strong>Loot Drops:</strong> {enemy.lootDrops.join(', ')}</li>
            </>
          )}
        </ul>
      </>
    );
  }
  