'use client'

import { EnemiesTable, PlayersTable, LocationsTable } from '@/app/ui/combat/table';
import { createBattle } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

export default function formWrapper({filteredEnemies, players, locations, battleImages} : { filteredEnemies: any, players: any, locations: any, battleImages: any}) {
    const initialState = { message: '', errors: {} };
    const [formData, setFormData] = useState<any>({});
    const [state, dispatch] = useFormState(() => createBattle(initialState, formData), initialState);
    const query = '';
    
    return(
    <>
        <form action={dispatch}>
            <input
                type="text"
                name="name"
                placeholder="Enter battle name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
                type="text"
                name="description"
                placeholder="Enter battle description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md mt-4"
            />
        
        <div className="grid grid-cols-4 gap-4 py-4">
            {battleImages.map((image: any) => (
                <div key={image} className={`relative ${formData.image_url === image ? 'selected' : ''}`}>
                    <img
                        src={`/battles/${image}`}
                        alt={image}
                        width={300}
                        height={200}
                        className="rounded-md"
                        onClick={() => setFormData({ ...formData, image_url: image })}
                    />

                    {formData.image_url === image && (
                        <div className="absolute -bottom-4" style={{ width: '300px', height: '200px' }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-full w-full text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    )}
                </div>
            ))}
        </div>
        <EnemiesTable query={query} currentPage={0} enemies={filteredEnemies} formData={formData} setFormData={setFormData} />
        <PlayersTable query={query} currentPage={0} players={players} formData={formData} setFormData={setFormData}/>
        <LocationsTable query={query} currentPage={0} locations={locations} formData={formData} setFormData={setFormData}/>
        <div className="mt-6">
            <h2 className="text-lg font-semibold">Turn Order</h2>
            <div className="grid grid-cols-4 gap-4 mt-4">
            {formData.turnOrder && formData.enemies && formData.players && 
                [...formData.enemies, ...formData.players] // Combine enemies and players
                    .sort((a: any, b: any) => {
                        const aIndex = formData.turnOrder.findIndex((id: number) => id === a.id);
                        const bIndex = formData.turnOrder.findIndex((id: number) => id === b.id);
                        return aIndex - bIndex;
                    })
                    .map((entity: any, index: number) => (
                        <div key={entity.id} className="flex items-center p-2 border border-gray-300 rounded-md">
                            <img src={`${entity.image_url}`} alt={entity.name} className="w-8 h-8 rounded-full mr-2" />
                            <div>
                                <p className="text-sm font-medium">{entity.name}</p>
                                <p className="text-xs text-gray-500">ID: {entity.id}</p>
                                <p className="text-xs text-gray-500">Order: {index + 1}</p>
                            </div>
                        </div>
            ))}
            </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
            <Link
            href="/dashboard"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
            Cancel
            </Link>
            <Button type="submit">Create Battle!</Button>
        </div>
        </form>
    </>
    );
}