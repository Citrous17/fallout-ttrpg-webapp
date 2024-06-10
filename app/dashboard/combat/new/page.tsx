import { fetchPlayers, fetchFilteredEnemies, fetchLocations } from '@/app/lib/data';
import FormWrapper from '@/app/ui/combat/form-wrapper';
import Image from 'next/image';
import fs from 'fs';

export default async function Page() {
  const query='';
  const players = await fetchPlayers();
  const locations = await fetchLocations(query);
  const filteredEnemies = await fetchFilteredEnemies(query);

  const battleImages = fs.readdirSync('public/battles');

  return (
    <main>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Create a new battle</h1>
        <FormWrapper filteredEnemies={filteredEnemies} players={players} locations={locations} battleImages={battleImages} />
      </div>
    </main>
  );
}