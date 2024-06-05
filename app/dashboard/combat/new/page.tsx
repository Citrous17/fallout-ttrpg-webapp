import Form from '@/app/ui/combat/create-form';
import { fetchPlayers, fetchEnemyDatabase, fetchFilteredEnemies } from '@/app/lib/data';
import InvoicesTable from '@/app/ui/combat/table';

export default async function Page() {
  const query = '';
  const players = await fetchPlayers();
  const enemies = await fetchEnemyDatabase();
  const filteredEnemies = await fetchFilteredEnemies(query);
  
  return (
    <main>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Create a new battle</h1>
        <InvoicesTable query={query} currentPage={0} enemies={filteredEnemies}/>
      </div>
      <Form players={players} enemies={enemies} />

    </main>
  );
}