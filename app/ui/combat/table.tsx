'use client'
// Ignore typescript errors
// @ts-nocheck

import Image from 'next/image';
import { useState } from 'react';
import { getInitiative, getTurnOrder } from '@/app/lib/utils';
import { players } from '@/app/lib/placeholder-data';
import { v4 as uuidv4 } from 'uuid';
import { set } from 'zod';

export const dynamic = "force-dynamic"
export const fetchCache = 'force-no-store';

export function PlayersTable({
  query,
  currentPage,
  players,
  formData,
  setFormData
}: {
  query: string;
  currentPage: number;
  players: any[];
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}) {
  
  const totalPages = Math.ceil(players.length / 10);
  const start = currentPage * 10;
  const end = start + 10;
  const paginatedEnemies = players.slice(start, end);
  const [selectedPlayers, setSelectedPlayers] = useState<any[]>([]);

  function addPlayer(player: any) {
    if (player.amount === undefined) {
      player.amount = 1;
  }
  
    const updatedSelectedPlayers = [...selectedPlayers.filter((e) => e.id !== player.id), player];
    const updatedTurnOrder = getTurnOrder([...players, ...updatedSelectedPlayers]);
    console.log('Turn Order:', updatedTurnOrder);    

    setSelectedPlayers(updatedSelectedPlayers);
    console.log("PLAYERS: ", updatedSelectedPlayers);
    
    const updatedFormData = {
        ...formData,
        players: updatedSelectedPlayers,
        turnOrder: updatedTurnOrder
    };
    setFormData(updatedFormData);
  }

  function removePlayer(player: any) {
    setSelectedPlayers(selectedPlayers.filter((e) => e.id !== player.id));
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-100 p-2 md:pt-0">
          <h1 className="text-xl font-semibold">Player Database:</h1>
          <div className="md:hidden">
            {players?.map((player) => (
              <div
                key={player.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={player.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${player.name}'s profile picture`}
                      />
                      <p>{player.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{player.id}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2">
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-3 py-5 font-medium sm:pl-6">
                  Player
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Health
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {players?.map((player) => (
                <tr
                  key={player.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={player.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${player.name}'s profile picture`}
                      />
                      <p>{player.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {player.id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {player.hp}/{player.maxHP}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => addPlayer(player)}>
                      Add
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <button type="button" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => removePlayer(player)}>
                      Remove
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-row items-center gap-3 py-4">

            {selectedPlayers?.map((player) => (
              <div key={player.id + "|" + player.amount} className="flex flex-col items-center">
                <Image
                  src={player.image_url}
                  className="rounded-full"
                  width={100}
                  height={100}
                  alt={`${player.name}'s profile picture`}
                />
                <h1>{player.name}</h1>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function EnemiesTable({
  query,
  currentPage,
  enemies,
  formData,
  setFormData
}: {
  query: string;
  currentPage: number;
  enemies: any[];
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}) {
  
  const totalPages = Math.ceil(enemies.length / 10);
  const start = currentPage * 10;
  const end = start + 10;
  const paginatedEnemies = enemies.slice(start, end);
  const [selectedEnemies, setSelectedEnemies] = useState<any[]>([]);
  function addEnemy(enemy: any) {
    if(enemy.amount === undefined) {
      enemy.amount = 1;
    } else {
    enemy.amount = 1 + enemy.amount;
    }

    const newEnemy = { ...enemy, id: uuidv4() };
    
    const sortedEnemies = [...selectedEnemies, newEnemy].sort((a, b) => {
      const initiativeA = getInitiative(a);
      const initiativeB = getInitiative(b);
      return initiativeB - initiativeA;
    });

    const updatedTurnOrder = getTurnOrder([...players, ...sortedEnemies]);
    console.log('Turn Order:', updatedTurnOrder);    

    setSelectedEnemies([...selectedEnemies.filter((e) => e.id !== enemy.id), newEnemy]);
    const updatedFormData = {
      ...formData,
      enemies: sortedEnemies,
      turnOrder: updatedTurnOrder
    };
    setFormData(updatedFormData);
  }

  function removeEnemy(enemy: any) {
    if(enemy.amount <= 1) {
      enemy.amount = 0;
      setSelectedEnemies(selectedEnemies.filter((e) => e.id !== enemy.id));
    }
    else {
      enemy.amount = enemy.amount - 1;
      setSelectedEnemies([...selectedEnemies.filter((e) => e.id !== enemy.id), enemy]);
    }
    const updatedFormData = {
      ...formData,
      enemies: [...selectedEnemies.filter((e) => e.id !== enemy.id), enemy]
    };
    setFormData(updatedFormData);
  }


  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-100 p-2 md:pt-0">
        <h1 className="text-xl font-semibold">Enemy Database:</h1>
          <div className="md:hidden">
            {enemies?.map((enemy) => (
              <div
                key={enemy.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={enemy.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${enemy.name}'s profile picture`}
                      />
                      <p>{enemy.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{enemy.id}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2">
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-3 py-5 font-medium sm:pl-6">
                  Enemy Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  ID
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {enemies?.map((enemy) => (
                <tr
                  key={enemy.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={enemy.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${enemy.name}'s profile picture`}
                      />
                      <p>{enemy.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {enemy.id}
                  </td>
                  <td className="whitespace-nowrap px-1 py-3">
                    <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => addEnemy(enemy)}>
                      Add
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-1 py-3">
                    <button type="button" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => removeEnemy(enemy)}>
                      Remove
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-row items-center gap-3 py-4">    
            {selectedEnemies?.map((enemy) => (
              <div key={enemy.id + "|" + enemy.amount} className="flex flex-col items-center">
                <Image
                  src={enemy.image_url}
                  className="rounded-full"
                  width={100}
                  height={100}
                  alt={`${enemy.name}'s profile picture`}
                />
                <h1>{enemy.amount}</h1>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LocationsTable({
  query,
  currentPage,
  locations,
  formData,
  setFormData
}: {
  query: string;
  currentPage: number;
  locations: any[];
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}) {
  
  const totalPages = Math.ceil(locations.length / 10);
  const start = currentPage * 10;
  const end = start + 10;
  const paginatedlocations = locations.slice(start, end);
  const [selectedlocations, setSelectedlocations] = useState<any[]>([]);

  function addLocation(location: any) {
    if(location.amount === undefined) {
      location.amount = 1;
    } else {
    location.amount = 1 + location.amount;
    }
    setSelectedlocations([...selectedlocations.filter((e) => e.id !== location.id), location]);
    setFormData({
      ...formData,
      locations: [...selectedlocations.filter((e) => e.id !== location.id), location]
    });
  }

  function removeLocation(location: any) {
    if(location.amount === 1) {
      location.amount = 0;
      setSelectedlocations(selectedlocations.filter((e) => e.id !== location.id));
    }
    else {
      location.amount = location.amount - 1;
      setSelectedlocations([...selectedlocations.filter((e) => e.id !== location.id), location]);
    }
    setFormData({
      ...formData,
      locations: [...selectedlocations.filter((e) => e.id !== location.id), location]
    });
  }


  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-100 p-2 md:pt-0">
        <h1 className="text-xl font-semibold">Location Database:</h1>
          <div className="md:hidden">
            {locations?.map((location) => (
              <div
                key={location.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={location.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${location.name}'s profile picture`}
                      />
                      <p>{location.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{location.id}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2">
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-3 py-5 font-medium sm:pl-6">
                  location Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  ID
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {locations?.map((location) => (
                <tr
                  key={location.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={location.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${location.name}'s profile picture`}
                      />
                      <p>{location.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {location.id}
                  </td>
                  <td className="whitespace-nowrap px-1 py-3">
                    <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => addLocation(location)}>
                      Add
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-1 py-3">
                    <button type="button" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => removeLocation(location)}>
                      Remove
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-row items-center gap-3 py-4">

            {selectedlocations?.map((location) => (
              <div key={location.id + "|" + location.amount} className="flex flex-col items-center">
                <Image
                  src={location.image_url}
                  className="rounded-full"
                  width={100}
                  height={100}
                  alt={`${location.name}'s profile picture`}
                />
                <h1>{location.amount}</h1>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
